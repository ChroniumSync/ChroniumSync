import logging
from datetime import datetime
from collections import deque
from statistics import mean, stdev
from typing import Deque, List, Optional, Any

# ─── Logger Setup ─────────────────────────────────────────────────────────────
logger = logging.getLogger("stream_watch")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s | %(levelname)s | %(message)s"))
logger.addHandler(handler)


def advanced_log_event(event_type: str, data: Any) -> None:
    """Log structured events with timestamp."""
    timestamp = datetime.utcnow().isoformat()
    logger.info(f"[{event_type}] {data} @ {timestamp}")


def detect_anomalous_patterns(
    data_series: List[float], sensitivity: float = 1.5
) -> Optional[List[float]]:
    """
    Identify values exceeding mean * sensitivity.
    Returns list of outliers or None.
    """
    if not data_series:
        return None
    μ = mean(data_series)
    threshold = μ * sensitivity
    outliers = [v for v in data_series if v > threshold]
    return outliers or None


class StreamWatch:
    """
    Maintains a sliding window of numeric events and detects anomalies.
    """

    def __init__(self, max_length: int = 100, sensitivity: float = 1.5):
        self.events: Deque[float] = deque(maxlen=max_length)
        self.sensitivity = sensitivity
        advanced_log_event("Init", f"max_length={max_length}, sensitivity={sensitivity}")

    def add_event(self, value: float) -> None:
        """Add a new event and log it."""
        self.events.append(value)
        advanced_log_event("EventAdded", value)

    def check_for_anomalies(self) -> str:
        """Check window for anomalies and log if found."""
        if not self.events:
            return "No Data"
        data = list(self.events)
        outliers = detect_anomalous_patterns(data, self.sensitivity)
        if outliers:
            advanced_log_event("AnomalyDetected", f"outliers={outliers}")
            return "⚠️ Anomaly Detected"
        return "✅ Stable"

    def get_statistics(self) -> dict:
        """Return basic stats (count, mean, stdev, min, max)."""
        if not self.events:
            return {}
        data = list(self.events)
        stats = {
            "count": len(data),
            "mean": mean(data),
            "stdev": stdev(data) if len(data) > 1 else 0.0,
            "min": min(data),
            "max": max(data),
        }
        advanced_log_event("Stats", stats)
        return stats

    def latest_values(self, n: int = 5) -> List[float]:
        """Get the last n values."""
        return list(self.events)[-n:]

    def reset(self) -> None:
        """Clear all events."""
        self.events.clear()
        advanced_log_event("Reset", "events cleared")
