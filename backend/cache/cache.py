import json
import time
from pathlib import Path

CACHE_DIR = Path(__file__).parent / ".cache_store"
DEFAULT_TTL_SECONDS = 60 * 60 * 24  # 24 hours


class Cache:
    """
    Simple file-based JSON cache.
    Services serialize DataFrames to dicts before storing,
    and reconstruct them with pd.DataFrame(cahced) on retrieval.

    Swap for Redis if you need multi-process or persistent caching.
    """

    def __init__(self, ttl: int = DEFAULT_TTL_SECONDS):
        self.ttl = ttl
        CACHE_DIR.mkdir(exist_ok=True)

    def _path(self, key: str) -> Path:
        safe_key = key.replace("/", "_").replace(" ", "_")
        return CACHE_DIR / f"{safe_key}.json"

    def get(self, key: str):
        path = self._path(key)
        if not path.exists():
            return None

        try:
            with open(path) as f:
                entry = json.load(f)
            if time.time() > entry["expires_at"]:
                return None
            return entry["value"]
        except (json.JSONDecodeError, KeyError):
            return None

    def set(self, key: str, value) -> None:
        path = self._path(key)
        entry = {"value": value, "expires_at": time.time() + self.ttl}
        with open(path, "w") as f:
            json.dump(entry, f, default=str)

    def delete(self, key: str):
        self._path(key).unlink(missing_ok=True)

    def clear(self) -> None:
        for f in CACHE_DIR.glob("*.json"):
            f.unlink(missing_ok=True)
