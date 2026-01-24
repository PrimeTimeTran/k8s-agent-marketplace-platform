import time
import os
import sys

print("\n--- 🌍 Environment Variables ---")
print(f"AGENT: {os.getenv('AGENT', 'N/A')}")
print(f"PROMPT: {os.getenv('PROMPT', 'N/A')}")
print(f"EXECUTION_ID: {os.getenv('EXECUTION_ID', 'N/A')}")
print(f"CUSTOM_VAR: {os.getenv('CUSTOM_VAR', 'N/A')}")

print("\n--- 📦 Runtime Arguments ---")
print(f"Arguments received: {sys.argv}")

for i in range(3):
    print(f"\nWorking... {i + 1}/3")
    print('Mehul color ...')
    print('Santosh color ...')
    print('Raj color ...')
    time.sleep(2)

print("\n✅ Done, exiting")
