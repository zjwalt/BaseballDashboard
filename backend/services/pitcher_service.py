from scrapers.base_ref import BaseballRefScraper
from scrapers.savant import SavantScraper
from dotenv import load_dotenv
from models.pitcher import (
    Pitcher,
    PitcherTraditionalStats,
    PitcherAdvancedStats,
    PitcherStatcastStats,
    PitcherPercentiles,
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
        park_factor: float,
    ) -> Pitcher:
        name = player["playername"]
        mlbam_id = player["mlbid"]

        pitching_rows = pitching_df[pitching_df["player_id"] == mlbam_id]
        pitch_df = pitching_rows.iloc[0] if not pitching_rows.empty else None
        ops = round(float(pitch_df["obp"] + pitch_df["slg"]), 3)

        ERA_plus = round(pitch_df["normERA"] / park_factor)

        pct_rows = percentile_df[percentile_df["player_id"] == mlbam_id]
        pct = pct_rows.iloc[0] if not pct_rows.empty else None

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
            advanced=PitcherAdvancedStats(
                BA=self._sf(pitch_df, "ba"),
                OBP=self._sf(pitch_df, "obp"),
                SLG=self._sf(pitch_df, "slg"),
                OPS=ops,
                BAbip=self._sf(pitch_df, "BAbip"),
                WHIP=self._sf(pitch_df, "WHIP"),
                FIP=self._sf(pitch_df, "FIP"),
                xFIP=self._sf(pitch_df, "xFIP"),
                ERAPlus=ERA_plus,
                H9=self._sf(pitch_df, "H9"),
                HR9=self._sf(pitch_df, "HR9"),
                BB9=self._sf(pitch_df, "BB9"),
                SO9=self._sf(pitch_df, "SO9"),
                kBB=self._sf(pitch_df, "SO/W"),
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
