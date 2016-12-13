<?php

$csvfile = $argv[1];
$mode=substr($csvfile,strpos($csvfile,"_")+1,-4);


$f = fopen($csvfile,"r");

$headers = fgetcsv($f,1000);

function formatting($value,$field,$fieldbefore)
{
  $pos="";
  if (!$field)
  {
	if ($value==0) return "";
	$field=$fieldbefore;
	$pos="+";
  }
  if (in_array($field,array("K/D Ratio","Win ratio","Eliminations")))
  {
	return ($value>0?$pos:"").number_format($value,2,".",",");
  }
  if (in_array($field,array("Games","Wins","Healing","Damage","Blocked","Time played","Rank","Level")))
  {
	return ($value>0?$pos:"").number_format(ceil($value),0,".",",");
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
 while ($row = fgetcsv($f,1000))
 {
?>
<tr>
<?php
	foreach ($row as $fnum=> $field)
	{
?>
	<td
		data-td="<?=$headers[$fnum];?>" 
		data-value="<?=$field;?>"
		<?=($headers[$fnum]?"":"class=\"small ".colorclass($field)."\"");?>
	><?=formatting($field,$headers[$fnum],$headers[abs($fnum-1)]);?></td>
<?php
	}
?>
</tr>
<?php
 }
?>
</tbody>
</table>
</div>
