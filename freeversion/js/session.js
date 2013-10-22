var Session = new Class({
   
__init__: function(self, project){
    self.project = project;
    self.cards = null;
    self.results = null;
    self.cardIndex = 0;
    self.skippedCards = [];
    self.wrongCards = []; //actual cards you get wrong will go in here
    self.activeCard = null; //card we're currently studying
    self.front; //question or answer - whatever's on front of card
    
    self.options = {
        style: StudyStyle.NORMAL, //see StudyStyles enum
        mode: StudyMode.NORMAL //see StudyModes enum
    };
},

start: function(self){
    //grab the options
    self.options.style = $('#study-response').val();//normal and jeopardy
    self.options.mode = $('#study-mode').val(); //string telling the studying mode
    
    //shuffle the project's cards
    if(chevre.options.shuffleBeforeStudying)
        self.project.shuffle();
    
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
        });
        
        //the cards in this session are the cardsWithMin - which we already created
        //but make sure it's not more than the max we can have
        cardsToStudy = cardsWithMin.first(chevre.options.maxCardsPerSession); 
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
    
    //init results - our private use
    self.results = [];
    
    //init click on show button, which will show answer
    $('#show-answer-button').oneClick(function(){
        //hide front side, show back
        //if front was question, show answer, and vice versa
        var html;
        if(self.front == CardParts.QUESTION) html = self.activeCard.answer;
        else if(self.front == CardParts.ANSWER) html = self.activeCard.question;
         self.setStudyText(html);
         
        //hide top, show bottom
        $('.study-main-answer').show(); //slideDown();
        $('.study-main-question').hide(); //slideUp();
    }); 
    //init quit button
    $('#study-quit').oneClick(function(){
        self.end();    
    });
    
        
    
    //studying result buttons (did you know or not)
    $('#study-result-yes').oneClick(function(){
        //alert the card the user knew it
        var card = self.activeCard;
        self.studiedCard(card, StudyResult.YES);
    });
    $('#study-result-sort').oneClick(function(){
         var card = self.activeCard;
        self.studiedCard(card, StudyResult.SORT_OF); 
    });
    $('#study-result-no').oneClick(function(){
         var card = self.activeCard;
        self.studiedCard(card, StudyResult.NO);    
    });
    //skip button
    var skip = function(){
        var card = self.activeCard;
        self.skippedCards.add(card);
        self.studiedCard(card, StudyResult.SKIPPED);         
    }; 
    $('#study-skip').oneClick(skip);
    //on swipe left - skip the card
    if(chevre.options.swipeToSkip)
     $('#study-main').oneBind("swipeleft", skip);
    
    
    //hide the answer panel; if we didn't, it would show when card 1 is being viewed
    $('.study-main-answer').hide();
    
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
    var title = sprintf(MSG_JS.MSG_no_cards, self.cardIndex + 1, self.cards.length);
    $('#study-progress-counter').html(title);
    $(document).attr('title', title);
    
    //hide the lower stuff (answer & buttons), show the top (show button)
    //do this BEFORE setting the q/a, so that the user cant peek
    $('.study-main-answer').hide(); //slideUp();
    $('.study-main-question').show(); //slideDown();    
    
    //put stuff in
    //TODO rethink this... it can get a bit jerky
    if(card.hasImage()){
         //show image
         $('#study-image').attr('src', card.imageURL);
         $('#study-image').fadeIn();
    }
    else{
         $('#study-image').fadeOut();
    }
    
    //determine what to show on front
    switch(self.options.style){
         case StudyStyle.NORMAL:
          self.front = CardParts.QUESTION;
          break;
         case StudyStyle.JEOPARDY:
          self.front = CardParts.ANSWER;
          break;
         case StudyStyle.RANDOM:
          var question = pushLuck(0.5); //true if we'll show question, false if answer
          if(question) self.front = CardParts.QUESTION;
          else self.front = CardParts.ANSWER;
          break;
    }
    //get text - question if we wanted question etc
    var text;
    if(self.front == CardParts.QUESTION) text = card.question;
    else if(self.front == CardParts.ANSWER) text = card.answer;
    self.setStudyText(text);

    //remove active state from the studying buttons... they tend to "stick" in active state
    //for some reason it doesn't work if called immediately, put it off a bit
    (function(){$('#study-buttons').find('a').removeClass('ui-btn-active')}).delay(100);
},

studiedCard: function(self, card, result){
    card.studied(result); //updates the rank & therefore reps left
    self.results.add(result);
    
    if(result == StudyResult.NO){
        //you didn't know it; save it in our list of wrong cards so you can re-study next time
        //TODO: instead of storing results, and cards wrong, just save an assoc array of card: result so you can count # cards and figure out which cards got which ranking all at once
        self.wrongCards.add(card);
    }
    
    self.cardIndex++;
    
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
setStudyText: function(self, html){
     $('#study-textarea').htmlFade(html);
          
     //text area responsive
     (function(){$('#study-textarea').responsiveMeasure({
          //idealLineLength: 66 //amazingly the default is right
          minimumFontSize: chevre.options.fontSize,
          maximumFontSize: chevre.options.fontSize*2
     })}).delay(100);     
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
    
    //save this project only. we're saving it at the very end
    self.project.save();
}
    
});
