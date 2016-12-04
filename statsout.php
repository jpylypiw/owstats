<?php
require "config.inc.php";
require "db.php";

define('DELIM',',');

$heroes = array(
	'offense' => array(
	  "mccree",
          "genji",
          "reaper",
          "tracer",
          "pharah",
          "soldier76",
          "sombra"
	),
	'defense' => array(
          "bastion",
          "widowmaker",
          "torbjorn",
          "junkrat",
          "mei",
          "hanzo"
	),
	'tank' => array(
          "reinhardt",
          "zarya",
          "winston",
          "roadhog",
          "dva"
	),
	'support' => array(
          "zenyatta",
          "symmetra",
          "ana",
          "lucio",
          "mercy"
	)
);

echo "Player".DELIM."Games".DELIM."Wins".DELIM."Win ratio".DELIM."Eliminations".DELIM."K/D Ratio".DELIM."Damage".DELIM."Blocked".DELIM."Healing";
echo "\n";



foreach ($player as $tag)
{
	$a = explode("#", $tag);
	echo $a[0].DELIM;
	$q = $db->query("select * from ow_qm where `tag`='$tag' and `mode`='QM' order by `date` DESC limit 1");
	$r = $q->fetch_object();
	$games_played = $r->games;
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


