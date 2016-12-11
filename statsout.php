<?php
require "config.inc.php";
require "db.php";

define('DELIM',',');
define('DELIMD','|');
$comparedays = 7;

$mode = $argv[1];
if (!$mode) $mode = "QM";

$columns = array(
  "Player",
  "Rank",
  "Games",
  "Wins",
  "Win ratio",
  "Eliminations",
  "K/D Ratio",
  "Damage",
  "Blocked",
  "Healing"
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
		select * from ow_general where `mode`='$mode' and `date` <= ('$recentdate' - INTERVAL $comparedays day) and `tag`='$tag' ORDER BY `date` desc");
	$rl = $ql->fetch_object();
	if (!$rl) {
		$ql = $db->query("
		select * from ow_general where `mode`='$mode' and `date`>('$recentdate' - INTERVAL $comparedays day) and `tag`='$tag' ORDER BY `date` "); 
		$rl = $ql->fetch_object();
	}
	$datediff = (strtotime($rl->date) - strtotime($r->date))/60/60/24;
	$a = explode("#", $tag);
	echo $a[0]." (${datediff}d)".DELIM;
	echo $r->rating.DELIMD;
	echo ($r->rating-$rl->rating).DELIM;
	echo $r->games.DELIMD;
	echo ($r->games-$rl->games).DELIM;
	echo $r->wins.DELIMD;
	echo ($r->wins-$rl->wins).DELIM;
	if ($r->games>0)
	{
		echo ($r->wins / $r->games)*100 . DELIMD;
		echo (($r->wins / $r->games)*100 - ($rl->wins / $rl->games)*100 ). DELIM;
	} else {
		echo "0".DELIM;
	}
	echo $r->kills/$r->games . DELIMD;
	echo ($r->kills/$r->games - $rl->kills/$rl->games ) . DELIM;
	echo $r->kills/$r->deaths.DELIMD;
	echo ($r->kills/$r->deaths - $rl->kills/$rl->deaths ).DELIM;
	echo $r->damage/$r->games.DELIMD;
	echo ($r->damage/$r->games - $rl->damage/$rl->games).DELIM;
	echo $r->blocked / $r->games.DELIMD;
	echo ($r->blocked / $r->games - $rl->blocked / $rl->games).DELIM;
	echo $r->healing / $r->games.DELIMD;
	echo ($r->healing / $r->games - $rl->healing / $rl->games);
	echo "\n";
}

// echo api_request("Juro#1208","stats");


