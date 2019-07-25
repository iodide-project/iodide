# (Unreleased; add upcoming change notes here)

- removes iodide.environment API
- Add back local-only dev mode using command "npm run simple-serve"
- Iodide docker container no longer hardcodes server hostnames, can
  reuse in multiple server environments (#1943)
- Hide "unsaved changes" in revision browser if no unsaved changes (#2046)
- Show revision, docs, contribute links even on non-public sites

# 0.10.0 (2019-07-15)

- Overhauls Iodide's data formatters to cover more data types, allow folding of long results, and many other enhancements
- Deprecates the need for the `files/` prefix in fetch chunks.
- Introduces the `plugin` fetch type in fetch chunks.
- No longer swallowing errors in plugin loader code (fixes #2010)

# 0.9.0 (2019-07-03)

- Reduce the image size for small user icons, to improve loading times (fixes #1711)
- Fix loading revision browser when authentication credentials are required
  for read-only API endpoints (partially fixes #1965)
- Fix authentication hole in files api validation that would allow any logged-in
  user to modify or create a file on another's behalf.

# 0.8.0 (2019-06-18)

- Adds favicon to iodide (fixes #826)
- Adds JWT-based authentication to Iodide's API as an option (fixes #1755)
- Rebrand the "jsmd" file format as "iomd" (fixes #1634)
- Adds ability to restrict server API to authenticated users only
  (disallowing read-only API access; fixes #1879)
- Gravatars are served via https by default (fixes #1930)
- Add new file management UI (click _Menu > Manage Files_ while logged in and
  viewing a notebook that you own)

# 0.7.0 (2019-05-30)

- Better behaviour around saving, especially when multiple copies
  of a notebook are open simultaneously. Note that as part of this
  work, iodide will no longer save in (unsupported) standalone mode.
  We may add this back at a future date.
- Detect case where server logged out either due to user intervention
  or session expiry, and offer to recover (fixes #1680)
- Titles are now autosaved locally (fixes #1599)
- Pyodide is now deployed separately, so will be on a different update
  cadence than Iodide.

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
