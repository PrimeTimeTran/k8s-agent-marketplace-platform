## Logging

- Stream logs

```sh
kubectl logs -n agent-platform -f deploy/agent-runtime
```

## Troubleshooting

-

```sh
kubectl get pods -n agent-platform -l app=agent-runtime -w
```

## Stale Images

- Create new image

```sh
docker build -t agent-job:dev agent-job
```

- Update new image

```sh
k3d image import agent-job:dev -c agent-mvp
```
