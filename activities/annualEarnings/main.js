    $(function(){
        //选择的人物
        var whichHead
        //pages总宽度
        var pagesWidth=$('.pages').css({width:4*100+'%'});
        // 每一页的宽度为pages/个数
        var pageWidth = 100/4;
        //屏幕宽度
        var $width=$(window).width();
        //pk背景的宽高比
        var pkBgHeight=Math.floor(($width*493)/640)-2 ;
        //用户的年终奖
        var userMoney;
        //选择人物年终奖
        var characterMoney;
        //谁赢
        var whoWin;
        //打败所需要的时间
        var useTime;
        var pkStart = document.getElementById("pkStart");
        // var pkOver = document.getElementById("pkOver");
        var personJson = [
            {name:'巴菲特',success:'我脑子里有些文件夹。如果有人提起某个企业或者某些证券，常常两三分钟内就能清楚自己有没有兴趣。你做得到吗？',fail:'小子，我想静静……'},
            {name:'马云',success:'以我从屌丝逆袭为“外星人”的经历告诉你：大家都在埋怨啥机会都没有的时候，就是到处都是机会。',fail:'小子，我想静静……'}, 
            {name:'比尔盖茨',success:'生活是不公平的，要去适应它。嘿嘿',fail:'小子，我想静静……'}, 
            {name:'扎克伯格',success:'在这样一个急速变化的世界中，唯一的策略就是保证即使失败也不必承担风险。',fail:'小子，我想静静……'}
        ]
        $(".pk-bg").css('height', pkBgHeight);

        $(".page").css('width',pageWidth+'%');
        //点击开始按钮
        $('.startBtn').on('click',function(){
            $('.firstPage').addClass('hidden');
            
            movePage(1);
        })
        $('.pk-choice-area').on('click',function(){
            if(!$('.money-input').val()||$('.money-input').val()<=0){
                alert('亲输入您的年终奖！')
            }
            else{
                $('.fix-bg').removeClass('hidden');
                $('.character-choice-wraper').addClass('active animated zoomIn');
                userMoney=$('.money-input').val()
            }    
        })
        $('.character-choice-wraper').on('click','.character-head',function(){
            $(this).siblings('.character-head').removeClass('selected');
            $(this).addClass(' selected' );   
           
            whichHead=$(this).attr('data-num');
            characterMoney=$(this).attr('data-money');
           
        })
        $('.choiceBtn').on('click',function(){
            if($('.character-choice-wraper div').hasClass('selected')){
                 setTimeout(function(){   
                        // pkOver.play();
                },3600)
                  $('body,html').animate({scrollTop:0},1000);
                movePage(2);
                //判断输赢
                whoWin=(+userMoney)-(+characterMoney);
                //打败需要的时间
               

                if(whoWin>=0){
                    //玩家赢
                    setTimeout(function(){   
                        $('.left-bar').addClass('winner-blood-bar');
                        $('.right-bar').addClass('loser-blood-bar');
                        $('.leftPerson').removeClass('left-person-in').addClass('leftPerson-fight');
                        $('.rightPerson').removeClass('right-person-in').addClass('rightPerson-fight');
                    },4000) 
                     setTimeout(function(){   
                        $('.left-bar').css('width', '30');
                        $('.right-bar').css('width', '0');
                        $('.rightPerson').removeClass('rightPerson-fight').addClass('bombRightOut');
                    },5800) 
                      $('.npc_name').html("你");
                      $('.npc_word').html("把"+personJson[whichHead-1].name+"踢飞");
                      $('.npc_word2').html("小子，我想静静……");
                     

                }else{
                    //电脑赢
                     setTimeout(function(){   
                       $('.left-bar').addClass('loser-blood-bar');
                       $('.right-bar').addClass('winner-blood-bar');
                        $('.leftPerson').removeClass('left-person-in').addClass('leftPerson-fight');
                        $('.rightPerson').removeClass('right-person-in').addClass('rightPerson-fight');
                    },4000) 
                      setTimeout(function(){   
                        $('.left-bar').css('width', '0');
                        $('.right-bar').css('width', '30');
                        $('.leftPerson').removeClass('leftPerson-fight').addClass('bombLeftOut');
                    },5800) 
                    useTime=(+userMoney)*365*24*60*60/(+characterMoney);
                    // $('.npc_time').html(useTime.toFixed(5)+"秒");
                    $('.npc_time').attr('data-to', useTime.toFixed(5));
                    $('.npc_word').html(personJson[whichHead-1].success);
                    $('.npc_name').html(personJson[whichHead-1].name+"用了") ;
                    $('.npc_word').html("把你踢飞");
                    $('.npc_word2').html(personJson[whichHead-1].success);
                    

                }
                setTimeout(function(){   
                        movePage(3);
                        $('.timer').each(count);
                },6800)
                 setTimeout(function(){   
                        $('.timer').each(count);
                },7000)
                setTimeout(function(){   
                        $('.ko').addClass('active ko-show');
                },5800)
                $('.fix-bg').addClass('hidden');
                $('.sHead').css('background-image', 'url(images/npc'+whichHead+'.png)');
                $('.npc_head').css('background-image', 'url(images/npc'+whichHead+'.png)');
                $('.rightPerson-head').css('background-image', 'url(images/head_'+whichHead+'.png)');
                $('.blood-bar-wraper').addClass('blood-bar fadeInDown');  
                    pkStart.play();
                   setTimeout(function(){
                        
                        $('.leftPerson').addClass('active left-person-in');
                        $('.blood-bar-wraper').removeClass('fadeInDown').addClass('bar-shake');
                        console.log('1')
                    },800)
                    setTimeout(function(){   
                        $('.rightPerson').addClass('active rightPersonIn');
                    },1300)
            }else{
                return;
            }
            
        })

         function movePage(targetIndex){
            var tranlateX = 'translateX(-'+ pageWidth*(targetIndex-1) +'%)';
            $('.pages').css('transform',tranlateX);
        }
        $(".replayBtn").on("click",function(){
            location.reload() ;
        })
        $(window).on("click",function(e){
            // e.preventDefault();
        })
        // $('.ko-show').load(function() {
        //    $(".container").addClass('ready');
        //    $(".loading").addClass('hidden');
        // });
        
    })