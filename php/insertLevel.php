<?php
	$newLevel = trim(strtoupper($_POST['level']));
	require_once('db.php');
	require_once('module/class/lexicon.php');
	if($newLevel!=''){
		$lexicon = new Lexicon();
	
		echo $lexicon->addLevel($newLevel);	
	}else{
		echo -1;
	}
	
?>