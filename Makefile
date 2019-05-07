SHELL := /bin/bash
.PHONY: help
# COLORS
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RESET  := $(shell tput -Txterm sgr0)

ISTIO_VERSION=1.1.5
TARGET_MAX_CHAR_NUM=20
## install dependencies
install: fetch.infra
	yarn
	sh dependencies.sh
	sh init_kube.sh
fetch.infra:
ifeq (,$(wildcard istio-${ISTIO_VERSION}))
	curl -L https://git.io/getLatestIstio | sh -
endif

define wait_for_ns_termination
	@printf "🌀 removing $(1) namespace";
	@while [ "$$(kubectl get namespace $(1) > /dev/null 2>&1; echo $$?)" = "0" ]; do printf "."; sleep 2; done;
	@printf " ✅\n";
endef

define wait_for_deployment
	@printf "🌀 waiting for deployment $(2) to complete"; 
	@until kubectl get deployment -n $(1)  "$(2)" -o jsonpath='{.status.conditions[?(@.type=="Available")].status}' | grep -q True ; do printf "."; sleep 2 ; done;
	@printf "  ✅\n";
endef
define wait_for_istio_control_plane
	$(call wait_for_deployment,istio-system,istio-citadel)
	$(call wait_for_deployment,istio-system,istio-galley)
	$(call wait_for_deployment,istio-system,istio-policy)
	$(call wait_for_deployment,istio-system,istio-pilot)
	$(call wait_for_deployment,istio-system,istio-sidecar-injector)
	$(call wait_for_deployment,istio-system,istio-telemetry)
endef
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
	./istio-1.1.5/bin/istioctl authn tls-check
## show proxy synchronization status
proxy-status:
	./istio-1.1.5/bin/istioctl proxy-status
## label namespace
label-namespace:
	# kubectl create namespace development
	kubectl label namespace development istio-injection=enabled
	kubectl get namespace -L istio-injection
## initialise kubernetes
initialise:
	cd deploy/charts; curl -L https://git.io/getLatestIstio | sh -
	sh init_kube.sh
## deploy microservice v1
deploy-v1:
	kubectl apply -f policy/microservice-v1/
## deploy microservice v2
deploy-v2:
	kubectl apply -f policy/microservice-v2/
## delete microservice-related resources
clean:
	kubectl --ignore-not-found=true delete -f policy/microservice-v1/
	kubectl --ignore-not-found=true delete -f policy/microservice-v2/
	kubectl --ignore-not-found=true delete -f policy/istio/base
	kubectl --ignore-not-found=true delete -f policy/istio/canary
## delete all resources
clean-all:
	kubectl --ignore-not-found=true delete -f policy/microservice-v1/
	kubectl --ignore-not-found=true delete -f policy/microservice-v2/
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
get-ingress-nodeport:
	echo "export NODE_PORT="`kubectl -n ingress-nginx get service ingress-nginx -o jsonpath='{.spec.ports[?(@.name=="http")].nodePort}'`

traffic:
	siege -t 100 -r 10 -c 2 -v demo.local/color
## install istio control plane
istio.install:
	kubectl apply -f deploy/resources/istio/${ISTIO_VERSION}/service/mandatory/namespace.yaml
	helm template deploy/charts/istio-${ISTIO_VERSION}/install/kubernetes/helm/istio-init --name istio-init --namespace istio-system > deploy/resources/istio/${ISTIO_VERSION}/istio-init.yaml
	kubectl apply -f deploy/resources/istio/${ISTIO_VERSION}/istio-init.yaml
	sleep 20
	helm template deploy/charts/istio-${ISTIO_VERSION}/install/kubernetes/helm/istio --name istio --namespace istio-system  -f deploy/values/istio/${ISTIO_VERSION}/values.yaml > deploy/resources/istio/${ISTIO_VERSION}/istio.yaml
	kubectl apply -f deploy/resources/istio/${ISTIO_VERSION}/istio.yaml
	$(call wait_for_istio_control_plane, ${ISTIO_VERSION})
istio.observability:
	kubectl apply -f deploy/resources/policy/istio/observability/
demo.deploy.v1:
	kubectl apply -f deploy/resources/policy/microservice-v1/

demo.deploy.v2:
	kubectl apply -f deploy/resources/policy/microservice-v2/
demo.deploy:
	kubectl apply -f deploy/resources/policy/microservice-v2/
	kubectl apply -f deploy/resources/policy/microservice-v1/
	kubectl apply -f deploy/resources/policy/istio/base
	kubectl apply -f deploy/resources/policy/istio/canary
	kubectl apply -f deploy/resources/policy/istio/canary/vs.100-v1.yaml



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
