# Making a new Iodide Release

Making a new iodide release involves several steps:

* Update `CHANGELOG.md` to reflect the current version as released
  (add a new version on top of it)
* Draft a new release from master with the version number using github's
  release feature. Copy paste the items from the changelog into the release
  notes.
* Update the `PYODIDE_VERSION` environment variable on heroku if you want
  to include a newer version of pyodide (hopefully this requirement will go away
  in the future: see [#1426](https://github.com/iodide-project/iodide/issues/1426)).
* Synchronize `master` with the `production` branch (either locally or via
  the github interface).

And that's it! If you are impatient and don't want to wait for circle ci
to run its various tests/checks (which should be redundant), you can go to
the heroku dashboard to deploy the production branch manually.
