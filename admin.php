<?php if(!session_id())session_start();?>
<!DOCTYPE html>

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
	   require_once('php/language.php');       
       $lang=new Lang();       
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
    $('#add-language-form').submit(function(e){
       /* e.preventDefault();
        $.ajax({
            url:"",
            type:"POST",
            data:{}
        }).done(function(msg){

        });*/
    });
    $('.language-edit').click(function(e){    
        var id = $(this).html();          
        row = $(this).closest('tr');
        $.each(row.find('td'),function(key,val){
            switch(key){
                case 0:
                    $('#language-name-edit').val($(val).html());
                    break;
                case 1:
                    $('#file-lang-edit').val($(val).find('a').html());                    
                    break;
                case 2:
                    title = '';
                    $('.name-flag-file').html(title=$(val).find('img').attr('title'));                    
                    $('input[name=flag-lang]').val(title);
                    $('.name-flag-file').next().find('img[title="'+title+'"]').addClass('flag-select');
                    break;
                case 3:
                    $('#active-lang-edit').val($(val).html());
                    window.setTimeout(function(){$('#active-lang-edit').slider( "refresh" );},300);                   
                    break;
            }            
        });
        $('#id-language').val(id);
        console.log("Loading language: "+$('#id-language').val()+" ...");
    });
    $('.choose-flag').click(function(){
        $('.choose-flag').removeClass('flag-select');
        $(this).addClass('flag-select');
        $('input[name=flag-lang]').val(title=$(this).attr('title'));
        $('.name-flag-file').html(title);
    });
    $('.file-admin').click(function(){
        url = $(this).attr('href');
        url = url.split('?p=');
        $('#options-lang').find('option').removeAttr('selected');
        $('#options-lang').find('option[data-file="'+url[1]+'"]').attr('selected','selected');        
        $('#options-lang').change();
        $('#form-json-file').show();

    });
    $('#form-json-file a').click(function(){
        $('#form-json-file').submit();
    });
    $('#remove-json').click(function(){
        $('#tipus-edit-remove').val('remove');
        $(this).closest('form').submit();
    });
    $('#options-lang').change(function(){
        $('#form-json-file').find('input').val('');
        $('#form-json-file').show();
        var file = $(this).find('option:selected').attr('data-file');
        $('#input-json').val(file);        
        $.getJSON('lang/'+file,function(language){   
            $.each(language, function(key,val){
                if(typeof(val)!='string'){
                    $.each(val,function(key1,val1){                        
                        $("#input-"+key1.replace(/'/g, "\\'")).val(val1);                   
                    });
                }else{
                    $("#input-"+key.replace(/'/g, "\\'")).val(val);                   
                }
                               
            });         
        });
    });
    function transformJSON(test, result){
        $.each(test, function(key,val){
            if($.isArray(val)){
                transformJSON(val,result);
            }else{                
                result[key]=val;
            }
        });
        return true;
    }
});

</script>

<!-- Home -->
<div data-role="page" id="main-admin">
    <div data-role="panel" class="menupanel" data-position="left" data-display="push">
        <ul data-role="listview">
            <li>
                <a href="#json-admin">                
                    <img src="img/bg_btn/2.png" style="width:80px; border:0px !important;" />
                    <h3>Configure JSON</h3>
                </a>
            </li>            
        </ul>
    </div>
    <div data-theme="a" data-role="header" data-id="header-manager" data-position="fixed">
        <span class="go-to-menu ui-btn-left"></span>
        <h3>
            Administrador
        </h3>
        <a href="php/logout.php" class="ui-btn-right" data-ajax="false" data-theme="r" data-role="button" data-icon="delete" title="Logout" data-iconpos="right">Desconectar</a>
        <div data-role="navbar" data-iconpos="top" data-theme="b">
            <ul>
                <li>
                    <a href="#main-admin" data-transition="none" class="ui-btn-active ui-state-persist">
                        Info
                    </a>
                </li>
                <li>
                    <a href="#students" data-transition="none">
                        Estudiantes
                    </a>
                </li>
                <li>
                    <a href="lessons.php" data-transition="none" data-ajax="false">
                        Lecciones
                    </a>
                </li>                
            </ul>
        </div>
    </div>
    <div data-role="content">
        <div>            
            <a href="#add-language-dialog" data-role="button" data-rel="dialog">New Language</a>
            <?php
                
                $lang->printLanguage();
            ?>
        </div>
    </div>
</div>           

<!-- JSON admin -->
<div data-role="page" id="json-admin">
    <div data-role="panel" class="menupanel" data-position="left" data-display="push">
        <ul data-role="listview">
            <li>
                <a>
                
                <img src="http://i.imgur.com/epln1cIb.jpg"/>
            </a>
            </li>            
        </ul>
    </div>
    <div data-theme="a" data-role="header" data-id="header-manager" data-position="fixed">
        <span class="go-to-menu ui-btn-left"></span>
        <h3>
            Administrador
        </h3>
        <a href="php/logout.php" class="ui-btn-right" data-ajax="false" data-theme="r" data-role="button" data-icon="delete" title="Logout" data-iconpos="right">Desconectar</a>
        <div data-role="navbar" data-iconpos="top" >
            <ul>
                <li>
                    <a href="#main-admin" data-transition="none">
                        Info
                    </a>
                </li>
                <li>
                    <a href="#students" data-transition="none">
                        Estudiantes
                    </a>
                </li>
                <li>
                    <a href="lessons.php" data-transition="none" data-ajax="false">
                        Lecciones
                    </a>
                </li>                
            </ul>
        </div>
    </div>
    <div data-role="content">       
        <div>
            <select name="options-lang" id="options-lang" data-native-menu="false" data-theme="c" class="ui-btn-left" data-mini="true" data-iconpos="left">                        
                <option selected>__Language__</option>
                <?php
                    require('php/db.php');
                    $query="SELECT * FROM language;";
                    $langs=mysql_query($query);                    
                    while($value=mysql_fetch_assoc($langs)){
                        echo '<option id="language-id-'.$value['id'].'" data-file="'.$value['file'].'">'.($value['name']).'</option>';                              
                    }
                    
                ?><!-- Language -->
            </select>   
        <?php
            
            function pJSON($json1) {           
                foreach ($json1 as $key => $val) {
                    if(is_array($val)){ 
                        switch($key){
                            case 'HTML label':
                                $key = 'HTML labels';
                                break;
                            case 'Message_HTML':
                                $key = 'HTML messages';
                                break;
                            case 'Options':
                                $key = 'Options messages';
                                break;
                            case '_MSG_JS':
                                $key = 'Javascript Message';
                                break;
                        }
                        print('<div data-role="collapsible" data-theme="e">
                                <h2>'.$key.'</h2>
                                <ul data-role="listview" data-divider-theme="b" data-autodividers="true">');                                               
                        pJSON($val);
                        print('</ul>
                            </div>');
                        
                    }else{                        
                        print('<li data-role="fieldcontain"><label for="input-'.$key.'" class="ui-input-text">'.$key.'</label>');
                        print('<input type="text" name="input-'.$key.'" id="input-'.$key.'"placeholder="'.$val.'"/></li>');
                    }                   
                }
            }

            function printJSON($file){
                $json = json_decode(file_get_contents('lang/'.$file), TRUE);
                print('<form data-ajax="false" method="POST" action="php/jsonFile.php" hidden id="form-json-file">
                        <div data-role="collapsible-set" data-theme="c" data-content-theme="d">');
                pJSON($json);

                print('</div>
                        
                        <input id="input-json" name="json-name" type="hidden"/>
                        <a data-role="button">Submit</a>
                    </form>');
            }   
            printJSON('template.json');            
        ?>
    </div>
    </div>
</div>           

<!-- Students -->
<div data-role="page" id="students">
    <div data-theme="a" data-role="header" data-id="header-manager" data-position="fixed">
        <h3>
            Administrador
        </h3>
        <a href="php/logout.php" class="ui-btn-right" data-ajax="false" data-theme="r" data-role="button" data-icon="delete" title="Logout" data-iconpos="right">Desconectar</a>
        <div data-role="navbar" data-iconpos="top" >
            <ul>
                <li>
                    <a href="#main-admin" data-transition="none">
                        Info
                    </a>
                </li>
                <li>
                    <a href="#students" data-transition="none" class="ui-btn-active ui-state-persist">
                        Estudiantes
                    </a>
                </li>
                <li>
                    <a href="lessons.php" data-transition="none" data-ajax="false">
                        Lecciones
                    </a>
                </li>
            </ul>
        </div>
    </div>
    <div data-role="content">
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

<div id="add-language-dialog" data-role="page">
    <div data-role="header">
        <h3>__ADD__</h3>
    </div>
    <div data-role="content">
        <p>__MSG_ADD__ </p>
        <form id="add-language-form" method="POST" action="php/insertLanguage.php" data-ajax="false" enctype="multipart/form-data">
        <ul data-role="listview" data-inset="true">
            <li data-role="fieldcontain"><label for="language-name-add" class="ui-input-text">__Name__:</label><input id="language-name-add" type="text" name="language-name" placeholder="example: Language name"/></li>
            <li data-role="fieldcontain"><label for="file-lang-add" class="ui-input-text">__Code__:</label><input id="file-lang-add" type="text" name="code" placeholder="example: new_file_name.json"/></li>
            <li data-role="fieldcontain"><label for="flag-lang-add" class="ui-input-text">__flag__:</label>
                <span class="name-flag-file"></span>
                <div style="margin-top:10px" data-role="collapsible" data-theme="b" data-content-theme="d">
                    <h3>Gallery</h3>
                    <div>
                    <?php
                        $dir = 'img/flags';
                        $files = scandir($dir);
                        $i;
                        for($i=0;$i<count($files);$i++){
                            $img=$files[$i];
                            if(preg_match('/(png)$/',$img))
                                print('<img src="'.$dir.'/'.$img.'" alt="'.$img.'" title="'.$img.'" style="width:16px;height:11px" class="choose-flag"/>');                           
                            else
                                $i++;
                        }
                    ?>
                    </div>
                </div>
                <input id="flag-lang-add" class="flag-lang" type="hidden" name="flag-lang" value=""/></li>                            
        </ul>
        <input type="hidden" name="tipus" value="add"/>
        <input type="submit" data-role="button" value="__Done__"/>
        </form>    
    </div>        
    </div>    
</div>

<div id="edit-language-dialog" data-role="page">
    <div data-role="header">
        <h3>__EDIT__</h3>
    </div>
    <div data-role="content">
        <p>__MSG_EDIT__ </p>
        <form method="POST" action="php/insertLanguage.php" data-ajax="false">
        <ul data-role="listview" data-inset="true">
            <li data-role="fieldcontain"><label for="language-name-edit" class="ui-input-text">__Name__:</label><input id="language-name-edit" type="text" name="language-name"/></li>
            <li data-role="fieldcontain"><label for="file-lang-edit" class="ui-input-text">__Code__:</label><input id="file-lang-edit" type="text" name="code"/></li>
            <li data-role="fieldcontain"><label for="flag-lang-edit" class="ui-input-text">___flag__:</label>
                <span class="name-flag-file"></span>
                <div style="margin-top:10px" data-role="collapsible" data-theme="b" data-content-theme="d">
                    <h3>Gallery</h3>
                    <div>
                    <?php
                        $dir = 'img/flags';
                        $files = scandir($dir);
                        $i;
                        for($i=0;$i<count($files);$i++){
                            $img=$files[$i];
                            if(preg_match('/(png)$/',$img))
                                print('<img src="'.$dir.'/'.$img.'" alt="'.$img.'" title="'.$img.'" style="width:16px;height:11px" class="choose-flag"/>');                           
                            else
                                $i++;
                        }
                    ?>
                    </div>
                </div>
                <input id="flag-lang-edit" type="hidden" name="flag-lang" value=""/></li> 

            </li>
            <li data-role="fieldcontain"><label for="active-lang" class="ui-input-text">__Active__</label>
                <select name="active-lang" id="active-lang-edit" data-role="slider" data-mini="true" class="ui-input-text">
                    <option value="OFF">No</option>
                    <option value="ON" selected="">Yes</option>                    
                </select>
            </li>                    
        </ul>
        <input id="tipus-edit-remove" type="hidden" name="tipus" value="edit"/>
        <input type="hidden" id="id-language" name="id-language" value=""/>
        <button type="submit" data-role="button">__Done__</button>        
        <button id="remove-json" type="button" data-role="button" data-theme="r">__Remove__</button>
    </form>
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
