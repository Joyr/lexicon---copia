<?php
	session_start();
	$post=$_POST['lang'];
	setcookie('language',$post,strtotime('+1 day'),'/');
?>