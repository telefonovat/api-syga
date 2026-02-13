FROM node:20-alpine AS builder

ENV PORT=8200

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# For downloading private package
RUN --mount=type=secret,id=api_github_token \
    export GITHUB_TOKEN=$(cat /run/secrets/api_github_token) && \
    echo "@telefonovat:registry=https://npm.pkg.github.com" >> .npmrc && \
    echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN" >> .npmrc && \
    pnpm install && \
    rm .npmrc

COPY . .

EXPOSE $PORT

CMD ["pnpm", "build"]
