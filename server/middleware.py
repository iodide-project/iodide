# this functionality cribbed from treeherder:
# https://github.com/mozilla/treeherder/blob/2501fbc10ad4ec8da6cb4d1a49472f866659ed64/treeherder/middleware.py

import re

from whitenoise.middleware import WhiteNoiseMiddleware


class CustomWhiteNoise(WhiteNoiseMiddleware):
    """
    Adds two additional features to WhiteNoise:

    1) Serving index pages for directory paths (such as the site root).
    2) Setting long max-age headers for bundled js files
    """

    # Matches webpack's style of chunk filenames. eg:
    # index.f03882a6258f16fceb70.bundle.js
    IMMUTABLE_FILE_RE = re.compile(r'\.[a-f0-9]{16,}\.bundle\.(js|css)$')
    INDEX_NAME = 'index.html'

    def update_files_dictionary(self, *args):
        """Add support for serving index pages for directory paths."""
        super(CustomWhiteNoise, self).update_files_dictionary(*args)
        index_page_suffix = '/' + self.INDEX_NAME
        index_name_length = len(self.INDEX_NAME)
        directory_indexes = {}
        for url, static_file in self.files.items():
            if url.endswith(index_page_suffix):
                # For each index file found, add a corresponding URL->content mapping
                # for the file's parent directory, so that the index page is served for
                # the bare directory URL ending in '/'.
                parent_directory_url = url[:-index_name_length]
                directory_indexes[parent_directory_url] = static_file
        self.files.update(directory_indexes)

    def find_file(self, url):
        """Add support for serving index pages for directory paths when in DEBUG mode."""
        # In debug mode, find_file() is used to serve files directly from the filesystem
        # instead of using the list in `self.files`, so we append the index filename so
        # that will be served if present.
        if url.endswith('/'):
            url += self.INDEX_NAME
        return super(CustomWhiteNoise, self).find_file(url)

    def is_immutable_file(self, path, url):
        """Support webpack bundle filenames when setting long max-age headers."""
        if self.IMMUTABLE_FILE_RE.search(url):
            return True
        # Otherwise fall back to the default method, so we catch filenames in the
        # style output by GzipManifestStaticFilesStorage during collectstatic. eg:
        #   bootstrap.min.abda843684d0.js
        return super(CustomWhiteNoise, self).is_immutable_file(path, url)
