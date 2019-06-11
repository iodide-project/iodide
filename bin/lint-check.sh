#!/usr/bin/env bash

set -e

isort --check-only --recursive server/
black --check server/

