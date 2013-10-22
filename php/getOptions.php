<?php
    if (!isset($_SESSION)) {
  session_start();
}

require_once("db.php");
$options=array();
if(!isset($_REQUEST['tInterval'])){
	$query="SELECT inter_time, theme FROM login WHERE id=".$_SESSION['userID'];	
	$result=mysql_query($query);
	while($option=mysql_fetch_array($result)){
		$options=array("intervalTime"=>(int)$option[0],"theme"=>$option[1]);
	}	
}else{
	$query="UPDATE login SET inter_time=".$_REQUEST['tInterval'].", theme='".$_REQUEST['theme']."' WHERE id=".$_SESSION['userID'];	
}
echo json_encode($options);

?>