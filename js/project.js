var Project = new Cobra.Class({
	    
	__init__: function(self, name, description,cards,tags){
	    
	    self.id = null;
	    self.name = name;
	    self.description = description; //TODO make this undefined by default so that it won't take up space when stored and there's nothing there
	    self.tags=tags;
	    self.cards = null||cards;
	    
	    self.wrongCards = null; //cards they got wrong last session; temporary variable, filled in by session
	},
	
	setId: function(self,id){
		self.id = id;
	},
	
	getProject: function(self,id){	
		$.getJSON('php/getProjects.php',{'projectId':id},function(data) {			
			$.each(data, function(key, val) { //Devuelve un JSON con los proyectos						
				self.setId(val.ID); 
				self.name = val.Name;
				self.description = val.Description;
				self.showOrHideDescription();
				self.tags = val.Tags;
				self.getCards();															
			});	
		});
	},

	showOrHideDescription: function(self){
	    if(self.description){
	    	$('#project-description').show();
	        $('#project-description h2').html(self.description);
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
	            console.log(text);
	            text = prettify(text); //make it show nicely in HTML
	            if(text){
	                self.description = text;
	                self.showOrHideDescription(); //that'll do the first case
	                self.save();
	            }
	        });
	    }
	},

	setTags: function(self,tags){
		self.tags = tags;
	},
	
	addCard: function(self, card){	
	    self.cards.add(card);
	},
	
	getCards: function(self){
		$.ajax({
			url:'php/setRankCard.php',
			type:'POST',
			data:{'projectId':self.id,'action':action.ADD.id}
		}).done(function(msg){
			//console.log(msg);
		});
		$.getJSON('php/getCards.php',{'projectId':self.id},function(data){
				self.cards = new Array();				
				$.each(data, function(key, val) {				
					var card=new Card(val.id,val.Question,val.Answer,val.img);
					var rank=returnRank(val.rank);
					card.setRank(rank);
					self.addCard(card);													
				});	
							
			if(self.numCards==0){
				$('#start-study-btn').addClass('ui-disabled');
				$('#project-chart-cards').html('<p>'+MSG_JS.MSG_no_cards_import+'</p>');
			}else if($('#start-study-btn').hasClass('ui-disabled')){
				$('#start-study-btn').removeClass('ui-disabled');			
				self.loadCardChart();
			}else{
				self.loadCardChart();
			}
		});	
	},
	
	//Method for showing cards from Search Option
	getCardsImporter: function(self){
		$.getJSON('php/getCards.php',{'projectId':self.id,'top':NUM_SAMPLE_CARDS},function(data){
			var li;
			var i=0;
			$('#importer-sample-list').empty();
			$.each(data, function(key, val) {							
				li=cloneTemplate('template-card');
				li.find('.card-manager-question').html(val.Question);
				li.find('.card-manager-answer').html(val.Answer);
				if(val.rank!=null)
					li.find('.ui-li-count').html(returnRank(val.rank).name);
				else
					li.find('.ui-li-count').html(MSG_JS.MSG_no_study);
				$('#importer-sample-list').append(li).listview('refresh');							
				i++;						
			});	
			if(i==0){
				var li=cloneTemplate('template-non-project');
				li.find('.project-name').html(MSG_JS.MSG_no_cards_import);
				$('#importer-sample-list').append(li).listview('refresh');
			}		
			$('#importer-sample-list').listview('refresh');	
		});	
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
	    self.card = self.cards.randomize();
	},
	
	//Reset Rank from all flashcards
	resetCards: function(self){
	    self.cards.forEach(function(card){
	       card.setRank(Rank.A);
	       self.setRankCard(card,action.EDIT.id);
	    });
	    self.getCards();
	},
	
	//Start to Study	
	loadStudy: function(self){
	   var study = new Study(self);
	   $('.study-main-answer').hide();
	   $('#study-textarea-answer').hide();
	   study.start(); 
	},
	
	//Manage cards from project	
	updateManager: function(self){
		$.getJSON('php/getCards.php',{'projectId':self.id},function(data){
			self.cards = [];
			title=$('#flashcard-divider');
			$('#flashcards').empty()
			.append(title); //limpia el listado y lo reinicia
			var li;
			var i=0;
			$.each(data, function(key, val) {		
				if(val.img)					
					li=cloneTemplate('template-card-image');
				else
					li=cloneTemplate('template-card');
				var card=new Card(val.id,val.Question,val.Answer,val.img);
				var rank=returnRank(val.rank); //Need to transform number to rank object
				card.setRank(rank);
				self.addCard(card);
				card.fillLI(li); //Show Li from each card
								
				li.find('.card-manager-edit-button').attr('href','#edit-card-dialog') //Añade enlace al menú de modificación			
				.click(function(){ //Escribe para su modificación					
					$('#edit-card-dialog').jqmData('card', card);
					if(val.img!=null){
						$("#edit-card-image-preview").attr('src',card.thumbImage('b'));
						$('#edit-card-if-image').show();
					}else
						$('#edit-card-if-image').hide();
					$('#edit-card-question').val(card.question);
					$('#edit-card-answer').val(card.answer);
				});
				$('#flashcards').append(li).listview('refresh');							
				i++;						
			});	
			if(i==0){ //si no hay flashcards, añade un elemento nulo a la lista
				var li=cloneTemplate('template-non-project');
				li.find('.project-name').html(MSG_JS.MSG_no_cards_import);
				$('#flashcards').append(li).listview('refresh');
			}		
			$('.numFlashcards').html(i);
			$('#flashcards').listview('refresh');	
		});	
	},
	
	//Import cards from CSV file
	updateManagerFile: function(self,cardsPreview){
	    
	    //empty card manager and refill
	    title=$('#card-manager-list-divider');
	    var list = $('#card-manager-list');
	    list.empty().append(title); 
	    
	    var li;
		var i=0;
				
		$.each(cardsPreview,function(key,val){				
			var fileRow=val.split(';'),question=fileRow[0],answer=fileRow[1],img=null;
			var card=new Card(null,question,answer,img);			
			li=cloneTemplate('template-card');
			card.fillLI(li);
			
			li.find('.ui-li-count').hide(); //Import cards don't have rank
			li.find('.card-manager-edit-button').attr('href','#remove-flashcard-popUp')			
			.attr('data-rel',"popup")
			.attr('data-position-to',"window") 
			.click(function(){							
				cID=key; //delete element from array of cards
			});
			$('#add-import-csv').click(function(){
				self.saveCard(card,action.ADD);	//Save in DB
			});		
			$('#card-manager-list').append(li).listview('refresh');							
			i++;
		});
		if(i==0){
			var li=cloneTemplate('template-non-project');
			li.find('.project-name').html('No hay flashcards');
			$('#card-manager-list').append(li).listview('refresh');
			$('#add-import-csv').hide();
		}else
			$('#add-import-csv').show();
		$('#numFlashcards-preview').html(i);
		$('#card-manager-list').listview('refresh');	    
	},
	
	/**
	 * Make a Chart about flashcards
	 *
	 * @param 
	 * @return void
	 * @author  
	 */

	loadCardChart: function(self){
	    // Can specify a custom tick Array.
	    // Ticks should match up one for each y value (category) in the series.
	    //ticks = ['No estudiado', 'Rank A', 'Rank B', 'Rank C', 'Rank D', 'Rank E'];
	     
	    $('#project-chart-cards').empty();
	    if(self.cards.isEmpty()){
	        //no cards, draw nothing$
	        $('#project-chart-cards').html(MSG_JS.MSG_no_cards);
	        $('#start-study-btn').addClass('ui-disabled');
	        return;
	    }
	    if($('#start-study-btn').hasClass('ui-disabled')){
				$('#start-study-btn').removeClass('ui-disabled');			
		}
	    
	    //map out how many cards have which rank
	    var data = [];
	    Object.each(Rank, function(key, value){
	        //key is the rank name - like Rank.A, Rank.B, etc.
	        //value is the actual object
	        //count how much of our cards are that 	        
	        if(key!='NO'){  
		        var numCards = self.cards.count(function(card){
		            return card.rank == value;    
		        });     
		        
		        //add on to data - the rank's name and the # of cards
		        data.push([value.name, numCards ]);
		    }
	    });
	    //pluralize the title word Flashcard if necessary
	    
	    try{
	    	$.jqplot('project-chart-cards', [data], {
		        // Turns on animatino for all series in this plot.
		        animate: true,
		        // Will animate plot on calls({resetAxes:true})
		        animateReplot: true,
				//Title
				title:MSG_JS.MSG_stadistics,
				
				// Provide a custom seriesColors array to override the default colors.
				seriesColors: Object.values(Rank).map(function(rank){ return rank.color; }),
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
	
	saveCard: function(self,card,act){
		$.mobile.loading('show', {
	        text: MSG_JS.MSG_finding+'...',
	        textVisible: true,
	        theme: 'b'
	    });
		$.ajax({
				type:'POST',
				url:'php/insertFC.php',
				data:{'project':self.id,'wQ':card.question,'wA':card.answer,'action':act.id,'id':card.id,'img':card.imageURL}
		}).done(function(msg) {
			//console.log(msg);
			$.mobile.loading('hide');
			console.log('Successfully changed');
				(function(){ self.updateManager(); }).delay(200);	
		}).fail(function(jqXHR, textStatus) {
			$.mobile.loading('hide');
			  alert( "Request failed: " + textStatus );
		});	
	},

	setRankCard: function(self,card,action){
		$.ajax({
			url:'php/setRankCard.php',
			type:'POST',
			data:{'projectId':self.id,'id':card.id,'rank':card.rank.id,'repsLeft':card.repsLeft,'action':action.id}
		});
	},

	save: function(self){
		$.ajax({
			type:'POST',
			url:'php/insertProject.php',
			data:{'name':self.name,'description':self.description,'tags':self.tags,'action':action.EDIT.id,'projectId':self.id}
		}).done(function(msg) {		
			console.log(msg);
		}).fail(function(jqXHR, textStatus) {
		  console.log( "Request failed: " + textStatus );
		});
	}
		
});
