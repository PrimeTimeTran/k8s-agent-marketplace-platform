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
