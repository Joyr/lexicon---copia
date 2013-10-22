<?php
	/**
	  * Lexicon Class 	  
	  *
	  * @package default
	  * @author  Marc Batalla
	  */
	 class Lexicon{
	 	
	 	private $levels;
	 	private $users;	 	 	

	 	function __construct(){	
	 		require_once('level.php');
	 		
	 		$this->allLevels();
	 				 	
	 	}

	 	function addLevel($name){
 			$query = "INSERT INTO levels (name) VALUES ('".$name."');";
 				 				 			
 			return mysql_query($query);
 			 		
	 	}

	 	function searchLevel($name){
	 		foreach($this->levels as $levels){
	 			if($levels->name == $name){
	 				return $levels->id;
	 			}
	 		}
	 		return false;
	 	}

	 	function allLevels(){
	 		$this->levels = array();
	 		$query = 'SELECT id,name FROM levels ORDER BY name';
	 		$results = mysql_query($query);	 		
 			while($result=mysql_fetch_assoc($results)){
	 			$this->levels[] = new Level($result['id'],$result['name']);	 		
	 		}
	 	}

	 	function printLevels(){
	 		if(count($this->levels)>0){
	 			print('<div id="list-of-units" data-role="collapsible-set">');
	 			foreach($this->levels as $val){	 					 				
	 				print('<div data-role="collapsible" data-theme="b" data-content-theme="d" data-collapsed-icon="arrow-d" data-expanded-icon="arrow-u">
	 							<h3>Level: '.$val->name.'</h3>
	 							<ul data-role="listview" data-inset="false">');
	 							$val->printUnits();
	 				print('<li><div><a data-role="button">New project</a></div></li>
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
	 			foreach($this->levels as $val){	 				
	 				print('<option id="level-id-'.$val->id.'">'.$val->name.'</option>');
	 			}	
	 		}else{
	 			//
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