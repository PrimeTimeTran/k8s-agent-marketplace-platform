import time
import os
import sys
import traceback
import pyfiglet

print("\n--- 🌍 Environment Variables ---")
print(f"AGENT: {os.getenv('AGENT', 'N/A')}")
print(f"PROMPT: {os.getenv('PROMPT', 'N/A')}")
print(f"EXECUTION_ID: {os.getenv('EXECUTION_ID', 'N/A')}")
print(f"CUSTOM_VAR: {os.getenv('CUSTOM_VAR', 'N/A')}")

print("\n--- 📦 Runtime Arguments ---")
print(f"Arguments received: {sys.argv}")

print(pyfiglet.figlet_format("Agent Worklow"))

import traceback

def test_python_11_vs_12():
    print("\n--- 🐍 Python Version Test ---")
    code = """
type UserId = int
user_id: UserId = 42
print("UserId =", user_id)
"""
    try:
        exec(code)
        print("✅ Python 3.12 type statement supported")
    except SyntaxError as e:
        print("❌ SyntaxError (expected on Python < 3.12)")
        print(f"Line {e.lineno}, column {e.offset}")
        if e.text:
            print(e.text.rstrip())
            print(" " * (e.offset - 1) + "^")
        print(f"Message: {e.msg}")

test_python_11_vs_12()

for i in range(3):
    print(f"\nWorking... {i + 1}/3")
    print('Mehul color ...')
    print('Santosh color ...')
    print('Raj color ...')
    time.sleep(1)
