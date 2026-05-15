# SYGA(See Your Graph Algorithm) API

API abstraction separating orchestration of backend operations from the interface the webapp interacts with.

## How to run


### Locally

Firstly, install dependencies through `pnpm install`

Run `pnpm dev:start` to expose the API through `http://localhost:8300`. Note that this is only for testing API endpoints and any serious fullstack testing should be done through the `syga-deploy` repository.

### Docker image

A production image of the webapp can be downloaded from [Dockerhub](https://hub.docker.com/repository/docker/kheltan/syga-prod-api).

