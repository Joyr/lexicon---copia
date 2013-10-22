<?php
	require_once('db.php');
	require_once('roman.php');
	$unit = $_POST['unit'];

	$query = "INSERT INTO units (name) VALUES ('".roman_numerals($unit)."');";

	mysql_query($query) or die("Error ".mysql_errno());

?>