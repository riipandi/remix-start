<p align="center"><img src="./banner.svg" width="500" height="150" alt="Project Logo"></p>
<p align="center">
    <a href="https://github.com/riipandi/prismix/pulse">
        <img src="https://img.shields.io/badge/Contributions-welcome-blue.svg?style=flat-square" alt="Contribution welcome">
    </a>
    <a href="https://github.com/riipandi/prismix">
        <img src="https://img.shields.io/github/languages/top/riipandi/prismix?style=flat-square" alt="Top language">
    </a>
    <a href="https://aris.mit-license.org">
        <img src="https://img.shields.io/github/license/riipandi/prismix?style=flat-square" alt="License">
    </a>
</p>

---

Minimal containerized Remix Stack with Tailwind CSSS, SQLite, and Prisma ORM.

```sh
yarn create remix --template riipandi/prismix <my_app>
```

Learn more about [Remix Stacks](https://remix.run/stacks).

---

## What's in the stack

- [Fly app deployment](https://fly.io) with [Docker](https://www.docker.com/)
- Production-ready [SQLite Database](https://sqlite.org)
- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)
- Email/Password Authentication with [cookie-based sessions](https://remix.run/docs/en/v1/api/remix#createcookiesessionstorage)
- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Tailwind linting and formatting with [eslint-plugin-tailwindcss](https://www.npmjs.com/package/eslint-plugin-tailwindcss)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## 🏁 Quickstart

### Generate Secret Key

Before you continue, you need to create `.env` file (you can duplicate `.env.example`) and
fill the `application secret key` with some random string. To generate a secret key, use
the following command:

```sh
openssl rand -base64 500 | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1
```

If you don't have openssl installed, you can also use [1password](https://1password.com/password-generator)
to generate a random secret.

### Up and running

```sh
yarn install      # install the dependencies
yarn db:init      # Prepare database migration
yarn db:setup     # Populate database seeder

yarn dev          # serve with hot reload
yarn build        # build for production
yarn start        # launch generated build
```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a new user with some data you can use to get started:

- Email: `aris@duck.com`
- Password: `passw0rd`

### Relevant code:

This is a pretty simple note-taking app, but it's a good example of how you can build a full stack app with Prisma and Remix.
The main functionality is creating users, logging in and out, and creating and deleting notes.

- creating users, and logging in and out [./app/models/user.server.ts](./app/models/user.server.ts)
- user sessions, and verifying them [./app/session.server.ts](./app/session.server.ts)
- creating, and deleting notes [./app/models/note.server.ts](./app/models/note.server.ts)

## 🚀 Deployment to Fly.io

Prior to your first deployment, you'll need to [Install Fly CLI](https://fly.io/docs/getting-started/installing-flyctl/).

### Login to Fly

```sh
fly auth login
```

> **Note:** If you have more than one Fly account, ensure that you are signed into the same
> account in the Fly CLI as you are in the browser. In your terminal, run `fly auth whoami`
> and ensure the email matches the Fly account signed into the browser.

### Create Fly application

```sh
fly apps create --org personal --name prismix
```

> **Note:** Make sure this name matches the `app` set in your `fly.toml` file.
> Otherwise, you will not be able to deploy.

### Store the dotenv values

```sh
fly secrets set $(cat .env | xargs -I %s echo %s)
```

### Create a persistent volume for the sqlite

```sh
fly volumes create data --size 1 --app prismix --region lax
```

### Deploy the application:

```sh
fly deploy
```

The application will available at `https://prismix.fly.dev`.

Go to the [documentation](https://fly.io/docs/flyctl) for more information about Fly CLI.

### Connecting to your database

The sqlite database lives at `/data/sqlite.db` in your deployed application. You can connect to
the live database by running `fly ssh console -C database-cli`.

### Getting Help with Deployment

If you run into any issues deploying to Fly, make sure you've followed all of the steps above
and if you have, then post as many details about your deployment (including your app name) to
[the Fly support community](https://community.fly.io). They're normally pretty responsive over
there and hopefully can help resolve any of your deployment issues and questions.

## 🧑🏻‍💻 Development

This project uses TypeScript for type checking, [ESLint](https://eslint.org/) for linting which
is configured in `.eslintrc.js`, and [Prettier](https://prettier.io/) for auto-formatting in
this project. It's recommended to get TypeScript set up for your editor and install an editor
plugin (like the [VSCode Prettier plugin](https://s.id/vscode-prettier)) to get auto-formatting
on saving and get a really great in-editor experience with type checking and auto-complete.
