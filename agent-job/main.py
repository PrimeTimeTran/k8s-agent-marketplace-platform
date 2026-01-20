import os
import time
import sys
import requests

AGENT = os.getenv("AGENT")
PROMPT = os.getenv("PROMPT")
EXECUTION_ID = os.getenv("EXECUTION_ID")
EXECUTION_MODE = os.getenv("EXECUTION_MODE")
CONTROL_PLANE_URL = os.getenv(
    "CONTROL_PLANE_URL",
    "http://infra-control-plane:3000",
)

print("DEBUG ENV:")
print("  EXECUTION_ID =", EXECUTION_ID)
print("  CONTROL_PLANE_URL =", CONTROL_PLANE_URL)
print("  PROMPT =", PROMPT)

def report(status: str | None = None, logs: str | None = None):
    """
    Report execution status and/or logs back to the control plane.
    """
    if EXECUTION_MODE == "agent" and not EXECUTION_ID:
        raise RuntimeError(
            "Agent execution started without EXECUTION_ID"
        )

    url = f"{CONTROL_PLANE_URL}/executions/{EXECUTION_ID}/status"

    payload = {}
    if status:
        payload["status"] = status
    if logs:
        payload["logs"] = logs

    print(f"📡 PATCH {url}")
    print(f"📦 Payload: {payload}")

    try:
        r = requests.patch(
            url,
            timeout=5,
            json=payload,
        )
        r.raise_for_status()
    except Exception as e:
        print("❌ Failed to report status/logs:", e, file=sys.stderr)
        raise

print("🚀 Pod started")

report(
    status="RUNNING",
    logs=f"""🚀 Pod started
🤖 Agent: {AGENT}
📝 Prompt: {PROMPT}
⚡️ Execution: {EXECUTION_ID}
"""
)

for i in range(5):
    msg = f"Working... {i + 1}/5"
    print(msg)
    report(logs=msg)
    time.sleep(2)

print("✅ Done, exiting")
report(status="COMPLETED", logs="✅ Done, exiting")
