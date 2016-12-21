<?php
require "config.inc.php";
require "db.php";


function api_request($battletag,$function="general",$apiv="v2")
{
	$tag = urlencode(str_replace("#","-",$battletag));
	$url = "http://localhost:4444/api/$apiv/u/$tag/$function";
	$agent= 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.0.3705; .NET CLR 1.1.4322)';
	$ch=curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_USERAGENT, $agent);
	$json=curl_exec($ch);
	curl_close($ch);
	return $json;
}

function get_stats($battletag,$function="general",$apiv="v2")
{
	return json_decode(api_request($battletag,$function));
}


foreach ($player as $tag)
{
  foreach (array("QM","COMPETITIVE") as $mode)
  {
	$modestr = ($mode=="QM" ? "general" : "competitive");
	echo $tag;
	$a = explode("#", $tag);
	$ob = get_stats($tag,"stats/$modestr");
	$ob_herolist = get_stats($tag,"heroes/$modestr");
	$ob_herolist = $ob_herolist->heroes;
	$games_played = round($ob->game_stats->damage_done / $ob->average_stats->damage_done_avg);
	$dmg_blocked=0;
	foreach ($heroes as $class)
	{
	 foreach ($class as $hero)
	 {
	  echo ".";
	  if (in_array($hero,$blocker))
	  {
		if (!$ob_herolist->$hero) continue;
		$ob_hero = get_stats($tag,"heroes/$hero/$modestr");
		/*
		$db->query(
		"insert into ow_heroes
			(`tag`, 
			`mode`, 
			`date`, 
			`hero`,
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
			'".$hero."',
			".$ob_hero->game_stats->games_won.",
			".$games_played.",
			".$ob->game_stats->eliminations.",
			".$ob->game_stats->deaths.",
			".$ob->game_stats->damage_done.",
			".$dmg_blocked.",
			".$ob->game_stats->healing_done."
		)");
		*/
		$dmg_blocked += $ob_hero->hero_stats->damage_blocked;
	  }
	 }
	}
	$db->query(
	"insert into ow_general 
		(`tag`, 
		`mode`, 
		`date`, 
		`rating`, 
		`wins`, 
		`games`, 
		`kills`, 
		`deaths`, 
		`damage`, 
		`blocked`, 
		`healing`) 
	values (
		'$tag',
		'$mode',
		'".date("Y-m-d")."',
		".(
		$mode=="COMPETITIVE" 
			? $ob->overall_stats->comprank 
			: ( $ob->overall_stats->prestige * 100)+$ob->overall_stats->level ).",
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
}

