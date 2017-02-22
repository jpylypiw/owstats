<?php
require "config.inc.php";
require "db.php";
require "functions.php";

define('DELIM',',');
define('DELIMD','|');
define('NO_HIST',true);

$mode = $argv[1];
if (!$mode) $mode = "QM";

$columns = array(
  "Player",
  "Games",
  "",
  "DMG High",
  "",
  "Eliminations High",
  "",
  "SoloKills High",
  "",
  "FinalBlows High",
  "",
  "Object time High",
  "",
  "Object kills High",
  "",
  "Healing High",
  "",
  "on Fire High",
  ""
);

if (NO_HIST) $columns = array(
  "Player",
  "Games",
  "",
  "DMG High",
  "Eliminations High",
  "SoloKills High",
  "FinalBlows High",
  "Object time High",
  "Object kills High",
  "Healing High",
  "on Fire High"
);

$row = "";
foreach ($columns as $col)
{
  if ($col=="Rank" && $mode=="QM") {
	$row .= "Level".DELIM;
	continue;
  }
  $row .= $col.DELIM;
}

echo substr($row,0,-1);
echo "\n";

$q = $db->query("select `date` from ow_general order by `date` DESC limit 1");
$r = $q->fetch_object();
$recentdate=$r->date;


$q = $db->query("select * from ow_general where `mode`='$mode' and `date`='$recentdate' order by `rating` DESC");
while ($r = $q->fetch_object()) 
{
	$tag = $r->tag;
	$ql = $db->query("
		select * from ow_general where `mode`='$mode' and `date` >= ('$recentdate' - INTERVAL $comparedays day) and `tag`='$tag' ORDER BY `date`");
	$history = array();
	while ($rl = $ql->fetch_object())
	{
		$history[] = $rl;
	}
	$firsthist = $history[0];
	$datediff = (strtotime($firsthist->date) - strtotime($r->date))/60/60/24;
	$a = explode("#", $tag);
	echo $a[0].DELIM;
	echo $r->games.DELIM;
	echo histdiff($history,"games");
	echo $r->damage_high.DELIM;
	if (!NO_HIST) echo histdiff($history,"damage_high");
	echo $r->eliminations_high.DELIM;
	if (!NO_HIST) echo histdiff($history,"eliminations_high");
	echo $r->solo_kills_high.DELIM;
	if (!NO_HIST) echo histdiff($history,"solo_kills_high");
	echo $r->final_blows_high.DELIM;
	if (!NO_HIST) echo histdiff($history,"final_blows_high");
	echo $r->objective_time_high.DELIM;
	if (!NO_HIST) echo histdiff($history,"objective_time_high");
	echo $r->objective_kills_high.DELIM;
	if (!NO_HIST) echo histdiff($history,"objective_kills_high");
	echo $r->healing_high.DELIM;
	if (!NO_HIST) echo histdiff($history,"healing_high");
	echo $r->time_spent_on_fire_high.(NO_HIST ? "" :  DELIM);
	if (!NO_HIST) echo substr(histdiff($history,"time_spent_on_fire_high"),0,-1);
	echo "\n";
}

