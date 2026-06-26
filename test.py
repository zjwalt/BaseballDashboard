import pybaseball
from pybaseball import cache

# df = pybaseball.batting_stats_bref(season=2026)
# cruz = df[df["mlbID"] == 665833]
# print(df.columns)
# print(cruz)
#
# pybaseball.statcast_pitcher()


## -- Batter analytics vs pitch types --
# df = pybaseball.statcast_batter_pitch_arsenal(2026)
# print(df[df["player_id"] == 665833])
# print(df.columns)


## -- Batter pitch results for a given time frame --
# df = pybaseball.statcast_batter(player_id=665833)
# print(df)
# print(df.columns)

season = 2026
min_pa = 1

ev_df = pybaseball.statcast_batter_exitvelo_barrels(season, minBBE=min_pa)
exp_df = pybaseball.statcast_batter_expected_stats(season, minPA=min_pa)

df = ev_df.merge(exp_df, on="player_id", how="outer", suffixes=("", "_exp"))

print(df.columns)
print()
print()
print()
print(df)
