<!DOCTYPE html>

<html>
<head>
    <meta charset="utf-8">
    <title>Lexicon</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="css/main.css" rel="stylesheet" type="text/css"/>  
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.css" />
    
    <!--   - tagThat's base CSS (tagThat.css). -->
    <link href="css/tagThat.css" rel="stylesheet" type="text/css">
    
    
    <!-- jQuery -->
    <script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
    
    <script src="http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.js"></script>
    
    <!-- Other plug-ins & useful tools -->
    <script src="js/util.js"></script>
    <script src="js/constants.js"></script>
    <script src="js/tagThat.js"></script>
    <script src="js/plugins.js"></script>
    <script src="js/lang.js"></script>
    
    <!--EXPIRE-->
    
<!-- Other options 

-->      
</head>
<body>
<div data-role="page">
    <div id="options-panel" data-role="panel" data-position="right" data-display="overlay" data-theme="b">
        <div id="options-collapsible-set" data-role="collapsible-set" data-inset="false" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d">
            <div data-role="collapsible" data-content-theme="c" data-collapsed="false">
                <h3>__Appearance__</h3>
                <div>                                        
                    <label for="options-theme">__Theme__</label>
                    <select name="options-theme" id="options-theme" data-native-menu="false">                        
                        <option value="blue">__Blueberry__</option>
                        <option value="black">__Black__</option>
                        <option value="green">__Apple__</option>
                        <option value="red">__Cherry__</option>
                        <!--<option value="purple">Grape</option>-->
                    </select>
                </div>
            </div>                             
        </div>
            
        <br />
        
        <a href="#home" id="options-finish" data-role="button" data-theme="b" data-icon="check" data-rel="close" data-iconpos="right">__Save__</a>
        <a href="#home" data-role="button" data-icon="delete" data-rel="close" data-iconpos="right">__Cancel__</a>
    </div>
    <div data-role="header">
        <select name="options-lang" id="options-lang" data-native-menu="false" data-theme="c" class="ui-btn-left" data-mini="true" data-iconpos="left">                                    
            <!-- Language -->
        </select>
    	<div class="img-title">
            <img src="img/On-lingua_web_peque.png" alt="image"/>            
        </div> 
        <a href="#options-panel" data-icon="grid" class="ui-btn-right">__Menu__</a>           	
    </div>
    <div data-role="content" id="login">
    	<div>
          <form data-ajax="false">
            <ul data-role="listview"  data-inset="true">
            	<li data-role="list-divider">__Login__</li>
                <li><label id="userL" for="user">__User__</label><input type="text" id="user" name="user" size="20" maxlength="20"/></li>
                <li><label id="passL" for="passw">__Password__</label><input type="password" id="passw" name="passw" size="20" maxlength="20"/></li>
                <li><input type="checkbox" name="remember" id="remember-check" data-theme="d" data-mini="true"><label for="remember-check" >__Remember_Pass__</label></li>
                <li data-mini="true"><a href="test.html" data-ajax="false" >__MSG_Lost_Pass__</a></li>
                <li><button id="submit" data-theme="b" data-icon="check" data-iconpos="right" >__Login__</button></li>                	
            </ul>
           </form>
       	<div><a href="?register" data-role="button" data-theme="e" data-ajax="false" data-transition="flip">__Register__</a></div>
        </div>
	</div>		
</div>

<!-- Dialogs & Alerts -->
<div id="alert-register"  data-role="dialog">
    	<div data-role="header">
        	<h3></h3>
        </div>
        <div data-role="content" data-iconpos="left">
	        <p></p>                    
        </div>
</div>
<script type="text/javascript">
Cobra.install();
$(document).ready(function(){
    lang.start({flags:true});
    $('form').submit(function(e){
    	e.preventDefault();
    	$.ajax({
    		url:"php/validate.php",
    		type:'POST',
    		data:$('input').serialize()
    	})
    	.done(function(msg) { 
    		var val = jQuery.parseJSON(msg);
    		$('p').html(val.msg); 		
    		if(val.error==0){
    			location.href=""; 
    		    location.reload();
    		}else
    			$.mobile.changePage('#alert-register'); 
    	});
    });	
    $('#options-finish').click(function(){
          
    });
    $('#options-lang').change(function(e){
        e.preventDefault();
    })
});
</script>
</body>
</html>
