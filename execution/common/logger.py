import os
import sys
import json
import logging
try:
    from .colors import Colors, colorize
except ImportError:
    # Fallback for local testing or if colors.py not found
    class Colors:
        CYAN = ''
        GREY = ''
        ENDC = ''
    def colorize(text, color):
        return text

def get_logger(name: str):
    logger = logging.getLogger(name)
    
    # Avoid adding multiple handlers if get_logger is called multiple times
    if logger.handlers:
        return logger

    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    logger.setLevel(log_level)
    
    handler = logging.StreamHandler(sys.stdout)
    
    # Check environment to decide format
    # In K8s (Prod/Dev), we usually want JSON for log aggregators (Datadog/Splunk/CloudWatch)
    # Locally, we want human-readable text.
    is_local = os.getenv("scaffold_env") == "local" or os.getenv("ENV") == "local" or not os.getenv("KUBERNETES_SERVICE_HOST")

    if is_local:
        # Human readable format for local dev
        # Allow override via LOG_FORMAT env var
        # Example: "%(message)s" for minimal output
        log_fmt = os.getenv("LOG_FORMAT", '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        
        formatter = logging.Formatter(
            log_fmt,
            datefmt='%H:%M:%S'
        )
    else:
        # JSON format for machine parsing in K8s
        formatter = logging.Formatter(
            json.dumps({
                "timestamp": "%(asctime)s",
                "level": "%(levelname)s",
                "name": "%(name)s",
                "message": "%(message)s"
            })
        )

    handler.setFormatter(formatter)
    logger.addHandler(handler)
    return logger

import datetime

class TimestampedStream:
    def __init__(self, stream):
        self.stream = stream
        self.new_line = True

    def write(self, message):
        if not message:
            return
        
        # Split by newlines to handle multiple lines in one write
        lines = message.split('\n')
        for i, line in enumerate(lines):
            if i > 0:
                # We encountered a newline in the previous iteration
                self.stream.write('\n')
                self.new_line = True
            
            if not line:
                continue

            if self.new_line:
                timestamp = datetime.datetime.now().strftime("[%Y-%m-%d %H:%M:%S] ")
                self.stream.write(colorize(timestamp, Colors.GREY))
                self.new_line = False
            
            self.stream.write(line)

    def flush(self):
        self.stream.flush()
