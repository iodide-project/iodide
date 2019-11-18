# Setting up a local development environment

This document covers the nuts and bolts of setting up a development environment, but be sure to review our [main contribution page](contributing.md) for more general information.

## Prerequisites

You should have [Node](https://nodejs.org/) installed at v8.0.0+ and [npm](https://www.npmjs.com/). If you want to work on the server, you will also need [docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/).

## Installing dependencies

Run `npm install` after cloning this repository.

### How to add a Python dependency

Add new dependencies to the requirements template file `requirements/build.in`
and run `make pip-compile`. This will regenerate the `requirements/build.txt`
file which will be used when building the Iodide server image.

## Running/Building

### Client-only mode

If you're only working on client code and don't need to use/test any of the server functionality described below,
you can skip setting up a full docker environment and get up and running quickly. Just run
`npm run simple-serve` after `npm install`: this should start up a web server which will provide a basic
version of the editing environment you can access at [http://localhost:8000/](http://localhost:8000/).

The command runs in watch mode, so changes to files will be detected and bundled automatically, but you will need to refresh the page in your browser manually to see the changes -- we have disabled "hot reloading" because automatically refreshing the browser would cause any active notebooks to lose their evaluation state.

If you want to use another port number (e.g `9999`), you can use the command `npm run simple-serve -- --port=9999`
If you require verbose Redux logging, you can use the command `REDUX_LOGGING=VERBOSE npm run simple-serve`

### Server mode

To develop or test server-side functionality like saving notebooks or authentication, you will need to set up a server environment using docker and docker-compose. Follow this set of steps:

- Register a [GitHub oauth token](https://github.com/settings/applications/new). Set the homepage URL to be
  "http://localhost:8000" and the authentication callback URL to be "http://localhost:8000/oauth/complete/github/".
- Copy `.env-dist` to `.env` and set the `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to the values provided above.
- Make sure you have [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/) installed and working correctly
- Run `make build && make up`
- You should now be able to navigate to a test server instance at http://localhost:8000

On subsequent runs, you only need to run `make up`.

Additionally, if you are working on client code, you can run `npm run start` in a separate terminal to run webpack in watch mode (which will make your client code changes visible on page reload). If you require verbose Redux logging, you can set the environment variable `REDUX_LOGGING=VERBOSE` with the command `REDUX_LOGGING=VERBOSE npm run start`

Sometimes, for debugging purposes, it is useful to have a shell session inside the "app" docker container. You
can use either the `make shell` command (creates a shell session with the "app" user) or the `make root-shell`
commands (creates a shell session logged in as root, useful for experimenting with new python packages). Note that the iodide server environment must already be running for this to work.

## Building the docs

The documentation is written in markdown, and uses
[mkdocs](https://www.mkdocs.org/) to generate a static website.

To test changes to the docs locally, you'll need to install `mkdocs` and
`markdown-include`. This is completely independent of the server's Docker image
described above. If you have `pip` and `python` installed on your system, you
can install these packages using the command:

```
pip install mkdocs markdown-include
```

If that doesn't work, consult the [mkdocs installation
instructions](https://www.mkdocs.org/#installing-mkdocs).

Then you can run:

```
mkdocs serve
```

to preview the docs during development.

To build a local, static copy of the docs, run:

```
mkdocs build
```

## Testing

Iodide currently has two test suites, one written with [jest](https://jestjs.io/) to test the editor environment. Another written with [pytest](https://docs.pytest.org/en/latest/) to test the server.

### Editor unit tests (jest)

Run `npm test` to run the test suite once, or `npm test --watch` to run the suite in watch mode, which will automatically re-run the tests when the source or tests have changed.

### Iodide server unit tests (pytest)

After bringing up the docker-compose environment (see above), run `make shell` then `py.test` to run the full test suite. You can run a small subset of the tests by specifying what you want on the command line. For example `py.test server/tests/test_file_api.py` will only run the tests contained in that file.

## Running with a local build of Pyodide

If you want to test your local changes to Pyodide with your local build of Iodide, there are [instructions here](https://github.com/iodide-project/pyodide/blob/master/docs/using_pyodide_from_iodide.md#using-a-local-build-of-pyodide-with-iodide).
