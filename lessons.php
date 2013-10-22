<?php if(!session_id())session_start();?>
<!DOCTYPE html>
<!-- Això és una prova-->
<html>
<head>
	<meta charset="utf-16">
    <title>{{title}}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="css/main.css" rel="stylesheet" type="text/css"/>
    <link href="css/themes/black.css" rel="stylesheet" id="theme-stylesheet" type="text/css"/>  
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.css" />
    
    <!--   - tagThat's base CSS (tagThat.css). -->
    <link href="css/tagThat.css" rel="stylesheet" type="text/css">
    
    
    <!-- jQuery -->
    <script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
    
    <script src="http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.js"></script>
    
    <!-- Other plug-ins & useful tools -->
    <script src="js/util.js"></script>
    <script src="js/plugins.js"></script>
    <script src="js/constants.js"></script>
    <script src="js/tagThat.js"></script>
    <script src="js/lexicon.js"></script>
    <script src="js/project.js"></script>
    
    <!--EXPIRE-->
    
<!-- Other options 

-->      
</head>
<body>
	<?php if(isset($_SESSION['role'])&&$_SESSION['role']>1){	    
    ?>
<script type="text/javascript">

Cobra.install();
$(document).ready(function(e){
    $.ajaxSetup({ cache: false });
    //lexicon.start();
    $('.go-to-menu').click(function(){
        //console.log('entra');
        $( ".menupanel" ).panel( "open" );
    });
    $('#add-new-level').click(function(){        
        var level = $('#new-level-name').val();
        $('#new-level-name').val('');       
        $.ajax({
            url:'php/insertLevel.php',
            type:'POST',
            data:{'level':level}            
        }).done(function(msg){
            if(msg==1){
                console.log('New level added');
                var url = location.href;
                url = url.split('&');
                location.href = url[0];
                location.reload();
            }else if(msg==-1){
                console.log('Fill input element');
            }else{
                console.log('This level exists')
            }
                        
        });
    });
    $('#add-new-general-unit').click(function(){        
        var unit = $('#last-general-unit').html();
        $.ajax({
            url:'php/insertUnit.php',
            type:'POST',
            data:{'unit':unit}            
        }).done(function(){
            var url = location.href;
            url = url.split('&');
            location.href = url[0];
            location.reload();
        });
    }); 

    $('#ol-lang').change(function(){ 
        $('#test').submit();               
    });

    $('.info-lessons-units').click(function(e){
        e.preventDefault();
        var newLocation = $(this).closest('tr').find('.row-name').html();
        var url = location.href;
        url = url.split('&code=');        
        if(url.length==1)
            url[1]='';
        newLocation=url[1]+newLocation;        
        location.href = url[0]+'&code='+newLocation;            
    });
    
    $('.position-lesson').click(function(e){
        e.preventDefault();
        var num = $(this).attr('data-id');
        num = num.split('-');
        var url = location.href;
        url = url.split('&code=');
        var newLocation = url[1].substr(0,(parseInt(num[1])+1)*2);
        location.href = url[0]+'&code='+newLocation;

    });
    
});

</script>

<!-- Lessons -->
<div data-role="page" id="main">
    <div data-theme="a" data-role="header" data-id="header-manager" data-position="fixed">
        <h3>
            Administrador
        </h3>
        <a href="php/logout.php" class="ui-btn-right" data-ajax="false" data-theme="r" data-role="button" data-icon="delete" title="Logout" data-iconpos="right">Desconectar</a>
        <div data-role="navbar" data-iconpos="top" >
            <ul>
                <li>
                    <a href="admin.php" data-ajax="false">
                        Info
                    </a>
                </li>
                <li>
                    <a href="#students" data-transition="none">
                        Estudiantes
                    </a>
                </li>
                <li>
                    <a href="#main" data-transition="none" class="ui-btn-active ui-state-persist">
                        Lecciones
                    </a>
                </li>
            </ul>
        </div>
    </div>
    <div data-role="content">   
        <div class="lexicon-unit-selects">             
            <form id="test" method="GET" action="lessons.php" data-ajax='false'>
                <select name="language" id="ol-lang"  data-mini="true" data-inline="true" >                        
                    <option selected>__Language__</option>
                    <?php
                        $code='';
                        $word = array();
                        if(isset($_GET['code'])){
                            $code = $_GET['code'];
                            
                            for($i=0;$i<strlen($code);$i+=2){
                                array_push($word,substr($code, $i,2));
                            } 
                        }
                        require('php/db.php');
                        $query="SELECT * FROM language;";
                        $langs=mysql_query($query);      
                        $lang='';                               
                        while($value=mysql_fetch_assoc($langs)){                            
                            if($_GET['language']==$value['code']){
                                $selected='selected';
                                $lang= $value['id'];
                            }else{
                                $selected='';
                            }                            
                            echo '<option id="language-id-'.$value['id'].'" '.$selected.' data-file="'.$value['file'].'" value="'.$value['code'].'">'.($value['name']).'</option>';                              
                        }
                        
                    ?><!-- Language -->
                </select> 
            </form>
            <h2 class="direction-url">
                <?php
                foreach($word as $key=>$val){
                    if($key<count($word)-1&&$key<5)
                        echo '<a href="#" data-id="position-'.$key.'" class="position-lesson">'.$val.'</a> <img src="img/bg_btn/5.png"/>';
                }               
            ?>
            </h2> 
        </div>
        <div >
            <?php
                if($lang!=''&$code==''){
                    $query = "SELECT MD5(le.id),l.code, le.name
                        FROM language l,levels le
                        WHERE l.id=".$lang;
                    $notions = mysql_query($query);
                    print('<table data-role="table" id="table-column-toggle" data-mode="columntoggle" class="ui-responsive table-stroke">
                        <thead>
                                <tr>
                                    <th>ID</th>
                                    <th data-priority="1">Language</th>
                                    <th>NAME</th>
                                </tr>
                            </thead>
                            <tbody>
                        ');
                    while($notion = mysql_fetch_array($notions)){
                        print('<tr>
                                    <td><a href="#" class="info-lessons-units" title="Go to level '.$notion[2].'">'.$notion[0].'</a></td>
                                    <td>'.$notion[1].'</td>
                                    <td class="row-name">'.$notion[2].'</td></tr>
                            ');
                    }                     
                    print('</tbody></table>');
                }else if($code!=''){
                    
                    
                    switch(count($word)){
                        case '1':
                            $query = "SELECT MD5(n.id), le.name, RIGHT(n.code,2), nl.name
                                    FROM levels le, language l 
                                    INNER JOIN notions n 
                                    LEFT OUTER JOIN notions_lang nl ON nl.id_language=l.id AND nl.id_notions=n.id
                                    WHERE le.name='".$word[0]."' AND l.id=".$lang."
                                    ORDER BY n.id;";
                            
                            $notions = mysql_query($query);
                            print('<form method="POST" action="php/units.php">
                                <table data-role="table" id="table-column-toggle" data-mode="columntoggle" class="ui-responsive table-stroke">
                                <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th data-priority="1">LEVEL</th>
                                            <th>CODE</th>
                                            <th>NAME</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                ');
                            while($notion = mysql_fetch_array($notions)){
                                print('<tr>
                                            <td><a href="#" class="info-lessons-units">'.$notion[0].'</a></td>
                                            <td>'.$notion[1].'</td>
                                            <td class="row-name">'.$notion[2].'</td>');
                                if($notion[3]==NULL){
                                    $placeholder = 'Notion name';
                                    $notion[3] = '';
                                }
                                print('<td><input type="text" placeholder="Notion name of '.$notion[2].'" value="'.$notion[3].'"/></td>
                                        </tr>
                                    ');
                            }                     
                            print('</tbody></table>
                                <input type="hidden" value="'.$code.$notion[2].'"/>
                                <input type="submit" value="Submit"/>
                                </form>');
                        break;

                        case '2':
                            $query = "SELECT MD5(u.id), le.name, RIGHT(n.code,2), right(u.num,2), ul.name
                                    FROM levels le, notions n, language l INNER JOIN units u LEFT OUTER JOIN units_has_language ul ON u.id=ul.units_id AND l.id=ul.language_id
                                    WHERE u.id_notions=n.id AND u.id_level=le.id AND le.name='".$word[0]."' AND l.id=".$lang." AND u.id_int IS NULL AND n.code='".$word[1]."'
                                    ORDER BY u.id;";
                                    $notions = mysql_query($query);
                            print('<form method="POST" action="php/units.php">
                                <table data-role="table" id="table-column-toggle" data-mode="columntoggle" class="ui-responsive table-stroke">
                                <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th data-priority="1">LEVEL</th>
                                            <th>CODE</th>
                                            <th>NAME</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                ');
                            while($notion = mysql_fetch_array($notions)){
                                print('<tr>
                                            <td><a href="#" class="info-lessons-units">'.$notion[0].'</a></td>
                                            <td>'.$code.'</td>
                                            <td class="row-name">'.$notion[3].'</td>');
                                            
                                print('<td><input type="text" placeholder="Notion name of '.$notion[3].'" value="'.$notion[4].'"/></td>
                                        </tr>
                                    ');
                            }                     
                            print('</tbody></table>
                                <input type="hidden" value="'.$code.$notion[2].'"/>
                                <input type="submit" value="Submit"/>
                                </form>');
                        break;
                        case '3':
                            $query = "SELECT u.id
                                FROM levels le, notions n, units u
                                WHERE le.name='".$word[0]."' AND n.code='".$word[1]."' AND u.num='".$word[2]."' 
                                AND u.id_notions=n.id AND u.id_level=le.id AND u.id_int IS NULL";
                            $id = mysql_query($query);
                            $id = mysql_fetch_array($id);                            
                            $query = "SELECT MD5(u.id), le.name, RIGHT(n.code,2), right(u.num,2), ul.name
                                    FROM levels le, notions n, language l INNER JOIN units u LEFT OUTER JOIN units_has_language ul ON u.id=ul.units_id AND l.id=ul.language_id
                                    WHERE u.id_notions=n.id AND u.id_level=le.id AND le.name='".$word[0]."' AND l.id=".$lang." AND u.id_int=".$id[0]." AND n.code='".$word[1]."'
                                    ORDER BY u.id;";
                                    $notions = mysql_query($query);
                            print('<form method="POST" action="php/units.php">
                                <table data-role="table" id="table-column-toggle" data-mode="columntoggle" class="ui-responsive table-stroke">
                                <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th data-priority="1">CODE</th>
                                            <th hidden>CODE</th>                                            
                                            <th>NAME</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                ');
                            while($notion = mysql_fetch_array($notions)){
                                print('<tr>
                                            <td><a href="#" class="info-lessons-units">'.$notion[0].'</a></td>
                                            <td>'.$code.$notion[3].'00</td>
                                            <td class="row-name" hidden>'.$notion[3].'</td>');
                                            
                                print('<td><input type="text" placeholder="Notion name of '.$notion[3].'" value="'.$notion[4].'"/></td>
                                        </tr>
                                    ');
                            }                     
                            print('</tbody></table>
                                <input type="hidden" value="'.$code.$notion[2].'"/>
                                <input type="submit" value="Submit"/>
                                </form>');
                        break;
                        case '4':    
                            $query = "SELECT u1.id
                                FROM levels le, notions n, units u, units u1
                                WHERE le.name='".$word[0]."' AND n.code='".$word[1]."' AND u.num='".$word[2]."' AND u1.num='".$word[3]."'
                                AND u.id_notions=n.id AND u.id_level=le.id AND u.id=u1.id_int AND u.id_int IS NULL";
                            $id = mysql_query($query);
                            $id = mysql_fetch_array($id); 

                            $query = "SELECT u2.id, RIGHT(u2.num,2), ul.name
                                    FROM levels le, notions n, units u, units u1, units u2 INNER JOIN language l RIGHT JOIN units_has_language ul 
                                    ON ul.language_id=l.id AND ul.units_id=u2.id
                                    WHERE le.name='".$word[0]."' AND n.code='".$word[1]."' AND u.num='".$word[2]."' AND u1.num='".$word[3]."' AND u1.id=u2.id_int
                                    AND u.id_notions=n.id AND u.id_level=le.id AND u1.id_int=u.id AND u.id_int IS NULL AND l.id=".$lang;
                            
                                    $notions = mysql_query($query);

                            print('<h2>Lessons</h2><form method="POST" action="php/units.php">
                                <table data-role="table" id="table-column-toggle" data-mode="columntoggle" class="ui-responsive table-stroke">
                                <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th data-priority="1">CODE</th>
                                            <th hidden>CODE</th>                                            
                                            <th>NAME</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                ');
                            while($notion = mysql_fetch_array($notions)){
                                print('<tr>
                                            <td><a href="#" class="info-lessons-units">'.$notion[0].'</a></td>
                                            <td>'.$code.$notion[1]."00".'</td>
                                            <td class="row-name" hidden>'.$notion[1].'</td>');
                                            
                                print('<td><input type="text" placeholder="Notion name of '.$notion[1].'" value="'.$notion[2].'"/></td>
                                        </tr>
                                    ');
                            }                     
                            print('</tbody></table>
                                <input type="hidden" value="'.$code.$notion[0].'"/>
                                <input type="submit" value="Submit"/>
                                </form>');

                            $query = "SELECT co.card_id, RIGHT(co.code,2), col.word, col.phrase, i.img
FROM units u
INNER JOIN flashcard c LEFT OUTER JOIN img i ON c.img_id=i.id
INNER JOIN card_official co INNER JOIN language l LEFT JOIN card_official_language col ON col.id_card=co.card_id AND col.id_language=l.id
WHERE u.id='".$id[0]."' AND c.id=co.card_id AND co.units_id=u.id AND l.id=".$lang;
                            
                            $notions = mysql_query($query);

                            print('<h2>Cards</h2><form method="POST" action="php/units.php">
                                <table data-role="table" id="table-column-toggle" data-mode="columntoggle" class="ui-responsive table-stroke">
                                <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th data-priority="1">CODE</th>
                                            <th>NUMBER</th>                                            
                                            <th>WORD</th>
                                            <th>PHRASE</th>
                                            <th>IMAGE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                ');
                            while($notion = mysql_fetch_array($notions)){
                                print('<tr>
                                            <td><a href="#" >'.$notion[0].'</a></td>
                                            <td>'.$code.'</td>
                                            <td class="row-name">'.$notion[1].'</td>');
                                            
                                print('<td><input type="text" placeholder="Notion name of '.$notion[1].'" value="'.$notion[2].'"/></td>
                                    <td class="row-name">'.$notion[3].'</td>
                                    <td class="row-name">'.$notion[4].'</td>
                                        </tr>
                                    ');
                            }                     
                            print('</tbody></table>
                                <input type="hidden" value="'.$code.$notion[0].'"/>
                                <input type="submit" value="Submit"/>
                                </form>');
                        break;
                        case '5':    
                            $query = "SELECT u2.id
                                FROM levels le, notions n, units u, units u1, units u2
                                WHERE le.name='".$word[0]."' AND n.code='".$word[1]."' AND u.num='".$word[2]."' AND u1.num='".$word[3]."'
                                AND u2.num='".$word[4]."' AND u2.id_int=u1.id
                                AND u.id_notions=n.id AND u.id_level=le.id AND u.id=u1.id_int AND u.id_int IS NULL";
                            $id = mysql_query($query);
                            $id = mysql_fetch_array($id);                             

                            $query = "SELECT co.card_id, RIGHT(co.code,2), col.word, col.phrase, i.img
FROM units u
INNER JOIN flashcard c LEFT OUTER JOIN img i ON c.img_id=i.id
INNER JOIN card_official co INNER JOIN language l LEFT JOIN card_official_language col ON col.id_card=co.card_id AND col.id_language=l.id
WHERE u.id='".$id[0]."' AND c.id=co.card_id AND 
co.units_id=u.id AND l.id=".$lang;
                            
                            $notions = mysql_query($query);

                            print('<h2>Cards</h2><form method="POST" action="php/units.php">
                                <table data-role="table" id="table-column-toggle" data-mode="columntoggle" class="ui-responsive table-stroke">
                                <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th data-priority="1">CODE</th>
                                            <th>NUMBER</th>                                            
                                            <th>WORD</th>
                                            <th>PHRASE</th>
                                            <th>IMAGE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                ');
                            while($notion = mysql_fetch_array($notions)){
                                print('<tr>
                                            <td><a href="#" >'.$notion[0].'</a></td>
                                            <td>'.$code.'</td>
                                            <td class="row-name">'.$notion[1].'</td>');
                                            
                                print('<td><input type="text" placeholder="Notion name of '.$notion[1].'" value="'.$notion[2].'"/></td>
                                    <td class="row-name">'.$notion[3].'</td>
                                    <td class="row-name">'.$notion[4].'</td>
                                        </tr>
                                    ');
                            }                     
                            print('</tbody></table>
                                <input type="hidden" value="'.$code.$notion[0].'"/>
                                <input type="submit" value="Submit"/>
                                </form>');
                        break;
                    }
                }
        ?>
        </div>
    </div>    

    <div data-role="footer" data-position="fixed">
        <div data-role="navbar">
            <ul>
                <li>
                    <a href="#add-level-dialog" id="add-general-level" data-icon="add" data-rel="dialog">__New_Level__</a>
                </li>
                <li>
                    <a href="#add-unit-dialog" id="add-general-unit" data-icon="add" data-rel="dialog">__New_Unit__</a>
                </li>
                <li>
                    <a>__New_Unit__</a>
                </li>
            </ul>
        </div>
    </div>
</div>
<!-- Dialogs pages -->
<div id="add-level-dialog" data-role="page">
    <div data-role="header">
        <h3>__Add_New_Level__</h3>
    </div>
    <div data-role="content">
        <ul data-role="listview" data-inset="true">
            <li data-role="listitem">
                <label for="new-level">__Name_Level__</label><input type="text" id="new-level-name" name="new-level">
                <p id="if-exist-level"></p>
            </li>
        </ul>
        <a id="add-new-level" data-role="button" data-theme="e">__MSG_Sure__</a>        
    </div>    
</div>

<div id="add-unit-dialog" data-role="page">
    <div data-role="header">
        <h3>__Add_New_Level__</h3>
    </div>
    <div data-role="content">
        <p>__MSG_New_Unit__ <span id="last-general-unit"><?php //$units->lastLevel();?></span></p>
        <a id="add-new-general-unit" data-role="button" data-theme="e">__MSG_Sure__</a>        
    </div>    
</div>



<!-- template -->
<!-- Templates -->
<div id="templates" data-role="page">
    <li id="template-project" data-role="listitem">
        <a href="" class="project-study" data-transition="fade">
        <h2 class="project-name"></h2>
        <p class="project-description"></p>
        <span class="ui-li-count project-card-count"></span></a>
        <a class="edit" href="#dialog-options" data-rel="dialog" data-transition="pop">__Edit__</a>
    </li>
    <li id="template-project-tags" data-role="listitem">
        <a href="" class="project-study" data-transition="fade" data-ajax="false">
        <h2 class="project-name"></h2>       
        <!--<p class="project-description"></p>-->
        <span class='project-tag-title' hidden>__Tags__:</span>
        <p class="project-tag"></p>
        <span class="ui-li-count project-card-count"></span></a>
        <a class="edit" href="#dialog-options" data-rel="dialog" data-transition="pop" data-icon="gear">__Edit__</a>
    </li>
    <li id="template-card" data-role="listitem">
            <a href="" class="card-manager-edit-button" data-rel="dialog">
                <h3><div class="ui-icon ui-icon-question" style="float:left" title="Question"></div>&nbsp;
                    <span class="card-manager-question"></span></h3>
                <h3><div class="ui-icon ui-icon-chat" style="float:left" title="Answer"></div>&nbsp; 
                    <span class="card-manager-answer"></span></h3>
                <span class="ui-li-count" title=""></span>
            </a>
      </li>
      <li id="template-non-project" data-role="listitem">
        <h3 class="project-name"></h3>
        <p class="project-description"></p>
    </li>
</div>
<?php 
}else{
	$host  = $_SERVER['HTTP_HOST'];
	$uri   = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
	//$extra = '/';
	exit(header("Location: http://$host$uri/"));
} ?>
</body>
</html>
