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

    def add_players(self, player: Player):
        conn = None
        cursor = None
        try:
            conn = get_db_conn()
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO players (mlbid, playername, playernumber, playerposition, playerthrow, playerbat, playerteam, playertype)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
                (
                    player.player_id,
                    player.name,
                    player.number,
                    player.position,
                    player.throw,
                    player.bat,
                    player.team,
                    player.type,
                ),
            )
            conn.commit()
        except Exception as ex:
            print(ex)
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    def get_new_player_details(self) -> list[Player]:
        conn = None
        cursor = None
        mlb_ids = None
        try:
            conn = get_db_conn()
            cursor = conn.cursor()
            cursor.execute("SELECT DISTINCT mlbid FROM players")
            mlb_ids = [row[0] for row in cursor.fetchall()]
        except Exception as ex:
            print(ex)
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

        if not mlb_ids:
            return []

        print()

        player_details = [
            p
            for p in self.scraper.get_combined_player_list(SEASON).to_dict(
                orient="records"
            )
            if p["player_id"] not in mlb_ids
        ]

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

    def get_current_player_details(self) -> list[Player]:
        conn = None
        cursor = None
        players = None
        try:
            conn = get_db_conn()
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            cursor.execute("SELECT * FROM players")
            players = cursor.fetchall()
        except Exception as ex:
            print(ex)
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

        if not players:
            return []

        current_players = []
        for p in players:
            player = self._build_player(
                mlb_id=p["mlbid"],
                name=p["playername"],
                team=p["playerteam"],
                number=p["playernumber"],
                position=p["playerposition"],
                throw=p["playerthrow"],
                bat=p["playerbat"],
                type=p["playertype"],
            )
            current_players.append(player)

        return current_players

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
