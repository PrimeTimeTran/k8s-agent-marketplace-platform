## Running

```sh
$ export PYTHONPATH=$PWD
```

```sh
python agent-alpha/main.py
```

> Output: [Fallback] Working... 1/5

```sh
python runner.py agent-alpha/main.py
```

> [LOCAL LOG] Working... 1/5

## Log Levels

```sh
LOG_FORMAT="%(message)s" python runner.py agent-alpha/main.py
```

```sh
LOG_FORMAT="%(levelname)s: %(message)s" python runner.py agent-alpha/main.py
```

## Rebuild Images

```sh
for v in 3.11 3.12; do docker build -f execution/Dockerfile.base -t agent-base:$v --build-arg PYTHON_VERSION=$v execution; done
```

- inject images

```sh
k3d image import agent-base:3.11 agent-base:3.12 -c agent-mvp
```
