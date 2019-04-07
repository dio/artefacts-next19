# Copyright (c) Tetrate, Inc 2019 All Rights Reserved.

CONTAINER_REGISTRY ?= dio123
NAME ?= 2135-frontend
TAG ?= v1.0.0

docker-build: build
	docker build -t $(CONTAINER_REGISTRY)/$(NAME):$(TAG) -f Dockerfile .

docker-push:
	docker push $(CONTAINER_REGISTRY)/$(NAME):$(TAG)

build:
	yarn build

dev:
	yarn start

clean:
	rm -fr build

.PHONY: docker-build docker-push clean