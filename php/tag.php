<?php
require_once('db.php');
function insertTag($list){
	$array=array();
	foreach($list as $t){
		$query="SELECT id FROM tags WHERE name='".$t->tag."'";
		$result=mysql_query($query);
		if(mysql_num_rows($result)==0){
			$query="INSERT INTO tags (name) VALUES ('".$t->tag."')";
			mysql_query($query) or die ('ERROR TAG');
		}
		$array[]="'".$t->tag."'";		
	}
	$a=join(',',$array);
	$query="SELECT id FROM tags WHERE name IN($a)";
	$result=mysql_query($query) or die('error');
	$array=array();
	while($t=mysql_fetch_array($result)) $array[]=$t['id'];
	return $array;
}
function recoverId($list){
		
}
function removeTagsProject($id){
	$query="DELETE FROM project_has_tags WHERE MD5(project_id)='".$id."'";
	mysql_query($query);	
}
function tagsFromProject($id){
	$query="SELECT t.name FROM tags t, project_has_tags pt WHERE MD5(pt.project_id)='".$id."' AND pt.tags_id=t.id";
	$result=mysql_query($query);	
	$tags=array();
	while($t=mysql_fetch_array($result)) $tags[]=$t['name']; 
	return $tags;	
}
?>
