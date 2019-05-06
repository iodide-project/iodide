# 0.6.0 (2019-05-06)
- introduces iodide.file API (see docs)
- restore tabular data viewer for arrays of objects
- add "TinyRep" components
- implement `storybook` for visually testing rep components
- only show notebooks with 10 or more edits on the server's index page list
- fixes bug where fetch chunks with errors don't halt further evaluation
- adds `arrayBuffer` type to fetch chunks (see docs)
- fix bug where you couldn't save a notebook after forking it

# 0.5.0 (2019-03-28)

- allow suitably authorized users to create notebooks on behalf of others
- add optional [token-based authentication](https://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication)
  for accessing iodide's API endpoints without a github or openidc session.
- Pyodide has been upgraded to version 0.10.0. This includes the new packages:
  `html5lib`, `pygments`, `beautifulsoup4`, `soupseive`, `docutils`, `bleach`
- disable automatic saving and interactivity if viewing an out of
  date copy of the notebook (#1593)
- use maintained `markdown-it-katex` package
- automatically flush any pending notebook saves to the server if the
  user is navigating away from the iodide tab
- Fix an unlikely race condition where a notebook is found to be out
  of date inside the throttle interval of a server autosave

# 0.4.0 (2019-03-09)

- iodide notebooks now automatically save to the server
- fix bug where we showed incorrect revision save times in history viewer,
  also show revision save time down to the second level
- alpha now less extreme
- improve title for user page when no first or last name is given

# 0.3.0 (2019-03-06)

- don't show "new notebook" button on user pages that don't belong to
  the currently logged in one
- add docs link to footer on server pages
- set default document position to (row 1, column 1) on startup (#1568)
- displays owner name in header message when viewing a notebook you do not own
- randomly generate initial notebook names (based on a list of iodide compounds) (#1541)
- don't allow the creation of "empty" revisions on the server

# 0.2.0 (2019-02-28)

- separates out evaluation inputs and outputs in the console and provides a standard set of console elements
- server backend: switch away from pipenv to requirements files
- add a history viewer in notebook
- redesign / refactor of console entries
- fix bug where user would be prompted to save a notebook they already own after logging in
- add link to github from user pages
- add document-level titles to all pages returned by the iodide server

# 0.1.0 (2019-02-21)

- fixes the production bug where JSS styles (material-ui) come after emotion styles
- move reps to react inspector
- change nomenclature around user output reps _including in API_ (**breaking change**)
- removed errant "0" in landing page
- plugins now throw network errors to the iodide console and catch syntax errors within plugin loaders
- implements a language selector menu on the right side of the console input

# 0.0.3 (2019-02-04)

First pre-alpha tagged release.
