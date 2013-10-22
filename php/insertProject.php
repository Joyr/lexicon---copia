<?php
	session_start();
	header('content-type:text/html;charset=utf-8');
	require_once('db.php');
	require_once('tag.php');
	$name=trim($_POST['name']);
	$tt=stripslashes($_REQUEST['tags']);	
	$tags=json_decode($tt);
	$description=trim($_REQUEST['description']);
	$tagsNum=count($tags)>0;
	$action=$_REQUEST['action'];

	if($action==1){
		//Añade un proyecto nuevo a la tabla de proyectos si no se ha especificado ninguno
		if(!$_REQUEST['projectId']){			
			
			$query="INSERT INTO project (InitialDate,ModifiedDate,login_id) VALUES (NOW(),NOW(),".$_SESSION['userID'].")";
			mysql_query($query);
			$project=mysql_insert_id();
			$query="INSERT INTO project_student (project_id,name,description) VALUES (".$project.",'".$name."','".$description."')";
			mysql_query($query);
			if($tagsNum){
				$idTags=insertTag($tags); //Añade las tags a la base de datos y devuelve los ids
				foreach($idTags as $tag){
					$query="INSERT INTO project_has_tags VALUES ($project,$tag)";
					mysql_query($query);				
				}
			}
		}else
			$project=getIdProject($_REQUEST['projectId']);						
		//Relaciona el proyecto con el usuario
		$query="INSERT INTO project_has_login (project_id,login_id) VALUES (".$project.",'".$_SESSION['userID']."')";
		mysql_query($query);
		echo "Operación realizada";
	}else if($action==0){
		$query="SELECT * FROM project WHERE MD5(id)='".$_REQUEST['projectId']."' AND login_id=".$_SESSION['userID'];
		$result1=mysql_query($query);
		if(mysql_num_rows($result1)==0){
			echo "__MSG_PHP_Wrong_User__";	
		}else{
			//Edita el proyecto
			$query="UPDATE project SET ModifiedDate=NOW() WHERE MD5(id)='".$_REQUEST['projectId']."'";
			mysql_query($query);
			$query="UPDATE project_student SET name='".$name."',description=\"$description\" WHERE MD5(project_id)='".$_REQUEST['projectId']."'";		
			mysql_query($query);
			$project=getIdProject($_REQUEST['projectId']);
			removeTagsProject($_REQUEST['projectId']);
			if($tagsNum) {				
				$idTags=insertTag($tags); //Añade las tags a la base de datos y devuelve los ids
				foreach($idTags as $tag){
						$query="INSERT INTO project_has_tags VALUES ($project,$tag)";
						mysql_query($query) or die('error'); 
										
				}
			}
			if(mysql_errno()==0)
				echo "Se ha modificado con éxito ";	
			else
				echo "Se ha producido un error";
		}
	}else if($action==-1){
		//Elimina el proyecto
		$query="DELETE FROM project_has_login WHERE MD5(project_id)='".$_POST['projectId']."' AND login_id=".$_SESSION['userID'];
		$verify=mysql_query($query);
		if($verify)
			echo "Se ha eliminado el proyecto con éxito";
		else
			echo "Se ha producido un error";
	}
	mysql_close($link);
	
	function getIdProject($id){
		$query="SELECT id FROM project WHERE MD5(id)=\"$id\"";	
		$projects=mysql_query($query);
		$project=mysql_fetch_array($projects);
		return $project[0];
	}
?>