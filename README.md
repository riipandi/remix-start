# Remix Start

[![Release](https://img.shields.io/github/v/release/riipandi/remix-start?logo=remix&color=orange)](https://github.com/riipandi/remix-start/releases)
[![Languages](https://img.shields.io/github/languages/top/riipandi/remix-start)](https://github.com/riipandi/remix-start)
[![Test](https://github.com/riipandi/remix-start/actions/workflows/test.yml/badge.svg)](https://github.com/riipandi/remix-start/actions/workflows/test.yml)
[![Contribution](https://img.shields.io/badge/Contributions-welcome-gray.svg)](https://github.com/riipandi/remix-start/pulse)

Minimal containerized Remix Stack with Tailwind CSS.

```sh
pnpm create remix --template riipandi/remix-start app_name
```

Learn more about [Remix Stacks][remix-stacks].

---

## What's in the stack?

- Deploy to [Fly.io](https://fly.io) using [Docker][docker] container
- Healthcheck endpoint for [Fly backups region fallbacks][fly-io]
- Styling with [Tailwind CSS][tailwindcss], [clsx][clsx], and [tailwind-merge][tailwind-merge]
- Code formatting and linting with [Biome][biome]
- Static Types with [TypeScript][typescript]
- Unit testing with [Vitest][vitest]
- E2E testing with [Playwright][playwright]

## 🏁 Quickstart

At least you will need `Node.js >=20.11.1` and `Docker >= 20.10` for building the container.

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
pnpm docker:images
```

```sh
# Run API Docker container in foreground
docker run --rm -it -p 3000:3000 --name remix-start --env-file .env remix-start
```

## 🚀 Deployment

[Read the guide](./DEPLOY.md) to learn how to deploy this project.

## 🧑🏻‍💻 Development

This project uses TypeScript for type checking, [Biome][biome] for code formatting
and linting which is configured in [`biome.json`](./biome.json). It's recommended
to get TypeScript set up for your editor and install an editor plugin (like the
[VSCode Biome plugin][vscode-biome]) to get auto-formatting on saving and get a
really great in-editor experience with type checking and auto-complete.

## 👷‍♂️ Contributions

Contributions are welcome! Please open a pull requests for your changes and tickets in case
you would like to discuss something or have a question.

Read [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed documentation.

## 🙏 Thanks to...

In general, I'd like to thank every single one who open-sources their source code for their
effort to contribute something to the open-source community. Your work means the world! 🌍 ❤️

## 📝 License

Licensed under either of [Apache License 2.0][license-apache] or [MIT license][license-mit] at your option.

> Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in this project by you,
> as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.

Copyrights in this project are retained by their contributors.

See the [LICENSE-APACHE](./LICENSE-APACHE) and [LICENSE-MIT](./LICENSE-MIT) files for more information.

---

<sub>🤫 Psst! If you like my work you can support me via [GitHub sponsors](https://github.com/sponsors/riipandi).</sub>

<!-- link reference definition -->
[1password]: https://1password.com/password-generator
[biome]: https://biomejs.dev
[clsx]: https://www.npmjs.com/package/clsx
[docker]: https://docs.docker.com/engine/install
[fly-io]: https://fly.io/docs/reference/configuration/#services-http_checks
[license-apache]: https://choosealicense.com/licenses/apache-2.0/
[license-mit]: https://choosealicense.com/licenses/mit/
[nodejs]: https://nodejs.org/en/download/
[playwright]: https://playwright.dev
[pnpm]: https://pnpm.io/installation
[remix-stacks]: https://remix.run/docs/en/main/guides/templates#stacks
[riipandi-x]: https://x.com/intent/follow?screen_name=riipandi
[tailwind-merge]: https://www.npmjs.com/package/tailwind-merge
[tailwindcss]: https://tailwindcss.com
[typescript]: https://typescriptlang.org
[vitest]: https://vitest.dev
[vscode-biome]: https://marketplace.visualstudio.com/items?itemName=biomejs.biome
