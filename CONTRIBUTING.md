# Contributing Guideline

Please open an issue to discuss the contribution you wish to make before submitting any changes.

This way we can guide you through the process and give feedback.

## 🏁 Quick Start

### Prerequisites

You will need `Node.js >=18.17.1` and `Docker >= 20.10` installed on your machine.

### Up and Running

1. Install the required toolchain & SDK: [Node.js][install-nodejs] and [Docker][docker].
2. Create `.env` file or copy from `.env.example`, then configure required variables.
3. Generate application secret key, use [Generate Secret](#generate-secret) command.
4. Install required dependencies: `pnpm install`
5. Run project in development mode: `pnpm dev`

Type `cargo --help` on your terminal and see the available `cargo` commands.

### Generate Secret

You need to set the `secret key` with a random string. To generate a secret key,
use the following command:

```sh
openssl rand -base64 500 | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1
```

## 🔰 Database Migration

> TODO: add more information here

## 🐳 Docker Container

### Development Server

```sh
# Start development server
docker-compose -f docker-compose.yml up -d

# Stop development server
docker-compose -f docker-compose.yml down --remove-orphans --volumes
```

### Build Container

```sh
docker build -f Dockerfile . -t remix-start

docker image list | grep remix-start
```

### Testing Container

```sh
docker run --rm -it -p 3000:3000 --env-file .env.docker --name remix-start remix-start
```

### Push Images

Sign in to container registry:

```sh
echo $REGISTRY_TOKEN | docker login ghcr.io --username YOUR_USERNAME --password-stdin
```

Push docker image:

```sh
docker push ghcr.io/riipandi/remix-start:latest
```

## 🚀 Deployment

Read [Deployment Guide](./DEPLOY.md) for detailed documentation.

## 🪪 Licensing

This project is licensed under the [MIT License][mit-license], which allows for the
freedom to use, modify, and distribute the software while retaining the requirement
that the original copyright notice and disclaimer are included in all copies or
substantial portions of the software. Contributions are subject to the same license
terms, and contributors agree to transfer ownership of their contributions to the
project maintainers.

[docker]: https://docs.docker.com/engine/install
[install-nodejs]: https://nodejs.org/en/download
[mit-license]: https://choosealicense.com/licenses/mit/
