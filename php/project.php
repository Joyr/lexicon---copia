<?php
	$db_name="onlingua";
	$link=mysql_connect('localhost','root','') or die('Could not connect '.mysql_errno());
	mysql_select_db($db_name,$link) or die('Error selecting database .');
	if(!isset($_REQUEST['id']))
		$query="SELECT A.*,COUNT(B.id) as cards FROM project A LEFT JOIN official B ON B.project_id=A.id GROUP BY A.id";
	else
		$query="SELECT A.*,COUNT(B.id) as cards FROM project A LEFT JOIN official B ON B.project_id=".$_GET['id'];
	$projects=mysql_query($query);
	$result=array();
	$line=mysql_num_rows($projects);
	if($line==0){
		$result[0]=array("ID"=>0);		
	}else{
		for($i=0;$project=mysql_fetch_array($projects);$i++){
			$result[$i]=array("ID"=>$project[0],"Name"=>$project[1],"Description"=>$project[2],"Cards"=>$project[3]);
		}
	}
	echo json_encode($result);
	mysql_close($link);

?>