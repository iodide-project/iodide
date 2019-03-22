# File Structure

This document describes the file structure of this project. 

## Iodide

**Iodide** is the primary git repository. It incudes a Django server to be
run on Heroku or locally.  It includes the Dockerfile to build a PostgreSQL server.
It include WebPack and Node to compress the javascript into
just a few files. When this repository is cloned, it does not
include any of the Python Wasm
files, they are downloaded or copied from the Pyodide repositories. 


## Pyodide
**Pyodide** is the other git repository. PyOdide is used to build the wasm from
Python.  For beginners the pyodide docker file is a
great way to do the build.  It
creates the wasm in the container in /app/src which gets saved to pyodide/src.
And from there it is copied to iodide/build/0.8.2 where 0.8.2 is the
current version of Pyodide. 
Reportedly the Pyodide versions change more slowly, so they just
need to be copied occassionally into the iodide directories.


## HEROKU
Heroku is a hosting environment, maybe the first cloud hosting service.
They have a model of a persistent database with disposale heroku containers
accessing it.    
Procfile: is the command they execute to start the Django Application.  
Procfile.windows: Procfile for windows hosting.


## DJANGO/Python
Iodide supports a Django server running on Heroku. You can read how to run
Django on Heroku here.
https://devcenter.heroku.com/articles/deploying-python
So there is a bunch of Python files to define the Django server.  

server: This contains the python files defining the Django server.  
manage.py:  Called by Heroku before starting the Django server.  
pyproject.toml: PEP 518 defines pyproject.toml as a configuration file to
store build system requirements for Python projects.  
https://black.readthedocs.io/en/stable/pyproject_toml.html  
setup.cfg: Various Django definitions.  
pytest.ini: Django testing configuration.

## WebPack/Node
For web performance
it is good to merge all of the small javascript
files into a single downloadable, and elmiinate extra spaces.
WebPack does this and more.

The Webpack commands support two different options.  Dev and production.
In production you want to make the variable names as short as possible,
but in development you need to be able to read the code.  Is that the
key difference??????

node_modules: Here you have the Node.js software which are downloaded to run
Webpack on Node.js   
package.json: Defines which packages need to be loaded to run the Node +
WebPack.  
renovate.json: Automatic dependencies update  
package-lock.json: package-lock.json is automatically generated for any
operations where npm modifies either the node_modules tree, or package.json.
It describes the exact tree that was generated, such that subsequent
installs are able to generate identical trees,
regardless of intermediate dependency updates.  
webpack.config.js:  This defines how to pack the files into smaller
downloadable files.
CACHE: A Cache directory is created by the WebPack process.  This holds
the compressed wasm files, because they take a looong time to generate, and do
not change often. 

## Javascript Executables.
There are a number of commands which can be run on top of node.  

npn run test: Runs the javascript test suite.    
npn run start-and-serve: Watches the files for changes.  If anything
changes reruns the build process.  
npn run start Also watches the files for changes.
??? The difference between start and watch-and-serve is not clear????  
npn run build: This is called by the makefile.  It calls the webpack.  
npn run build-production: Runs the production build.  
npn run lint: runs lint on the Javascript code.  


## Client/Javascript
And of course all of the Javascript that runs on the client is managed in this 
Iodide repository. 

src: Here you have all of the javascrpt (.js) and react (.jsx) files.  
build: This is where the client side javascritp is put by the make command.  
build/pyodide-$PYODIDE_VERSION: This is where the pyodide wasm goes.  It
takes a long time to compress it, so it gets moved to the cache directory.  
test: Routines for testing the Javascript Application.  The tests are actually
run on the server. 


## Executales
There are a number of executables in iodide/bin.  They depend on some
environment variables.  They are called with arguments. So generally you
do not call them directly.  You can call them from the Makefile or by
calling using the npn run command as documented above. 

Makefile: is used to run all of different commands.   Unlike the C Makefiles of
old, this one is easy to read. To build just type make.
   $make  
This will create the required files in the build directory. 
You should definitely read the Makefile.  Lots of useful commands in there
all pretty self-explanatory. 


Other than the build command, makefile  just calls commands
in the bin directory.    
   
bin/install_pyodide
bin/lint-check.sh: Run the Javascript lint commands. 
bin/lint-fix.sh: Run the Javascript lint commands. 
bin/post_compile: ???  
bin/pre_deploy: Run after the Heroku buildpack, but before prior to the Django
deploy.  Looks like various tests using manage.py. Some switched off.
bin/run: run is a bash script to start the Django server locally.
On Heroku the Procfile is used to start the Django server.

## DOCKER
Dockerfile: This is used to create the docker container.  It contains a
PostgreSQL database for local deployment. 
docker-compose.yml: This is used to connect the Iodide Django application
to the local PostgreSQL database container.

## Markdown
mkdocs.yml: Used to help markdown rendering include the correct libraries. 

## THE EASY STUFF
These 5 files are self explanatory.  
LICENSE  
CHANGELOG.md  
README.md  
QA-CHECKLIST.md  
docs

