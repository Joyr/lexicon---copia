<?php
session_start();
require_once('secure_hash.class.php');
require_once('db.php');
require_once('email.php');
$username=trim($_POST["username"]);
$password=trim($_POST["password"]);
$password2=trim($_POST["password2"]);
$email=trim($_POST["email"]);
$name=trim($_POST["name"]);
$lastname=trim($_POST["lastname"]);
$language=$_POST["language"];
$json=array();
if($username==NULL|$password==NULL|$password2==NULL|$email==NULL){
	$json['msg'] = "Un campo está vació.";
	$json['error'] = -1;
}else{
	if($password!=$password2){
		$json['msg'] = "Las contraseñas no coinciden";
		$json['error'] = 2;
	}else{
		$checkuser=mysql_query("SELECT username FROM login WHERE username='$username'");
		if(mysql_num_rows($checkuser)!=0){
			$json['msg'] = "El usuario existe";			
			$json['error'] = 1;
		}else{
			$secure_hash = new secure_hash;
			$secure_hash->salt_global = '';
			$secure_hash->hashing_method = 'sha1';
			$hashPW=$secure_hash->hash($password);
			$query='INSERT INTO login (username,passwd,email,lastDate,name,lastName,language_id) VALUES ("'.$username.'","'.$hashPW.'","'.$email.'", NOW(),"'.$name.'","'.$lastname.'",'.$language.');';
			mysql_query($query) or die(mysql_errno());
			sendMail($email,$username,$password);
			$json['msg'] = "El usuario ha sido registrado con existo";
			$json['error'] = 0;					
		}
	}
}
echo json_encode($json);
mysql_close();
?>