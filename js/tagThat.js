/* jQuery tagThat
*
* @version 1.0 (05/2013)
*
* Author:
*	Marc Batalla Burgueño
*
* Dependencies
*	jQuery 1.8.2
*
*/
$.fn.extend({		
	
	//Create an UL Element from any tag
	//Main function
	tagThat:function(options){		
		tag=$('<li>');		
		var error='error';
		var $this=$(this);
		var that=this;				
		//Main settings
		var settings=jQuery.extend({
			defaultText: 'nueva tag',
			delimiter:';',
			readOnly:false,
			addClass:'',
			highlight:true,
			autocomplete:false,
			autohide:false,
			server:''
		},options);
		if(options){
			var text=options.defaultText||settings.defaultText;	
			var read=options.readOnly||settings.readOnly;
			var high=options.highlight||settings.highlight;
			var addClass=options.addClass||'';
			var delimiter=options.delimiter||settings.delimiter;
			var autohide = options.autohide||settings.autohide;
			var autocomplete=options.autocomplete||settings.autocomplete;
			if(autocomplete)
				var server=options.server;
		}else{
			var text=settings.defaultText;	
			var read=settings.readOnly;
			var high=settings.highlight;
			var addClass='';
			var autohide = settings.autohide;
			var delimiter=settings.delimiter;
			var autocomplete=settings.autocomplete;
		}
		//AutoComplete
		
		if(autocomplete){									
			$this.after($('<ul>')
					.addClass('ui-menu')
					.hide());
			var source=new Array();
			$.getJSON(server,function(data){
				source=data;							
			});						
		}		
		//Add CSS class 
		var readClass=(read)?'ui-readOnly':'';
		var highlight=(high)?'ui-tag-hover':'';		

		$(this).after(									//Make a List of tags
			ul = $('<ul>')
				.attr('data-role','none')
				.addClass('tags '+highlight)
				.addClass(addClass)				
				.append(	
					$('<li>').append(
						input=$('<input/>').addClass('ui-input-tag '+readClass)	//Create an Input to create a new tag
							.attr('name','inputTag')
							.val(text)
							.focusin(function(){								
								opt=$this.closest('ul').find('.ui-menu');										
								opt.width($(this).width()-10)									
									.hide();
								$(this).val('');
							})													
							.keyup(function(e) {	//options for repetitions and control
								var str=$(this).val().toLowerCase();						
								tag=$('.ui-tag');
								str1=str.replace(/;/,'');
								tags=$this.getTag();								
								if(str1!=str){									
										if(!tag.hasClass(error)){											
											$this.addTag(str1);
											$(this).val('');
										}else
											$(this).val(str1);
								}
								if(tag.hasClass(error))
									tag.removeClass(error);													
								if((index=tags.indexOf(str1))!=-1){							
									tag=$($(this).closest('ul').find('.ui-tag').get(index));									
									if(!tag.hasClass(error)){																				
										tag.addClass(error);																		
									}
								}								
								if(autocomplete&&str1!=''){
									var offset=$(this).offset();
									height=$(this).parent().height();									
									opt.css('top',offset.top+height)
										.css('left',offset.left);																								
									$this.autocomplet(source,str1);	
								}else if(str1=='')
									opt.hide();																							
                            })									
							.keypress(function(e){ //New tag when press Enter								
								if(e.keyCode==13){																		
										console.log('Add new tag\n');
										$this.addTag($(this).val());
										$(this).val('');																																															
									}
							})
							.focusout(function(){
								$('.ui-tag').removeClass(error);
								$(this).val(text);
								window.setTimeout(function(){opt.hide();},300);
							})																											
						)
					)
		);
		if(autohide){
			$(this).next().hide();
			$(this).closest('a').mouseover(function(){	
						$(this).find('.project-tag-title').show();			
						$(this).find('ul').show();						
				})
			$(this).closest('a').mouseout(function(){
				$(this).find('.project-tag-title').hide();
				$(this).find('ul').hide();
			})
		}
		if(read) input.hide();						//Hide Input if only needs read tags
		$this.hide();								//Hide original tag
		value=$this.val()||$this.html();			//Take values from original tag
		$this.addTag(value,delimiter);				//Add tags with atribute delimiter			
	},
	
	//Add a new Tag in tagThat
	
	addTag:function(value,delimiter,id){
		$this=$(this);
		delimiter=delimiter||';';
		tags=value.split(delimiter);				//Split the values
		$input=$this.next().find('li').last();		//Search the last LI (input)
		read=$input.find('input').hasClass('ui-readOnly');				
		$.each(tags,function(key,val){
			val=jQuery.trim(val);			
			tagSpan=$this.getTag();
			index=tagSpan.indexOf(val);			
			if(val!=''&&index==-1){
				val=val.toLowerCase();
				val=(val[0].toUpperCase())+val.substr(1);
				$('<li>').addClass('ui-tag').append(	//Make a new tag
					$('<span>').addClass('value').text(val),
						a=$('<a>',{						//Delete tag from remove tag
							title: 'Eliminar etiqueta',
							text:'\xD7'
							}).addClass('close')
							.click(function(){
								$that=$(this).closest('ul').prev();		//Find original tag														
								return $that.removeTag(val.toLowerCase());			
							})	
				).insertBefore($input);
				if(id){	
					$('<span>').addClass('id').text(id).hide().insertBefore(a);					
				}
				if(read) a.remove(); //If only needs read, delete Anchor				
			}else if(index!=-1){
				$($(this).closest('ul').find('.ui-tag').get(index)).addClass('error');	
			}								
		});				
	},
	
	//Remove tag
	
	removeTag:function(value){		
		var tags=this.getTag(); 		//Get an array from UL
		index=tags.indexOf(value);		//Search if exists tag
		if(index!=-1)
			this.next().find('.ui-tag').get(index).remove();	
	},	
	
	//Remove all tags
	
	removeAll:function(){
		this.next().find('.ui-tag').remove();
	},
	
	//Get List of tags like JSON
	
	getTagJSON:function(){				
		$this=$(this);
		tags=$this.next().find('.ui-tag');
		var tagsJSON='[';
		$.each(tags,function(key,val){
			id=$(val).find('.id');
			value=$(val).find('.value');
			tagsJSON+=("{\"id\":\""+id.text()+"\",\"tag\":\""+value.text().toLowerCase()+"\"}");
			if(key<tags.length-1)
				tagsJSON+=',';
		});
		tagsJSON+=']';
		return tagsJSON;
	},
	
	//Get list of tags
	
	getTag:function(){
		$this=$(this);
		tags=[];								
		$.each($($this.next().find('span.value')),function(key,val){
			tags.push($(val).text().toLowerCase());								
		});	
		return tags;
	},
	
	autocomplet:function(list,word){
		$this=$(this);	
		$content=$this.closest('ul').find('.ui-menu');
		tag=$this.getTag();
		$content.empty();		
		$.each(list,function(key,val){				
			regExp=new RegExp(word);
			exists=val.tag.search(regExp);
			if(exists!=-1&&tag.indexOf(val.tag)==-1){
				$content.append(
				$('<li>').addClass('ui-menu-item')
					.text(val.tag)
					.click(function(){
						$content.hide();												
						return $this.addTag(val.tag,';',val.id);
					})
				);
			}			
		});
		if($content.children().length>0)
			$content.show();
		else			
			$content.hide();
	}
});
