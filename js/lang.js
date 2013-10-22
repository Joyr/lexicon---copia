var lang = new Cobra.Singleton({
	
	__init__: function(self){
		self.language = [];
		self.id = $('#options-lang');
		self.options={
			flags:false
		};
	},
	start: function(self,options){
		self.options.flags=(options)?options.flags:self.options.flags;
		console.log('Languages Engaged...');
		self.refresh();
		self.newForm();
		//self.id.change(function(){console.log(self.id)});
	},
	newForm:function(self){
		if(self.options.flags)
			self.addFlag();
		self.inColumns();
	},
	getLanguage: function(self){		
		var file = self.id.find('option:selected').attr('data-file')||'eng.json';
		$.getJSON('lang/'+file,function(language){
			$.each(language, function(key,val){
				if(key=='_MSG_JS')
					MSG_JS=val;
			});			
		});		
	},
	changeLanguage:function(self,newLanguage){
		$.ajax({
           url:'php/lang_ajax.php',
           type:"POST",
           data:{'lang':newLanguage}
        }).done(function(){
            reloadPage();           
        });
	},
	refresh: function(self){
		window.setTimeout(function(){$('#options-lang').selectmenu('refresh');},500);
		
	},
	addFlag: function(self){
		src=$('.img-flag-language');				
		links = $('#options-lang-menu a');
		$.each(links,function(key,val){
			$.each(src,function(k1,v1){				
				if($(val).html()==v1.alt){
					$(v1).css('margin-right','5px').prependTo(val);
				}
			});
		})
	},
	inColumns:function(self){
		columns=Math.floor($('#options-lang-menu li').length/5);
		newBool=false;
		if($('#options-lang-menu li').length>5){
			newBool=true;
			$('#options-lang-menu').append(
				div=$('<div class="ui-grid-a">')						
			);			
			divList=[];
			for(i=0;i<columns;i++){
				divList.push($('<div class="ui-block-'+String.fromCharCode(i+97)+'">'))
				div.append(divList[i]);
			}			
		}
		$.each($('#options-lang-menu li'),function(key,li){
			if($(li).attr('data-option-index')!=0){
				$(li).show();								
				if(newBool){
					i=key%columns;
					$(li).appendTo(divList[i]);
				}
				$(li).click(function(){
					index=$(li).attr('data-option-index');
					self.changeLanguage($('#options-lang option:eq('+index+')').attr('id').replace('language-id-',''));
				});
			}
		});		
	}
	
});
