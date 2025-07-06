from datetime import datetime
from typing import List, Optional


def advanced_log_event(event_type: str, data: str) -> None:
    timestamp = datetime.utcnow().isoformat()
    print(f"[{timestamp}] [{event_type}] {data}")


def detect_anomalous_patterns(
    data_series: List[float],
    sensitivity: float = 1.5
) -> Optional[List[float]]:
    if not data_series:
        return None

    mean = sum(data_series) / len(data_series)
    threshold = mean * sensitivity
    outliers = [val for val in data_series if val > threshold]
    return outliers if outliers else None


class StreamWatch:
    def __init__(self, max_length: int = 100, sensitivity: float = 1.5):
        self.events: List[float] = []
        self.max_length = max_length
        self.sensitivity = sensitivity

    def add_event(self, value: float) -> None:
        self.events.append(value)
        if len(self.events) > self.max_length:
            self.events.pop(0)
        advanced_log_event("EventAdded", f"value={value}")

    def check_for_anomalies(self) -> str:
        if not self.events:
            return "No Data"

        anomalies = detect_anomalous_patterns(self.events, self.sensitivity)
        if anomalies:
            advanced_log_event("Anomaly", f"count={len(anomalies)}")
            return "⚠️ Anomaly Detected"
        else:
            return "✅ Stable"

    def reset(self) -> None:
        self.events.clear()
        advanced_log_event("Reset", "Stream cleared")

    def latest_values(self, n: int = 5) -> List[float]:
        return self.events[-n:]
