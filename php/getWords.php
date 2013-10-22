<?php
	session_start();
	/* 
	*/
	//header("Content-Type: applicaciont/json");
	require_once('db.php');
	$text=$_REQUEST['file'];
	$text=preg_split('/\n/',$text);
	$final=array();
	foreach($text as $key=>$val){
			$text=explode(';',$val);
			if(count($text)==2)
				array_push($final,array('Question'=>$text[0],'Answer'=>$text[1]));
	}
	echo json_encode($final);
	//mysql_close($link);
?>