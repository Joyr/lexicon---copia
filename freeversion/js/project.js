var Project = new Class({
    
__init__: function(self, name, description){
    self.name = name;
    self.description = orDefault(description, null); //TODO make this undefined by default so that it won't take up space when stored and there's nothing there
    //self.lastStudied = null;
    self.id = Math.floor(Math.random() * 1000);
    self.cards = [];
    self.session = null;
    self.wrongCards = null; //cards they got wrong last session; temporary variable, filled in by session
},

equals: function(self, other){
    return self.name == other.name;
},

addCard: function(self, card){
    self.cards.add(card);
    
    //chevre.save(self);
},

numCards: function(self){
    if(self.raw){
        return self.rawCards.length;
    }    
    else{
        return self.cards.length;
    }
},

/**
 * Randomizes the order of all cards in the project. 
 */
shuffle: function(self){
    self.cards = self.cards.randomize();
    self.save();
},

resetCards: function(self){
    self.cards.forEach(function(card){
       card.setRank(Rank.A); 
    });
},

flipCards: function(self){
    //make all cards' question the answer and vice versa
    self.cards.forEach(function(card){
        var question = card.question;
        var answer = card.answer;
        card.question = answer;
        card.answer = question;    
    });
    self.save();
},

/**
 * Shows or hides the description based on whether or not there is one set. 
 */
showOrHideDescription: function(self){
    if(self.description){
        $('#project-description').html(self.description).show();
        $('#project-description-entry').hide();
        $('#project-description-entry-text').val(''); //clear the entry field
    }
    else{
        //don't have it
        $('#project-description').hide();
        $('#project-description-entry').show();
        $('#project-description-entry-button').oneClick(function(){
            //grab description text 
            var text = $('#project-description-entry-text').val();
            text = prettify(text); //make it show nicely in HTML
            if(text){
                self.description = text;
                self.showOrHideDescription(); //that'll do the first case
                self.save();
            }
        });
    }
},

clearDescription: function(self){
    self.description = null;
    self.showOrHideDescription();
    self.save();  
},

load: function(self){
    //load home page
    $('#project-name').html(self.name);
    $(document).attr('title', self.name);
    
    //$('#study-session-init-button').toggle(self.cards.length > 0);
    
    //show description text if there is any; otherwise show the description entry stuff
    self.showOrHideDescription();
    
    //handle clicks
    
    //create card button in the card creator page (where the cards are ACTUALLY created)
    $('.create-card-button').oneClick(function(){
        //grab the text from the fields and put it in a card
        var questionField = $('#create-card-question');
        var answerField = $('#create-card-answer');
        var imageField = $('#create-card-image');
        var question = questionField.val();
        var answer = answerField.val();
        
        
        //must provide question & answer
        if(question && answer){
            //manipulate question and answer to make them prettier
            question = prettify(question);
            answer = prettify(answer);
            
            var card = new Card(question, answer);
            
            //if they specified an image, have it be added and then re-save (async)
            //do it now anyway (if they added an image, we'll just re-save later)
            if(imageField.val()){
                 imageField.uploadImage(function(imageURL){
                      //called later
                      card.imageURL = imageURL;
                      self.save();
                      console.log(imageURL);
                 });
                 //TODO maybe upload each time they change the image (or just read it) so we can show a preview
            }
            
            self.addCard(card);
            self.save();
            
            //clear the fields
            questionField.val('');
            answerField.val('');
            imageField.val('');
            
            //give page focus to question field
            questionField.focus();            
        }
        else{
            //they omitted one or both
            if(!question) questionField.focus();
            else if(!answer) answerField.focus();
        }

    });
    $('#cancel-create-card-button').oneClick(function(){
        //empty fields and get back
        $('#create-card-question').val('');
        $('#create-card-answer').val('');  
        $("#create-card-image").val(''); 
    });
    
    //create card button in batch creator
    $('#batch-create-button').oneClick(function(){
        //grab delimiter - from select
        var delimiter = $('#batch-style').val();
        //grab raw text containing all the cards
        var rawText = $('#batch-text').val(); //contains "Q-A \n Q-A \n Q-A ..."
        
        //break into individual cards
        var rawCards = rawText.split('\n'); //now ["Q-A", "Q-A", ...]
        var malformedCards = []; //raw strings that don't work will be stored in this
        rawCards.each(function(rawCard){
             //TODO put this in the Card class
            //Q and A are separated by some delimiter; what they told us should be delimiter
            var split = rawCard.splitOnce(delimiter); //[Q, A]
            if(split.length < 2){
                //malformed; skip this
                //store it in the malformed cards and leave it in the text box when we're done
                malformedCards.push(split);
                //<TODO>: if all or most of the cards are malformed, assume the delimiter's wrong and intelligently guess which one is the right one
                return;    
            }
            else{
                //properly formed
                //trim the question and answer and assign to a card
                var card = new Card(split[0].trim(), split[1].trim());
                self.addCard(card);
            }            
        });
        
        //cleanup 
        self.save();
        //empty the text area and put in any malformed ones - so they can fix it and re-try
        var textarea = $('#batch-text');
        textarea.val(malformedCards.join("\n"));
        textarea.focus();     
        
        //TODO: prevent the button from going back to main immediately; only go there programmatically if all cards are well-formed
    });
    
    //start studying button in the study init page
    $('#study-session-start').oneClick(function(event){
        //make a session and start it
        self.session = new Session(self);
        self.session.start(); 
    });
    
    //this will be called the page loaded
    $('#project-home').oneBind('pageshow', function(){
        //show chart with cards
        self.loadCardChart();
        
        //enable/disable study button (the one to start initialization) if there are no cards
        var disable = self.cards.isEmpty(); //bool
        //$('#study-session-init-button').button(disable ? 'disable' : 'enable');
        //disable each of these
        var buttonIDsToDisable = [ '#study-session-init-button', '#card-manager-button', '#backup-launch-button', '#project-shuffle', '#project-reset', '#project-flip' ];
        buttonIDsToDisable.forEach(function(id){
            disable ? $(id).hide() : $(id).show();
            //$(id).toggleClass('ui-disabled', disable);
        });
        
        //the top/bottom buttons may have been removed so you may see square edges. Re-round them
        $('.project-main-controlgroup').controlgroup();
    });    
    $('#card-manager').oneBind('pageshow', function(){
        //update card manager list
        self.updateManager();
    });
    /*$('#card-viewer').oneBind('pageshow', function(){
          // set up click/tap panels
          $('.flip-click').click(function() {
               $(this).toggleClass('flip');
          });
    });*/
    $('#study-session-init').oneBind('pageshow', function(){
        //user given choice to study only cards they got wrong last time
        //but if no cards were wrong, or there WAS no last time (this is first run since opening Cabra), disable it
        var wrongCardsItem = $('#study-mode-perfection');    
        var modeSelect = $('#study-mode');
        
        if(self.wrongCards && self.wrongCards.length > 0){
            //there are some cards we could study
            wrongCardsItem.removeAttr('disabled');
        }
        else{
            //no cards we could study, so no point; disable that choice
            wrongCardsItem.attr('disabled', 'disabled');
            
            //if they had chosen to study perfection and now it got disabled, change the choice
            if(modeSelect.val() == StudyMode.PERFECTION){
                modeSelect.val(StudyMode.NORMAL); //will be refreshed later
            }
        }
        
        //refresh study mode select menu to reflect change
        modeSelect.selectmenu('refresh', true); //true is to rebuild it
    });
    
    
    //project manager & more tools
    $('#project-shuffle').oneClick(self.shuffle);
    $('#project-reset').oneClick(self.resetCards); //that'll save too
    $('#project-flip').oneClick(self.flipCards);
    $('#project-clear-description').oneClick(self.clearDescription);
    $('#project-edit').oneClick(function(){
        //give that dialog this project so it can access it
        $('#project-edit-dialog').jqmData('project', self);
        
        //rename the dialog
        $('#project-edit-header').html(self.name);        
    });
    
    
    //now at the very end...
    //pre-load all images so that they're cached - so it's quicker to load them when you go to study
    var img = new Image();
    self.cards.forEach(function(card){
     if(card.imageURL){
          img.src = card.imageURL;
     }     
    });
},

updateManager: function(self){
    //show the spinny thingy
    //$.mobile.showPageLoadingMsg();
    
    //empty card manager and refill
    var list = $('#card-manager-list');
    list.empty();
    
    //now before we add anything, disable searching until we're done
    var searchBar = $('#card-manager').find('.ui-input-text'); //the text field
    searchBar.attr('disabled','disabled');
    var originalSearchBarText = searchBar.attr('placeholder'); //restore later
    searchBar.attr('placeholder',MSG_JS.MSG_wait); //TODO maybe remove this
    
    /*
     * We're being super cheap here:
     * First put in a dummy li and enhance it, and copy the enhanced HTML. That's what each LI will look like.
     * Then break the card list into chunks.
     * Add each card in a chunk. Use the enhanced LI template we got earlier.
     * Take a short break so it doesn't freeze up.
     * Continue with another chunk.
     */
    
    //add dummy li to see what it's like when enhanced
    var template = getClonedTemplate('template-card');
    list.append(template);
    list.listview('refresh');
    var liFixedHTML = list.html(); //this is how jqm enhances it
    list.empty();
    
    var chunkList = self.cards.inGroupsOf(CHUNK_SIZE); //breaks into a list of card chunks
    var chunkNum = 0;
    chunkList.forEach((function(chunk){
        //chunk contains a bunch of cards; add them all on
        chunk = chunk.compact(); //remove nulls at end
        chunk.forEach(function(card){
            //add in one card
            var li = $(liFixedHTML); 
            card.fillLI(li);
            
            //handle clicks
            //<TODO>: make this more efficient - attach handler to list with scope, not to each individual button 
            li.find('.card-manager-edit-button').oneClick(function(){
                //edit this card
                //load the fields with q/a
                $('#edit-card-question').val(deprettify(card.question));
                $('#edit-card-answer').val(deprettify(card.answer));
                
                //TODO make the label say "Add" if there's no image, "Change" if there is (EASY polish)
                if(card.imageURL){
                     $('#edit-card-if-image').show();
                     //show the image in the preview
                    $('#edit-card-image-preview').attr('src', card.imageURL);    
                }
                else{
                     //hide that whole thing
                     $('#edit-card-if-image').hide();
                }
                
                
                $('#edit-card-finish-button').oneClick(function(){
                    //finish & save
                    var question = $('#edit-card-question').val();
                    var answer = $('#edit-card-answer').val();
                    var imageField = $('#edit-card-new-image');
                    var imageURL = imageField.val(); //a NEW one
                    question = prettify(question);
                    answer = prettify(answer);
                    if(!question || !answer) return false; //make sure not empty
                    card.question = question;
                    card.answer = answer;
                    
                    //save & update
                    self.save();
                    card.fillLI(li);
                    
                    //if there's an image, try adding that
                    if(imageURL){
                        imageField.uploadImage(function(imageURL){
                                //called later
                                card.imageURL = imageURL;
                                self.save();
                                card.fillLI(li);
                               
                                //TODO make it actually show up (this only fails when the image is big??)
                                //self.updateManager(); //this makes us redo the WHOLE list - wasteful, although it gets the job done
                           });
                         //clear that field
                         imageField.val('');
                    }
                });
                
                $('#edit-card-image-clear').oneClick(function(){
                    //remove image from card
                    card.imageURL = undefined;
                    card.fillLI(li);
                    self.save();     
                });
                
                $('#edit-card-delete-button').oneClick(function(){
                    //remove this card
                    self.cards = self.cards.subtract(card);
                    self.save();
                    //remove this div
                   li.remove();
                   $('#card-manager-list').listview('refresh');
                });   
            });
                    
            list.append(li);                
        });
        
        if(chunkNum == 0){
             //if this is the FIRST chunk, prettify the listview now so that user won't see rounded corners (they'll see the first bit prettified; the rest will be unprettified but they won't see that immediately)
            list.listview('refresh'); 
        }
        

        chunkNum++;
        //list.listview('refresh');  //this slows it down a bit by re-prettifying each and every li
    }).lazy(BREAK_TIME)); //after each chunk, pause for a bit
    
    //lazy will make it take a bit of time; run full refresh once all are done
    var delay = chunkList.length * (BREAK_TIME + 100); //100: provide a bit of buffer for function to run
    (function(){ 
         //anything to run once we're all done
         //re-enable search bar
         searchBar.removeAttr('disabled');
         searchBar.attr('placeholder',originalSearchBarText);         
         
         list.listview('refresh');  //remove rounded edges and combine into list a bit later (else it'll lag or just not happen)
    }).delay(delay);
},

loadCardChart: function(self){
    if(self.cards.isEmpty()){
        //no cards, draw nothing$
        $('#project-card-chart').empty()
        //$('#project-card-chart').css({ 'height': '25px' }); //otherwise there would be a lot of empty space since the charts force it to be 300px //PROBLEM: after this, the charts stay 25px so it looks weird
        $('#project-card-chart').html(MSG_JS.MSG_no_cards);
        return;
    }
    
    $('#project-card-chart').empty();
    
    //map out how many cards have which rank
    var data = [];
    Object.each(Rank, function(key, value){
        //key is the rank name - like Rank.A, Rank.B, etc.
        //value is the actual object
        //count how much of our cards are that   
        var numCards = self.cards.count(function(card){
            return card.rank == value;    
        });     

        //add on to data - the rank's name and the # of cards
        data.push([ MSG_JS.MSG_rank+" "+value.name, numCards ]);
    });
    //pluralize the title word Flashcard if necessary
    var titleWord = 'Flashcard';
    titleWord += self.cards.length != 1 ? 's' : '';
    
    try{
        $.jqplot('project-card-chart', [data], {
        	animate: true,
	        // Will animate plot on calls({resetAxes:true})
	        animateReplot: true,
            title: self.cards.length + ' ' + titleWord, //can change
            seriesColors: Object.values(Rank).map(function(rank){ return rank.color; }), //the ranks' colors, in order
            // The "seriesDefaults" option is an options object that will
	        // be applied to all series in the chart.
			seriesDefaults:{
	            renderer:$.jqplot.BarRenderer,
				pointLabels: { show: true},
	            rendererOptions: { 
								barMargin:10,
								varyBarColor: true,
								highlightMouseOver: false
								}
				
	        },		       
	        // Show the legend and put it outside the grid, but inside the
	        // plot container, shrinking the grid to accomodate the legend.
	        // A value of "outside" would not shrink the grid and allow
	        // the legend to overflow the container.
	        legend: {
	            show: false
	        },
			axesDefaults: {
				show: false,    // wether or not to renderer the axis.  Determined automatically.
				min: 0,      // minimum numerical value of the axis.  Determined automatically.
				max: null,      // maximum numverical value of the axis.  Determined automatically.
				pad: 2,       // a factor multiplied by the data range on the axis to give the
								// axis range so that data points don't fall on the edges of the axis.
	    	},
	        axes: {
	            // Use a category axis on the x axis and use our custom ticks.
	            xaxis: {
	                renderer: $.jqplot.CategoryAxisRenderer
	            },
				yaxis: {drawMajorGridlines: false, tickOptions:{ show:false}}
	        }  
        });
    }
    catch(ex){
        //This error often thrown when the slices the pie tries to draw are too tiny; eg 1/150 cards has rank A
        console.log(ex);
    }
},

decompress: function(self){
    //map each of the raw cards into an array of fixed cards
    self.cards = self.rawCards.map(function(rawCard){
        //rawCard has question and answer, which is what we're going for
        //also, we stored rank as just a string - so revive that by looking it up
        return decompress(rawCard, "Card",
            [ 'question', 'answer', 'imageURL' ], //recreate faithfully
            [
                'repsLeft',
                { rank: function(goodCard, rawRank){
                    //rawRank contains just the name of the rank; look it up in the Rank object
                    return Rank[rawRank];
                }}
            ]);    
    });
    
    //get rid of raw status
    self.raw = false;   
    delete self.rawCards;     
},

save: function(self){
    chevre.save(self);
}

});
