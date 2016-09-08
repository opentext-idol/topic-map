#!/bin/bash

node_modules/grunt-cli/bin/grunt test

if [[ $TRAVIS_BRANCH == 'master' ]]
then
  git config credential.helper "store --file=.git/credentials"
  echo "https://${GH_TOKEN}:@github.com" > .git/credentials
  node_modules/grunt-cli/bin/grunt push-doc-travis
fi
