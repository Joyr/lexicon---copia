<?php
	/**
	  *		Units Class 	  
	  *
	  * @package default
	  * @author  Marc Batalla
	  */
	 class Units{
	 	
	 	public $levels = array();
	 	public $title;
	 	public $description;
	 	public $language;
	 	public $idProjects = array();

	 	function __construct(){
	 		require_once('php/db.php');
	 		require_once('php/roman.php');
	 		$query = 'SELECT name,id,sup_unit FROM units';

	 		$results = mysql_query($query);
	 		if(mysql_num_rows($results)!=0){
	 			while($result=mysql_fetch_assoc($results)){
		 			$this->levels[romanic_number($result['name'],TRUE)] = $result;
		 		}	
	 		} 		
	 	}

	 	function printUnits(){
	 		if(count($this->levels)>0){
	 			print('<div id="list-of-units" data-role="collapsible-set">');
	 			foreach($this->levels as $key=>$val){
	 				print('<div data-role="collapsible" data-theme="b" data-content-theme="d" data-collapsed-icon="arrow-d" data-expanded-icon="arrow-u">
	 							<h3>Unit '.$val['name'].'</h3>
	 							<ul data-role="listview" data-inset="false">
	 								<li><div><a data-role="button">New project</a></div></li>
	 							</ul>
	 					</div>');
	 			}
	 			print('</div>');	
	 		}else{
	 			print('<h2>No found units</h2>');
	 		}	 		
	 	}

	 	function printOptions(){
	 		if(count($this->levels)>0){
	 			print('<div data-role="collapsible-set">');
	 			foreach($this->levels as $key=>$val){
	 				print('<div data-role="collapsible">
	 						<h3>'.$key.'</h3>
	 					</div>');
	 			}
	 			print('</div>');	
	 		}else{
	 			print('<h2>No found units</h2>');
	 		}
	 	}

	 	function lastLevel($unit = null){
	 		$number;
	 		if($unit == null){
	 			echo count($this->levels) + 1;
	 		}else{

	 		}

	 	}
	 } 
	 
	
	
?>

