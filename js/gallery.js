var Gallery = new Cobra.Class({
	
	__init__: function(self,tag){
	    self.DOM = '#'+tag;
	    self.images = [];	   	    
	    self.imagesTag = [];
	    self.divSelector = '';
	    self.prev = '';
	    self.nex = '';
	    self.template = 'template-image';
	    self.div = $('#gallery-carousel');		
	},

	load: function(self){
		$.getJSON('php/ajax/getImage.php',function(data){				
			$.each(data,function(key,image){											
				self.images[key] = image;								
			});	
			num = 1;			
			$(self.DOM).append(self.divSelector = $('<div class="gallery-num">'));
			$(self.DOM).append(self.prev = $('<div>'));
			self.prev.addClass('prevImages movers');
			$(self.DOM).append(self.nex = $('<div>'));
			self.nex.addClass('nextImages movers');			
			for(var i=num-1;i<Math.ceil(self.images.length/10);i++){				
				$(self.divSelector).append(opt = $('<div>').append($('<span hidden>'+i+'</span>')));
				if(i==(num-1)){
					opt.addClass('selectedGallery');
				}else{
					opt.addClass('selectGallery')
				}
				opt.click(function(){
					var index = parseInt($(this).find('span').html())+1;
					$(self.divSelector).find('div').removeClass().addClass('selectGallery');
					$(this).removeClass('selectGallery').addClass('selectedGallery');					
					self.fillImg(index);
				})
			}		
			self.fillImg(num);	
		});
	},

	fillImg: function(self,num){				
		var i = (num-1)*10;
		self.div.empty();
		$(self.div).offset({left:$(self.div).parent().offset().left});
		if(num*10>self.images.length){
			num = self.images.length;
			factor = self.images.length%10;
		}else{
			num *= 10;
			factor = 10;
		}
			
		for(i;i<num;i++){
			self.insertImage(i);
		}		
		$(self.div).width(num*1000);
		var position = false;
		var p = 0;				
		$('.movers').mouseenter(function(e){	
			p = $(self.DOM).offset().left+$(self.DOM).width()/2-e.pageX;						
			position = true;								
		});
		$('.movers').mouseout(function(e){
			position = false;
		});
		window.setInterval(function(){
			if(position){
				var limit = 56.5 * factor;	
				if(p<0&&(Math.abs(parseInt($(self.div).css('left')))<limit||$(self.div).css('left')=='auto')&&limit>$(self.DOM).width()){
					$(self.div).offset({left:$(self.div).offset().left - 2});
				}else if(p>0&&parseInt($(self.div).css('left'))<0){
					$(self.div).offset({left:$(self.div).offset().left + 2});
				}
			}
			self.nex.css('left',$(self.DOM).width()+10+"px");
		},10);
	},

	insertImage: function(self,num){		
		var img = cloneTemplate(self.template);
		var image = self.images[num];
		var newURL = image.url.substr(0,image.url.lastIndexOf('.'))+'s'+image.url.substr(image.url.lastIndexOf('.'));	       
		img.attr('src',newURL);	
		img.click(function(){	
			img2 = img.clone();
			$('#image-from-gallery').find('img').remove();
			$('#image-from-gallery').show().append(img2.addClass('floatImage gallery-image').hide());		
			$('#image-from-gallery span').html(image.id);
			self.showHideImage(img2);			
		});		
		$(self.div).append($('<a data-rel="back">').append(img));
		self.showHideImage();
	},

	showHideImage: function(self,img){				
		$('#image-from-gallery span').mouseover(function(e){		
			$(img).show();			
			$(img).offset({top:e.pageY,left:e.pageX});
			
		});
		$('#image-from-gallery span').mouseout(function(e){
			$(img).hide();
		});
	},

	getWidth: function(self){
		//console.log($(self.DOM).width());
	},
});