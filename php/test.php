<?php
session_start();
require_once('db.php');
if(!isset($_POST['id'])){
	$query="SELECT c.id, s.rank, c.project_id
				FROM project p, card c 
				LEFT JOIN sm0 s ON s.card_id=c.id AND s.login_id=".$_SESSION['userID']."
				WHERE c.project_id=p.id AND MD5(p.id)='".$_REQUEST['projectId']."'";
	$cards=mysql_query($query);
	$card_json=array();
	for($i=0;($card=mysql_fetch_array($cards));$i++){
			if($card[1]==NULL)
				$query="INSERT INTO sm0 (card_id,login_id, card_project_id) VALUES ($card[0],".$_SESSION['userID'].",$card[2])";
				mysql_query($query);
	}
}else{
	$query="UPDATE sm0 SET rank=".$_POST['rank']." WHERE card_id=".$_POST['id']." AND login_id=".$_SESSION['userID'];
	mysql_query($query);
}
echo mysql_errno();
?>