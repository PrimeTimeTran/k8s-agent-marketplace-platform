# Agent Container Specification

This document outlines the requirements and specifications for creating Docker containers compatible with the Marketplace Platform.

## 1. File Structure Requirements

The platform expects your agent code to follow a specific structure within the container.

- **Entrypoint Script**: You **must** have a file named `main.py` in your container's working directory. This is the script the platform will execute to start your agent.
- **Working Directory**: Your Dockerfile must specify a `WORKDIR` where your `main.py` resides.

## 2. Dockerfile Specification

You have full control over your Dockerfile and base image (OS, Python version, system dependencies), provided you meet the following criteria:

### Required Steps

1.  **Base Image**: Use any Python-capable image (e.g., `python:3.11-slim`, `python:3.9-alpine`).
2.  **Dependencies**: Install all necessary Python packages (e.g., via `requirements.txt`).
3.  **Source Code**: Copy your `main.py` and other source files into the image.
4.  **Workdir**: Set `WORKDIR` to the location of your code.

### Example Dockerfile

```dockerfile
# You can choose your python version
FROM python:3.11-slim

# Set the working directory (Required)
WORKDIR /app

# Install your dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your source code (Must include main.py)
COPY . .

# The platform overrides the CMD, but it's good practice to set a default for local testing
CMD ["python", "main.py"]
```

## 3. Runtime Environment & Injection

When your container is deployed on the platform, we inject a "Runner" process that wraps your code. This happens automatically using Kubernetes features—you do not need to include any platform code in your Dockerfile.

### Injected Tools

The runner injects the following tools into your Python environment globally. You do not need to import them; they are available as built-ins.

- **`report(status=str, logs=str)`**: Use this to send status updates and logs back to the platform control plane.
- **`logger`**: A pre-configured `logging.Logger` instance that formats logs correctly for the platform's monitoring system.

**Example Usage (`main.py`):**

```python
import time

# 'logger' is injected automatically
logger.info("Agent starting...")

for i in range(5):
    # 'report' is injected automatically
    if 'report' in globals():
        report(status="RUNNING", logs=f"Processing step {i}...")

    print(f"Standard print also works and is captured: {i}")
    time.sleep(1)
```

### Environment Variables

The platform provides the following environment variables at runtime:

- `AGENT`: The name/identifier of the agent.
- `PROMPT`: The input prompt provided by the user.
- `EXECUTION_ID`: The unique ID of the current job execution.
- `CONTROL_PLANE_URL`: Internal URL for platform services.

## 4. Reserved Paths & Restrictions

To facilitate the platform injection, certain paths and namespaces are reserved.

- **Reserved Path**: `/platform`
  - **Description**: The platform mounts a volume at `/platform` inside your container at runtime. This contains the runner script and shared libraries.
  - **Restriction**: Do not create a folder named `platform` in your root directory, and do not rely on writing files to `/platform`.

- **Reserved File Name**: `runner.py` (in the root/python path)
  - The platform injects a `runner.py` into the python path. Avoid naming your own files `runner.py` to prevent conflicts.

## 5. Local Development vs. Production

- **Local**: When running `python main.py` locally, the injected tools (`report`, `logger`) will not be present. You should code defensively (e.g., `if 'report' in globals():`) or use the provided local runner script to simulate the platform environment.
- **Production**: The platform automatically handles injection, authentication, and reporting.
