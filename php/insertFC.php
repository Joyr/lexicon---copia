<?php
session_start();
require_once('db.php');
$project=$_POST['project'];
$wQ=$_POST['wQ'];
$wA=$_POST['wA'];
$action=$_POST['action'];
$id=$_POST['id'];
$img=$_POST['img'];

//Busca el proyecto correspondiente
$query="SELECT id FROM project WHERE MD5(id)='".$project."'";	
$projects=mysql_query($query);
$project=mysql_fetch_array($projects);
$project=$project[0];
$error='';
if($img){
	$query="SELECT id FROM img WHERE img='".$img."'";
	$img = mysql_query($query);
	$imgID = mysql_fetch_array($img);
	$img = $imgID[0];
}
if($action==1){ 
	//Añade un tarjeta simple	
	if($img)
		$query="INSERT INTO flashcard (img_id,login_id) VALUES (".$img.",".$_SESSION['userID'].")";
	else
		$query="INSERT INTO flashcard (login_id) VALUES (".$_SESSION['userID'].")";
	mysql_query($query);
	$card=mysql_insert_id();
	$query="INSERT INTO card_simple (card_id,project_id,question,answer) VALUES ($card,$project,'".$wQ."','".$wA."')";
	mysql_query($query);
	$error='a';
}else if($action==0){
	//Modifica una tarjeta
	if($img)
		$query = "UPDATE flashcard SET img_id=$img WHERE id=$id";
	else
		$query = "UPDATE flashcard SET img_id=NULL WHERE id=$id";
	mysql_query($query);
	$query="UPDATE card_simple SET question='".$wQ."', answer='".$wA."' WHERE card_id=".$id;
	mysql_query($query);
		$error='b';
}else if($action==-1){
	//Elimina una tarjeta
	$query="DELETE FROM flashcard WHERE id=".$id;
	mysql_query($query);
		$error='c';
}
	echo mysql_errno();
?>