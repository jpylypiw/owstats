<?php
require "config.inc.php";
require "db.php";
require "functions.php";

define('DRYRUN',false);
define('NO_HEROES',false);

ob_end_flush();
if (DRYRUN) echo "DRYRUN ACTIVE\n";
$region = "eu";
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
	foreach ($heroes as $class)
	{
	 if (NO_HEROES) continue;
	 foreach ($class as $hero)
	 {
	  echo ".";
	  if ($ob_heroes->eu->heroes->playtime->$modestr->$hero == 0) continue;
	  $gs = $data_heroes->$hero->general_stats;
	  if (!$gs->deaths) continue; # no death -> not played -> skip
	  if (!$data_heroes->$hero->average_stats->deaths_average) continue; # no death -> not played -> skip

	  $hero_games_played = $gs->deaths / $data_heroes->$hero->average_stats->deaths_average;
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
			`healing`
		) values (
			'$tag',
			'$mode',
			'".date("Y-m-d")."',
			'".$hero."',
			'".$gs->games_won."',
			'".$hero_games_played."',
			'".$gs->eliminations."',
			'".$gs->deaths."',
			'".$gs->hero_damage_done."',
			'".(isset($data_heroes->$hero->hero_stats->damage_blocked) ? $data_heroes->$hero->hero_stats->damage_blocked : "0")."',
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
		`healing`,
		`medals`,
		`medals_gold`,
		`medals_silver`,
		`medals_bronze`,
		`cards`,
		`environmental_kills`,
		`environmental_deaths`,
		`teleporter_pads_destroyed`,
		`damage_high`,
		`eliminations_high`,
		`solo_kills_high`,
		`final_blows_high`,
		`objective_time_high`,
		`objective_kills_high`,
		`healing_high`,
		`time_spent_on_fire_high`
	) values (
		'$tag',
		'$mode',
		'".date("Y-m-d")."',
		".(
		$mode=="COMPETITIVE"
			? $data->overall_stats->comprank
			: ( $data->overall_stats->prestige * 100)+$data->overall_stats->level ).",
		".$data->game_stats->games_won.",
		".$data->overall_stats->games.",
		".$data->game_stats->eliminations.",
		".$data->game_stats->deaths.",
		".$data->game_stats->hero_damage_done.",
		".$data->game_stats->damage_blocked.",
		'".$data->game_stats->healing_done."',
		'".$data->game_stats->medals."',
		'".$data->game_stats->medals_gold."',
		'".$data->game_stats->medals_silver."',
		'".$data->game_stats->medals_bronze."',
		'".$data->game_stats->cards."',
		'".$data->game_stats->environmental_kills."',
		'".$data->game_stats->environmental_deaths."',
		'".(isset($data->game_stats->teleporter_pads_destroyed) ? $data->game_stats->teleporter_pads_destroyed : "0")."',
		'".$data->game_stats->hero_damage_done_most_in_game."',
		'".$data->game_stats->eliminations_most_in_game."',
		'".$data->game_stats->solo_kills_most_in_game."',
		'".$data->game_stats->final_blows_most_in_game."',
		'".$data->game_stats->objective_time_most_in_game."',
		'".$data->game_stats->objective_kills_most_in_game."',
		'".$data->game_stats->healing_done_most_in_game."',
		'".$data->game_stats->time_spent_on_fire_most_in_game."'
	)";
	if (DRYRUN) { echo $sql; } else { $db->query($sql); };
	echo "\n";
  }
  if (DRYRUN) {
    echo "END OF DRYRUN\n";
    return;
  }

  $tagset = array();
  $tagset['region'] = $region;
  $tagset['player'] = $tag;
  $stats = get_stats($tag,"stats");
  
  foreach ($stats->$region->stats as $mode => $mstat)
  {
    $tagset['mode'] = $mode;
    unset($mstat->competitive);
    $fieldset = array();
    foreach ($mstat as $table => $values)
    {
      $fieldset = array_merge($fieldset, (array)$values);
    }
    ixdb_insert("overall",$tagset,$fieldset);
  }
  
  $heroes = get_stats($tag,"heroes");
  
  foreach ($heroes->$region->heroes->stats as $mode => $heroes)
  {
    $tagset['mode'] = $mode;
    echo "\n";
    foreach ($heroes as $hero => $tables)
    {
      $tagset["hero"]=$hero;
      $fieldset = array();
      foreach ($tables as $table => $values)
      {
        $fieldset = array_merge($fieldset, (array)$values);
      }
      ixdb_insert("heroes",$tagset,$fieldset);
    }
  
  }

}
