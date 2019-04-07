# Copyright (c) Tetrate, Inc 2019 All Rights Reserved.

CONTAINER_REGISTRY ?= dio123
NAME ?= 2135-profiles
TAG ?= v1.0.0

docker-build:
	docker build -t $(CONTAINER_REGISTRY)/$(NAME):$(TAG) -f Dockerfile .

docker-push:
	docker push $(CONTAINER_REGISTRY)/$(NAME):$(TAG)

.PHONY: docker-build docker-push
