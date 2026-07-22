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

        ## Calculate some key stats like BABIP, K%, and BB%
        df["k%"] = df["SO"] / df["PA"]
        df["bb%"] = df["BB"] / df["PA"]
        df["BABIP"] = (df["H"] - df["HR"]) / (df["AB"] - df["SO"] - df["HR"] + df["SF"])

        lg_obp = round((df["OBP"] * df["PA"]).sum() / df["PA"].sum(), 3)
        lg_slg = round((df["SLG"] * df["PA"]).sum() / df["PA"].sum(), 3)

        df["_ops"] = ((df["OBP"] / lg_obp) + (df["SLG"] / lg_slg) - 1) * 100

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

        df["obp"] = (df["H"] + df["BB"] + df["HBP"]) / (
            df["AB"] + df["BB"] + df["HBP"] + df["SF"]
        )

        df["H9"] = (df["H"] / df["IP"]) * 9
        df["HR9"] = (df["HR"] / df["IP"]) * 9
        df["BB9"] = (df["BB"] / df["IP"]) * 9

        lgERA = round((df["ER"].sum() / df["IP"].sum()) * 9, 3)
        lgHR = df["HR"].sum()
        lgBB = df["BB"].sum()
        lgHBP = df["HBP"].sum()
        lgK = df["SO"].sum()
        lgIP = df["IP"].sum()

        df["FIPconstant"] = lgERA - (
            ((13 * lgHR) + (3 * (lgBB + lgHBP)) - (2 * lgK)) / (lgIP)
        )
        df["FIP"] = (
            ((13 * df["HR"]) + (3 * (df["BB"] + df["HBP"])) - (2 * df["SO"])) / df["IP"]
        ) + df["FIPconstant"]

        df["normERA"] = (lgERA / df["ERA"]) * 100

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
