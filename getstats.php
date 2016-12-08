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

