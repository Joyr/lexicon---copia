<?php
	session_start();
	require_once('php/validate.php');
	include('php/db.php');
	initSession($_GET['user']);
	include('index.php');
	
?>