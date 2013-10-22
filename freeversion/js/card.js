var Card = new Class({
   
   /**
    * Creates a flashcard.
    * @param {String} question     the question.
    * @param {String} answer       the answer.
    * @param {String} imageURL     [optional, default null] the link to the image (must be exact... like http://imgur.com/a.png) 
    */
__init__: function(self, question, answer, imageURL){
    self.question = question;
    self.answer = answer;
    self.imageURL = imageURL;
    
    self.repsLeft = 0;
    self.rank = null;
    self.setRank(Rank.A);
},

hasImage: function(self){
     return self.imageURL != null;
},

setRank: function(self, rank){
    self.rank = rank;
    self.repsLeft = rank.baseReps;
},

/**
 * This card was studied by the user.
 * @param {StudyResult} result  from the StudyResults enum.
 */
studied: function(self, result){
    //adjust rank
    switch(result){
        case StudyResult.YES:
            self.setRank(nextRank(self.rank));
            break;
        case StudyResult.SORT_OF:
            break;
        case StudyResult.NO:
            self.setRank(Rank.A);
            break;
    }
},

/**
 * Fills a <li> containing info about a card (this is found in the card manager and other places.) 
 * @param {$li} li  A jQuery object containing the <li>. Use getClonedTemplate() to find it (it's from #template-card).
 */
fillLI: function(self, li){
     li.find('.card-manager-question').html(self.question);
     li.find('.card-manager-answer').html(self.answer);
     
     if(self.imageURL){
          //add a thumbnail image to the li
          //don't put it in the template cause then everything gets that weird padding
          var image = getClonedTemplate('template-flashcard-image');
          image.attr('src', self.imageURL);
          
          li.find('a').prepend(image);
          //li.find('.card-manager-image').show().attr('src',self.imageURL);
     }
     
     //li of count
     //darken the color of the rank
     var rgb = hexToRGB(self.rank.color);
     var REDUCE_FACTOR = 0.85; // new colors will be this times as much as the original
     rgb = rgb.map(function(x){ return (x * REDUCE_FACTOR).round(); });     
     var hex = '#' + rgbToHex(rgb);
     
     li.find('.ui-li-count').html(MSG_JS.MSG_rank+" "+self.rank.name).attr('title', MSG_JS.MSG_rank+" "+self.rank.name).css('color',hex); //TODO maybe remove the color part... looks bad for C (yellow is illegible)x
}
    
});
