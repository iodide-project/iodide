# Server administration overview

Iodide is currently designed to be deployable on [Heroku](https://heroku.com)
out of the box, using [Github](https://github.com) as an authentication
provider. We are also steadily working on a docker-container based
version of Iodide which should be suitable for use in other environments
(e.g. Google Cloud Platform) using other authentication/identity providers,
but this is not yet ready for public use.

This documentation is currently somewhat incomplete, help filling it out is
welcome.

## Important configuration variables

For the Iodide server to operate as expected, the following environment
variables should be defined:

Variable name | Required | Example | Purpose
------------- | -------- | ------- | -------
DATABASE_URL | Yes | postgres://USER:PASSWORD... | Defines location of database, see [dj-database-url](https://github.com/kennethreitz/dj-database-url) documentation
EVAL_FRAME_ORIGIN | Yes | https://alpha.iodide.app/ | Refers to the domain that should be used to serve the eval frame
GA_TRACKING_ID | No | UA-1000005-1 | If specified, google analytics will be used for pages loaded (users may opt-out by specifying Do Not Track
GITHUB_CLIENT_ID | Yes | bdc0d336e6bdac44... | Github client id credential, provided when you register a github application
GITHUB_CLIENT_SECRET | Yes | 9dd7e43338bc08b95ac7... | Github client secret credential, provided when you register github application
SECRET_KEY | Yes | q+50k8-no4ukn9pc25(i*=...| See [django documentation](https://docs.djangoproject.com/en/dev/ref/settings/#secret-key)
SERVER_URI | Yes | https://alpha.iodide.io/ | Root URL of site