<?php

$csvfile = $argv[1];
$mode=substr($csvfile,strpos($csvfile,"_")+1,-4);


$f = fopen($csvfile,"r");

$headers = fgetcsv($f,1000);

?>
<div id="<?=$mode;?>" class="tabcontent">
<table>
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
	<td data-td="<?=$headers[$fnum];?>"><?=$field;?></td>
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
