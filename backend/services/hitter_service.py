from pybaseball.datasources import bref
from scrapers.savant import SavantScraper
from scrapers.base_ref import BaseballRefScraper
from dotenv import load_dotenv
from models.hitter import (
    Hitter,
    HitterTraditionalStats,
    HitterAdvancedStats,
    HitterStatcastAdvanced,
    HitterPercentiles,
)
import pandas as pd
import psycopg2
from psycopg2.extras import RealDictCursor
import os


load_dotenv()


def get_db_conn():
    return psycopg2.connect(os.getenv("DATABASE_URL", ""))


SEASON = 2026
WOBA_SCALE = 1.234


class HitterService:
    def __init__(self):
        self.savant = SavantScraper()
        self.bref = BaseballRefScraper()

    def get_all(self) -> list[Hitter]:
        conn = None
        cursor = None
        players = None
        try:
            conn = get_db_conn()
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            cursor.execute("SELECT * FROM players WHERE playertype='hitter'")
            players = cursor.fetchall()
            cursor.execute("SELECT * FROM parkfactors WHERE season=%s", (SEASON,))
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

        savant_batting = self.savant.get_batting_stats_by_season(SEASON)
        percentile_df = self.savant.get_percentile_rankings(SEASON)
        bref_batting = self.bref.get_batting_stats(SEASON)

        """
            Calculate some extra stats for the dashboard
            K%, BB%, wRC, wRC+
            NOTE: wRC+ must be calculated in _build_hitter()
                because we need to like the player's team to the team abrv in the parkfactor table
        """

        bref_batting["bb%"] = round((bref_batting["BB"] / bref_batting["PA"]) * 100, 1)
        bref_batting["k%"] = round((bref_batting["SO"] / bref_batting["PA"]) * 100, 1)
        bref_batting["babip"] = round(
            (
                (bref_batting["H"] - bref_batting["HR"])
                / (
                    bref_batting["AB"]
                    - bref_batting["SO"]
                    - bref_batting["HR"]
                    + bref_batting["SF"]
                )
            ),
            3,
        )

        lg_wOBA = round(
            (savant_batting["woba"] * savant_batting["pa"]).sum()
            / savant_batting["pa"].sum(),
            3,
        )
        lg_R_PA = round(bref_batting["R"].sum() / bref_batting["PA"].sum(), 3)

        savant_batting["wRC"] = (
            ((savant_batting["woba"] - lg_wOBA) / WOBA_SCALE) + lg_R_PA
        ) * savant_batting["pa"]
        savant_batting["wRAA"] = (
            (savant_batting["woba"] - lg_wOBA) / WOBA_SCALE
        ) * savant_batting["pa"]

        lg_wRC_PA = savant_batting["wRC"].sum() / savant_batting["pa"].sum()

        hitters = []
        for player in players:
            try:
                hitter = self._build_hitter(
                    id=player["id"],
                    player=player,
                    savant_batting_df=savant_batting,
                    percentile_df=percentile_df,
                    bref_df=bref_batting,
                    lg_R_PA=lg_R_PA,
                    lg_wRC_PA=lg_wRC_PA,
                    park_factor=float(park_factors.get(player["playerteam"], 1.0)),
                )
                hitters.append(hitter)
            except Exception as e:
                print(
                    f"[HitterService] Failed to build hitter {player['playername']}: {e}"
                )

        return hitters

    def get_by_id(self, player_id: int) -> Hitter | None:
        all_hitters = self.get_all()
        return next((h for h in all_hitters if h.player_id == player_id), None)

    def _build_hitter(
        self,
        id: int,
        player: dict,
        savant_batting_df: pd.DataFrame,
        percentile_df: pd.DataFrame,
        bref_df: pd.DataFrame,
        lg_R_PA: float,
        lg_wRC_PA: float,
        park_factor: float,
    ) -> Hitter:
        name = player["playername"]
        mlbam_id = player["mlbid"]

        sv_rows = savant_batting_df[savant_batting_df["player_id"] == mlbam_id]
        sv = sv_rows.iloc[0] if not sv_rows.empty else None

        wRC_plus = round(
            (
                (
                    ((sv["wRAA"] / sv["pa"]) + lg_R_PA)
                    + (lg_R_PA - (park_factor * lg_R_PA))
                )
                / lg_wRC_PA
            )
            * 100
        )

        pct_rows = percentile_df[percentile_df["player_id"] == mlbam_id]
        pct = pct_rows.iloc[0] if not pct_rows.empty else None

        bref_rows = bref_df[bref_df["mlbID"] == mlbam_id]
        bref = bref_rows.iloc[0] if not bref_rows.empty else None

        ops_plus = round(bref["_ops"] / park_factor)

        return Hitter(
            id=id,
            player_id=mlbam_id,
            name=name,
            team=player["playerteam"],
            number=player["playernumber"],
            position=player["playerposition"],
            throw=player["playerthrow"],
            bat=player["playerbat"],
            traditional=HitterTraditionalStats(
                PA=self._si(bref, "PA"),
                AB=self._si(bref, "AB"),
                AVG=self._sf(bref, "BA"),
                OBP=self._sf(bref, "OBP"),
                SLG=self._sf(bref, "SLG"),
                OPS=self._sf(bref, "OPS"),
                HITS=self._si(bref, "H"),
                DOUBLES=self._si(bref, "2B"),
                TRIPLES=self._si(bref, "3B"),
                HR=self._si(bref, "HR"),
                RBI=self._si(bref, "RBI"),
                K=self._si(bref, "SO"),
                BB=self._si(bref, "BB"),
                SB=self._si(bref, "SB"),
            ),
            advanced=HitterAdvancedStats(
                wOBA=self._sf(sv, "woba"),
                xBA=self._sf(sv, "est_ba"),
                xSLG=self._sf(sv, "est_slg"),
                xwOBA=self._sf(sv, "est_woba"),
                babip=self._sf(bref, "babip"),
                bbPct=self._sf(bref, "bb%"),
                kPct=self._sf(bref, "k%"),
                wRCPlus=wRC_plus,
                opsPlus=ops_plus,
            ),
            statcastAdv=HitterStatcastAdvanced(
                exitVelo=self._sf(sv, "ev50"),
                launchAngle=self._sf(sv, "avg_hit_angle"),
                hardHitPct=self._sf(sv, "ev95percent"),
                barrelPct=self._sf(sv, "brl_percent"),
                sweetSpotPct=self._sf(sv, "anglesweetspotpercent"),
            ),
            percentiles=HitterPercentiles(
                xBA=self._pi(pct, "xba"),
                xSLG=self._pi(pct, "xslg"),
                xwOBA=self._pi(pct, "xwoba"),
                barrelPct=self._pi(pct, "brl_percent"),
                kPct=self._pi(pct, "k_percent"),
                bbPct=self._pi(pct, "bb_percent"),
                whiffPct=self._pi(pct, "whiff_percent"),
                chasePct=self._pi(pct, "chase_percent"),
                exitVelo=self._pi(pct, "exit_velocity"),
                hardHitPct=self._pi(pct, "had_hit_percent"),
                batSpeed=self._pi(pct, "bat_speed"),
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
