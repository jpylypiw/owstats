<?php
function histdiff(&$history, $colname)
{
        $col="";
        $firsthist=$history[0];
        foreach ($history as $rl)
        {
                $col .= ($rl->$colname-$firsthist->$colname).DELIMD;
        }
        return substr($col,0,-1).DELIM;
}

function histdiffavg(&$history, $colname, $factor=1)
{
        $col="";
        $firsthist=$history[0];
        foreach ($history as $rl)
        {
                $col .= (($rl->$colname / $rl->games)*$factor - ($firsthist->$colname / $firsthist->games)*$factor ). DELIMD;
        }
        return substr($col,0,-1).DELIM;
}

function histkddiffavg(&$history)
{
        $col="";
        $firsthist=$history[0];
        foreach ($history as $rl)
        {
                $col .= (($rl->kills / $rl->deaths) - ($firsthist->kills / $firsthist->deaths) ). DELIMD;
        }
        return substr($col,0,-1).DELIM;
}

