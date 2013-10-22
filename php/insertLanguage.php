<?php
	require_once('db.php');
	$name = $_POST['language-name'];	
	$code = strtoupper($_POST['code']);	
	/*if(isset($_FILES['flag-lang-add'])){
		$flag = $_FILES['flag-lang-add'];
		$name_flag = $flag['name'];
		$tmppath = $flag['tmp_name'];
	}else
		$flag = '';*/
	$json=strtolower($code).'.json';	
	$flag = $_POST['flag-lang'];
	//$jsonTemplate = file_get_contents('../lang/template.json');
	//$jsonTemplate = json_decode($jsonTemplate);
	//$jsonTemplate = file_put_contents('../lang/'.$json, json_encode($jsonTemplate));
		
	if($_POST['tipus']=='add'){
		if(!is_file('../lang/'.$json))
			$jsonTemplate = file_put_contents('../lang/'.$json, '');
		$query = "INSERT INTO language (name,file,code,flag) VALUES ('".mb_convert_encoding($name,'auto')."','".$json."','".$code."','".$flag."')";
	}else if($_POST['tipus']=='edit'){	
		$active = ($_POST['active-lang']=='ON')?1:0;
		$query = "UPDATE language SET name='".mb_convert_encoding($name,'auto')."',file='".$json."',flag='".$flag."', active=".$active." WHERE MD5(id)='".$_POST['id-language']."';";
	}else{
		$query = "DELETE FROM language WHERE MD5(id)='".$_POST['id-language']."';";
	}
	mysql_query($query) or die('Error: '.mysql_error());

	//$last = mysql_insert_id();

	/*if($flag!=''){
		if(move_uploaded_file ($tmppath, '../img/flags/'.$name_flag)){			
			$query="UPDATE language SET flag='".$name_flag."' WHERE id=".$last;
			mysql_query ($query) or die ('could not updated:'.mysql_error());						
			echo "Your image upload successfully !!";
		}
	}*/
	mysql_close();	
	$host  = $_SERVER['HTTP_HOST'];
	header("Location: http://$host/lexicon/admin.php");
?>