# create workload namespace
#/bin/bash
kubectl create namespace development --save-config --dry-run -o yaml | kubectl apply -f -