<?php

if (!isset($_SESSION)) {
  session_start();
}

require_once("db.php");

if(!isset($_REQUEST['projectId'])){	
		$query="SELECT MD5(id),name FROM tags t ORDER BY name ASC;";
}else	
	$query="";
$tags=mysql_query($query);
$line=mysql_num_rows($tags);
$result=array();
for($i=0;$tag=mysql_fetch_array($tags);$i++){
	$result[$i]=array("id"=>$tag[0],"tag"=>$tag[1]);
}

echo json_encode($result);
mysql_close();

?>
