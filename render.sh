#!/bin/bash
BASE=$(dirname $0)
/usr/bin/php $BASE/statsout.php QM > $BASE/stats_QM_OVERALL.csv
/usr/bin/php $BASE/statsout.php COMPETITIVE > $BASE/stats_CS_OVERALL.csv
/usr/bin/php $BASE/statsout_weekly.php QM > $BASE/stats_QM_WEEKLY.csv
/usr/bin/php $BASE/statsout_weekly.php COMPETITIVE > $BASE/stats_CS_WEEKLY.csv
/usr/bin/php $BASE/statsout_misc.php QM > $BASE/stats_QM_MISC.csv
/usr/bin/php $BASE/statsout_misc.php COMPETITIVE > $BASE/stats_CS_MISC.csv
/usr/bin/php $BASE/statsout_high.php QM > $BASE/stats_QM_HIGH.csv
/usr/bin/php $BASE/statsout_high.php COMPETITIVE > $BASE/stats_CS_HIGH.csv
/usr/bin/php $BASE/statsout_classes.php COMPETITIVE Attack > $BASE/stats_CS_OFFENSE.csv
/usr/bin/php $BASE/statsout_classes.php COMPETITIVE Defense > $BASE/stats_CS_DEFENSE.csv
/usr/bin/php $BASE/statsout_classes.php COMPETITIVE Tank > $BASE/stats_CS_TANK.csv
/usr/bin/php $BASE/statsout_classes.php COMPETITIVE Support > $BASE/stats_CS_SUPPORT.csv
/usr/bin/php $BASE/statsout_heroes.php QM > $BASE/stats_QM_HEROES.csv
cd $BASE
$BASE/csvtotable.sh
