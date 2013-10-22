<?php
/**
  * undocumented class
  *
  * @package default
  * @author  
  */
 class Lang {
 	/**
	  * undocumented class variable
	  *
	  * @var $lang feeet
	  */
	private $lang = array();
	private $id;
	public $name;
	public $JSONfile;
	protected $flag;
	public $json;

 	function __construct(){
 		require('db.php');	
		if(!isset($_COOKIE['language'])){
			$_SESSION['language'] = '0000000001';			
			setcookie('language',$_SESSION['language'],strtotime('+1 day'),'/');
		}else{
			$_SESSION['language'] = $_COOKIE['language'];
		}					
		$query="SELECT * FROM language WHERE active = 1;";
		$langs=mysql_query($query);
		while($lang=mysql_fetch_assoc($langs)){			
			if($_SESSION['language']== $lang['id']){				
				//list($this->id,$this->name,$this->JSONfile,$this->flag)=$lang;
				$this->id=$lang['id'];
				$this->name=$lang['name'];
				$this->JSONfile=$lang['file'];
				$this->flag=$lang['flag'];
			}
			array_push($this->lang,$lang);						
		}

 	}
	
	/**
	 * Translate Page
	 *	 
	 * @param String $word Palabra a traducir
	 * @param Array $json Contiene la lista de palabras
	 * @return Palabra traducida
	 * @author Marc Batalla 
	 */
	function translatePage($html,$json) {			
		foreach ($json as $key => $val) {
			if(is_array($val)){
				$html = $this->translatePage($html,$val);
			}else{
				
				$html = str_replace('__'.$key.'__',$val,$html);
			}					
		}
		return $html;
	}
	
	/**
	 * Select a language
	 *	 
	 * @param string $html Página	 
	 * @return Página Traducida
	 * @author Marc Batalla 
	 */
	function selectLang($html){
		$this->JSONfile=file_get_contents('lang/'.$this->JSONfile);
		$this->json = json_decode($this->JSONfile, TRUE);
		return $this->translatePage($html, $this->json);
	}
	
		
	/**
	 * List of Language
	 *	 
	 * @param String $html Documento HTML	 
	 * @return Palabra traducida
	 * @author Marc Batalla 
	 */
	function langOptions($html){
		$test='';	
		$flags = '';
		foreach($this->lang as $value){
				if($this->id==$value['id'])
					$test.='<option id="language-id-'.$value['id'].'" selected data-file="'.$value['file'].'">'.ucfirst($value['name']).'</option>';
				else
					$test.='<option id="language-id-'.$value['id'].'" data-file="'.$value['file'].'">'.ucfirst($value['name']).'</option>';
			if($value['flag']!=''){
				$flags.='<img src="img/flags/'.$value['flag'].'" class="img-flag-language" alt="'.$value['name'].'"/>';
			}

		}
		$html = str_replace('<!-- Language IMG -->', $flags, $html);
		return str_replace('<!-- Language -->',$test,$html);
	}
	
	/**
	 * Translate some phrase or Words
	 * 
	 * @param String $phrase Frase del JSON
	 * @return Frase traducida
	 * @author Marc Batalla
	 */
	function translatePhrase($phrase){
		
	}

	/**
	 * Translate some phrase or Words
	 * 
	 * @param String $phrase Frase del JSON
	 * @return Frase traducida
	 * @author Marc Batalla
	 */
	function printLanguage(){
		$query="SELECT MD5(id) as id,name,file,flag,active FROM language;";
		$langs=mysql_query($query);
		print('<table data-role="table" id="table-column-toggle" data-mode="columntoggle" class="ui-responsive table-stroke">');
		$header=true;
		while($lang=mysql_fetch_assoc($langs)){			
			if($header){
				print('<thead>
       					<tr>
       						<th data-priority="2">id</th>
					        <th>language</th>
					        <th data-priority="3">json file</th>
					        <th data-priority="1">flag image</abbr></th>
					        <th data-priority="5">active</th>
					    </tr>
					   </thead>
					   <tbody>
       				');				
				$header = false;
			}
			print('<tr>
					<th><a href="#edit-language-dialog" class="language-edit" data-rel="dialog">'.$lang['id'].'</a></th>
					<td data-name="name">'.mb_convert_encoding($lang['name'],'auto').'</td>
					<td data-name="file"><a class="file-admin" href="#json-admin?p='.$lang['file'].'" data-ajax="false">'.$lang['file'].'</a></td>');

			if($lang['flag']!='')
				print('<td><img src="img/flags/'.$lang['flag'].'" title="'.$lang['flag'].'" alt="'.$lang['flag'].'"/></td>');
			else
				print('<td>No flag</td>');
			$active=($lang['active']==1)?'ON':'OFF';
			print('<td data-name="active">'.$active.'</td>
				</tr>');								
		}
		print('</tbody></table>');
	}

 } 


?>