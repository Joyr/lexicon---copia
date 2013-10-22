<?php
session_start();
require_once('db.php');
if($_POST['action']=='1'){
	$query="SELECT c.card_id, s.rank, c.project_id FROM project_student p, card_simple c LEFT JOIN sm2 s ON s.card_simple_id=c.card_id AND s.login_id=".$_SESSION['userID']." WHERE c.project_id=p.project_id AND MD5(p.project_id)='".$_POST['projectId']."'";
	$cards=mysql_query($query);
	$card_json=array();
	for($i=0;($card=mysql_fetch_array($cards));$i++){
			if($card[1]==NULL){
				$query="INSERT INTO sm2 (login_id, card_simple_id, project_student_id) VALUES (".$_SESSION['userID'].",$card[0],$card[2])";
				mysql_query($query);
			}
	}
}else{
	$query="UPDATE sm2 SET rank=".$_POST['rank'].",repsLeft=".$_POST['repsLeft']." WHERE card_simple_id=".$_POST['id']." AND login_id=".$_SESSION['userID'];
	mysql_query($query);
}
echo mysql_errno();
?>