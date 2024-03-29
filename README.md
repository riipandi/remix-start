# Remix Start

[![Release](https://img.shields.io/github/v/release/riipandi/remix-start?logo=remix&color=orange)](https://github.com/riipandi/remix-start/releases)
[![Languages](https://img.shields.io/github/languages/top/riipandi/remix-start)](https://github.com/riipandi/remix-start)
[![License](https://img.shields.io/github/license/riipandi/remix-start)][mit-license]
[![Test](https://github.com/riipandi/remix-start/actions/workflows/test.yml/badge.svg)](https://github.com/riipandi/remix-start/actions/workflows/test.yml)
[![Contribution](https://img.shields.io/badge/Contributions-welcome-gray.svg)](https://github.com/riipandi/remix-start/pulse)

Minimal containerized Remix Stack with Tailwind CSS.

```sh
pnpm create remix --template riipandi/remix-start app_name
```

Learn more about [Remix Stacks](https://remix.run/docs/en/main/guides/templates#stacks).

---

## What's in the stack?

- Deploy to [Fly.io](https://fly.io) using [Docker](https://www.docker.com/) container
- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)
- Styling with [Tailwind CSS](https://tailwindcss.com/), [clsx](https://www.npmjs.com/package/clsx), and [tailwind-merge](https://www.npmjs.com/package/tailwind-merge)
- Tailwind linting and formatting with [eslint-plugin-tailwindcss](https://www.npmjs.com/package/eslint-plugin-tailwindcss)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)
- Unit testing with [Vitest](https://vitest.dev)
- E2E testing with [Playwright](https://playwright.dev)

## 🏁 Quickstart

At least you will need `Node.js >=18.17.1` and `Docker >= 20.10` for building the container.

### Generate Secret Key

Before you continue, you need to create `.env` file (you can duplicate `.env.example`) and
fill the `application secret key` with some random string. To generate a secret key, use
the following command:

```sh
openssl rand -base64 500 | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1
```

If you don't have openssl installed, you can also use [1password][1password]
to generate a random secret.

### Up and running

```sh
pnpm install      # install the dependencies
pnpm dev          # serve with hot reload

pnpm build        # build for production
pnpm start        # launch generated build
```

This starts your app in development mode, rebuilding assets on file changes.

### E2E Testing

```sh
pnpm e2e-test:ui
```

## 🐳 Build Container

```sh
pnpm docker:build
```

```sh
# Run API Docker container in foreground
docker run --rm -it -p 3000:3000 --name remix-start --env-file .env remix-start
```

## 🚀 Deployment

[Read the guide](./DEPLOY.md) to learn how to deploy this project.

## 🧑🏻‍💻 Development

This project uses TypeScript for type checking, [ESLint](https://eslint.org/) for linting which
is configured in `.eslintrc.js`, and [Prettier](https://prettier.io/) for auto-formatting in
this project. It's recommended to get TypeScript set up for your editor and install an editor
plugin (like the [VSCode Prettier plugin](https://s.id/vscode-prettier)) to get auto-formatting
on saving and get a really great in-editor experience with type checking and auto-complete.

## 👷‍♂️ Contributions

Contributions are welcome! Please open a pull requests for your changes and tickets in case
you would like to discuss something or have a question.

Read [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed documentation.

## 🙏 Thanks to...

In general, I'd like to thank every single one who open-sources their source code for their
effort to contribute something to the open-source community. Your work means the world! 🌍 ❤️

## 📝 License

This project is open-sourced software licensed under the [MIT license](./LICENSE).

Copyrights in this project are retained by their contributors.
See the [license file](./LICENSE) for more information.

---

<sub>🤫 Psst! If you like my work you can support me via [GitHub sponsors](https://github.com/sponsors/riipandi).</sub>

[mit-license]: https://choosealicense.com/licenses/mit/
[1password]: https://1password.com/password-generator
