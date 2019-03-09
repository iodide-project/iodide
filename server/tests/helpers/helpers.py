import json
import re

# Misc. helper functions for unit tests


# this helper function returns a time string in the same format as presented
# by django rest framework (e.g. `2018-09-13T21:37:04.353408Z`)
def get_rest_framework_time_string(t):
    return t.isoformat()[:-6] + "Z"


# pulls the content of a script block out of the page, return it as a string
def get_script_block(page_content, id, mimetype):
    m = re.search(r'<script id="%s" type="%s">(.*?)</script>' % (id, mimetype), str(page_content))
    if m:
        return str(m.group(1))
    raise Exception("Script block with id `%s` and mimetype `%s` not found" % (id, mimetype))


# pull the contents of a script block out of the page, parse it as json
def get_script_block_json(page_content, id):
    return json.loads(get_script_block(page_content, id, "application/json"))


# get the specified title of the page
def get_title_block(page_content):
    m = re.search(r"<title>(.*)</title>", str(page_content))
    if m:
        return m.group(1)
    raise Exception("Expected to find title element but didn't!")
