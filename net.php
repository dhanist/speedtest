<?php
 header('Content-Type: application/json');
 ini_set('default_socket_timeout', 2);
 $info = array(
        'ip' => "",
        'isp' => ""
 );
 $ip = $_SERVER['REMOTE_ADDR'];

 $isp = file_get_contents("http://ipinfo.io/" . $ip . "/org");
 
 $isp = preg_replace('/^AS[0-9]+ /', '', $isp);

 $info['ip'] = $ip;
 $info['isp'] = $isp != null ? $isp : "IP Whois Timeout";

 echo json_encode($info);

?>
