<?php
session_start();
require_once('db.php');
//Coge las targetas con su rango
$query="SELECT c.id, cs.question, cs.answer, img.img as image, s.rank, s.repsLeft
FROM project p, flashcard c 
LEFT OUTER JOIN card_simple cs ON ( cs.card_id=c.id )
LEFT OUTER JOIN img ON img.id=c.img_id
LEFT OUTER JOIN sm2 s ON s.card_simple_id=cs.card_id AND s.login_id=".$_SESSION['userID']."
WHERE cs.project_id=p.id AND (c.login_id=".$_SESSION['userID']." OR p.login_id=c.login_id)AND MD5(p.id)='".$_REQUEST['projectId']."'";
$cards=mysql_query($query);
$card_json=array();
$top=(!isset($_REQUEST['top']))?-1:$_REQUEST['top'];
for($i=0;($card=mysql_fetch_array($cards))&&($i!=$top);$i++){
		$card_json[$i]=array('id'=>$card[0],'Question'=>$card[1],'Answer'=>$card[2],'img'=>$card[3],'rank'=>$card[4],'repsLeft'=>$card[5]);	
}

echo json_encode($card_json);
mysql_close($link);
?>