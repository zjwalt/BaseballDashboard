from scrapers.base_ref import BaseballRefScraper
from scrapers.savant import SavantScraper
from models.pitcher import (
    Pitcher,
    PitcherTraditionalStats,
    PitcherStatsAgainst,
    PitcherExpectedRate,
    PitcherStatcastStats,
    PitcherPercentiles,
    PitchUsage,
)
import pandas as pd
import psycopg2
from psycopg2.extras import RealDictCursor
import os


def get_db_conn():
    return psycopg2.connect(os.getenv("DATABASE_URL", ""))


SEASON = 2026


class PitcherService:
    def __init__(self):
        self.savant = SavantScraper()
        self.bref = BaseballRefScraper()

    def get_all(self) -> list[Pitcher]:
        conn = None
        cursor = None
        players = None
        park_factors = {}
        try:
            conn = get_db_conn()
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            cursor.execute("SELECT * FROM players WHERE playertype='pitcher'")
            players = cursor.fetchall()
            cursor.execute("SELECT * FROM parkfactors WHERE season = %s", (SEASON,))
            park_factors = {
                row["abbrev"]: row["park_factor"] for row in cursor.fetchall()
            }
        except Exception as ex:
            print(ex)
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

        if not players:
            return []

        savant_pitcher = self.savant.get_pitching_stats_by_season(SEASON)
        percentile_df = self.savant.get_percentile_rankings(SEASON)
        arsenal = self.savant.get_pitcher_arsenal_stats(SEASON)
        bref_pitching = self.bref.get_pitching_stats(SEASON)
        bref_pitching["mlbID"] = bref_pitching["mlbID"].astype(int)

        bref_pitching = bref_pitching.rename(columns={"mlbID": "player_id"})
        pitching_df = savant_pitcher.merge(bref_pitching, on="player_id", how="inner")

        """
            Calculate some additional Statistics 
            ERA+ and xFIP
        """
        pitching_df["FB"] = pitching_df["fbld"] - pitching_df["LD"]

        lgHRFB = pitching_df["HR"].sum() / pitching_df["FB"].sum()
        pitching_df["xFIP"] = (
            (
                (13 * pitching_df["FB"] * lgHRFB)
                + (3 * (pitching_df["BB"] + pitching_df["HBP"]))
                - (2 * pitching_df["SO"])
            )
            / (pitching_df["IP"])
        ) + pitching_df["FIPconstant"]

        pitchers = []
        for player in players:
            try:
                pitcher = self._build_pitcher(
                    id=player["id"],
                    player=player,
                    pitching_df=pitching_df,
                    percentile_df=percentile_df,
                    arsenal_df=arsenal,
                    park_factor=float(park_factors.get(player["playerteam"], 1.0)),
                )
                pitchers.append(pitcher)
            except Exception as ex:
                print(
                    f"[PitcherService] Failed to build pitcher {player['playername']}: {ex}"
                )

        return pitchers

    def get_by_id(self, player_id: int) -> Pitcher | None:
        all_pitchers = self.get_all()
        return next((p for p in all_pitchers if p.player_id == player_id), None)

    def _build_pitcher(
        self,
        id: int,
        player: dict,
        pitching_df: pd.DataFrame,
        percentile_df: pd.DataFrame,
        arsenal_df: pd.DataFrame,
        park_factor: float,
    ) -> Pitcher:
        name = player["playername"]
        mlbam_id = player["mlbid"]

        pitching_rows = pitching_df[pitching_df["player_id"] == mlbam_id]
        pitch_df = pitching_rows.iloc[0] if not pitching_rows.empty else None

        ## Error Handling
        if pitch_df is None:
            raise ValueError(
                f"[PitchingService] Missing Data for {player['playername']} ({mlbam_id})"
            )

        ops = round(float(pitch_df["obp"] + pitch_df["slg"]), 3)

        ERA_plus = round(pitch_df["normERA"] / park_factor)

        pct_rows = percentile_df[percentile_df["player_id"] == mlbam_id]
        pct = pct_rows.iloc[0] if not pct_rows.empty else None

        arsenal_rows = arsenal_df[arsenal_df["player_id"] == mlbam_id]
        ars = arsenal_rows.iloc[0] if not arsenal_rows.empty else None

        return Pitcher(
            id=id,
            player_id=mlbam_id,
            name=name,
            team=player["playerteam"],
            number=player["playernumber"],
            position=player["playerposition"],
            throw=player["playerthrow"],
            bat=player["playerbat"],
            traditional=PitcherTraditionalStats(
                ERA=self._sf(pitch_df, "ERA"),
                IP=self._sf(pitch_df, "IP"),
                H=self._si(pitch_df, "H"),
                R=self._si(pitch_df, "R"),
                ER=self._si(pitch_df, "ER"),
                HR=self._si(pitch_df, "HR"),
                BB=self._si(pitch_df, "BB"),
                K=self._si(pitch_df, "SO"),
                W=self._si(pitch_df, "W"),
                L=self._si(pitch_df, "L"),
                SV=self._si(pitch_df, "SV"),
            ),
            statsAgainst=PitcherStatsAgainst(
                BA=self._sf(pitch_df, "ba"),
                OBP=self._sf(pitch_df, "obp"),
                SLG=self._sf(pitch_df, "slg"),
                OPS=ops,
                BAbip=self._sf(pitch_df, "BAbip"),
                WHIP=self._sf(pitch_df, "WHIP"),
                FIP=self._sf(pitch_df, "FIP"),
                ERAPlus=ERA_plus,
            ),
            expectedRate=PitcherExpectedRate(
                xBA=self._sf(pitch_df, "est_ba"),
                xSLG=self._sf(pitch_df, "est_slg"),
                xwOBA=self._sf(pitch_df, "est_woba"),
                xFIP=self._sf(pitch_df, "xFIP"),
                H9=self._sf(pitch_df, "H9"),
                HR9=self._sf(pitch_df, "HR9"),
                BB9=self._sf(pitch_df, "BB9"),
                K9=self._sf(pitch_df, "SO9"),
                kBB=self._sf(pitch_df, "SO/W"),
                HRPct=self._sf(pitch_df, "hr%"),
                KPct=self._sf(pitch_df, "k%"),
                BBPct=self._sf(pitch_df, "bb%"),
            ),
            statcastAdv=PitcherStatcastStats(
                exitVelo=self._sf(pitch_df, "ev50"),
                launchAngle=self._sf(pitch_df, "avg_hit_angle"),
                hardHitPct=self._sf(pitch_df, "ev95percent"),
                barrelPct=self._sf(pitch_df, "brl_percent"),
                sweetSpotPct=self._sf(pitch_df, "anglesweetspotpercent"),
            ),
            percentiles=PitcherPercentiles(
                xBA=self._pi(pct, "xba"),
                xSLG=self._pi(pct, "xslg"),
                xwOBA=self._pi(pct, "xwoba"),
                barrelPct=self._pi(pct, "brl_percent"),
                kPct=self._pi(pct, "k_percent"),
                bbPct=self._pi(pct, "bb_percent"),
                whiffPct=self._pi(pct, "whiff_percent"),
                chasePct=self._pi(pct, "chase_percent"),
                exitVelo=self._pi(pct, "exit_velocity"),
                hardHitPct=self._pi(pct, "hard_hit_percent"),
            ),
            usage=PitchUsage(
                FB=self._sf(ars, "FF_pitch_usage"),
                SL=self._sf(ars, "SL_pitch_usage"),
                CB=self._sf(ars, "CU_pitch_usage"),
                CH=self._sf(ars, "CH_pitch_usage"),
                SI=self._sf(ars, "SI_pitch_usage"),
                FC=self._sf(ars, "FC_pitch_usage"),
                ST=self._sf(ars, "ST_pitch_usage"),
                SLV=self._sf(ars, "SV_pitch_usage"),
                KN=self._sf(ars, "KN_pitch_usage"),
                FS=self._sf(ars, "FS_pitch_usage"),
            ),
        )

    @staticmethod
    def _sf(row: pd.Series | None, col: str, default: float = 0.0) -> float:
        if row is None:
            return default
        try:
            return round(float(row[col].item()), 3)
        except (KeyError, TypeError, ValueError):
            return default

    @staticmethod
    def _si(row: pd.Series | None, col: str, default: int = 0) -> int:
        if row is None:
            return default

        try:
            return int(row[col].item())
        except (KeyError, TypeError, ValueError):
            return default

    @staticmethod
    def _pi(row: pd.Series | None, col: str, default: int = 0) -> int:
        if row is None:
            return default

        try:
            return int(row[col].item())
        except (KeyError, TypeError, ValueError):
            return default
