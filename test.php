<?php
define('DELIM',',');

function api_request($battletag,$function="general",$apiv="v2")
{
	$tag = urlencode(str_replace("#","-",$battletag));
	$url = "http://localhost:4444/api/$apiv/u/$tag/$function";
	$agent= 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.0.3705; .NET CLR 1.1.4322)';
	$ch=curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_USERAGENT, $agent);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$json=curl_exec($ch);
	curl_close($ch);
	// $json = file_get_contents($url);
	return $json;
}

function get_stats($battletag,$function="general",$apiv="v2")
{
	return json_decode(api_request($battletag,$function,$apiv));
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



# print_r(get_stats("Juro-1208",$argv[1]));

# print_r(get_stats("Hardhörnchen-2577",$argv[2],$argv[1]));
# print_r(get_stats("Iluv-2966",$argv[2],$argv[1]));
print_r(get_stats("Juro-1208",$argv[2],$argv[1]));

/*
		foreach ($blocker as $hero)
		{
		echo $hero." ";
		$ob_hero = get_stats("Hardhörnchen#2577","heroes/".$hero);
		echo $ob_hero->hero_stats->damage_blocked;
		echo "\n";
	}
*/

// echo api_request("Juro#1208","stats");


