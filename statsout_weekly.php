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
$rows = array();
while ($r = $q->fetch_object()) 
{
	$row = "";
	$tag = $r->tag;
	$ql = $db->query("select * from ow_general where `mode`='$mode' and `date` = ('$recentdate' - INTERVAL $comparedays day) and `tag`='$tag' ORDER BY `date`");
	$history = array();
	if ($rl = $ql->fetch_object()) { $f = $rl; } else { continue; }
	
	# grab stats from 2 weeks ago
	$ql = $db->query("select * from ow_general where `mode`='$mode' and `date` = ('$recentdate' - INTERVAL (2 * $comparedays) day) and `tag`='$tag' ORDER BY `date`");
	if ($rl = $ql->fetch_object()) { $g = $rl; } else { $g = $f; }

	$gamediff = ($r->games - $f->games);
	if ($gamediff < $mingames) continue;
	$a = explode("#", $tag);
	$row .= $a[0].DELIM;
	$row.= ($r->games - $f->games) .DELIM;
	$row.= ($r->rating - $f->rating) . DELIM;
	$change = (($r->rating - $f->rating)/$f->rating);
	$row.= $change . DELIM;
	$row.= $r->rating . DELIM;
	$row.=(($r->kills-$f->kills) / ($r->deaths - $f->deaths)) . DELIM;
	$row.= (($r->kills - $f->kills)/$gamediff) . DELIM;
	$row.= (($r->damage - $f->damage)/$gamediff) . DELIM;
	$row.= (($r->blocked - $f->blocked)/$gamediff) . DELIM;
	$row.= (($r->healing - $f->healing)/$gamediff);
	$row.= "\n";
	$rows[] = array('change'=>$change, 'row'=>$row);
}
function bychange($a,$b) {
  if ($a['change']==$b['change']) return 0;
  return ($a['change']<$b['change'] ? 1 : -1);
}
uasort($rows,'bychange');
foreach ($rows as $row)
{
	echo $row['row'];
}

// echo api_request("Juro#1208","stats");


