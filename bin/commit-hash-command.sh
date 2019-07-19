#!/bin/bash
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ $CURRENT_BRANCH = 'master' ]]; then
  echo $(git rev-list HEAD --max-count=1);
else 
  echo $(git rev-list HEAD --max-count=1 --skip=$(git rev-list --right-only master..HEAD --count HEAD));
fi