
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
	// $('.btn-yuyue').click(function(){
	// 	$('#slider').css({
	// 		'transform': 'translate(0px, 0%)'
	// 	});
	// });
	$('form').on('submit',  function(event) {
		//$.ajax({
		//	urL:'http://a.irs01.com/hat?_t=r&_htsinfo=QyY2MSY2MzAmMTMzMCY5NDMwJiNy&_z=_&l=aHR0cDovL2FjdGl2aXR5LndhbGxzdHJlZXRjbi5jb20vYWN0aXZpdGllcy95aW5nRmVpTmlEaS0yL2luZmluaXR5Lmh0bWw=',
		//	success:function(e){
		//		console.log(e)
		//	}
        //
		//})
		event.preventDefault();
		if($('#UserName').val().length==0){
			alert('请填写正确姓名')
			return;
		}
		var i = /^1[34578][0-9]{9}$/;
		var phoneStr = $('#Mobile').val().toString();
		if(!i.test(phoneStr)){
			alert('请填写正确手机号')
			return;
		}
		if($('#sex input[type=radio]:checked').length==0){
			alert('请选择称谓')
			return;
		}
		if($('#Province').val()==0){
			alert('请选择城市')
			return;
		}
		if(!$('#cbox-agree').is(':checked')){
			alert('请勾选同意，才可以提交数据')
			return;
		}
		var _this = $(this)
		var provinceTxt =$('#Province option:selected').text();
		var cityTxt =$('#City option:selected').text();
		var paramObj = {};
		$.each(_this.serializeArray(), function(_, kv) {
			paramObj[kv.name] = kv.value;
		});
		paramObj['field_5'] = provinceTxt+'-'+cityTxt;
		$.ajax({
			url:_this.attr('action'),
			data:paramObj,
			success:function(e){
				console.log(e);
				alert('预约成功');
				$('#slider').css({
					'transform': 'translate(0px, 0%)'
				});
			}
		})

	});
	$('.btn-close').click(function(){
		$('.pop').hide();
	});
