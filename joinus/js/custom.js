		jQuery(function($) {
			 "use strict";
			
			//------------------------------------ ABOUT -----------------------------------//
			
			jQuery('.about-player').appear();
			jQuery(document.body).on('appear', '.about-player', function(e, $affected) {
				var fadeDelayAttr;
				var fadeDelay;
				jQuery(this).each(function(){
					
					
				
	
					if (jQuery(this).data("delay")) {
						fadeDelayAttr = jQuery(this).data("delay")
						fadeDelay = fadeDelayAttr;				
					} else {
						fadeDelay = 0;
					}			
					jQuery(this).delay(fadeDelay).queue(function(){
						jQuery(this).addClass('animated').clearQueue();
					});			
				})			
			});



			jQuery('.animate').appear();
			jQuery(document.body).on('appear', '.animate', function(e, $affected) {
				var fadeDelayAttr;
				var fadeDelay;
				jQuery(this).each(function(){
					
					
				
	
					if (jQuery(this).data("delay")) {
						fadeDelayAttr = jQuery(this).data("delay")
						fadeDelay = fadeDelayAttr;				
					} else {
						fadeDelay = 0;
					}			
					jQuery(this).delay(fadeDelay).queue(function(){
						jQuery(this).addClass('animated').clearQueue();
					});			
				})			
			});



			
		});(jQuery);
		
		
		
		
		
		
		