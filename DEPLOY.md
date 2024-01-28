# Deployment to Fly.io

Prior to your first deployment, you'll need to [Install Fly CLI](https://fly.io/docs/getting-started/installing-flyctl/).

## Login to Fly

```sh
fly auth login
```

> **Note:** If you have more than one Fly account, ensure that you are signed into the same
> account in the Fly CLI as you are in the browser. In your terminal, run `fly auth whoami`
> and ensure the email matches the Fly account signed into the browser.

## Create Fly application

```sh
fly apps create --org personal --name remix-start
```

> **Note:** Make sure this name matches the `app` set in your `fly.toml` file.
> Otherwise, you will not be able to deploy.

## Store the dotenv values

```sh
fly secrets set $(cat .env | xargs -I %s echo %s)
```

## Create a persistent volume for the sqlite

```sh
fly volumes create data --size 1 --app remix-start --region lax
```

## Deploy the application:

```sh
fly deploy
```

The application will available at `https://remix-start.fly.dev`.

Go to the [documentation](https://fly.io/docs/flyctl) for more information about Fly CLI.

## Connecting to your database

The sqlite database lives at `/data/sqlite.db` in your deployed application. You can connect to
the live database by running `fly ssh console -C database-cli`.

## Getting Help with Deployment

If you run into any issues deploying to Fly, make sure you've followed all of the steps above
and if you have, then post as many details about your deployment (including your app name) to
[the Fly support community](https://community.fly.io). They're normally pretty responsive over
there and hopefully can help resolve any of your deployment issues and questions.
