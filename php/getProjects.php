<?php
/*
** Encuentra los proyectos
** Devuelve -> id, nombre, descripcion y nombre total de tarjetas que sean Standard
*/
if (!isset($_SESSION)) {
  session_start();
}
//header("Content-Type: applicaciont/json");
require_once("db.php");
require_once('tag.php');

// Si no hay un proyecto concreto con projectId
if(!isset($_REQUEST['projectId'])){
	//Si no proviene de una busqueda donde el texto esta en 'add'
	if(!isset($_REQUEST['add']))
		$query="SELECT MD5(a.project_id) as id,a.name,a.description, COUNT(c.card_id) as cards 
		FROM project_student a LEFT JOIN project_has_login pl
		ON a.project_id=pl.project_id LEFT OUTER JOIN card_simple c
		ON a.project_id=c.project_id
		WHERE pl.login_id=".$_SESSION['userID']."
		GROUP BY a.project_id
		ORDER BY a.name; ";
	else
	//Busqueda de proyectos que en su nombre o descripcion tengan el texto de 'add'
		$query="SELECT MD5(A.project_id),A.name,A.description, COUNT(c.card_id) as cards 
FROM project P LEFT OUTER JOIN project_student A ON P.id=A.project_id 
LEFT OUTER JOIN card_simple c ON c.project_id=A.project_id 
LEFT OUTER JOIN flashcard f ON f.id=c.card_id AND (f.login_id=P.login_id OR f.login_id=".$_SESSION['userID'].")
WHERE A.project_id NOT IN(SELECT project_id FROM project_has_login WHERE login_id=".$_SESSION['userID'].") AND (A.name LIKE '%".$_REQUEST['add']."%') 
GROUP BY A.project_id 
ORDER BY cards ASC;";
}else
	//Encuentra un proyecto concreto
	$query="SELECT MD5(B.project_id),B.name,B.description,COUNT(fc.id) as cards 
FROM project A
LEFT OUTER JOIN project_student B ON A.ID=B.project_id
LEFT OUTER JOIN card_simple c ON c.project_id=B.project_id
LEFT OUTER JOIN flashcard fc ON fc.id=c.card_id AND (fc.login_id=A.login_id OR fc.login_id=".$_SESSION['userID'].")
WHERE A.id=B.project_id AND MD5(A.id)='".$_REQUEST['projectId']."';";

$projects=mysql_query($query);
$result=array();
//$line=mysql_num_rows($projects);
if(!$projects){
	$result[0]=array("ID"=>0);		
}else{
	for($i=0;$project=mysql_fetch_array($projects);$i++){
		$tags=tagsFromProject($project[0]);
		$tags=join(';',$tags);
		$result[$i]=array("ID"=>$project[0],"Name"=>$project[1],"Description"=>$project[2],"Tags"=>$tags,"Cards"=>$project[3]);
	}
}
if(!isset($title))
	echo json_encode($result);
else
	$title=$result[0]['Name'];
mysql_close();
?>