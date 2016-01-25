#!/bin/bash -e

BASEDIR=`dirname $0`/..

if [ ! -d "$BASEDIR/env" ]; then
    virtualenv -p python3 $BASEDIR/env
    echo "Virtualenv created."
fi

if [ ! -f "$BASEDIR/env/updated" -o $BASEDIR/requirements.txt -nt $BASEDIR/env/updated ]; then
    $BASEDIR/env/bin/pip install -r $BASEDIR/requirements.txt
    touch $BASEDIR/env/updated
    echo "Requirements installed."
fi
