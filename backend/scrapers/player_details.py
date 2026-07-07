from cache.cache import Cache
from pybaseball import cache
import pandas as pd
import pybaseball
import requests

cache.enable()

_cache = Cache()


TEAM_ID_MAP = {
    108: "LAA",
    109: "ARI",
    110: "BAL",
    111: "BOS",
    112: "CHC",
    113: "CIN",
    114: "CLE",
    115: "COL",
    116: "DET",
    117: "HOU",
    118: "KC",
    119: "LAD",
    120: "WSH",
    121: "NYM",
    133: "ATH",
    134: "PIT",
    135: "SD",
    136: "SEA",
    137: "SF",
    138: "STL",
    139: "TB",
    140: "TEX",
    141: "TOR",
    142: "MIN",
    143: "PHI",
    144: "ATL",
    145: "CWS",
    146: "MIA",
    147: "NYY",
    158: "MIL",
}


class PlayerDetailScraper:
    def get_player_list(self, season: int, min_pa: int = 1) -> pd.DataFrame:
        """
        Returns a list of player names and their mlb_ids
        """

        cache_key = f"player_list_{season}_{min_pa}"
        cached = _cache.get(cache_key)
        if cached is not None:
            return pd.DataFrame(cached)

        batters = pybaseball.statcast_batter_exitvelo_barrels(season, minBBE=min_pa)[
            ["last_name, first_name", "player_id"]
        ]
        batters["type"] = "hitter"

        pitchers = pybaseball.statcast_pitcher_exitvelo_barrels(season, minBBE=min_pa)[
            ["last_name, first_name", "player_id"]
        ]
        pitchers["type"] = "pitcher"

        df = pd.concat([batters, pitchers], ignore_index=True)
        df[["last_name", "first_name"]] = df["last_name, first_name"].str.split(  # type: ignore
            ", ", expand=True
        )
        df = df.drop(columns=["last_name, first_name"])
        _cache.set(cache_key, df.to_dict(orient="records"))  # type: ignore
        return df  # type: ignore

    def get_player_details(self, season: int):
        cache_key = f"player_details_{season}"
        cached = _cache.get(cache_key)
        if cached is not None:
            return pd.DataFrame(cached)

        response = requests.get(
            f"https://statsapi.mlb.com/api/v1/sports/1/players?season={season}"
        )
        people = response.json()["people"]
        df = pd.DataFrame(
            [
                {
                    "player_id": p["id"],
                    "first_name": p["firstName"],
                    "last_name": p["lastName"],
                    "position": p["primaryPosition"]["abbreviation"],
                    "team": TEAM_ID_MAP.get(p["currentTeam"]["id"], "UNK"),
                    "bats": p.get("batSide", {}).get("code"),
                    "throws": p["pitchHand"]["code"],
                    "number": int(p["primaryNumber"])
                    if p.get("primaryNumber")
                    else None,
                }
                for p in people
            ]
        )

        _cache.set(cache_key, df.to_dict(orient="records"))
        return df

    def get_combined_player_list(self, season: int, min_pa: int = 1) -> pd.DataFrame:
        """
        Returns a combined list of players from Savant and MLB Stats API
        """
        cache_key = f"combined_player_list_{season}_{min_pa}"
        cached = _cache.get(cache_key)
        if cached is not None:
            return pd.DataFrame(cached)

        savant_df = self.get_player_list(season, min_pa)
        mlb_df = self.get_player_details(season)

        df = savant_df.merge(mlb_df, on="player_id", how="inner")  # type: ignore
        df = df.drop(columns=["first_name_y", "last_name_y"])
        df = df.rename(
            columns={"first_name_x": "first_name", "last_name_x": "last_name"}
        )

        _cache.set(cache_key, df.to_dict(orient="records"))  # type: ignore
        return df  # type: ignore
