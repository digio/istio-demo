# Istio Demonstration

A basic example of implementing ingress into an Istio service mesh, with a demonstration of canary based policy which utilises labels on a multi-versioned microservice, which has been deployed within the Istio service mesh.

## Contents

- [Istio Demonstration](#istio-demonstration)
  - [Contents](#contents)
  - [Reference](#reference)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
    - [install dependencies](#install-dependencies)
    - [Resolution](#resolution)
    - [Install Demo](#install-demo)
    - [Install Istio](#install-istio)
    - [Deploy Example Microservice](#deploy-example-microservice)
    - [Observability](#observability)
    - [Generate Traffic](#generate-traffic)

## Reference

[1] https://istio.io/docs/reference/config/istio.networking.v1alpha3/

[2] https://istio.io/blog/2018/v1alpha3-routing/

## Prerequisites

- I've developed and tested this using Docker for Mac, with the Kubernetes local cluster enabled.  It is available [here](https://store.docker.com/editions/community/docker-ce-desktop-mac).  These instructions/tooling should also work with Minikube, however I have not tested yet.

- nginx/haproxy to enable a single origin to prevent CORS complaints when web-app accesses the backend. associated steps are implemented in the `Makefile` contained in this repo, instructions below.

- [NVM](https://github.com/creationix/nvm) installed and configured in the shell.

## Getting Started

To start the presentation alone run the following:

```bash
nvm install
nvm use
npm install
npm run start
```

### install dependencies

```bash
make install
```

### Resolution

Add the following to your /etc/hosts to faciliate domain resolution which will be
used for requesting content from the service mesh, running on your local machine within docker-for-desktop.

```text
...
127.0.0.1   webapp.demo api.demo grafana.demo kiali.demo tracing.demo
...
```

### Install Demo

The end-to-end install can be started by running:

```bash
make install.demo
```

### Install Istio

In order to install Istio we run the below command. What this will do is deploy the Istio control plane via Helm, there are a range of flags added to add in the additional observability tooling as part of the deployment

```bash
make istio.intall
```

### Deploy Example Microservice

With the namespace labelled, the below deployment will have side-cars added and consequently be augmented into the mesh.

These are deployed in the `development` namespace. This namespace has been labeled with `istio-injection=enabled`, consequently the `admissionMutatingWebhook` will modify the deployment resource to include an istio side-car in the deployment.

```bash
make deploy.demo
```

This will apply the related Istio CRD's to faciliate ingress into the mesh to the required microservices. You can see these polices in [policy/istio](/policy/istio) within this repo.

Open a browser and hit [http://localhost:3000](http://localhost:3000), and we are ready to roll.

### Observability

The observability tooling such as Jaeger, Grafana, Prometheus, and Kiali will be deployed as part of the `make istio-install` command. However, in order to enable ingress to these services we need to deploy some `Ingress` policies to enable this connectivity.

This can be achieved with the following make command:

```bash
make istio.observability
```
If you've added the required `/etc/hosts` configuration. These services will be available at the the following `${HOSTNAME}:${NODE_PORT}`. Example:

- [http://grafana.demo](http://grafana.demo)
- [http://tracing.demo](http://tracing.demo)
- [http://kiali.demo](http://kiali.demo)
- [http://webapp.demo](http://webapp.demo)

### Generate Traffic

In order to stimulate the given backend microservices and the Istio service mesh, we can generte some `Siege` traffic via the following command:

```bash
make traffic
```

This will generate many requests to the `http://api.demo` host, and we should see this traffic coming in via the myriad of observability tooling made available in the previous step.
