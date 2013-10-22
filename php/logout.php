<?php session_start();

//Borrado de sesión
require_once('db.php');

$query="UPDATE login SET `lastDate`= NOW() WHERE `id`=".$_SESSION['userID'];
mysql_query($query);
mysql_close();

session_destroy();
$host  = $_SERVER['HTTP_HOST'];
$uri   = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
$host.='/lexicon/';
header("Location: http://$host");

?>
