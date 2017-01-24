#!/bin/bash

unset GIT_WORK_TREE

SCRIPT=$(readlink -f $0)
SCRIPTPATH=`dirname $SCRIPT`

cd $SCRIPTPATH/../../server
./scripts/virtual-env-setup.sh

# TODO: find a better solution than this
# update config for client
sed -i 's/tandem\.dev/tandem\.marklewis\.me/g' $SCRIPTPATH/../../client/master/js/modules/core/core.constants.js

cd $SCRIPTPATH/../../client/master
npm install
bower install
gulp build
