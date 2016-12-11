<?php
require "config.inc.php";
require "db.php";

define('DELIM',',');

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

$q = $db->query("select * from ow_general where `mode`='$mode' and `date`='$recentdate' order by `rating`");
while ($r = $q->fetch_object()) 
{
	$tag = $r->tag;
	$a = explode("#", $tag);
	echo $a[0].DELIM;
	$games_played = $r->games;
	echo $r->rating.DELIM;
	echo $games_played.DELIM;
	echo $r->wins.DELIM;
	if ($games_played>0)
	{
		echo ($r->wins / $games_played)*100 . DELIM;
	} else {
		echo "0".DELIM;
	}
	echo $r->kills/$games_played . DELIM;
	echo number_format($r->kills/$r->deaths,5,".","").DELIM;
	echo $r->damage/$games_played.DELIM;
	$dmg_blocked=$r->blocked;
	echo number_format($dmg_blocked / $games_played,5,".","").DELIM;
	echo $r->healing / $games_played;
	echo "\n";
}

// echo api_request("Juro#1208","stats");


