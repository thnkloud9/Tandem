#!/bin/bash
SCRIPTPATH="`dirname \"$0\"`"
SCRIPTPATH="`( cd \"$SCRIPTPATH\" && pwd )`" 

printf "Are you sure you want to restore? This will remove any data not saved since the last backup.\n";
read -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
    mongo tandem --eval "db.dropDatabase()";
    mongorestore --db tandem $SCRIPTPATH/../data/dump/tandem/;
else
    printf "\nExiting WITHOUT restoring data from the repository.\n";
fi
