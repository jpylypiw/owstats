#!/bin/bash

OUTFILE=index.html

cat index.header > $OUTFILE
for csv in stats_*.csv; do php csvtotable.php $csv >> $OUTFILE; done
cat index.footer >> $OUTFILE
