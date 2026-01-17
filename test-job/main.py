import time
import os

print("🚀 Pod started")
print(f"HOSTNAME={os.getenv('HOSTNAME')}")

for i in range(5):
    print(f"Working... {i+1}/5")
    time.sleep(2)

print("✅ Done, exiting")
