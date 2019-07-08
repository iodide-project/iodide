# Setting up a local development environment

## Installing dependencies

Run `npm install` after cloning this repository.

## Running/Building

### Client-only mode

If you're only working on client code and don't need to use/test any of the server functionality described below. You can use `npm run start-and-serve` to write development versions of the Iodide client-side app resources to `dev/` and to serve the files in that folder at `http://localhost:8000`. You can open `http://localhost:8000/iodide.dev.html` in your browser to get started with a blank notebook, or open `http://localhost:8000` to see the list of files saved in `dev/` (in case you have exported other test notebooks in that folder)

The command `npm run start-and-serve` runs in watch mode, so changes to files will be detected and bundled into `dev/` automatically, but you will need to refresh the page in your browser manually to see the changes -- we have disabled "hot reloading" because automatically refreshing the browser would cause any active notebooks to lose their evaluation state.

If you require verbose Redux logging, you can use the command `npm run start-and-serve -- reduxVerbose`

#### Exporting from client-only dev mode

In this mode, resource paths are set to be relative to the `dev/` directory. Thus, if you export a bundled notebook from a dev notebook, you need to be sure save the exported HTML file in the `dev/` folder for the relative paths to correctly resolve the required js, css, and font files (and if you want to share a notebook that you created in a dev environment, you'll need to update the paths to point to the web-accessible resources at `iodide.io` and `iodide.app`).

### Server mode

To develop or test server-side functionality like saving notebooks or authentication, you will need to set up a server environment using docker and docker-compose. Follow this set of steps:

* Register a [GitHub oauth token](https://github.com/settings/applications/new). Set the homepage URL to be
"http://localhost:8000" and the authentication callback URL to be "http://localhost:8000/oauth/complete/github/".
* Copy `.env-dist` to `.env` and set the `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to the values provided above.
* Make sure you have [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/) installed and working correctly
* Run `make build && make up`
* You should now be able to navigate to a test server instance at http://localhost:8000

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

If you want to test your local changes to Pyodide with your local build of Iodide, there are [instructions here](https://github.com/iodide-project/pyodide/pull/455).
