<?php
require_once 'php/db.php';
require_once 'php/module/Classes/PHPExcel/IOFactory.php';
$objPHPExcel = PHPExcel_IOFactory::load("Nociones_Ingles.xls");
$lang = 1;
foreach ($objPHPExcel->getWorksheetIterator() as $key=>$worksheet) {
    if($key==0){
	    $worksheetTitle     = $worksheet->getTitle();
	    $highestRow         = $worksheet->getHighestRow(); // e.g. 10
	    $highestColumn      = 'H'; // e.g 'F'
	    $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);
	    $nrColumns = ord($highestColumn) - 64;
	    $codi = array();
	    $fin = array();
	   /* echo "<br>The worksheet ".$worksheetTitle." has ";
	    echo $nrColumns . ' columns (A-' . $highestColumn . ') ';
	    echo ' and ' . $highestRow . ' row.';
	    echo '<br>Data: <table border="1"><tr>';*/

	    for ($row = 1; $row <= $highestRow; ++ $row) {
	        //echo '<tr>';
	        $rowA = array();
	        for ($col = 0; $col < $highestColumnIndex; ++ $col) {	        	
	            $cell = $worksheet->getCellByColumnAndRow($col, $row);
	            $val = $cell->getValue();
	            if($row==1){
	        		switch($val){
	        			case 'code':
	        				$codi['code'] = $col;
	        			break;
	        			case 'name':
	        				$codi['name'] = $col;
	        			break;
	        			case 'phrase':
	        				$codi['phrase'] = $col;
	        			break;
	        			case 'img':
	        				$codi['img'] = $col;
	        			break;
	        			case 'sound':
	        				$codi['sound'] = $col;
	        			break;
	        		}
	        	}else{
	        		if($col==$codi['code']||$col==$codi['name']||$col==$codi['phrase']||$col==$codi['img']||$col==$codi['sound'])
	            		array_push($rowA, $val);
	        	}

	            $dataType = PHPExcel_Cell_DataType::dataTypeForValue($val);
	            //echo '<td>' . $val . '</td>';
	            	            	
	        }
	        //echo '</tr>';
	        $fin[] = $rowA;
	    }
	    //echo '</table>';
	    foreach($fin as $key=>$value){
	    	if($key!=0&&$value[0]!=null){
		    	$word = array();		    		    	
				for($i=0;$i<strlen($value[0]);$i+=2){
					array_push($word,substr($value[0], $i,2));
				}  
				$value[0] = $word;  		
				$code = array();
				//$lexicon = new Lexicon();
				//$language = 1;
				//$lexicon->addNewCode($value[0],$value[1],$value[2],$value[3],$value[4],$language);
				$query = "SELECT id FROM levels WHERE name='".$value[0][0]."';";
				$result = mysql_query($query);
				if($result1 = mysql_fetch_array($result)){
					
					$code['level'] = $result1[0];
				}else{
					$query = "INSERT INTO levels (name) VALUES ('".$value[0][0]."')";
					mysql_query($query);
					$code['level'] = mysql_insert_id();					
				}

				$query = "SELECT id FROM notions WHERE code='".$value[0][1]."';";
				$result = mysql_query($query);				
				if($result1 = mysql_fetch_array($result)){					
					$code['notion'] = $result1[0];
				}else{
				$query = "INSERT INTO notions (code,id_level) VALUES ('".$value[0][1]."',".$code['level'].")";
					mysql_query($query);
					$code['notion'] = mysql_insert_id();
				}

				$query = "SELECT id FROM units WHERE num=CONCAT(LEFT('".implode('',$value[0])."',6),'000000') AND id_notions=".$code['notion']." AND id_int IS NULL;";
				$result = mysql_query($query);
				if($result1 = mysql_fetch_array($result)){					
					$code['unit'] = $result1[0];
				}else{
					$query = "INSERT INTO project (InitialDate,ModifiedDate,login_id) VALUES (NOW(),NOW(),16)";
					mysql_query($query) or die('Error project Unit '.mysql_errno());
					$code['unit'] = mysql_insert_id();

					$query = "INSERT INTO units (id,num,id_notions,id_level) VALUES (".$code['unit'].",CONCAT(LEFT('".implode('',$value[0])."',6),'000000'),".$code['notion'].",".$code['level'].")";
					mysql_query($query) or die('Error Insert Unit '.mysql_errno());
				}

				if($value[0][3]=='00'){

					$query = "INSERT IGNORE INTO notions_lang (id_level,id_notions,id_language,name) VALUES (".$code['level'].",".$code['notion'].",".$lang.",'".$worksheetTitle ."')";
					mysql_query($query);
					

					$query = "INSERT IGNORE INTO units_has_language (units_id,language_id,name,description) VALUES (".$code['unit'].",".$lang.",'".$value[1]."','".$value[2]."')";
					mysql_query($query);
									

				}else{					
					$query = "SELECT id FROM units WHERE num=CONCAT(LEFT('".implode('',$value[0])."',8),'0000') AND id_notions=".$code['notion']." AND id_int=".$code['unit'].";";
					$result = mysql_query($query);
					if($result1 = mysql_fetch_array($result)){					
						$code['subunit'] = $result1[0];
					}else{
						$query = "INSERT INTO project (InitialDate,ModifiedDate,login_id) VALUES (NOW(),NOW(),16)";
						mysql_query($query) or die('Error project SubUnit '.mysql_errno());
						$code['subunit'] = mysql_insert_id();

						$query = "INSERT INTO units (id,num,id_level,id_notions,id_int) VALUES (".$code['subunit'].",CONCAT(LEFT('".implode('',$value[0])."',8),'0000'),".$code['level'].",".$code['notion'].",".$code['unit'].")";
						mysql_query($query) or die('Error Insert subunit '.mysql_errno());
					}					
					if($value[0][4]=='00'){																	
						if($value[0][5]=='00'){
							$query = "INSERT IGNORE INTO units_has_language (units_id,language_id,name,description) VALUES (".$code['subunit'].",".$lang.",'".$value[1]."','".$value[2]."')";
							mysql_query($query);
							
						}else if($value[1]!=''){							
							$query = "SELECT card_id FROM card_official WHERE code='".implode('',$value[0])."' AND units_id=".$code['subunit'].";";
							$result = mysql_query($query);
							if($result1 = mysql_fetch_array($result)){					
								$code['card'] = $result1[0];
							}else{
								if($value[3]!=''){
									$query = "SELECT id FROM img WHERE img='".$value[3]."';";
									$result = mysql_query($query);
									if($result1 = mysql_fetch_array($result)){					
										$id_img = $result1[0];
									}else{
										$query = "INSERT INTO img (img) VALUES ('".$value[3]."')";
										mysql_query($query) or die('Error Image: '.mysql_errno());
										$id_img = mysql_insert_id();
									}
									$query = "INSERT INTO flashcard (img_id,login_id) VALUES ('".$id_img."',16)";
								}else{
									$query = "INSERT INTO flashcard (login_id) VALUES (16)";
								}								
								mysql_query($query) or die('Error card: '.mysql_errno());
								$code['card'] = mysql_insert_id();

								$query = "INSERT INTO card_official (card_id,units_id,code) VALUES (".$code['card'].",'".$code['subunit']."','".implode('',$value[0])."')";
								$test = mysql_query($query) or die('Error Card_official '.mysql_errno());
							}								
							$query = "INSERT IGNORE INTO card_official_language (id_card,id_language,word,phrase,url_sound) VALUES (".$code['card'].",".$lang.",\"".$value[1]."\",\"".$value[2]."\",'".$value[4]."')";							
							mysql_query($query) or die('Error Card_official Lang 1'.mysql_errno());
														
						}
					}else{
						$query = "SELECT id FROM units WHERE num=CONCAT(LEFT('".implode('',$value[0])."',10),'00') AND id_notions=".$code['notion']." AND id_int=".$code['subunit'].";";
						$result = mysql_query($query);
						if($result1 = mysql_fetch_array($result)){											
							$code['theme'] = $result1[0];
						}else{
							$query = "INSERT INTO project (InitialDate,ModifiedDate,login_id) VALUES (NOW(),NOW(),16)";
							mysql_query($query) or die('Error project theme '.mysql_errno());
							$code['theme'] = mysql_insert_id();

							$query = "INSERT INTO units (id,num,id_level,id_notions,id_int) VALUES (".$code['theme'].",CONCAT(LEFT('".implode('',$value[0])."',10),'00'),".$code['level'].",".$code['notion'].",".$code['subunit'].")";
							mysql_query($query) or die('Error Insert theme '.mysql_errno());
						}

						if($value[0][5]=='00'){		
							$query = "INSERT IGNORE INTO units_has_language (units_id,language_id,name,description) VALUES (".$code['theme'].",".$lang.",'".$value[1]."','".$value[2]."')";
							mysql_query($query);
							
						}else if($value[1]!=''){
							$query = "SELECT card_id FROM card_official WHERE code='".implode('',$value[0])."' AND units_id=".$code['theme'].";";
							$result = mysql_query($query);
							if($result1 = mysql_fetch_array($result)){					
								$code['card'] = $result1[0];
							}else{
								if($value[3]!=''){
									$query = "SELECT id FROM img WHERE img='".$value[3]."';";
									$result = mysql_query($query);
									if($result1 = mysql_fetch_array($result)){					
										$id_img = $result1[0];
									}else{
										$query = "INSERT INTO img (img) VALUES ('".$value[3]."')";
										mysql_query($query) or die('Error Image: '.mysql_errno());
										$id_img = mysql_insert_id();
									}
									$query = "INSERT INTO flashcard (img_id,login_id) VALUES ('".$id_img."',16)";
								}else{
									$query = "INSERT INTO flashcard (login_id) VALUES (16)";
								}								
								mysql_query($query) or die('Error card: '.mysql_errno());
								$code['card'] = mysql_insert_id();

								$query = "INSERT INTO card_official (card_id,units_id,code) VALUES (".$code['card'].",'".$code['theme']."','".implode('',$value[0])."')";
								mysql_query($query) or die('Error Card_official '.mysql_errno());

							}	
							$query = "INSERT IGNORE INTO card_official_language (id_card,id_language,word,phrase,url_sound) VALUES (".$code['card'].",".$lang.",\"".$value[1]."\",\"".$value[2]."\",'".$value[4]."')";
							mysql_query($query) or die('Error Card_official Lang 2'.mysql_errno());							
						}
					}												
				}
					
		    }

	    }
	}
}
?>