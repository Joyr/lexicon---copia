<?php
session_start();
require_once('db.php');
$json;
function removeIt( $mis ){
	$nopermise = array("'",'\\','<','>',"\"");
	$mis = str_replace($nopermise,"",$mis);
	return $mis;
}

if(isset($_POST['user'])){
	if(trim($_POST["user"])!=""&&trim($_POST["passw"])!=""){
		$user=htmlentities($_POST["user"]);
		$passW=$_POST["passw"];
		require_once('secure_hash.class.php');
		$secure_hash = new secure_hash;
		$secure_hash->salt_global = '';
		$secure_hash->hashing_method = 'sha1';
		$result= mysql_query('SELECT id, username, passwd, DATE_FORMAT(lastDate,\'%d %b %Y %T\')lastDate, role FROM login WHERE username="'.$user.'"');
		if($row = mysql_fetch_array($result)){
			if($secure_hash->check($row['passwd'],$passW)){
				$_SESSION['username']=$row['username'];
				$_SESSION['userID']=$row['id'];
				$_SESSION['role']=$row['role'];
				if(isset($_POST['remember'])){
					
				}
				//$_SESSION['permanent']=$_REQUEST['permanent'];
				//header('Location: index.php');
				$json['msg']="Bienvenido ".$_SESSION['username'].", tu último ingreso fue el ".$row['lastDate'];
				$json['error']=0;

			}else{
				$json['msg']="Password incorrecto";
				$json['error']=1;
			}
		}else{
			$json['msg']="El usuario no existe";
			$json['error']=1;
		}
		mysql_free_result($result);
	}else{
		$json['msg']="Debe especificar un usuario y un password";
		$json['error']=1;
	}
	echo json_encode($json);
}
mysql_close();
?>