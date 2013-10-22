<?php
	/**
	  * Level Class 	  
	  *
	  * @package default
	  * @author  Marc Batalla
	  */
	 class Level{
	 	
	 	public $id;
	 	private $notions;
	 	public $name;	 	
	 	public $language;
	 	public $idProjects = array();

	 	function __construct($id,$name){
	 		require_once('notions.php');	 		
	 		$this->id = $id;
	 		$this->name = $name;	 			
	 	}

	 	function printArray(){
	 		return array($this->id,$this->name);
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