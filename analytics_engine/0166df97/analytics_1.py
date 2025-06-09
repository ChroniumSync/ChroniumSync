
import logging
import os
import time
from logging.handlers import RotatingFileHandler

# Create logs directory if it doesn't exist
if not os.path.exists("logs"):
    os.makedirs("logs")

# Log file path
LOG_FILE = "logs/stillbit_monitor.log"

# Logger setup
logger = logging.getLogger("stillbit")
logger.setLevel(logging.DEBUG)

# Rotating handler setup
handler = RotatingFileHandler(LOG_FILE, maxBytes=1000000, backupCount=5)
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)

# Sample function for demo
def log_asset_status(asset_id, status, level="info"):
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    message = f"[{timestamp}] Asset {asset_id}: {status}"
    if level == "info":
        logger.info(message)
    elif level == "warning":
        logger.warning(message)
    elif level == "error":
        logger.error(message)

# Example usage
if __name__ == "__main__":
    log_asset_status("0xabc123", "Asset stability confirmed")
    log_asset_status("0xdef456", "Asset health below threshold", level="warning")
