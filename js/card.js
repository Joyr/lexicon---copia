var Card = new Cobra.Class({
   
   /**
    * Creates a flashcard.
    * @param {String} question     the question.
    * @param {String} answer       the answer.
    * @param {String} imageURL     [optional, default null] the link to the image (must be exact... like http://imgur.com/a.png) 
    */
	__init__: function(self, id, question, answer, imageURL){
	    self.id = id;
	    self.question = $.trim(question);
	    self.answer = $.trim(answer);
	    self.imageURL = imageURL;
	    
	    self.repsLeft = 0;
	    self.rank = null;
	},
	
	/*
	 *  
	 * 
	 */
	
	setRank: function(self,rank){		
		self.rank = rank;
		self.repsLeft = rank.baseReps;						
	},
	
	flipCard: function(self){
	    //make question the answer and vice versa
        var question = self.question;
        var answer = self.answer;
        self.question = answer;
        self.answer = question;    
	},
	
	/**
	 * This card was studied by the user.
	 * @param {StudyResult} result  from the StudyResults enum.
	 */
	studied: function(self, result){
	    //adjust rank
	    switch(result){
	        case StudyResult.YES:
	            var rank=nextRank(self.rank);
	            self.setRank(rank);
	            break;
	        case StudyResult.SORT_OF:
	            break;
	        case StudyResult.NO:
	            self.setRank(Rank.A);
	            break;
	    }
	},
	
	thumbImage: function(self,size){
		var newURL = self.imageURL.substr(0,self.imageURL.lastIndexOf('.'))+size+self.imageURL.substr(self.imageURL.lastIndexOf('.'));	       
		return newURL;
	},

	/**
	 * Fills a <li> containing info about a card (this is found in the card manager and other places.) 
	 * @param {$li} li  A jQuery object containing the <li>. Use getClonedTemplate() to find it (it's from #template-card).
	 */
	fillLI: function(self, li){
	    li.find('.card-manager-question').html(self.question);
	    li.find('.card-manager-answer').html(self.answer); 
		
		if(self.rank!=null){
			//li of count
		    //darken the color of the rank
		    var rgb = hexToRGB(self.rank.color);
		    var REDUCE_FACTOR = 0.85; // new colors will be this times as much as the original
		    rgb = rgb.map(function(x){ return (x * REDUCE_FACTOR).round(); });     
		    var hex = '#' + rgbToHex(rgb);
		    
			li.find('.ui-li-count').html(self.rank.name).attr('title', self.rank.name).css('color',hex); //TODO maybe remove the color part... looks bad for C (yellow is illegible)x
		}else
			li.find('.ui-li-count').html("No estudiado");
				
	    if(self.imageURL){
          //add a thumbnail image to the li
          //don't put it in the template cause then everything gets that weird padding
          var newURL = self.thumbImage('b');
          li.find('.card-manager-img').attr('src',newURL);
	    }	     
	     	  
	}
	    
});

