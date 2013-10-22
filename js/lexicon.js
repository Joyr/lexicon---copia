/**
 * Like Controller in desktop Cabra.
 * All global functions you'll need to use are in the chevre object: chevre.func() 
 * 
 * Accessible:
 * Project[] projects
 */

var lexicon = new Cobra.Singleton({
    
	__init__: function(self){
	    self.projects = [];     
	    self.activeProject = self.p = null;
	    
	    self.defaultOptions = {
	        intervalTime: 5,     //int
	        theme: Theme.BLUE
	    };
	    self.options = {};
	},
	
	/**
	 * Called when the program is first booted up. 
	 */
	start: function(self){
	    //load options & projects	
	    self.loadOptions();
	    	
		//window.setInterval(function(){self.updateProjects();},self.options.intervalTime*1000); //Refresh Projects
		self.updateProjects();
		
	},
	
	numProjects: function(self){
		return self.projects.length;	
	},
	
	//Actualiza la vista general de proyectos de un usuario
	updateProjects: function(self){
		var x=window.pageXOffset;
		var y=window.pageYOffset;
		$.getJSON('php/getProjects.php',function(data) {
			self.projects=new Array();
			var title=$('#projects-title');
			$('#projects').html('');
			$('#projects').append(title);							
			$.each(data, function(key, val) { //Devuelve un JSON con los proyectos
				if(val.ID!=0){
					var project=new Project(val.Name,val.Description,val.Cards,val.Tags);
					project.setId(val.ID); //Añade un Id al proyecto
					self.loadProject(project); //Carga las opciones de visualización del proyecto											
				}			
			});	
			$('.numProjects-title').html(self.numProjects());
			$('#projects').listview('refresh');
		});
		window.scrollBy(x,y);
	},   
	
	//Busca proyectos dentro de la base de datos a partir de un texto
	searchProject: function(self,text){
		var i=0;
		$.getJSON('php/getProjects.php',{'add':text},function(data) {
			$('#projects-list').show();
			var title=$('#projects-list-title');
			$('#projects-list').empty();
			$('#projects-list').append(title);							
			$.each(data, function(key, val) {
				if(val.ID!=0){						
					var li=cloneTemplate('template-project-tags-search');
					li.attr('id',val.ID);
					li.find('.project-name').html(val.Name);
					li.find('.ui-li-count').html(val.Cards+" Flashcards");	
					li.find('.project-tag').html(val.Tags);
					li.find('.project-tag').tagThat({readOnly:true, highlight:false});					
					/*if(val.Description=='')
						val.Description='No hay descripción';
					li.find('.project-description').html('Descripción: '+val.Description);*/
					li.find('.project-study').attr('href','#importer-sample')
					.bind('click',function(){
						var project= new Project(val.Name,val.Description,val.Cards,val.Tags);
						project.setId(val.ID);
						project.getCardsImporter();
						self.addProject(project,text);

					});
					i++;
					$('#projects-list').append(li).listview('refresh');
				}
			});	
			$('.numProjects').html(i);
			if(i==0){
				pID=-1;
				var li=cloneTemplate('template-non-project');
				li.find('.project-name').html(MSG_JS.MSG_no_found);
				$('#projects-list').append(li).listview('refresh');
			}
		});
	},
	
	loadProject: function(self, project){		
	    self.projects.push(project); //Add projects to list
	         
	    //TODO: maybe sort projects when a new one's added? but that involves adding the li to a custom spot...
	
	    //add to view - grab template and modify it
	    var li = cloneTemplate("template-project-tags");
	    li.find(".project-name").html(project.name);
	    
	    //show desc if there is one; else show other text
	    descrip=(project.description=='')?'No hay descripción':project.description;
		li.find('.project-description').html('Descripción: '+descrip);	    
	    li.find(".project-card-count").html(project.cards+" Flashcards"); //bubble showing # of cards
	    li.find('.project-tag').html(project.tags); //add tags
		li.find('.project-tag').tagThat({readOnly:true, highlight:false, autohide:true});	    
	    li.find('.edit').click(function(){
			$('#edit-project').jqmData('project', project);			
			$('#flashcard-divider h1').html('Proyecto: '+project.name);
			//self.loadProject(project);
		});
				  
		li.find('.project-study').attr('href','?project='+project.id); //add href to project
	    $('#project-list').append(li).listview('refresh');   
		$('#projects').append(li).listview('refresh');

	},
	
	//Save project in DataBase
	saveProject: function(self,project,action){
		var id=(action.id==1)?0:project.id;
		$.ajax({
			type:'POST',
			url:'php/insertProject.php',
			data:{'name':project.name,'description':project.description,'tags':project.tags,'action':action.id,'projectId':id}
		}).done(function(msg) {		
			console.log(msg);				
			$('input[name=name]').val('');
			$('textarea[name=description]').val('');
			$.mobile.changePage('#main');		
			self.updateProjects();
		}).fail(function(jqXHR, textStatus) {
		  alert( "Request failed: " + textStatus );
		});
	},
	
	addProject: function(self,project,text){
		$('#importer-sample-name').html(project.name);
		$('#importer-sample-description').html(project.description);
		$('#importer-sample-numcards').html(project.cards);   
		$('#importer-sample-accept').click(function(){
			var request=$.ajax({
				type:'POST',
				url:'php/insertProject.php',
				data:{'name':0,'description':0,'action':1,'projectId':project.id}
			}).done(function(){
				self.searchProject(text);
				$.mobile.changePage('#search-home');
				$('#importer-sample').dialog('close');
			});				
		});
	},
		
	loadOptions: function(self){
	    //grab options from Database
	    $.getJSON('php/getOptions.php',function(storedOptions){
	    	self.options = $.extend({}, self.defaultOptions, storedOptions);
	    	self.updateOptions();	    		    	
	    	self.applyOptions();
	    });

	},
	
	applyOptions:function(self){    
	    //init the options dialog
	    var options = self.options;
	    
	    $('#options').bind('pageshow', function(){      
	        //set the current value of any form elements to whatever's stored
	        $('#options-max-cards').val(options.invervalTime).slider('refresh');
	        $('#options-theme').val(options.theme).selectmenu('refresh');
	    });
	    
	    //save when "done" is clicked
	    $('#options-save').oneClick(function(){
	        //get stuff from the options page and store to vars
	        options.intervalTime = $('#options-max-cards').val().toNumber();	        
	        options.theme = $('#options-theme').val();
	      	$.ajax({
				type:'POST',
				url:'php/getOptions.php',
				data:{'tInterval':options.intervalTime,'theme':options.theme}
			}).done(function(){
				self.loadOptions();
			});  	          
	    });
	   	
	},
	
	
	/**
	 * Call when initializing page (load) and after saving options.
	 * This re-loads any things dynamically that were changed (i.e. theme). 
	 */
	updateOptions: function(self){
	    //theme... update the theme css file
	    var href=$('#theme-stylesheet').attr('href');
	    href.replace(/\/[a-z]+/,self.options.theme,href);
	    $('#theme-stylesheet').attr('href', href);
	},
		       
});
