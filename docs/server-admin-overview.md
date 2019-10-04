# Server administration overview

This documentation is currently somewhat incomplete, help filling it out is
welcome.

## Architecture

At heart, Iodide is a fairly standard CRUD (create-read-update-delete) application, built on top of [Django](https://www.djangoproject.com/). Here is an architecture diagram outlining the main components:

<div class="mermaid">
graph TD

User(fa:fa-user User)

User --> Main
User --> EvalFrame

subgraph Website / Editor
Main(fa:fa-server Main website e.g. <i>https://alpha.iodide.io</i>)
EvalFrame(fa:fa-server Iodide eval-frame sandbox e.g. <i>https://alpha.iodide.app</i>)
end

subgraph Supporting services
DB(fa:fa-database Database Storage - Heroku Postgres or Google CloudSQL)
Redis(fa:fa-database Redis Cache)
end

Main --> DB
Main --> Redis
</div>

The main unconventional piece is that (when properly configured), Iodide
will serve content from two domains: the bulk of the site and JavaScript
is served from a "primary" domain (e.g. https://alpha.iodide.io/), but the actual evaluation context for the notebook content is served from a *separate* domain (e.g. https://alpha.iodide.app/), loaded transparently from the primary one. This is designed to provide some measure of security against a malicious notebook being used (for example) to steal a user's credentials or private information: the evaluation context (eval-frame) has no credentials or cookies associated with it, so is not able to directly access server APIs which are privileged.

## Deployment

Iodide is currently designed to be deployable on [Heroku](https://heroku.com) out of the box, using [Github](https://github.com) as an authentication provider. We are also steadily working on a docker-container based version of Iodide which should be suitable for use in other environments (e.g. Google Cloud Platform) using other authentication/identity providers, but this is not yet ready for public use.

## Important configuration variables

For the Iodide server to operate as expected, the following environment
variables *must* be defined:

Variable name | Example | Purpose |
------------- | ------- | ------ |
DATABASE_URL | postgres://USER:PASSWORD... | Defines location of database, see [django-environ](https://django-environ.readthedocs.io/en/latest/#environ.environ.Env.db_url_config) documentation
GITHUB_CLIENT_ID | bdc0d336e6bdac44... | Github client id credential, provided when you register a github application
GITHUB_CLIENT_SECRET | 9dd7e43338bc08b95ac7... | Github client secret credential, provided when you register github application
SECRET_KEY | q+50k8-no4ukn9pc25(i*=...| See [django documentation](https://docs.djangoproject.com/en/dev/ref/settings/#secret-key)
SERVER_URI | https://alpha.iodide.io/ | Root URL of site

## Optional configuration variables

The following variables may be configured to add or change behaviour of the
Iodide server:

Variable name | Example | Purpose
------------- | ------- | -------
GA_TRACKING_ID | UA-1000005-1 | If defined, google analytics (with the specified tracking id) will be used for pages loaded (users may opt-out by specifying Do Not Track)
EVAL_FRAME_ORIGIN | https://alpha.iodide.app/ | If defined, refers to the domain that should be used to serve the eval frame
USE_OPENIDC_AUTH | 1 | If specified and true, use OpenIDC for authentication instead of GitHub
