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

