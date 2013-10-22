/*
 * Called at the ABSOLUTE beginning.
 */

Cobra.install();

/*
 * Called when the app is fully loaded.
 */

     	
$(document).ready(function(){  
    //$.mobile.loading( "hide" );
    //if we're already on home page, load immediately; else go home and load there
    if($.mobile.activePage.attr('id') == "home"){
         initClicks(); 
         chevre.start();
    }     
    else{
         $.mobile.changePage('#home', {
              changeHash: true
         });
         
         initClicks();       
            
         $('#home').on('pageshow', (function(){
              chevre.start();
              location.hash = "#";
         }).once());         
    }
	lang.start();
	lang.getLanguage();
    //TODO: add option where they can enter a URL of a custom background, and if they do the following lines will be run
    
    //load custom background
    //$('#home').css('background-image','url(http://sickr.files.wordpress.com/2012/03/brave.jpg)');

    
});

/**
 * Template: Called when page with ID #pageid is loaded. 
 */
$(document).delegate('#pageid', 'pageinit', function(){
    
}); 