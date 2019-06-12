#!/usr/bin/env bash

set -e

isort --check-only --recursive server/
flake8 server/
