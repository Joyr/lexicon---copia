<?php 
session_start();
/*if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 1800)) {
    // last request was more than 30 minutes ago
    session_unset();     // unset $_SESSION variable for the run-time 
    session_destroy();   // destroy session data in storage
	$host  = $_SERVER['HTTP_HOST'];
	$uri   = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
	$expire=true;	
}
if(isset($_SESSION['username']))
	$_SESSION['LAST_ACTIVITY'] = time();*/

include('php/language.php');
$lang=new Lang();
if(isset($_SESSION['username'])){
	if($_SESSION['role']==1){
		$html=file_get_contents('freeversion/index.html');
		$html=str_replace('<!-- user variable -->','<script> var SL_user="'.$_SESSION['username'].'"</script>',$html);	
		
	}else if($_SESSION['role']>1&&isset($_REQUEST['admin'])){
		$html = '';
		include('admin.php');
	}else if(isset($_REQUEST['project'])){
		if(isset($_REQUEST['cards'])){
			$html=file_get_contents('html/cards.html');
			if($_REQUEST['cards']==true)
				$html=str_replace('href="/"','href="?project='.$_REQUEST['project'].'"',$html);						
		}else
			$html=file_get_contents('html/study.html');
		$title=true;
		$_REQUEST['projectId']=$_REQUEST['project'];
		require_once('php/getProjects.php');
		$html=str_replace('{{title}}',strtoupper($title),$html);
		$html=str_replace('/*projectID*/',"var pID='".$_REQUEST['project']."';",$html);
	}else if(isset($_REQUEST['s'])){
		$html=file_get_contents('html/add-project.html');
	
	}else{
		$html=file_get_contents('html/main.html');				
	}
	//Change this String and write Username
	$html=str_replace('{{USER_NAME}}',$_SESSION['username'],$html);
}else{
	// Files for registering or login 
	if(isset($_REQUEST['register'])){
		$html=file_get_contents('html/register.html');
	}else if(isset($_REQUEST['lost_password'])){
		$html=file_get_contents('html/lost_password.html');
	}else{
		//Main file for login
		$html=file_get_contents('html/login.html');
	}	
}

//$_FILES['lang']=$html;
//$html=replaceLang($_SESSION['lang']); 
$html=$lang->langOptions($html);
$html=$lang->selectLang($html);
//$html=str_replace('{{title}}','On-lingua Cards',$html);	
echo $html;

?>
