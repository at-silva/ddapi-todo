# DDAPI (Database Direct API) TODO app

This repo contains a TODO app implemented as a proof of concept for the [DDAPI](https://github.com/at-silva/ddapi).

This is *not* a production ready app right now.

## Here's the interesting stuff

### Backend

 - **[backend/main.go](https://github.com/at-silva/ddapi-todo/blob/main/backend/main.go#L54)**: DDAPI Exec Handler Initialization

 - **[backend/main.go](https://github.com/at-silva/ddapi-todo/blob/main/backend/main.go#L62)**: DDAPI Query Handler Initialization

### Frontend
 - **[frontend/ddapi-sign.js](https://github.com/at-silva/ddapi-todo/blob/main/frontend/bin/ddapi-sign.js):** Script responsible for finding and signing DDAPI DML statements and DQL queries at build time.

 - **[frontend/src/containers/ListItem.jsx](https://github.com/at-silva/ddapi-todo/blob/main/frontend/src/containers/ListItem.jsx#L14):** Embedded *delete* and *update* statements 😲.

 - **[frontend/src/containers/Lists.jsx](https://github.com/at-silva/ddapi-todo/blob/main/frontend/src/containers/Lists.jsx#L24):** Embedded *select* statement.

 - **frontendsrc/ddapi/signatures.js**: This file is supposed to be generated during compilation time so we don't have it commited to the repo, but here's how one should look like:

![signatures.js]( https://github.com/at-silva/ddapi-todo/raw/main/docs/signatures-js.jpg "signatures.js")

## And here's a brief tour of the app
![Screencast 1]( https://github.com/at-silva/ddapi-todo/raw/main/docs/screencast1.gif "Screencast")

## How to run the code
Clone the repo and

```bash
make start
```

There's a `docker-compose.yml` file in the project but we need to generate an env file with a signing key for your environment first, so DO NOT RUN `doker-compose up` on your first run, please use the makefile.

**Important:** It will take a few minutes to boot up the first time because the frontend needs to download the dependencies (`npm install`) before starting.

**Any feedback is welcome!**