<?php
function connectionLang($lang){
	
}
function replaceLang($lang){	
	$l=file_get_contents('lang/'.$lang.'.json');
	$json = json_decode($l, TRUE);	
	$html=repeatJson($json,$_FILES['lang']);
	//$html=langOptions($html);
	return selectLangOptions($lang,$html);		
}
function repeatJson($json,$html){
	foreach ($json as $key => $val) {
		if(is_array($val))
			return repeatJson($val,$html);
		else{
			$html=str_replace('__'.$key.'__',$val,$html);
		}
					
	}
	return $html;
}
function langOptions($html){
	$test='';	
	for($i=0;$i<5;$i++){
		$test.='<option>Prova $i</option>';
	}
	return str_replace('<!-- Language -->',$test,$html);
}
function selectLangOptions($lang,$html){
	return str_replace('value="'.$lang.'"','value="'.$lang.'" selected',$html);
	
}
?>