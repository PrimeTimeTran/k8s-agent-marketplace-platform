## Jobs

### Review jobs logs

- 1️⃣ List Jobs

```sh
kubectl get jobs -n agent-platform
```

> Will print a list of jobs

```sh
$ kubectl get jobs -n agent-platform
NAME                            STATUS    COMPLETIONS   DURATION   AGE
infra-agent-job-1768912582351   Running   0/1           5s         5s
```

- 2️⃣ Find Job with Pod key

```sh
kubectl get pods -n agent-platform \
  -l job-name=infra-agent-job-1768912844541
```

> Will print the job name WITH pod id

```sh
$ kubectl get pods -n agent-platform \
  -l job-name=infra-agent-job-1768912844541
NAME                                  READY   STATUS      RESTARTS   AGE
infra-agent-job-1768912844541-qpqzw   0/1     Completed   0          61s
```

- 3️⃣ View logs from the job run

```sh
kubectl logs -n agent-platform infra-agent-job-1768912844541-qpqzw
```

### Stream logs

- Get job id

```sh
kubectl get jobs -n agent-platform
```

- Update job id and stream it in real time.

```sh
kubectl logs -n agent-platform job/infra-agent-job-1768913195223
```

- One Line

```sh
# Exits
kubectl logs -n agent-platform \
  job/$(kubectl get jobs -n agent-platform \
    --sort-by=.metadata.creationTimestamp \
    -o jsonpath='{.items[-1:].metadata.name}')

# Follows
kubectl logs -n agent-platform -f \
  job/$(kubectl get jobs -n agent-platform \
    --sort-by=.metadata.creationTimestamp \
    -o jsonpath='{.items[-1:].metadata.name}')
```
