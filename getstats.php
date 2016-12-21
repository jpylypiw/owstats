<?php
require "config.inc.php";
require "db.php";

define('DRYRUN',false);

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
	sleep(2);
	return $json;
}

function get_stats($battletag,$function="general",$apiv="v3")
{
	return json_decode(api_request($battletag,$function,$apiv));
}

ob_end_flush();
if (DRYRUN) echo "DRYRUN ACTIVE\n";
foreach ($player as $tag)
{
  $ob = get_stats($tag,"stats");
  $ob_heroes = get_stats($tag,"heroes");
  foreach (array("QM","COMPETITIVE") as $mode)
  {
	$modestr = ($mode=="QM" ? "quickplay" : "competitive");
	$data = $ob->eu->stats->$modestr;
	$data_heroes = $ob_heroes->eu->heroes->stats->$modestr;
	echo $tag;
	
	$a = explode("#", $tag);
	$games_played = round($data->game_stats->damage_done / $data->average_stats->damage_done_avg);
	$dmg_blocked=0;
	foreach ($heroes as $class)
	{
	 foreach ($class as $hero)
	 {
	  echo ".";
	  if ($ob_heroes->eu->heroes->playtime->$modestr->$hero == 0) continue;
	  $gs = $data_heroes->$hero->general_stats;
	  if (!$gs->deaths) continue; # no death -> not played -> skip
	  $blocked = $data_heroes->$hero->hero_stats->damage_blocked;
	  if ($blocked>0) $dmg_blocked += $blocked;
	  else $blocked = "0";
	  
	  $hero_games_played = $gs->deaths / $gs->deaths_average;
	  $sql="insert into ow_heroes
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
			'$mode',
			'".date("Y-m-d")."',
			'".$hero."',
			'".$gs->games_won."',
			'".$hero_games_played."',
			'".$gs->eliminations."',
			'".$gs->deaths."',
			'".$gs->damage_done."',
			'".$blocked."',
			'".$gs->healing_done."'
		)";
	   if (DRYRUN) { echo $sql; } else { $db->query($sql); };
	 }
	}
	$sql="insert into ow_general 
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
			? $data->overall_stats->comprank 
			: ( $data->overall_stats->prestige * 100)+$data->overall_stats->level ).",
		".$data->game_stats->games_won.",
		".$games_played.",
		".$data->game_stats->eliminations.",
		".$data->game_stats->deaths.",
		".$data->game_stats->damage_done.",
		".$dmg_blocked.",
		".$data->game_stats->healing_done."
	)";
	if (DRYRUN) { echo $sql; } else { $db->query($sql); };
	echo "\n";
  }
  if (DRYRUN) {
    echo "END OF DRYRUN\n";
    return;
  }
}

