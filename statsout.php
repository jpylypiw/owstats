<?php
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

$players = array(
'TheBomb#2919' => "TheBomb",
'DERTYP#2248' => "DerTyp",
'Daryu#2129' => "Daryu",
'hawoosin#2541' => "", 
'Juro#1208'   => "", 
'hiroyukki#2129' => "", 
'Shyrogan#2408' => "", 
'Lynrael#2231' => "", 
'Thoronga#2172' => "", 
'Weed4Speed#2694' => "", 
'Hardhörnchen#2577' => "", 
'Iluv#2966' => "", 
'Yeydida#2538' => "", 
'LordPE#2884' => "", 
'Kelyrra#21953' => "", 
'Everose#2269' => "", 
'Skay#21101' => "", 
'm420p#2639' => "" 
);

/*
$players = array(
'Hardh%C3%B6rnchen#2577' => ""
)
*/

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


/*
$players = array(
'Iluv#2966' => "", 
'Juro#1208' => ""
);
*/

echo "player".DELIM."Time played".DELIM."Wins".DELIM."Eliminations".DELIM."K/D Ratio".DELIM."Damage".DELIM."Blocked".DELIM."Healing";
/*
foreach ($heroes as $class => $herolist)
{
	echo "$class games".DELIM."$class wins".DELIM;
}
*/
echo "\n";

foreach ($players as $tag => $name)
{
	$a = explode("#", $tag);
	echo $a[0].DELIM;
	$ob = get_stats($tag,"stats/general");
	$games_played = round($ob->game_stats->damage_done / $ob->average_stats->damage_done_avg);
	echo $ob->game_stats->time_played.DELIM;
	echo $ob->game_stats->games_won.DELIM;
	echo $ob->game_stats->eliminations.DELIM;
	echo number_format($ob->game_stats->eliminations/$ob->game_stats->deaths,1,".","").DELIM;
	echo $ob->average_stats->damage_done_avg.DELIM;
	$dmg_blocked=0;
	foreach ($blocker as $hero)
	{
		$ob_hero = get_stats($tag,"heroes/".$hero);
		$dmg_blocked += $ob_hero->hero_stats->damage_blocked;
	}
	echo number_format($dmg_blocked / $games_played,1,".","").DELIM;
	echo $ob->average_stats->healing_done_avg;
	echo "\n";
}

// echo api_request("Juro#1208","stats");


