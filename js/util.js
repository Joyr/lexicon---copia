// JavaScript Document
/*
	Clone LI element for append in List
	@param identify id
	@param return li element
*/
function cloneTemplate(id){return $('#'+id).clone().removeAttr('id').removeClass('hidden');}

/**
 * Works much the same as .click(), except it unbinds any existing click events beforehand.
 * Use this if you want to quickly overwrite the click handler.
 * 
 * Pass just callback - bound to normal click
 * Pass scope & callback - bound like on('click', scope, callback)
 */
$.fn.oneClick = function(scope, callback){
    this.unbind('click');
    if(arguments.length == 1){
        //only 1 arg - that'll be named scope
        this.click(scope);
    }
    else if(arguments.length == 2){
        //2 args - that means to re-bind
        this.on('click', scope, callback);
    }
}

/**
 * Safely reloads the current page. 
 */
function reloadPage(){
    location.href = "#";
    location.reload();
}

/**
 * Given a raw string from a text area or such, makes it more HTML-friendly. 
 */
function prettify(raw){
    raw = raw.replace(/\n/g, "<br>"); //newlines turn to br's
    raw = raw.removeTags('script', 'link', 'img'); //no scripting! that could be evil! and images crash stuff
    //TODO: make images work
    
    //TODO: have some sort of markdown editor/replacer (markItUp)
    //TODO: run prettification on stuff imported from quizlet too
    
    return raw;
};

/**
 * Takes an HTML-friendly string from prettify and de-prettifies it, making it raw again.
 * This should be the EXACT inverse of prettify: deprettify(prettify(str)) = prettify(deprettify(str)) == str 
 */
function deprettify(pretty){
    var raw = pretty.replace(/\<br\>/g,"\n"); //br's turn to newlines
    return raw;
}

/**
 * Works just like bind(), except it unbinds any existing bind events so that only one is active at once.
 * @param {string} event    the type of event
 * @param {function} callback   will be called when the event is triggered 
 */
$.fn.oneBind = function(event, callback){
    this.unbind(event);
    this.bind(event, callback);
}

/**
 * For <input type='file'> elements.
 * This grabs the image that's been uploaded in the input and uploads it to imgur.
 * @param [function(url)]     callback  It will be called with the URL of the image once it's been uploaded. (May fail on old browsers!) For instance, the URL may be "http://imgur.com/asdf.png"
 * 
 * Usage: $('#input').uploadImage(function(url){
 *   //do something with the URL...
 * $('#image').attr('src',url);
 * console.log(url);     
 * });
 */
$.fn.uploadImage = function(callback){
     var file = this[0].files[0];

     // file is from a <input> tag or from Drag'n Drop
     // Is the file an image?
     if (!file || !file.type.match(/^image.+/))
          return;

     // It is!
     // Let's build a FormData object

     var fd = new FormData();
     fd.append("image", file);
     // Append the file   

     //TODO jquery-fy this
     // Create the XHR (Cross-Domain XHR FTW!!!)
     var xhr = new XMLHttpRequest();
     xhr.open("POST", "/lexicon/php/getKey.php");
     // Boooom!
     xhr.onload = function() {
          // Big win!
          // The URL of the image is:          
          var rawURL = $.parseJSON(xhr.responseText);
          //this links to page, we need image link
          //we need to add extension... grab that from file name
          //var chunks = file.name.split(".");
          //var extension = chunks.last();
          //so like "png"
          var url = rawURL.data.link;
          callback(url);
     }
     // Ok, I don't handle the errors. An exercice for the reader.
     // And now, we send the formdata
     xhr.send(fd);   

}  

/**
 * Converts a hex code to RGB. Outputs an array [r,g,b].
 * You can add the hashtag # if you want - not necessary.
 * hexToRGB('#FF0000') -> [255,0,0]
 */
function hexToRGB(hex){
     hex = hex.remove('#');
     var rgb = [ hex.substring(0,2), hex.substring(2,4), hex.substring(4,6) ];
     rgb = rgb.map(function(x){ return x.toNumber(16); });
     return rgb;
}

/**
 * Converts an rgb array [r,g,b] to hex code rrggbb.
 * Does NOT put the hashtag # in front.
 * rgbToHex([255,0,0]) -> 'FF0000' 
 */
function rgbToHex(rgb){
     var hexArray = rgb.map(function(x){ return x.pad(2,false,16); }); //['FF','00','00']
     var hexString = hexArray.reduce(function(x,y){ return x + y});
     return hexString;
}