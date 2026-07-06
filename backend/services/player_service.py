from scrapers.player_details import PlayerDetailScraper
from dotenv import load_dotenv
from models.player import Player
import psycopg2
from psycopg2.extras import RealDictCursor
import os

load_dotenv()


def get_db_conn():
    return psycopg2.connect(os.getenv("DATABASE_URL", ""))


SEASON = 2026


class PlayerService:
    def __init__(self):
        self.scraper = PlayerDetailScraper()

    def get_player_details(self) -> list[Player]:
        player_details = self.scraper.get_combined_player_list(SEASON).to_dict(
            orient="records"
        )
        players = []
        for p in player_details:
            try:
                player = self._build_player(
                    mlb_id=p["player_id"],
                    name=p["first_name"] + " " + p["last_name"],
                    team=p["team"],
                    number=p["number"],
                    position=p["position"],
                    throw=p["throws"],
                    bat=p["bats"],
                    type=p["type"],
                )
                players.append(player)
            except Exception as e:
                print(
                    f"[PlayerService] Failed to build player {p['first_name']} {p['last_name']}: {e}"
                )

        return players

    def _build_player(
        self,
        mlb_id: int,
        name: str,
        team: str,
        number: int,
        position: str,
        throw: str,
        bat: str,
        type: str,
    ) -> Player:
        return Player(
            player_id=mlb_id,
            name=name,
            team=team,
            number=number,
            position=position,
            throw=throw,
            bat=bat,
            type=type,
        )

