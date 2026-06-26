from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor
import psycopg2
import os


load_dotenv()


def get_db_conn():
    return psycopg2.connect(os.getenv("DATABASE_URL", ""))


conn = get_db_conn()
cursor = conn.cursor(cursor_factory=RealDictCursor)
cursor.execute("SELECT * FROM players WHERE playertype='hitter'")
rows = cursor.fetchall()
cursor.close()
conn.close()

for i in rows:
    print(i["id"])
