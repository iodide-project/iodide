# (Unreleased; add upcoming change notes here)

- allow suitably authorized users to create notebooks on behalf of others
- add optional [token-based authentication](https://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication)
  for accessing iodide's API endpoints without a github or openidc session.

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
