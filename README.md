# Istio Demonstration

## Contents

- [Istio Demonstration](#istio-demonstration)
    - [Contents](#contents)
    - [Reference](#reference)
    - [Getting Started](#getting-started)
        - [install dependencies](#install-dependencies)
        - [resolution](#resolution)
        - [Install Istio](#install-istio)
        - [Install ingress components](#install-ingress-components)
        - [label namespace](#label-namespace)
        - [deploy example microservice](#deploy-example-microservice)
        - [deploy mesh and ingressgateway istio policy](#deploy-mesh-and-ingressgateway-istio-policy)
    - [Build & Deployment](#build--deployment)

## Reference

## Getting Started

To start the presentation alone run the following:

```bash
yarn
npm run start
```

In order to run the Istio demo we need to run a series of installs and deployments within a kubernetes cluster. This is achieved through the `Makefile` in this repo. 

### install dependencies

```bash
make install
```

### resolution

add the following to your /etc/hosts to faciliate domain resolution which will be
used for requesting content from the serice mesh:

```text
...
127.0.0.1 tracing.local grafana.local kiali.local demo.microservice.local
...
```

### Install Istio

```bash
make install-istio
```

### Install ingress components

```bash
make install-ingress
```

### label namespace

In orde to allow for auto-sidecar injection we label the given namespace with the following tag:

```bash
make label-namespace
```

### deploy example microservice

With the namespace labelled, the below deployment will have side-cars added and consequently be augmented into the mesh.

```bash
make deploy-v1
make deploy-v2
```

### deploy mesh and ingressgateway istio policy

```bash
make microservice-policy
```

This will apply the related Istio CRD's to faciliate ingress into the mesh to the required microservices. You can see these polices in [policy/istio](/policy/istio) within this repo.

Open a browser and hit [http://localhost:3000](http://localhost:3000), and we are ready to roll.

## Build & Deployment

Building the dist version of the project is as easy as running

```bash
npm run build
```

If you want to deploy the slideshow to surge, run 
```bash
npm run deploy
```
