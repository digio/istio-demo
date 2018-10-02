SHELL := /bin/bash
.PHONY: help
# COLORS
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RESET  := $(shell tput -Txterm sgr0)


TARGET_MAX_CHAR_NUM=20
## install dependencies
install:
	yarn
	brew install siege
	brew install kubernetes-helm
	brew install kubernetes-cli
	brew install nginx
	curl -L https://git.io/getLatestIstio | sh -
	sh init_kube.sh

init-nginx:
	cp policy/nginx/nginx.conf /usr/local/etc/nginx/nginx.conf
	sudo nginx -s stop; sudo nginx


restart-nginx:
	sudo nginx -s stop; sudo nginx
## raw gradle build
gradle-build:
	gradle build -p microservice
## build docker container
build:
	docker-compose -f microservice/docker-compose.yaml build
## build docker container
push:
	docker-compose -f microservice/docker-compose.yaml push
## install helm
helm-install:
	brew install kubernetes-helm
## check mtls status
show-mtls:
	./istio-1.0.1/bin/istioctl authn tls-check
## show proxy synchronization status
proxy-status:
	./istio-1.0.1/bin/istioctl proxy-status
## label namespace
label-namespace:
	# kubectl create namespace development
	kubectl label namespace development istio-injection=enabled
	kubectl get namespace -L istio-injection
## initialise kubernetes
initialise:
	curl -L https://git.io/getLatestIstio | sh -
	sh init_kube.sh
## deploy microservice v1
deploy-v1:
	kubectl apply -f policy/microservice-a-v1/
## deploy microservice v2
deploy-v2:
	kubectl apply -f policy/microservice-a-v2/
## deploy microservice v3
deploy-v3:
	kubectl apply -f policy/microservice-a-v3/

## delete microservice-related resources
clean:
	kubectl --ignore-not-found=true delete -f policy/microservice-a-v1/
	kubectl --ignore-not-found=true delete -f policy/microservice-a-v2/
	kubectl --ignore-not-found=true delete -f policy/microservice-a-v3/
	kubectl --ignore-not-found=true delete -f policy/istio/base
	kubectl --ignore-not-found=true delete -f policy/istio/canary
## delete all resources
clean-all:
	kubectl --ignore-not-found=true delete -f policy/microservice-a-v1/
	kubectl --ignore-not-found=true delete -f policy/microservice-a-v2/
	kubectl --ignore-not-found=true delete -f policy/microservice-a-v3/
	kubectl --ignore-not-found=true delete -f policy/istio/base
	kubectl --ignore-not-found=true delete -f policy/istio/canary
	kubectl --ignore-not-found=true delete -f istio-1.0.1/install/kubernetes/helm/istio/templates/crds.yaml
	helm del --purge istio
	kubectl -n istio-system delete job --all
	kubectl delete namespace istio-system
## microservice policy
microservice-policy:
	kubectl apply -f policy/istio/base
	kubectl apply -f policy/istio/canary
	kubectl apply -f policy/istio/canary/vs.100-v1.yaml
## enable-retries
retry.enable:
	kubectl apply -f policy/istio/canary/vs.90-v1-with-retry.yaml
## disable-retries
retry.disable:
	kubectl apply -f policy/istio/canary/vs.90-v1.yaml
## reapply istio policies
refresh-policy:
	kubectl --ignore-not-found=true delete -f policy/istio/base
	kubectl --ignore-not-found=true delete -f policy/istio/canary
	kubectl apply -f policy/istio/base
	kubectl apply -f policy/istio/canary/vs.100-v1.yaml
## deploy canary with a 90-10 split
canary:
	kubectl apply -f policy/istio/canary/vs.90-v1.yaml
## rollback canary deployment
canary-rollback:
	kubectl apply -f policy/istio/canary/vs.100-v1.yaml
install-ingress:
	kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/mandatory.yaml
	kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/provider/cloud-generic.yaml
	kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/provider/baremetal/service-nodeport.yaml
access-observability:
	kubectl apply -f policy/istio/observability/
get-ingress-nodeport:
	echo "export NODE_PORT="`kubectl -n ingress-nginx get service ingress-nginx -o jsonpath='{.spec.ports[?(@.name=="http")].nodePort}'`

traffic:
	siege -t 1H -r 2 --delay 0.1 -c 2 -v demo.microservice.local/color
## install istio control plane
istio-install:
	cd istio-1.0.1
	helm upgrade --install --force istio istio-1.0.1/install/kubernetes/helm/istio --namespace istio-system \
		--set ingress.enabled=true \
		--set gateways.istio-ingressgateway.enabled=true \
		--set gateways.istio-egressgateway.enabled=true \
		--set gateways.istio-ingressgateway.type=NodePort \
		--set gateways.istio-egressgateway.type=NodePort \
		--set galley.enabled=true \
		--set sidecarInjectorWebhook.enabled=true \
		--set mixer.enabled=true \
		--set prometheus.enabled=true \
		--set global.hub=istio \
		--set global.tag=1.0.1 \
		--set global.imagePullPolicy=Always \
		--set global.proxy.envoyStatsd.enabled=true \
		--set global.mtls.enabled=true \
		--set security.selfSigned=true \
		--set global.enableTracing=true \
		--set global.proxy.autoInject=disabled \
		--set grafana.enabled=true \
		--set kiali.enabled=true \
		--set kiali.hub=kiali \
		--set kiali.tag=latest \
		--set tracing.enabled=true \
		--timeout 600



## Show help
help:
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk '/^[a-zA-Z\-\_0-9]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")-1); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "  ${YELLOW}%-$(TARGET_MAX_CHAR_NUM)s${RESET} ${GREEN}%s${RESET}\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)
