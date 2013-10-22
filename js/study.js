var Study = new Cobra.Class({
	   
	__init__: function(self, project){
	    self.project = project;
	    self.cards = null;
	    self.results = null;
	    self.cardIndex = 0;
	    self.skippedCards = [];
	    self.wrongCards = []; //actual cards you get wrong will go in here
	    self.activeCard = null; //card we're currently studying
	    
	    self.options = {
	        style: "normal", //"normal" or "invert"
	        mode: StudyMode.NORMAL, //see StudyModes enum
	        shuffle: 'off',
	        writing: 'off',
	        tries: 2
	    };
	},
	
	start: function(self){
	    //grab the options
	    self.options.style = ($('#invert-qa-slider-flip').val()=='off')?"normal":"invert"; //normal and invert
	    //self.options.mode = $('#study-mode').val(); //string telling the studying mode
	    self.options.shuffle = $('#random-options-slider-flip').val();
	    self.options.writing = $('#write-answer-slider').val();
	    //self.options.tries = $().val();
	    
	    $('#home').bind('pageshow',function(){
			$('#project-chart-cards').width('100%');
			$('#project-chart-cards').empty();
			window.setTimeout(self.project.loadCardChart,50);		
		});
	    //now, based on the mode, determine which cards are to be studied
	    var cardsToStudy = []; //fill this with the cards this session will have
	    switch(self.options.mode){
		    case StudyMode.NORMAL:        
		        //grab cards from the project that are eligible to be studied
		        //these are the cards with the lowest repsLeft. May be 0 or higher.
		        //if cards have repsLeft [2,2,5], then subtract 2 (the min) from each to get some to 0
		        //then grab the ones with 0 repsLeft
		        var cardsWithMin = self.project.cards.min('repsLeft', true); //these are the cards with the minimum reps left
		        var minRepsLeft = cardsWithMin[0].repsLeft; //the actual value
		        //subtract the min reps from the rest - so that [2,2,5] would shift to [0,0,3]
		        //this doesn't handle reducing the count by 1 for cards that were NOT studied - that's done at end
		        self.project.cards.forEach(function(card){		        	
		            card.repsLeft -= minRepsLeft;
		            self.updateCard(card);
		        });
		        //the cards in this session are the cardsWithMin - which we already created
		        //but make sure it's not more than the max we can have	        
		        cardsToStudy = cardsWithMin; 
		        break;
		    case StudyMode.CRAM:
		        //get every single card in the project regardless of how well you know it
		        //don't need to change reps since the "moment of reckoning" will come for every card	        
		        cardsToStudy = self.project.cards;
		        
		        break;
		    case StudyMode.PERFECTION:
		        //project may have list of cards the user got wrong last time; in that case, study JUST them
		        //this is outside the whole leitner workflow (may have many cards that are rank A, not just wrong cards) so don't change any reps
		        //we should have already checked if there even are any cards (if there aren't the corresponding menu item would have been disabled)
		        cardsToStudy = self.project.wrongCards.randomize(); //the order of this has not been randomized (same cards, just the container is different); don't want them showing up in the same order
		        break;
	    }
	    //we've decided which cards to study
	    self.cards = cardsToStudy;
	    
	   	//shuffle the project's cards
	    if(self.options.shuffle=='on'){
			self.cards=self.cards.randomize();			
		}
		
	
	    self.results = new Array();   
	    //init click on show button, which will show answer	    
	    
	    self.writeAnswer();    	
    	$('#study-input-answer-submit').submit(function(e){
    		e.preventDefault();
    	});   	
	    $('#flip-card').click(function(){
			$('.line').show();	
			if(self.options.style == "normal"){
		        //question & answer in appropriate fields
		        self.setStudyText(self.activeCard.answer,'answer');
		    }
		    else{
		        //in flipped fields
		        self.setStudyText(self.activeCard.question,'answer');
		    } 						       
         		
         	$('#study-textarea-answer').show();
         	$(this).hide();
			window.setTimeout(function(){$('.study-main-answer').show();},500);
		});	  
		
			 
	    //init quit button
	    $('#study-quit').oneClick(function(){
	        self.end();    
	    });
	     
	    //load first card
	    self.cardIndex = 0;
	    self.loadCard();
	},
	
	loadCard: function(self, card){
	    //if there's no card, get the one at the current card index
	    if(!card)
	        card = self.cards[self.cardIndex];
	        
	    self.activeCard = card;
	    	    
	      
	    //update page title (Card x of y)
	    //cardindex +1 to make it human-readable: start at 1, end at length instead of start at 0
	    var title='Flashcard '+(self.cardIndex+1)+' de '+self.cards.length;
	    $('#study-progress-counter').html(title);
	    $(document).attr('title', title);
	     
	    
	    //put stuff in
	    //TODO rethink this... it can get a bit jerky
	    if(card.imageURL){
	         //show image
	         $('#study-image').attr('src', card.thumbImage('m'));
	         $('#study-image-div').fadeIn();
	    }
	    else{
	         $('#study-image-div').fadeOut();
	    }
	    
    	//Hide Answer DIV
    	$('#study-textarea-input-answer').hide();
    	$('.study-main-input').hide();
    	
	    //Options in Writing mode
	    if(self.options.writing=='on'){
	    	$('#study-answer-text h3').html('');
	    	$('#study-answer-text').show();
	    	$('.line').show();
	    	$('#flip-card').hide();
	    	//remove active state from the studying buttons... they tend to "stick" in active state
	    	//for some reason it doesn't work if called immediately, put it off a bit
	    	window.setTimeout(function(){$('.study-main-input').find('a').removeClass('ui-btn-active');},100);
	    }else{
	    	$('#flip-card').show();
	    	$('.line').hide();
	    	$('#study-answer-text').hide();
	    		    //remove active state from the studying buttons... they tend to "stick" in active state
	    //for some reason it doesn't work if called immediately, put it off a bit
	    	window.setTimeout(function(){$('.study-main-answer').find('a').removeClass('ui-btn-active');},100);
	    } 
	    if(self.options.style == "normal"){
	        //question & answer in appropriate fields
	        self.setStudyText(card.question,'question');
	    }
	    else{
	        //in flipped fields
	        self.setStudyText(card.answer,'question');
	    }
	    
	    
	    //studying result buttons (did you know or not)
	    $('.study-result-yes').oneClick(function(){
	        //alert the card the user knew it
	        self.studiedCard(card, StudyResult.YES);
	    });
	    $('.study-result-sort').oneClick(function(){
	        self.studiedCard(card, StudyResult.SORT_OF); 
	    });
	    $('.study-result-no').oneClick(function(){
	        self.studiedCard(card, StudyResult.NO);    
	    });
	    
	    //skip button
	    $('#study-skip').oneClick(function(){
	        self.skippedCards.add(card);
	        self.studiedCard(card, StudyResult.SKIPPED);
	    });	    

	},
	
	studiedCard: function(self, card, result){
	    card.studied(result); //updates the rank & therefore reps left
	    self.results.add(result);
	    if(self.options.writing=='on'){
	    	$('#study-textarea-input-answer').hide();
    		$('.study-main-input').hide();
	    	$('#study-input-answer').val('');
	    }else{
	    	$('#flip-card').show();
	    	$('.study-main-answer').hide();
	    	$('.line').hide();
	    	$('#study-textarea-answer').hide();
	    }	    	   	    
	    if(result == StudyResult.NO){
	        //you didn't know it; save it in our list of wrong cards so you can re-study next time
	        //TODO: instead of storing results, and cards wrong, just save an assoc array of card: result so you can count # cards and figure out which cards got which ranking all at once
	        self.wrongCards.add(card);
	    }
	    
	    self.cardIndex++;
	    
	    self.updateCard(card); //Update Rank in DB
		
	    //are we out of space?
	    if(self.cardIndex >= self.cards.length){
	        //session finished
	        self.end();
	    }
	    else{
	        //more cards; load those
	        self.loadCard();
	    }
	},
	
	/**
	 * Changes the text in #study-textarea. 
	 * @param {String} html  what to put in there - usually question or answer.
	 */
	setStudyText: function(self, html, destiny){
	     var id='#study-textarea-'+destiny;
	     $(id+' h1').html(html);	          	         
	},

	//Update card's rank in Database		
	updateCard: function(self,card){
		//Update Database
		if(card.rank==Rank.NO)
			card.rank=Rank.A;
	    $.ajax({
			url:'php/setRankCard.php',
			type:'POST',
			data:{'projectId':self.project.id,'id':card.id,'rank':card.rank.id,'repsLeft':card.repsLeft,'action':action.EDIT.id}
		}).done(function(msg){
		});
	},
	
	//Mode Write answer
	writeAnswer: function(self){
		var i=self.options.tries;
    	var answer;      	  	
    	$('#study-input-answer-submit').oneClick(function(){
    		$input=$('#study-input-answer');
	    	if($input.hasClass(MISSING)){
	    				$input.removeClass(MISSING);
			}
    		    		
    		if(self.options.style == "normal"){
		        //question & answer in appropriate fields
		        answer=self.activeCard.answer;
		    }
		    else{
		        //in flipped fields
		        answer=self.activeCard.question;
		    }
		    
		    //La respuesta escrita es idéntica a la base de datos
		    //Siguiente palabra   		    	
    		if($input.val()==answer){	    				
	    			i=self.options.tries;
	    			self.studiedCard(self.activeCard, StudyResult.YES);
	    			$('#study-answer-text h3').html('');	    			   			
    		}else{
    			if(i>0){
    				$('#study-answer-text h3').html(i+' '+MSG_JS.MSG_tries);
	    			$input.addClass(MISSING);
	    			i--;
    			}else{
    				i=self.options.tries;
				    self.setStudyText(answer,'input-answer');					    				       	         
		         	$('#study-textarea-input-answer').show();  
	    			window.setTimeout(function(){$('.study-main-input').show();},500);
	    		}     			 			
    		}
    	});	
	},
	
	end: function(self){
	    //update the study session end page (switch when we're all done)

	    //put in proper counts
	    $('#result-yes-count').html(self.results.count(StudyResult.YES));
	    $('#result-sort-count').html(self.results.count(StudyResult.SORT_OF));
	    $('#result-no-count').html(self.results.count(StudyResult.NO));
	    $('#result-skipped-count').html(self.results.count(StudyResult.SKIPPED));
	    $('#result-total-count').html(self.results.length);
	    
	    //switch to the study session end page
	    
	    $.mobile.changePage('#study-session-end');    
	    $('#study-textarea-input-answer').hide();
    	$('.study-main-input').hide();
	    $('#study-input-answer').val('');
	    $('#study-answer-text h3').html('');
	    
	    //for each card that WASN'T studied, reduce its sessions left by 1
	    //cards that were skipped count as not studied too. their sessions left should remain at 0
	        //and by making it one less, or zero (whatever's bigger), this does that
	    var studiedNotSkipped = self.cards.subtract(self.skippedCards);
	    var notStudied = self.project.cards.subtract(studiedNotSkipped); //not studied and not skipped
	    notStudied.forEach(function(card){
	        //reduce repsLeft
	        card.repsLeft = Math.max(card.repsLeft - 1, 0); //so it's 0 at minimum
	    });
	    
	    //for cards the user got wrong, let the project know so that the user can study just those next time
	    self.project.wrongCards = self.wrongCards;
	    
	    
	}
	    
});
