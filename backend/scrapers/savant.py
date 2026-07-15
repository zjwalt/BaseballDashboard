from cache.cache import Cache
from pybaseball import cache
import pandas as pd
import pybaseball

cache.enable()

_cache = Cache()


class SavantScraper:
    def get_batter_statcast(
        self, mlbam_id: int, start_dt: str, end_dt: str
    ) -> pd.DataFrame:
        """
        Returns raw Statcast DataFrame for a single batter.
        """

        cache_key = f"statcast_batter_{mlbam_id}_{start_dt}_{end_dt}"
        cached = _cache.get(cache_key)
        if cached is not None:
            return pd.DataFrame(cached)

        df = pybaseball.statcast_batter(start_dt, end_dt, mlbam_id)
        _cache.set(cache_key, df.to_dict(orient="records"))
        return df

    def get_batting_stats_by_season(self, season: int, min_pa: int = 1) -> pd.DataFrame:
        """
        Returns season-level Statcast batting stats for all get_batter_statcast
        (AVG, HR, RBI, xBA, xSLG, xwOBA, ...)
        """

        cache_key = f"savant_batting_{season}_{min_pa}"
        cached = _cache.get(cache_key)
        if cached is not None:
            return pd.DataFrame(cached)

        ev_df = pybaseball.statcast_batter_exitvelo_barrels(season, minBBE=min_pa)
        exp_df = pybaseball.statcast_batter_expected_stats(season, minPA=min_pa)

        df = ev_df.merge(exp_df, on="player_id", how="outer", suffixes=("", "_exp"))
        _cache.set(cache_key, df.to_dict(orient="records"))
        return df

    def get_batter_vs_pitch(self, season, min_pa: int = 1) -> pd.DataFrame:
        """
        Returns hitting metrics vs specific pitch types
        """

        cache_key = f"savant_batting_pitch_{season}_{min_pa}"
        cached = _cache.get(cache_key)
        if cached is not None:
            return pd.DataFrame(cached)

        df = pybaseball.statcast_batter_pitch_arsenal(season, minPA=min_pa)
        _cache.set(cache_key, df.to_dict(orient="records"))
        return df

    def get_pitcher_statcast(
        self, mlbam_id: int, start_dt: str, end_dt: str
    ) -> pd.DataFrame:
        """
        Returns raw Statcast DataFrame for a single pitcher
        """

        cache_key = f"statcast_pitcher_{mlbam_id}_{start_dt}_{end_dt}"
        cached = _cache.get(cache_key)
        if cached is not None:
            return pd.DataFrame(cached)

        df = pybaseball.statcast_pitcher(start_dt, end_dt, mlbam_id)
        _cache.set(cache_key, df.to_dict(orient="records"))
        return df

    def get_pitching_stats_by_season(
        self, season: int, min_pitches: int = 1
    ) -> pd.DataFrame:
        cache_key = f"savant_pitching_{season}_{min_pitches}"
        cached = _cache.get(cache_key)
        if cached is not None:
            return pd.DataFrame(cached)

        ev_df = pybaseball.statcast_pitcher_exitvelo_barrels(season, minBBE=min_pitches)
        exp_df = pybaseball.statcast_pitcher_expected_stats(season, minPA=min_pitches)

        df = ev_df.merge(exp_df, on="player_id", how="outer", suffixes=("", "_exp"))
        _cache.set(cache_key, df.to_dict(orient="records"))
        return df

    def get_percentile_rankings(self, season: int) -> pd.DataFrame:
        """
        Returns percentile ranking for all players in a given season.
        """

        cache_key = f"percentiles_{season}"
        cached = _cache.get(cache_key)
        if cached is not None:
            return pd.DataFrame(cached)

        pitchers = pybaseball.statcast_pitcher_percentile_ranks(season)
        batters = pybaseball.statcast_batter_percentile_ranks(season)
        df = pd.concat([pitchers, batters], ignore_index=True)
        _cache.set(cache_key, df.to_dict(orient="records"))
        return df
