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
  "Medals",
  "",
  "Gold",
  "",
  "Silver",
  "",
  "Bronze",
  "",
  "Cards",
  "",
  "Environmental Kills",
  "",
  "Environmental Deaths",
  "",
  "Telep. Pads dest.",
  ""
);

if (NO_HIST) $columns = array(
  "Player",
  "Games",
  "",
  "Medals",
  "Gold",
  "Silver",
  "Bronze",
  "Cards",
  "Environmental Kills",
  "Environmental Deaths",
  "Telep. Pads dest."
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
	echo $r->medals.DELIM;
	if (!NO_HIST) echo histdiff($history,"medals");
	echo $r->medals_gold.DELIM;
	if (!NO_HIST) echo histdiff($history,"medals_gold");
	echo $r->medals_silver.DELIM;
	if (!NO_HIST) echo histdiff($history,"medals_silver");
	echo $r->medals_bronze.DELIM;
	if (!NO_HIST) echo histdiff($history,"medals_bronze");
	echo $r->cards.DELIM;
	if (!NO_HIST) echo histdiff($history,"cards");
	echo $r->environmental_kills.DELIM;
	if (!NO_HIST) echo histdiff($history,"environmental_kills");
	echo $r->environmental_deaths.DELIM;
	if (!NO_HIST) echo histdiff($history,"environmental_deaths");
	echo $r->teleporter_pads_destroyed.(NO_HIST ? "" :  DELIM);
	if (!NO_HIST) echo substr(histdiff($history,"teleporter_pads_destroyed"),0,-1);
	echo "\n";
}
// echo api_request("Juro#1208","stats");


