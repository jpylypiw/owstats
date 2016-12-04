<?php
require "config.inc.php";

define('DELIM',',');

function api_request($battletag,$function="general",$apiv="v2")
{
	$tag = urlencode(str_replace("#","-",$battletag));
	$url = "http://localhost:4444/api/$apiv/u/$tag/$function";
	$json = file_get_contents($url);
	return $json;
}

function get_stats($battletag,$function="general",$apiv="v2")
{
	return json_decode(api_request($battletag,$function));
}

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

$blocker = array(
        "mei", "reinhardt", "zarya", "winston", "dva"
);

echo "player".DELIM."Time played".DELIM."Wins".DELIM."Eliminations".DELIM."K/D Ratio".DELIM."Damage".DELIM."Blocked".DELIM."Healing";
echo "\n";

foreach ($player as $tag)
{
	$a = explode("#", $tag);
	echo $a[0].DELIM;
	$ob = get_stats($tag,"stats/general");
	$games_played = round($ob->game_stats->damage_done / $ob->average_stats->damage_done_avg);
	echo $ob->game_stats->time_played.DELIM;
	echo $ob->game_stats->games_won.DELIM;
	echo $ob->average_stats->eliminations_avg.DELIM;
	echo number_format($ob->game_stats->eliminations/$ob->game_stats->deaths,5,".","").DELIM;
	echo $ob->average_stats->damage_done_avg.DELIM;
	$dmg_blocked=0;
	foreach ($blocker as $hero)
	{
		$ob_hero = get_stats($tag,"heroes/".$hero);
		$dmg_blocked += $ob_hero->hero_stats->damage_blocked;
	}
	echo number_format($dmg_blocked / $games_played,5,".","").DELIM;
	echo $ob->average_stats->healing_done_avg;
	echo "\n";
}

// echo api_request("Juro#1208","stats");


