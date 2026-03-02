import os
import sys
import platform
import requests
try:
    from .logger import get_logger
    from .colors import Colors, colorize
except ImportError:
    from logger import get_logger
    from colors import Colors, colorize

logger = get_logger("reporter")

AGENT = os.getenv("AGENT")
PROMPT = os.getenv("PROMPT")
EXECUTION_ID = os.getenv("EXECUTION_ID")
EXECUTION_MODE = os.getenv("EXECUTION_MODE")
CONTROL_PLANE_URL = os.getenv(
    "CONTROL_PLANE_URL",
    "http://infra-control-plane:3000",
)
GIT_REPO_URL = os.getenv(
    "GIT_REPO_URL",
    "GIT_REPO_URL_MISSING",
)

def log_environment():
    """Logs the environment variables and runtime for debugging."""

    print(colorize(f"""--- 🚀 Starting execution

--- 🐍 PYTHON RUNTIME
Python version     = {platform.python_version()}
Python full        = {sys.version}
Python executable  = {sys.executable}

--- ⚙️ EXECUTION ENV
AGENT               = {AGENT}
PROMPT              = {PROMPT}
GIT_REPO_URL        = {GIT_REPO_URL}
EXECUTION_ID        = {EXECUTION_ID}
EXECUTION_MODE      = {EXECUTION_MODE}
CONTROL_PLANE_URL   = {CONTROL_PLANE_URL}

--- 📦 ARGS
{sys.argv}
""", Colors.CYAN))
    sys.stdout.flush()

def report(status=None, logs=None):
    if not EXECUTION_ID:
        if logs:
            logger.info(f"[LOCAL LOG] {logs}")
        if status:
            logger.info(f"[LOCAL STATUS] {status}")
        return

    url = f"{CONTROL_PLANE_URL}/executions/{EXECUTION_ID}/status"
    payload = {}
    if status:
        payload["status"] = status
    if logs:
        payload["logs"] = logs

    try:
        r = requests.patch(url, json=payload, timeout=5)
        r.raise_for_status()
    except Exception as e:
        logger.error(f"Failed to report status: {e}")
