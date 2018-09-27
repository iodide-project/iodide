# Misc. helper functions for unit tests


# this helper function returns a time string in the same format as presented
# by django rest framework (e.g. `2018-09-13T21:37:04.353408Z`)
def get_rest_framework_time_string(t):
    return t.isoformat()[:-6] + 'Z'
