#!/bin/bash

bower install
grunt test || exit 1

if [[ $TRAVIS_BRANCH == 'master' ]]
then
  git config credential.helper "store --file=.git/credentials"
  echo "https://${GH_TOKEN}:@github.com" > .git/credentials
  grunt push-doc-travis
fi
