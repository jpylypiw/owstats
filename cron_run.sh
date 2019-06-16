#!/bin/bash

DATE=$(date +%Y-%m-%d)
LOGFILE=/opt/owstats/log/"$DATE"-owstats.log
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
cd $SCRIPTPATH
while [ -f .running ]
do
  sleep 5
done
touch .running
/usr/bin/node readdata.js >> $LOGFILE
rm .running
