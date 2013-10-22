<?php
	
	$UserSSH = 'root'; 
    $PassSSH = 'myonlingua'; 
    $User = 'db_lexicon';
    $Pass = 'D8524CabbRtmsyaQ';
    $remotehost = '82.165.171.36'; 
    $host = '127.0.0.1';
    $Servidor = '127.0.0.1';
    $db_name = $User;
    $connection = ssh2_connect($remotehost, '22');     
     if (ssh2_auth_password($connection, $UserSSH,$PassSSH)) {  
            if (!$tunnel = ssh2_tunnel($connection, $host,'3306')){ 
               echo "Fallo el Tunel.";
            } 
    }else{  
            die('Authenticacion Fallida...');  
    } 
   
	$link=mysql_connect($host,$User,$Pass) or die('Could not connect '.mysql_errno());
	mysql_select_db($db_name,$link) or die('Error selecting database .');
?>