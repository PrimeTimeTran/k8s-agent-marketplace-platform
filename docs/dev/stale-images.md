- Create a new job

```sh
docker build -t agent-job:dev agent-job
```

- When creating a new job/tag you may need to pull it into K3d

```sh
k3d image import agent-job:dev -c agent-mvp
```

- Build image and import into local cluster

```sh
docker build -t agent-job:dev agent-job && k3d image import agent-job:dev -c agent-mvp
```
