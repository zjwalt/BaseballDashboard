from scrapers.savant import SavantScraper
from scrapers.base_ref import BaseballRefScraper
from dotenv import load_dotenv
from models.hitter import (
    Hitter,
    HitterTraditionalStats,
    # HitterAdvancedStats,
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
            cursor.execute("Select * FROM players WHERE playertype='hitter'")
            players = cursor.fetchall()
            for player in players:
                print(player)
        except Exception as ex:
            # print(ex)
            print()
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

        hitters = []
        for player in players:
            try:
                hitter = self._build_hitter(
                    id=player["id"],
                    player=player,
                    savant_batting_df=savant_batting,
                    percentile_df=percentile_df,
                    bref_df=bref_batting,
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
    ) -> Hitter:
        name = player["playername"]
        mlbam_id = player["mlbid"]

        sv_rows = savant_batting_df[savant_batting_df["player_id"] == mlbam_id]
        sv = sv_rows.iloc[0] if not sv_rows.empty else None

        pct_rows = percentile_df[percentile_df["player_id"] == mlbam_id]
        pct = pct_rows.iloc[0] if not pct_rows.empty else None

        bref_rows = bref_df[bref_df["mlbID"] == mlbam_id]
        bref = bref_rows.iloc[0] if not bref_rows.empty else None

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
                pa=self._si(bref, "PA"),
                ab=self._si(bref, "AB"),
                hits=self._si(bref, "H"),
                avg=self._sf(bref, "BA"),
                hr=self._si(bref, "HR"),
                rbi=self._si(bref, "RBI"),
                obp=self._sf(bref, "OBP"),
                slg=self._sf(bref, "SLG"),
                ops=self._sf(bref, "OPS"),
                doubles=self._si(bref, "2B"),
                triples=self._si(bref, "3B"),
                k=self._si(bref, "SO"),
                bb=self._si(bref, "BB"),
                sb=self._si(bref, "SB"),
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


conn = get_db_conn()
cursor = conn.cursor()
cursor.execute("SELECT * FROM players WHERE playertype='hitter'")
rows = cursor.fetchall()
cursor.close()
conn.close()
