import pybaseball
from pybaseball import cache

df = pybaseball.batting_stats_bref(season=2026)
cruz = df[df["mlbID"] == 665833]
print(df.columns)
print(cruz)

pybaseball.statcast_pitcher()
