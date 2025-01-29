# Contributing Guideline

Please open an issue to discuss the contribution you wish to make before submitting any changes.

This way we can guide you through the process and give feedback.

## 🏁 Quick Start

You will need `Node.js >=20.11.1`, `pnpm >=9.15.0` and `Docker >= 27.4` installed on your machine.

Optionally, you can use [Docker Slim][docker-slim] to reduce the container image size.

### Up and Running

1. Install the required toolchain & SDK: [Node.js][nodejs], [pnpm][pnpm], and [Docker][docker].
2. Create `.env` file or copy from `.env.example`, then configure required variables.
3. Generate application secret key: `pnpm generate:key`
4. Install required project dependencies: `pnpm install`
5. Start the database server and local SMTP server: `pnpm pre-dev`
6. Run project in development mode: `pnpm dev`

If you don't have OpenSSL installed, an alternative option for generating a secret key
is to use [1password][1password] to create a random secret.

Application will run at <http://localhost:3000>

For detailed explanation on how things work, check out [React Router documentation][react-router-docs].

### OAuth Configuration

Callback: `http://localhost:3000/auth/<PROVIDER>/callback`

### Webhooks

In order to receive webhooks (_i.e. notifications, payment integrations, etc_), you will need
to expose the local port to the internet. To expose a local port to the internet, you can use
service like [Tailscale Funnel][tailscale], [Expose by Beyond Code][expose-dev], or [ngrok][ngrok].

In this case we will use Tailscale Funnel. By default, no alias for `tailscale` is set up.
If you plan on frequently accessing the Tailscale CLI, you can add an alias to your `.bashrc`
or `.zshrc` to make it easier.

```sh
alias tailscale="/Applications/Tailscale.app/Contents/MacOS/Tailscale"
```

```sh
tailscale funnel --bg=false http://localhost:3000
tailscale funnel status
```

Reference: https://www.twilio.com/blog/expose-localhost-to-internet-with-tunnel

## 🔰 Database Migration

> TODO: add more information here

## Testing

### Unit Testing

```sh
pnpm test            # Run unit tests
pnpm test:coverage   # Run unit tests and generate coverage report
pnpm test:report     # View the unit test report
pnpm test:ui         # Launch the unit test runner UI
```

### E2E Testing

```sh
pnpm e2e-test:install   # Install dependencies for E2E testing
pnpm e2e-test:ui        # Launch the E2E test runner UI

pnpm e2e-test:chrome    # Run end-to-end tests in Chrome browser
pnpm e2e-test:firefox   # Run end-to-end tests in Firefox browser
pnpm e2e-test:safari    # Run end-to-end tests in Safari browser
pnpm e2e-test:mobile    # Run end-to-end tests for mobile devices

pnpm e2e-test:report    # Generate and view the E2E test report
```

## 🐳 Docker Container

### Development Server

```sh
# Start development server
docker-compose up -d

# Stop development server
docker-compose down --remove-orphans --volumes
```

### Build Container

```sh
pnpm docker:build
```

### List Docker Images

```sh
pnpm docker:images
```

### Testing Container

```sh
# Run API Docker container in foreground
docker run --rm -it -p 3000:3000 --name remix-start --env-file .env remix-start
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

<!-- link reference definition -->
[1password]: https://1password.com/password-generator
[docker-slim]: https://github.com/slimtoolkit/slim
[docker]: https://docs.docker.com/engine/install
[expose-dev]: https://expose.dev/
[ngrok]: https://ngrok.com/
[nodejs]: https://nodejs.org/en/download/
[pnpm]: https://pnpm.io/installation
[react-router-docs]: https://reactrouter.com/start/framework/installation
[tailscale]: https://tailscale.com/kb/1223/funnel
