# Remix Start

[![Release](https://img.shields.io/github/v/release/riipandi/remix-start?logo=react-router&color=red&logoColor=white)](https://github.com/riipandi/remix-start/releases)
[![Languages](https://img.shields.io/github/languages/top/riipandi/remix-start)](https://github.com/riipandi/remix-start)
[![Test](https://github.com/riipandi/remix-start/actions/workflows/test.yml/badge.svg)](https://github.com/riipandi/remix-start/actions/workflows/test.yml)
[![Contribution](https://img.shields.io/badge/Contributions-welcome-gray.svg)](https://github.com/riipandi/remix-start/pulse)

Minimal containerized React Router application. Production-ready template for building full-stack React applications using React Router v7.
This template comes with [Tailwind CSS][tailwindcss] already configured for a simple default starting experience.

---

## What's in the stack?

- Server-side rendering
- Hot Module Replacement (HMR)
- Asset bundling and optimization
- [React Router v7][react-router]
- Deploy to [Fly.io](https://fly.io) using [Docker][docker] container
- Healthcheck endpoint for [Fly backups region fallbacks][fly-io]
- Styling with [Tailwind CSS][tailwindcss] and [Tailwind Variants][tailwind-variants]
- Production ready [Express][expressjs] server
- Code formatting and linting with [Biome][biome]
- Static Types with [TypeScript][typescript]
- Unit testing with [Vitest][vitest]
- [Storybook][storybook] for component development
- E2E testing with [Playwright][playwright]

## 🏁 Quickstart

```sh
pnpm create react-router@latest --template riipandi/remix-start app_name
```

To get started with setting up this project, refer to [CONTRIBUTING.md](./CONTRIBUTING.md) for step-by-step instructions.

## 🧑🏻‍💻 Development

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `pnpm build`:

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── server.js
├── dist/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

This project uses TypeScript for type checking, [Biome][biome] for code formatting
and linting which is configured in [`biome.json`](./biome.json). It's recommended
to get TypeScript set up for your editor and install an editor plugin (like the
[VSCode Biome plugin][vscode-biome]) to get auto-formatting on saving and get a
really great in-editor experience with type checking and auto-complete.

## 👷‍♂️ Contributions

Contributions are welcome! Please open a pull requests for your changes and tickets
in case you would like to discuss something or have a question.

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

[![Made by](https://badgen.net/badge/icon/Made%20by%20Aris%20Ripandi?icon=bitcoin-lightning&label&color=black&labelColor=black)][riipandi-x]

<!-- link reference definition -->
[biome]: https://biomejs.dev
[docker]: https://docs.docker.com/engine/install
[expressjs]: https://expressjs.com/
[fly-io]: https://fly.io/docs/reference/configuration/#services-http_checks
[license-apache]: https://choosealicense.com/licenses/apache-2.0/
[license-mit]: https://choosealicense.com/licenses/mit/
[playwright]: https://playwright.dev
[react-router]: https://reactrouter.com
[riipandi-x]: https://x.com/intent/follow?screen_name=riipandi
[storybook]: https://storybook.js.org
[tailwind-variants]: https://www.tailwind-variants.org
[tailwindcss]: https://tailwindcss.com
[typescript]: https://typescriptlang.org
[vitest]: https://vitest.dev
[vscode-biome]: https://marketplace.visualstudio.com/items?itemName=biomejs.biome
