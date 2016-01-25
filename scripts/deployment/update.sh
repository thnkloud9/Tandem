#!/bin/bash

unset GIT_WORK_TREE

BASEDIR=$(dirname $0)

cd $BASEDIR/../../server
./scripts/virtual-env-setup.sh

cd $BASEDIR/../../client/master
npm install
bower install
gulp build
