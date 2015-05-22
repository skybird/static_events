
	var _flag = 0,$wrap = $('#wrap'),$section = $('.section'),$bxslider = $('.slider'),max = $section.length-1,_isDone = true,bxslider,_bgmplay = true,_stopSwipe = false;

	$('body').on('touchmove', function(event) {
		event.preventDefault();
	});
	$wrap.swipe({
		swipeDown:function(){
			if(_flag == 0 || !_isDone || _stopSwipe) return;
			_flag--
			moveEvent();

		},
		swipeUp:function(){
			if(_flag == max || !_isDone || _stopSwipe) return;
			_flag++;
			moveEvent();
		}
	});
	

	function moveEvent(sp){
		_isDone = false;
		var y = _flag*-10+'%';
		var speed = sp || 1000;
		$bxslider.transition({ y: y },speed,function(){
			_isDone = true;
			
			if(_flag == max){
				$('.arrow').addClass('hideArrow');
			}else{   //else if(_flag == max-1 )
				$('.arrow').removeClass('hideArrow');
			};
		
		});
	};


	function gotoPgae(n,sp){
		_flag = n;
		moveEvent(sp);

	};
	

	TouchSlide({
        slideCell: "#focused",
        titCell: ".hd ul",
        mainCell: ".bd ul",
        effect: "leftLoop",
        //autoPlay: true,
        autoPage: true
    });
	
	
	$('.table-con .table').hide();
	$('.table-con .table.table-1').show();
	$('.table-con .table.table-7').show();


 

	var ms = new IScroll('.iscroll-wrap', {
		scrollbars: 'custom',
		click: true
	});
	ms.on('scrollEnd', function () {
		if(this.y == 0||this.y==this.maxScrollY){
			_stopSwipe = false;
		}else{
			_stopSwipe = true;
		};
	});
	
	var ms2 = new IScroll('.iscroll-wrap2', {
		scrollbars: true,
		scrollbars: 'custom',
		click: true
	});

	ms2.on('scrollEnd', function () {
		if(this.y == 0||this.y==this.maxScrollY){
			_stopSwipe = false;
		}else{
			_stopSwipe = true;
		};
	});
	


	//alert(navigator.appName);
	$('.table-con .tdDiv').click(function(){
		var Class = $(this).data('class');
		$('.'+Class).slideToggle('slow', function(){
			//$('.table-con .table').not('.'+Class).hide();
			if($(this).closest('.iscrollBox').attr('iNow') == 0){
				ms.refresh();
			}else{
				ms2.refresh();
			}
		});
		$(this).find('span').toggleClass('table-arrow-up');
	});
	$('.btn-yuyue').click(function(){
		$('#slider').css({
			'transform': 'translate(0px, 0%)'
		});
	});
	$('.btn-close').click(function(){
		$('.pop').hide();
	});
