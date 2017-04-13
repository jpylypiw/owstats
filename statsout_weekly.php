<?php
require "config.inc.php";
require "db.php";
require "functions.php";

define('DELIM',',');
define('DELIMD','|');

$mingames = 10;
$mode = $argv[1];
if (!$mode) $mode = "QM";

$columns = array(
  "Player",
  "Games week",
  "Points gained / lost",
  "Change in %",
  "current Rating",
  "KD/A week",
  "Kills week",
  "DMG week",
  "Block week",
  "Heal week"
);

$row = "";
foreach ($columns as $col)
{
  $row .= $col.DELIM;
}

echo substr($row,0,-1);
echo "\n";

$q = $db->query("select `date` from ow_general order by `date` DESC limit 1");
$r = $q->fetch_object();
$recentdate=$r->date;


$q = $db->query("select * from ow_general where `mode`='$mode' and `date`='$recentdate' order by `rating` DESC");
while ($r = $q->fetch_object()) 
{
	$tag = $r->tag;
	$ql = $db->query("
		select * from ow_general where `mode`='$mode' and `date` = ('$recentdate' - INTERVAL $comparedays day) and `tag`='$tag' ORDER BY `date`");
	$history = array();
	if ($rl = $ql->fetch_object())
	{
		$history[] = $rl;
	} else {
		continue;
	}
	$f = $history[0];
	$gamediff = ($r->games - $f->games);
	if ($gamediff < $mingames) continue;
	$a = explode("#", $tag);
	echo $a[0].DELIM;
	echo ($r->games - $f->games) .DELIM;
	echo ($r->rating - $f->rating) . DELIM;
	echo (($r->rating - $f->rating)/$f->rating) . DELIM;
	echo $r->rating . DELIM;
	echo (($r->kills-$f->kills) / ($r->deaths - $f->deaths)) . DELIM;
	echo (($r->kills - $f->kills)/$gamediff) . DELIM;
	echo (($r->damage - $f->damage)/$gamediff) . DELIM;
	echo (($r->blocked - $f->blocked)/$gamediff) . DELIM;
	echo (($r->healing - $f->healing)/$gamediff);
	echo "\n";
}
// echo api_request("Juro#1208","stats");


