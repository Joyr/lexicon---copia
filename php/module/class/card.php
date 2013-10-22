<?php
	/**
	  * Official Cards Class 	  
	  *
	  * @package default
	  * @author  Marc Batalla
	  */
	 class Cards{
	 	
	 	private $id;
	 	public $img;	 	
	 	public $author;	 	

	 	function __construct($id){
	 		require_once('../../db.php');	 
	 		$this->id = $id;		
	 		$query = 'SELECT i.img as img,l.username as author FROM flashcard c LEFT OUTER JOIN img i ON i.id=c.img_id LEFT OUTER JOIN login l ON l.id=c.login_id WHERE c.id ='.$this->id;	 			
	 		$results = mysql_query($query);	 	
 			while($result=mysql_fetch_assoc($results)){
	 			$this->img = $result['img'];
	 			$this->author = $result['author'];
	 		}	
	 	}

	 	
	 } 	

?>