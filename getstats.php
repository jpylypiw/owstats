<?php
require "config.inc.php";
require "db.php";


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

foreach ($player as $tag)
{
	echo $tag;
	$a = explode("#", $tag);
	$ob = get_stats($tag,"stats/general");
	$games_played = round($ob->game_stats->damage_done / $ob->average_stats->damage_done_avg);
	$dmg_blocked=0;
	foreach ($blocker as $hero)
	{
		$ob_hero = get_stats($tag,"heroes/".$hero);
		$dmg_blocked += $ob_hero->hero_stats->damage_blocked;
		echo ".";
	}
	$db->query(
	"insert into ow_qm 
		(`tag`, 
		`mode`, 
		`date`, 
		`wins`, 
		`games`, 
		`kills`, 
		`deaths`, 
		`damage`, 
		`blocked`, 
		`healing`) 
	values (
		'$tag',
		'QM',
		'".date("Y-m-d")."',
		".$ob->game_stats->games_won.",
		".$games_played.",
		".$ob->game_stats->eliminations.",
		".$ob->game_stats->deaths.",
		".$ob->game_stats->damage_done.",
		".$dmg_blocked.",
		".$ob->game_stats->healing_done."
	)");
	echo "\n";
}

