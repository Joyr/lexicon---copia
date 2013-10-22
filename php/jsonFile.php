<?php
function translateJSON($newjson,$json) {			
		$result = array();
		foreach ($json as $key => $val) {
			if(is_array($val)){
				$result[$key] = translateJSON($newjson,$val);
			}else{				
				if($newjson['input-'.$key]!=''){
					$result[$key] = mb_convert_encoding($newjson['input-'.$key],'auto');					
				}
			}		
		}
		return $result;
	}

$jsonTemplate = file_get_contents('../lang/template.json',true);
$json = json_decode($jsonTemplate,TRUE);

$newJSON = $_POST;

$file = $_POST['json-name'];
$translate = translateJSON($newJSON,$json);
$finalFile = json_encode($translate);

$t = file_put_contents('../lang/'.$file, $finalFile);

$host  = $_SERVER['HTTP_HOST'];
header("Location: http://$host/lexicon/admin.php");
?>