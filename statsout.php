<?php
define('DELIM',',');

function api_request($battletag,$function="general",$apiv="v2")
{
	$tag = str_replace("#","-",$battletag);
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


$heroes = array(
	'offense' => array(
	  "mccree",
          "genji",
          "reaper",
          "tracer",
          "pharah",
          "soldier76"
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

/*
$players = array(
'Iluv#2966' => "", 
'Juro#1208' => ""
);
*/

echo "player".DELIM."rank".DELIM;
foreach ($heroes as $class => $herolist)
{
	echo "$class games".DELIM."$class wins".DELIM;
}
echo "\n";

foreach ($players as $tag => $name)
{
	$a = explode("#", $tag);
	echo $a[0].DELIM;
	$ob = get_stats($tag,"stats/competitive");
	echo $ob->overall_stats->comprank.DELIM;
	foreach ($heroes as $class => $herolist)
	{
		$games = 0;
		$won = 0;
		foreach ($herolist as $hero)
		{
			$ob = get_stats($tag,"heroes/$hero/competitive");
			// $won += $ob->eu->heroes->stats->quickplay->$hero->general_stats->games_won;
			if ($ob)
			{
				$won += $ob->general_stats->games_won;
				$games += $ob->general_stats->games_played;
			}
		}
		echo $games.DELIM.$won.DELIM;
		
	}
	
/*
	echo $ob->data->username.";";
	echo $ob->data->level.";";
	$hd = api_request($tag,"competitive/hero/Genji%2CMccree%2CPharah%2CReaper%2Csoldier-76%2Csombra%2Ctracer");
*/	
	echo "\n";
}

// echo api_request("Juro#1208","stats");


