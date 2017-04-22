<?php

$csvfile = $argv[1];
$mode=substr($csvfile,strpos($csvfile,"_")+1,-4);


$f = fopen($csvfile,"r");

$headers = fgetcsv($f,2000);


function toMMSS($value) 
{
    $sec_num = ceil($value*60*60); // don't forget the second param
    $minutes = floor($sec_num  / 60);
    $seconds = $sec_num - ($minutes * 60);

    if ($minutes < 10) {$minutes = "0".$minutes;}
    if ($seconds < 10) {$seconds = "0".$seconds;}
    return $minutes.':'.$seconds;
}


function get_cellformat($value,$field)
{
  if (in_array($field,array("Change in %")))
  {
    $b = 0;
    $r = 255;
    if ($value<-0.14) $g=0;  // 1/0 red
    if ($value>0.14) { $r = 0; $g = 255; }
    $r = ceil(255*floor(((16.0-(100*$value+2.0))/16.0)*4)/4);
    $g = ceil(255*floor((((100*$value+14.0))/16.0)*4)/4);
    return "style=\"background-color: rgb($r,$g,$b)\"";
  }
  return "";
}

function formatting($value,$field,$fieldbefore)
{
  $pos="";
  if (!$field)
  {
	$value = explode("|",$value);
	$value = $value[count($value)-1];
	if (abs($value)<0.005) return "";
	$field=$fieldbefore;
	$pos="+";
  }
  if (in_array($field,array("K/D Ratio","Win Ratio","Kills","KD/A week","Kills week")))
  {
	return ($value>0?$pos:"").number_format($value,2,",",".");
  }
  if (in_array($field,array("Change in %")))
  {
	return ($value>0?$pos:"").number_format($value*100,2,",",".");
  }
  if (in_array($field,array("Games","Wins","Heal","Dmg","Block","Time played","Rank","Level","Kills week","DMG week","Block week","Heal week","current Rating")))
  {
	return ($value>0?$pos:"").number_format(ceil($value),0,",",".");
  }
  if (in_array($field,array("Object time High","on Fire High")))
  {
	return ($value>0?$pos:"") . toMMSS($value);
  }
  return ($value>0?$pos:"").$value;
  
}

function colorclass($value)
{
  if ($value>0.1) return "green";
  if ($value<-0.1) return "red";
  return "";
}

?>
<div id="<?=$mode;?>" class="tabcontent">
<table class="sortable">
<thead>
<tr>
<?php
foreach ($headers as $head) {
?>
	<th class="header"><?=$head;?></th>
<?php
}
?>
</tr>
</thead>
<tbody>
<?php
 while ($row = fgetcsv($f))
 {
		$cellformat = get_cellformat($row[5],$headers[5]);
?>
<tr>
<?php
	foreach ($row as $fnum=> $field)
	{
		$addclass = "";
		if (!$headers[$fnum]) {
			$chartvals = $field;
			$field = substr($field,strrpos($field,"|")+1);
			$addclass = "small ".colorclass($field);
		}
		
?>
	<td
		data-td="<?=$headers[$fnum];?>" data-value="<?=$field;?>" class="nowrap <?=$addclass;?>" <?=$cellformat;?>>
		<?php /* if ($headers[$fnum]) */ echo formatting($field,$headers[$fnum],$headers[abs($fnum-1)]);?><br/>
<?php
	if (!$headers[$fnum] && ($fnum>6 || ($mode!="QM" && $fnum==2))) {
		$chartvalsa = explode("|",$chartvals);
		$noval = true;
		foreach ($chartvalsa as $value)
		{
			if ($value!=0) $noval = false;
		}
		if (!$noval) {
?>
		<span class="chart" title="<?=$field;?>"><?=str_replace("|",",",$chartvals);?></span>
<?php
		}
	}
?>
	</td>
<?php
	}
?>
</tr>
<?php
 }
?>
</tbody>
</table>
<a href="<?=$csvfile;?>">Raw CSV Output</a>
</div>
