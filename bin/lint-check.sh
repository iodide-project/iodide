#!/usr/bin/env bash
isort --check-only --recursive server/
black --check server/

