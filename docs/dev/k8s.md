- Create a new job

```sh
docker build -t agent-job:latest agent-job
```

- When creating a new job/tag you may need to pull it into K3d

```sh
k3d image import agent-job:latest -c agent-mvp
```
