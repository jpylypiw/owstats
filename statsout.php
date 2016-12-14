<?php
require "config.inc.php";
require "db.php";

define('DELIM',',');
define('DELIMD','|');

$mode = $argv[1];
if (!$mode) $mode = "QM";

$columns = array(
  "Player",
  "Rank",
  "",
  "Games",
  "",
  "Wins",
  "",
  "Win ratio",
  "",
  "Eliminations",
  "",
  "K/D Ratio",
  "",
  "Damage",
  "",
  "Blocked",
  "",
  "Healing",
  ""
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

function histdiff(&$history, $colname)
{
	$col="";
	$firsthist=$history[0];
	foreach ($history as $rl)
	{
		$col .= ($rl->$colname-$firsthist->$colname).DELIMD;
	}
	return substr($col,0,-1).DELIM;
}
		
function histdiffavg(&$history, $colname)
{
	$col="";
	$firsthist=$history[0];
	foreach ($history as $rl)
	{
		$col .= (($rl->$colname / $rl->games)*100 - ($firsthist->$colname / $firsthist->games)*100 ). DELIMD;
	}
	return substr($col,0,-1).DELIM;
}

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
	echo $a[0]." (${datediff}d)".DELIM;
	echo $r->rating.DELIM;
	echo histdiff($history,"rating");
	echo $r->games.DELIM;
	echo histdiff($history,"games");
	echo $r->wins.DELIM;
	echo histdiff($history,"wins");
	if ($r->games>0)
	{
		echo ($r->wins / $r->games)*100 . DELIM;
		echo histdiffavg($history,"wins");
	} else {
		echo "0".DELIM;
	}
	echo $r->kills/$r->games . DELIM;
	echo histdiffavg($history,"kills");
	echo $r->kills/$r->deaths.DELIM;
	echo histdiffavg($history,"deaths");
	echo $r->damage/$r->games.DELIM;
	echo histdiffavg($history,"damage");
	echo $r->blocked / $r->games.DELIM;
	echo histdiffavg($history,"blocked");
	echo $r->healing / $r->games.DELIM;
	echo histdiffavg($history,"healing");
	echo "\n";
}
// echo api_request("Juro#1208","stats");


