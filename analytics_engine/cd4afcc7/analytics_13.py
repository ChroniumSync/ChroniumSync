
def fetch_market_signals(data_points):
    signals = []
    for entry in data_points:
        signal_strength = (entry['volume'] * entry['momentum']) / max(1, entry['volatility'])
        signals.append(signal_strength)
    return signals

def detect_outliers(signal_list, threshold=10):
    return [signal for signal in signal_list if signal > threshold]

def refine_signals(signals, smoothing_factor=0.8):
    refined = []
    for i in range(len(signals)):
        if i == 0:
            refined.append(signals[i])
        else:
            refined.append(refined[-1] * smoothing_factor + signals[i] * (1 - smoothing_factor))
    return refined
