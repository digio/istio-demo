# Istio Demonstration

A basic example of implementing ingress into an Istio service mesh, with a demonstration of canary based policy which utilises labels on a multi-versioned microservice, which has been deployed within the Istio service mesh.

## Contents

- [Istio Demonstration](#istio-demonstration)
    - [Contents](#contents)
    - [Reference](#reference)
    - [Prerequisites](#prerequisites)
    - [Getting Started](#getting-started)
        - [install dependencies](#install-dependencies)
        - [Local CORS](#local-cors)
        - [Resolution](#resolution)
        - [Install Istio](#install-istio)
        - [Install Ingress Components](#install-ingress-components)
        - [label namespace](#label-namespace)
        - [Deploy Example Microservice](#deploy-example-microservice)
        - [Deploy Mesh and Ingressgateway Istio Policy](#deploy-mesh-and-ingressgateway-istio-policy)
        - [Observability](#observability)
        - [Generate Traffic](#generate-traffic)

## Reference

[1] https://istio.io/docs/reference/config/istio.networking.v1alpha3/

[2] https://istio.io/blog/2018/v1alpha3-routing/

## Prerequisites

- I've developed and tested this using Docker for Mac, available [here](https://store.docker.com/editions/community/docker-ce-desktop-mac). These instructions/tooling should also work with Minikube, however I have not tested yet.

- nginx/haproxy to enable a single origin to prevent CORS complaints when web-app accesses the backend. associated steps are implemented in the `Makefile` contained in this repo, instructions below.

- [NVM](https://github.com/creationix/nvm) installed and configured in the shell.

## Getting Started

To start the presentation alone run the following:

```bash
nvm install
nvm use
yarn
npm run start
```

### install dependencies

```bash
make install
```

### Local CORS

In order to run the Istio demo we need to run a series of installs and deployments within a kubernetes cluster. This is achieved through the `Makefile` in this repo.
We must also run a reverse proxy to faciliate wrapping both the `webapp` and `api` under one origin, this is to avoid CORS limitations.

The configuration for this can be found in this repo [here](policy/nginx/nginx.conf). This can be installed and configurd with the following command:

```bash
make init-nginx
```

The end-state configuration should allow for both the web-app (presentation) and microservice to be available on `localhost:8080`. the endpoints would be:

- `localhost:8080/` - webapp
- `localhost:8080/api/` - microservice

### Resolution

Add the following to your /etc/hosts to faciliate domain resolution which will be
used for requesting content from the service mesh, as well as the `nginx-ingress-controller`:

```text
...
127.0.0.1 tracing.local grafana.local kiali.local demo.microservice.local
...
```

### Install Istio

In order to install Istio we run the below command. What this will do is deploy the Istio control plane via Helm, there are a range of flags added to add in the additional observability tooling as part of the deployment

```bash
make install-istio
```

### Install Ingress Components

In order to add the `nginx-ingress-controller` to the kubernetes cluster (used for accessing observability tooling) we run the following:

```bash
make install-ingress
```

### label namespace

In orde to allow for auto-sidecar injection we label the given namespace with the following tag:

```bash
make label-namespace
```

### Deploy Example Microservice

With the namespace labelled, the below deployment will have side-cars added and consequently be augmented into the mesh.

These are deployed in the `development` namespace. This namespace has been labeled with `istio-injection=enabled`, consequently the `admissionMutatingWebhook` will modify the deployment resource to include an istio side-car in the deployment.

```bash
make deploy-v1
make deploy-v2
```

### Deploy Mesh and Ingressgateway Istio Policy

```bash
make microservice-policy
```

This will apply the related Istio CRD's to faciliate ingress into the mesh to the required microservices. You can see these polices in [policy/istio](/policy/istio) within this repo.

Open a browser and hit [http://localhost:3000](http://localhost:3000), and we are ready to roll.

### Observability

The observability tooling such as Jaeger, Grafana, Prometheus, and Kiali will be deployed as part of the `make istio-install` command. However, in order to enable ingress to these services we need to deploy some `Ingress` policies to enable this connectivity.

This can be achieved with the following make command:

```bash
make access-observability
```

Now in order to access these endpoints, we need to discover the NodePort that has been provisioned for the given `nginx-ingress-controller`. This can be discovered with the following command:

```bash
make get-ingress-nodeport
```

If you've added the required `/etc/hosts` configuration. These services will be available at the the following `${HOSTNAME}:${NODE_PORT}`. Example:

- [http://grafana.local:NODE_PORT](http://grafana.local:NODE_PORT)
- [http://jaeger.local:NODE_PORT](http://jaeger.local:NODE_PORT)
- [http://kiali.local:NODE_PORT](http://kiali.local:NODE_PORT)

### Generate Traffic

In order to stimulate the given backend microservices and the Istio service mesh, we can generte some `Siege` traffic via the following command:

```bash
make traffic
```

This will generate many requests to the `http://demo.microservice.local` host, and we should see this traffic coming in via the myriad of observability tooling made available in the previous step.
