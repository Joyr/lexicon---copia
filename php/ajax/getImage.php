<?php	
	require_once('../db.php');

	$query = "SELECT @rank:=@rank + 1 AS Rank, MD5(i.id) AS id, i.img AS url FROM (SELECT @rank:=0) r,img i ORDER BY rank;";
	$images = mysql_query($query);
	$result = array();
	while($img = mysql_fetch_assoc($images)){
		$imgSplit = array();
		foreach($img as $key=>$value){			
			$imgSplit[$key] = $value;
		}
		array_push($result, $imgSplit);
	}	
	
	echo json_encode($result,JSON_UNESCAPED_SLASHES);
?>