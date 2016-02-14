#!/bin/bash

unset GIT_WORK_TREE

BASEDIR=$(dirname $0)

cd $BASEDIR/../../server
./scripts/virtual-env-setup.sh

# TODO: find a better solution than this
# update config for client
sed -i 's/tandem\.dev/tandem\.marklewis\.me/g' $BASEDIR/../../client/master/js/modules/core/core.constants.js

cd $BASEDIR/../../client/master
npm install
bower install
gulp build
