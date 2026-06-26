from cache.cache import Cache
from pybaseball import cache
import pandas as pd
import pybaseball

cache.enable()

_cache = Cache()


class BaseballRefScraper:
    def get_batting_stats(self, year: int) -> pd.DataFrame:
        """
        Returns traditional batting stats for a given year from Baseball Reference
        """
        cache_key = f"bref_batting_{year}"
        cached = _cache.get(cache_key)
        if cached is not None:
            return pd.DataFrame(cached)

        df = pybaseball.batting_stats_bref(year)
        _cache.set(cache_key, df.to_dict(orient="records"))
        return df

    def get_batting_stats_range(self, start_dt: str, end_dt: str) -> pd.DataFrame:
        """
        Returns batting stats for a given time frame
        """
        cache_key = f"bref_batting_{start_dt}_{end_dt}"
        cached = _cache.get(cache_key)
        if cached is not None:
            return pd.DataFrame(cached)

        df = pybaseball.batting_stats_range(start_dt, end_dt)
        _cache.set(cache_key, df.to_dict(orient="records"))
        return df

    def get_pitching_stats(self, year: int) -> pd.DataFrame:
        """
        Returns traditional pitching stats for a given year from Baseball Reference
        """
        cache_key = f"bref_pitching_{year}"
        cached = _cache.get(cache_key)
        if cached is not None:
            return pd.DataFrame(cached)

        df = pybaseball.pitching_stats_bref(year)
        _cache.set(cache_key, df.to_dict(orient="records"))
        return df

    def get_pitching_stats_range(self, start_dt: str, end_dt: str) -> pd.DataFrame:
        """
        Return pitching stats for a given time frame
        """
        cache_key = f"bref_pitcher_{start_dt}_{end_dt}"
        cached = _cache.get(cache_key)
        if cached is not None:
            return pd.DataFrame(cached)

        df = pybaseball.pitching_stats_range(start_dt, end_dt)
        _cache.set(cache_key, df.to_dict(orient="records"))
        return df
