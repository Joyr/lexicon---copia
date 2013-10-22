/**
 * Like Controller in desktop Cabra.
 * All global functions you'll need to use are in the chevre object: chevre.func() 
 * 
 * Accessible:
 * Project[] projects
 */

var chevre = new Singleton({
    
__init__: function(self){
    self.projects = [];     
    self.activeProject = self.p = null;
    
    self.defaultOptions = {
        maxCardsPerSession: 50,     //int
        fontSize: FontSize.MEDIUM, //FontSize: int
        shuffleBeforeStudying: true, //boolean
        swipeToSkip: true, //boolean
        askFeedback: true,
        theme: Theme.BLUE
    };
    self.options = {};
},

/**
 * Called when the program is first booted up. 
 */
start: function(self){
    //load options & projects
    self.load();
    
    //now that we're done... at this point not much is happening
        
},

getProjectByID: function(self, id){
    return self.projects.find(function(project){
        return project.id == id;
    })    
},
    
addProject: function(self, project, dontSave){
    self.projects.push(project);
    
    //TODO: maybe sort projects when a new one's added? but that involves adding the li to a custom spot...

    //add to view - grab template and modify it
    var li = getClonedTemplate("template-project");
    li.find(".project-name").html(project.name);
    //show desc if there is one; else show nothing
    //li.find(".project-description").html(orIfFalsy(project.description, "")); //project.numCards() + " Cards"));
    li.find(".project-card-count").html(project.numCards()); //bubble showing # of cards
    
    li.find(".project").click(function(){
        //main buttons
        self.loadProject(project);
    });
    
    //click on the gear OR long-tap for options
    li.find(".project").bind('taphold', function(event){
        li.find(".project-options").trigger('click');   
        event.preventDefault();
    });
    li.find(".project-options").click(function(){
        //give that dialog this project so it can access it
        $('#project-edit-dialog').jqmData('project', project);
        
        //rename the dialog
        $('#project-edit-header').html(project.name);
    });
    li.attr('id', 'project-div-' + project.id);
    $('#project-list').append(li).listview('refresh');   
    
    if(!dontSave)
        self.save(project); 
},

/**
 * Opens up a project for studying, etc. 
 */
loadProject: function(self, project){
    //when we loaded Chevre, the project's cards weren't unpacked; they were left raw
    //if they're STILL raw, it's the first time we viewed - unpack them
    if(project.raw){
        project.decompress();
    }
    project.load();
    self.activeProject = self.p = project; //self.p is shortcut
},

removeProject: function(self, project){
    self.projects = self.projects.subtract(project);
    if(self.activeProject == project){
        self.activeProject = self.p = null;
    }
    
    //remove from view
    $('#project-div-' + project.id).remove();
    $('#project-list').listview('refresh');
    
    self.save();
},

/**
 * Takes the cards from mergeFrom and places them into mergeTo's cards list. Then mergeFrom is deleted.
 * @param {Project} mergeFrom   the project whose cards to take. It will be deleted.
 * @param {Project} mergeTo     the project who will receive the cards. 
 */
mergeProjects: function(self, mergeFrom, mergeTo){
    //they are automatically decompressed now (0.4.1)
    mergeTo.cards.add(mergeFrom.cards);
    self.removeProject(mergeFrom);
    self.loadProject(mergeTo); //open it up for viewing
},

save: function(self, project, dontSync){
    console.log("Saving...");
    
    //give this function a raw project and it'll return a compressed version of it.
    var compressProject = function(project){
        //this is a project that contains cards which need to be compressed
        
        //if project is still raw (wasn't unpacked)
        if(project.raw){
            //cards weren't unpacked into full objects; so lets just re-save them as raw
            return compress(project, [
                'name',
                'description',
                {
                    //cards should just be given as raw
                    rawCards: function(compressedProject, packedRawCards){
                        compressedProject.cards = packedRawCards;
                    }
                }
            ]);
        }
        
        return compress(project, [
            'name',
            'description',
            { cards: function(compressedProject, rawCards){
                //rawCards = raw cards within project - array
                //compress each member of the cards array
                return rawCards.map(function(rawCard){
                    return compress(rawCard, [
                        'question',
                        'answer',
                        'imageURL',
                        'repsLeft',
                        { 'rank': function(compressedCard, rankObj){ 
                                return rankObj.name; //just "A" for Rank.A  
                            }}
                    ]);  
                });   
            }}  
        ]);
    };    
    
    //they may have sent us a project to save - in that case, save ONLY that
    if(project && $.store.get(SL_user+'$'+SL_KEYS.PROJECTS)){
        //find that project out of storage, re-compress it, and re-save
        var storedProjects = $.store.get(SL_user+'$'+SL_KEYS.PROJECTS);
        var didResave = false; //will be set to true if we re-saved any project (will stay false if it wasn't found')
        for(var i=0; i<storedProjects.length; i++){
            if(project.equals(storedProjects[i])){
                //right index; re-assign
                storedProjects[i] = compressProject(project);
                //re-save
                $.store.set(SL_user+'$'+SL_KEYS.PROJECTS, storedProjects);
                didResave = true;
                break;
            }
        }
        
        if(!didResave){
            //they haven't reached it so far, which means that there's no matching project. so add a new one
            storedProjects.add(compressProject(project));
            //re-save & upload
            $.store.set(SL_user+'$'+SL_KEYS.PROJECTS, storedProjects);
        }
        
        if(!dontSync)
            self.syncUpload();
        return storedProjects;     
    }
    
    //otherwise, just save it all
    
    //UGLY CODE AHEAD
    var compressed = compress(self, [
        {
            'projects': function(compressed, val){ //compressed is chevre
                //val = array of raw projects
                //go through each project in array
                return val.map(compressProject); //see above func
            }
        }
    ]);
    
    //store it
    $.store.set(SL_user+'$'+SL_KEYS.PROJECTS, compressed.projects);
    self.syncUpload();
    
    return compressed; //if they want to see it
},

load: function(self){
    console.log("Loading...");
    
    /* //device id is useless for now
    //if this is a new install, load certain necessary things / save certain things
    if(!$.store.get(SL_KEYS.DEVICE_ID)){
        //set a new device id; this is pretty much read-only so it'll be the same forever on this device
        //device id is unique to this device
        //TODO: find some way to make a more personalized id (perhaps let user set it themselves in sync menu)
        //default is just random num
        var id = Number.random(1e8);
        $.store.set(SL_KEYS.DEVICE_ID, id);
    }
    */
    
    //OPTIONS
    self.loadOptions();
    
    
    //PROJECTS

    
    //if there's sync, then grab that; otherwise get it from locally
    //TODO: rethink this method (perhaps prefer local stuff)
    if(self.syncActivated()){
        //projects in the table are stored as pure (not compressed), so we can load them directly
        self.syncDownload();
    }
    else{
        //load as normal
        self.loadLocally();    
    }
},

/**
 * Loads cards from the local storage. 
 */
loadLocally: function(self){
    var stored = $.store.get(SL_user+'$'+SL_KEYS.PROJECTS);
    if(truthiness(stored))
        self.unpackProjects();
    else
        console.log('none')
        //self.loadDefaultProjects();        
},

/**
 * Takes the projects from straight stored form and converts to raw form. They will be fully converted to normal form when loaded.
 */
unpackProjects: function(self){
    var rawProjects = $.store.get(SL_user+'$'+SL_KEYS.PROJECTS);
    //UGLY CODE AHEAD
    var goodProjects = rawProjects.map(function(rawProj){
        return decompress(rawProj, "Project",
        [ 'name', 'description' ], //in init
        [ 
            { cards: function(goodProj, rawCards){
                    //obj is the good object, value is the raw cards
                    //NEW: store them as raw until the project is loaded; THEN convert them
                    goodProj.raw = true; //not converted yet
                    goodProj.rawCards = rawCards;
                }}
        ]);    
    });
    
    //add in the projects
    goodProjects.forEach(function(project){
        self.addProject(project, true); //don't save at all
        
        //decompress the project to normal
        project.decompress();
    });
},

/**
 * Loads the default projects & cards.
 * @param {Object} self
 */
loadDefaultProjects: function(self){
    console.log("Defaults...");
    //temporary!
    var proj = new Project("Sample Flashcards (try me out!)", "Try out Cabra with this sample set of flashcards!");
    var cards = [
         new Card("What animal is this?", "A goat", "http://imgur.com/wSyzk7l.png"),
         new Card("sin²θ =","2sinθcosθ"),
         new Card("What color is the sky?", "Blue"),
         new Card("'Goat' in Spanish", "'Cabra'")
    ];
    cards.forEach(function(card){
        proj.addCard(card);    
    });
    self.addProject(proj);
},

loadOptions: function(self){
    //grab options from storage
    var storedOptions = $.store.get(SL_user+'$'+SL_KEYS.OPTIONS);
    //if there are no options (nothing stored), use defaults
    //merge defaults with stored so that anything that WASN'T set is just set to default
    self.options = $.extend({}, self.defaultOptions, storedOptions);
    self.updateOptions();
    
    //init the options dialog
    var options = self.options;
    
    /**
     * ADD A NEW LINE WHENEVER YOU ADD A NEW OPTION!
     * Also add to chevre.defaultOptions at top. 
     * Also add to chunk below - saving options
     */
    $('#options-panel').oneBind('panelbeforeopen', function(){
        //set the current value of any form elements to whatever's stored
        $('#options-max-cards').val(options.maxCardsPerSession).slider('refresh');
        var shuffleValue = options.shuffleBeforeStudying ? "on" : "off";
        $('#options-shuffle').val(shuffleValue).slider('refresh');
        var swipeValue = options.swipeToSkip ? "on" : "off";
        $('#options-swipe').val(swipeValue).slider('refresh'); 
        $('#options-theme').val(options.theme).selectmenu('refresh');
        var fbValue = options.askFeedback ? "on" : "off";
        $('#options-feedback').val(fbValue).slider('refresh');
        
        //font size - see what matches
        var size = options.fontSize;
        var fontName = "MEDIUM"; //"SMALL", "MEDIUM", etc.
        Object.keys(FontSize,function(key, value){
          if(value == size) fontName = key;      
        });
        $('#options-font-size').val(fontName).selectmenu('refresh');
    });
    
    //save when "done" is clicked
    $('#options-finish').oneClick(function(){
        //get stuff from the options page and store to vars
        options.maxCardsPerSession = $('#options-max-cards').val().toNumber();
        options.fontSize = FontSize[$('#options-font-size').val()]; //looking up in the enum
        options.shuffleBeforeStudying = $('#options-shuffle').val() == "on"; //true if it's on, fals e if off
        options.swipeToSkip = $('#options-swipe').val() == "on";
        options.theme = $('#options-theme').val();
        options.askFeedback = $('#options-feedback').val() == "on";
        
        self.saveOptions();
        //changeLanguage($('#options-lang').val());
        $('#options-panel').panel('close'); //FIXME i set the data-rel=close attribute on the Done button (this one), but it won't close as long as the button has an id attribute
    });
},

/**
 * Call this independently of save().
 */
saveOptions: function(self){
    $.store.set(SL_user+'$'+SL_KEYS.OPTIONS, self.options);
    self.updateOptions();
},

/**
 * Call when initializing page (load) and after saving options.
 * This re-loads any things dynamically that were changed (i.e. theme). 
 */
updateOptions: function(self){
    //theme... update the theme css file
    $('#theme-stylesheet').attr('href', sprintf("css/themes/%s.css", self.options.theme));
},

/**
 * Returns true if the user's set up sync, false otherwise 
 */
syncActivated: function(self){
    return $.store.get(SL_user+'$'+SL_KEYS.SYNC_KEY) != undefined;    
},

syncUpload: function(self){
    if(self.syncActivated() == false){
        //sync not set up
        return;
    }
    
    console.log("Uploading...");
    //pass the passcode & projects (strings, stored in browser) to php, which will store in table
    //TODO: instead of storing pure form, store it compressed
    $.post(
        syncBaseURL + 'sync-upload.php',
        {
            'passcode': $.store.get(SL_user+'$'+SL_KEYS.SYNC_KEY),
            'projects': JSON.stringify($.store.get(SL_user+'$'+SL_KEYS.PROJECTS)) //what's nice is that this won't store undefined values
        },
        function(data){
             //it's just 1 (literally just that number)
            //console.log(data);
        }
    );
},

/**
 * If the user has a sync key, grabs data from the server and saves it. If there is no data from the server, in instead uploads the data we have. See the body for explanation.
 */
syncDownload: function(self){
    if(self.syncActivated() == false){
        //sync not set up
        return;
    }
        
    console.log("Downloading...");
    //pass the passcode; get projects in return
    $.ajax({
        type: 'POST',
        url: syncBaseURL + 'sync-download.php',
        data: {
            'passcode': $.store.get(SL_user+'$'+SL_KEYS.SYNC_KEY)
        },
        
        success: function(data){
            //data is some HTML; the projects are wrapped in a <pre> tag
            var projectsString = $(data.trim()).html(); //there may be some spaces before the actual text; remove those, then get the json-encoded projects out
            //console.log(projectsString);
            projectsString = projectsString.unescapeHTML();
            try{
                var projects = $.parseJSON(projectsString);
            }
            catch(error){
                //Sometimes there's a sort of error when downloading (usually when the last machine to upload didn't finish or do it right)
                console.log("Sync download failed");
                console.log(projectsString);
                console.log(error);
                
                //don't do anything; fall back to local storage
                self.loadLocally(); //this may or may not be already done (don't think  it is - we need to unpack our projects and all ourself)
                return;
            }
            
            //so it did work
            console.log("Download successful!");
            if(projects == null){
                //there's no corresponding data on the server
                //so don't do anything
                //this would most likely happen if we're setting up sync for the first time, and there's no data on server
                //instead, let's upload our data so that future syncing will work
                chevre.syncUpload(); //TODO: reconsider
            }
            else{
                //save it
                $.store.set(SL_user+'$'+SL_KEYS.PROJECTS, projects);
                //self.save(undefined, true); //no project; and don't sync it
                
                //reload the page
                //<TODO>: remove all projects and load in the new ones
                //TODO: make this more efficient - keep a tag of when we synced; if that's more recent than this then don't sync
            }
            
            self.unpackProjects(); //they've been stored away but now load into memory as raw
        },
        
        timeout: 3000, //how many ms to wait before declaring that it failed; TODO: tweak this
        error: function(jqXHR, textStatus, errorThrown){
            //sync failed! load normally (from local storage)
            console.log('Download failed!');
            console.log(textStatus);
            self.loadLocally();
        }
    })
}
        
      
});
