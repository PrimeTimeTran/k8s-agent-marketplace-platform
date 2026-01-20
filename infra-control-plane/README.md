## Inspect Executions from pod

```sh
kubectl run debug \
  -n agent-platform \
  --rm -it \
  --image=curlimages/curl \
  -- sh
```

```sh
curl http://infra-control-plane:3000/executions
```
