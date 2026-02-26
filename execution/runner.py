import os
import sys
import runpy
import builtins
import subprocess
import traceback

from common.colors import Colors, colorize

def log(message, color=None):
    if color:
        print(colorize(message, color))
    else:
        print(message)
    sys.stdout.flush()

sys.path.append(os.getcwd())

def initialize():
    try:
        from common.logger import get_logger, TimestampedStream
        from common.reporter import report, log_environment
        
        builtins.Colors = Colors
        builtins.colorize = colorize
        
        if os.getenv("ENABLE_LOG_TIMESTAMPS") == "true":
            sys.stdout = TimestampedStream(sys.stdout)
            # We typically don't wrap stderr if using logging module as it might double stamp,
            # but for user print() calls (stdout), it's useful.
            # If user writes to stderr explicitly, we can wrap it too.
            sys.stderr = TimestampedStream(sys.stderr)

        builtins.report = report
        builtins.logger = get_logger("user-agent")
        log_environment()
        return True
    except ImportError as e:
        print(f"Warning: Could not import 'common' library. Running without platform tools. Reason: {e}")
        return False

def clone_repo():
    repo_url = os.environ.get("GIT_REPO_URL")
    if not repo_url:
        return
    log(f"--- 📥 Cloning {repo_url}...", Colors.CYAN)
    try:
        subprocess.check_call(["git", "clone", repo_url, "repo"])
        os.chdir("repo")
        sys.path.append(os.getcwd())
    except subprocess.CalledProcessError as e:
        log(f"Error: Failed to clone repo: {e}", Colors.FAIL)
        sys.exit(1)

def install_dependencies():
    if os.path.exists("requirements.txt"):
        log("--- 📦 Installing dependencies from requirements.txt...", Colors.CYAN)
        try:
            subprocess.check_call([
                sys.executable, "-m", "pip", "install", 
                "--default-timeout=100", 
                "--no-cache-dir", 
                "-r", "requirements.txt"
            ])
            log("--- ✅ Dependencies installed", Colors.CYAN)
        except subprocess.CalledProcessError as e:
            log(f"Error: Failed to install dependencies: {e}", Colors.FAIL)
            sys.exit(1)

def run_entrypoint():
    script_path = sys.argv[1] if len(sys.argv) > 1 else "main.py"
    if not os.path.exists(script_path):
        log(f"Error: {script_path} not found.")
        sys.exit(1)
    
    # Add newline for separation, handled by log helper if we wanted, 
    # but here we can just print a newline first or include it.
    # The previous code had `+ "\n"`.
    log(f"--- 🤖 Launching {script_path} via Platform Runner", Colors.HEADER)

    try:
        runpy.run_path(script_path, run_name="__main__")
        print()
        log(f"--- 🗑️  Releasing {script_path} via Platform Runner", Colors.HEADER)
    except Exception as e:
        print()
        log("--- 💥 Agent Crashed 💥 ---", Colors.FAIL)
        traceback.print_exc()
        
        sys.stdout.flush() # traceback prints to stderr directly, so flush stdout to keep order
        if 'report' in builtins.__dict__:
            builtins.report(status="FAILED", logs=str(e))
        sys.exit(1)

def main():
    # We want to be able to exit immediately for infra/smoke tests
    mode = os.getenv("EXECUTION_MODE", "agent")
    if mode != "agent":
        print(f"[runner] Skipping runner (mode={mode})")
        sys.exit(0)

    initialize()
    clone_repo()
    install_dependencies()
    run_entrypoint()

if __name__ == "__main__":
    main()
