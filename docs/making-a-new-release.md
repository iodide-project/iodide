# Making a new Iodide Release

Making a new iodide release involves several steps:

* Update `CHANGELOG.md` to reflect the current version as released
  (add a new version on top of it)
* Draft a new release from master with the version number using github's
  release feature. Copy paste the items from the changelog into the release
  notes.
* Synchronize `master` with the `production` branch (either locally or via
  the github interface). This entails merging `master` into `production`.

And that's it! If you are impatient and don't want to wait for circle ci
to run its various tests/checks (which should be redundant), you can go to
the heroku dashboard to deploy the production branch manually.
