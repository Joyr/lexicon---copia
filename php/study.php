<?php
session_start();
$esquema=file_get_contents('test.html');
if(isset($_SESSION['username'])){
	$html=file_get_contents('app.html');
	$html=str_replace('/*projectID*/',"var pID='".$_REQUEST['project']."';",$html);
	$html=str_replace('{{USER_NAME}}',$_SESSION['username'],$html);				

}else{
	$html=file_get_contents('login.html');	

}
//$html=str_replace('{{title}}',$_REQUEST['title'],$html);
$esquema=str_replace('{{CONTENT}}',$html,$esquema);	
echo $esquema;
?>