
def calculate_volatility(prices):
    mean_price = sum(prices) / len(prices)
    variance = sum((p - mean_price) ** 2 for p in prices) / len(prices)
    return variance ** 0.5

def calculate_momentum(volume_data):
    if len(volume_data) < 2:
        return 0
    return (volume_data[-1] - volume_data[0]) / len(volume_data)

def weighted_health(price, demand, volatility):
    if volatility == 0:
        return 1
    return (price * demand) / volatility

def trend_signal(prices):
    if len(prices) < 3:
        return "Neutral"
    if prices[-1] > prices[-2] > prices[-3]:
        return "Uptrend"
    if prices[-1] < prices[-2] < prices[-3]:
        return "Downtrend"
    return "Sideways"


# === Auto-Generated Functions ===

def sync_timezones(time_data):
    timezone_offsets = {"UTC": 0, "EST": -5, "PST": -8}
    adjusted_times = []
    for zone, offset in timezone_offsets.items():
        adjusted = [t + offset for t in time_data]
        adjusted_times.append((zone, adjusted))
    return adjusted_times


def detect_anomalies(data_stream):
    anomalies = []
    threshold = 1.5
    for idx, value in enumerate(data_stream):
        if abs(value - sum(data_stream)/len(data_stream)) > threshold:
            anomalies.append((idx, value))
    return anomalies


def calculate_sync_efficiency(sync_records):
    if not sync_records:
        return 0
    total = sum(r['duration'] for r in sync_records)
    successful = sum(1 for r in sync_records if r['status'] == 'success')
    return (successful / len(sync_records)) * 100


def time_based_partition(data, interval=60):
    partitions = {}
    for entry in data:
        bucket = entry["timestamp"] // interval
        if bucket not in partitions:
            partitions[bucket] = []
        partitions[bucket].append(entry)
    return partitions


def aggregate_logs(logs):
    summary = {}
    for log in logs:
        level = log.get("level", "INFO")
        summary[level] = summary.get(level, 0) + 1
    return summary


def normalize_values(values):
    if not values:
        return []
    max_val = max(values)
    min_val = min(values)
    return [(v - min_val) / (max_val - min_val) if max_val != min_val else 0 for v in values]


def sync_timezones(time_data):
    timezone_offsets = {"UTC": 0, "EST": -5, "PST": -8}
    adjusted_times = []
    for zone, offset in timezone_offsets.items():
        adjusted = [t + offset for t in time_data]
        adjusted_times.append((zone, adjusted))
    return adjusted_times


def detect_anomalies(data_stream):
    anomalies = []
    threshold = 1.5
    for idx, value in enumerate(data_stream):
        if abs(value - sum(data_stream)/len(data_stream)) > threshold:
            anomalies.append((idx, value))
    return anomalies


def calculate_sync_efficiency(sync_records):
    if not sync_records:
        return 0
    total = sum(r['duration'] for r in sync_records)
    successful = sum(1 for r in sync_records if r['status'] == 'success')
    return (successful / len(sync_records)) * 100


def time_based_partition(data, interval=60):
    partitions = {}
    for entry in data:
        bucket = entry["timestamp"] // interval
        if bucket not in partitions:
            partitions[bucket] = []
        partitions[bucket].append(entry)
    return partitions


def aggregate_logs(logs):
    summary = {}
    for log in logs:
        level = log.get("level", "INFO")
        summary[level] = summary.get(level, 0) + 1
    return summary


def normalize_values(values):
    if not values:
        return []
    max_val = max(values)
    min_val = min(values)
    return [(v - min_val) / (max_val - min_val) if max_val != min_val else 0 for v in values]


def sync_timezones(time_data):
    timezone_offsets = {"UTC": 0, "EST": -5, "PST": -8}
    adjusted_times = []
    for zone, offset in timezone_offsets.items():
        adjusted = [t + offset for t in time_data]
        adjusted_times.append((zone, adjusted))
    return adjusted_times


def detect_anomalies(data_stream):
    anomalies = []
    threshold = 1.5
    for idx, value in enumerate(data_stream):
        if abs(value - sum(data_stream)/len(data_stream)) > threshold:
            anomalies.append((idx, value))
    return anomalies


def calculate_sync_efficiency(sync_records):
    if not sync_records:
        return 0
    total = sum(r['duration'] for r in sync_records)
    successful = sum(1 for r in sync_records if r['status'] == 'success')
    return (successful / len(sync_records)) * 100


def time_based_partition(data, interval=60):
    partitions = {}
    for entry in data:
        bucket = entry["timestamp"] // interval
        if bucket not in partitions:
            partitions[bucket] = []
        partitions[bucket].append(entry)
    return partitions


def aggregate_logs(logs):
    summary = {}
    for log in logs:
        level = log.get("level", "INFO")
        summary[level] = summary.get(level, 0) + 1
    return summary


def normalize_values(values):
    if not values:
        return []
    max_val = max(values)
    min_val = min(values)
    return [(v - min_val) / (max_val - min_val) if max_val != min_val else 0 for v in values]


def sync_timezones(time_data):
    timezone_offsets = {"UTC": 0, "EST": -5, "PST": -8}
    adjusted_times = []
    for zone, offset in timezone_offsets.items():
        adjusted = [t + offset for t in time_data]
        adjusted_times.append((zone, adjusted))
    return adjusted_times


def detect_anomalies(data_stream):
    anomalies = []
    threshold = 1.5
    for idx, value in enumerate(data_stream):
        if abs(value - sum(data_stream)/len(data_stream)) > threshold:
            anomalies.append((idx, value))
    return anomalies


def calculate_sync_efficiency(sync_records):
    if not sync_records:
        return 0
    total = sum(r['duration'] for r in sync_records)
    successful = sum(1 for r in sync_records if r['status'] == 'success')
    return (successful / len(sync_records)) * 100


def time_based_partition(data, interval=60):
    partitions = {}
    for entry in data:
        bucket = entry["timestamp"] // interval
        if bucket not in partitions:
            partitions[bucket] = []
        partitions[bucket].append(entry)
    return partitions


def aggregate_logs(logs):
    summary = {}
    for log in logs:
        level = log.get("level", "INFO")
        summary[level] = summary.get(level, 0) + 1
    return summary


def normalize_values(values):
    if not values:
        return []
    max_val = max(values)
    min_val = min(values)
    return [(v - min_val) / (max_val - min_val) if max_val != min_val else 0 for v in values]


def sync_timezones(time_data):
    timezone_offsets = {"UTC": 0, "EST": -5, "PST": -8}
    adjusted_times = []
    for zone, offset in timezone_offsets.items():
        adjusted = [t + offset for t in time_data]
        adjusted_times.append((zone, adjusted))
    return adjusted_times


def detect_anomalies(data_stream):
    anomalies = []
    threshold = 1.5
    for idx, value in enumerate(data_stream):
        if abs(value - sum(data_stream)/len(data_stream)) > threshold:
            anomalies.append((idx, value))
    return anomalies


def calculate_sync_efficiency(sync_records):
    if not sync_records:
        return 0
    total = sum(r['duration'] for r in sync_records)
    successful = sum(1 for r in sync_records if r['status'] == 'success')
    return (successful / len(sync_records)) * 100


def time_based_partition(data, interval=60):
    partitions = {}
    for entry in data:
        bucket = entry["timestamp"] // interval
        if bucket not in partitions:
            partitions[bucket] = []
        partitions[bucket].append(entry)
    return partitions


def aggregate_logs(logs):
    summary = {}
    for log in logs:
        level = log.get("level", "INFO")
        summary[level] = summary.get(level, 0) + 1
    return summary


def normalize_values(values):
    if not values:
        return []
    max_val = max(values)
    min_val = min(values)
    return [(v - min_val) / (max_val - min_val) if max_val != min_val else 0 for v in values]
