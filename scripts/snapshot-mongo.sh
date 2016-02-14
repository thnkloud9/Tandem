#!/bin/bash
SCRIPTPATH="`dirname \"$0\"`"
SCRIPTPATH="`( cd \"$SCRIPTPATH\" && pwd )`" 

rm -rf $SCRIPTPATH/../data/dump/tandem/*
mongodump --db tandem --out $SCRIPTPATH/../data/dump/
printf "Data dump writing to $SCRIPTPATH/../data/dump/tandem/.  If you wish to include in the repository for live update\n";
printf "You must run 'git add $SCRIPTPATH/../data/dump/tandem; git commit -m 'latest db'; git push origin master'\n";
