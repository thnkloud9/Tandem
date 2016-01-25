#!/bin/bash

unset GIT_WORK_TREE

BASEDIR=$(dirname $0)

cd $BASEDIR/../../server
./scripts/virtual-env-setup.sh

# update config for client
sed 's/tandem\.dev/tandem\.marklewis\.me/g' $BASEDIR/../../client/master/js/modules/core/core.constants.js

cd $BASEDIR/../../client/master
npm install
bower install
gulp build
