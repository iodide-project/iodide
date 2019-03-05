import random

ELEMENTS = [
    ("oxygen", "oxide"),
    ("hydrogen", "hydride"),
    ("argon", "argide"),
    ("phosphorous", "phosphide"),
]
PREFIXES = ["di", "tri", "tetra", "penta", "hexa"]


def _get_elements(num, elements):
    i = int(random.random() * len(elements))
    element_part = elements[i][num]
    prefix_part = PREFIXES[int(random.random() * len(PREFIXES))]
    if element_part[0] == prefix_part[-1]:
        val = prefix_part[:-1] + element_part
    else:
        val = prefix_part + element_part
    if num == 0:
        return val
    return _get_elements(num - 1, elements[0 : i - 1] + elements[i + 1 : -1]) + " " + val


def get_random_molecule_name():
    return _get_elements(1, ELEMENTS)
