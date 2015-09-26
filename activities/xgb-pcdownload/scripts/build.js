/**
 * Created by zhangbin on 15/9/25.
 */
(function(){
    var index= 0,timer;
    function Slider(){
        this.cfg={
            speed:600,
        }
    }
    Slider.prototype={
        hover:function(){
            var that=this;
            $(".slider").hover(function(){
                $("#slider-left").fadeIn('normal');
                $("#slider-right").fadeIn('normal');
                clearTimeout(timer);
            },function(){
                $("#slider-right").fadeOut('normal');
                $("#slider-left").fadeOut('normal');
                that.autoPlay();
            })
        },
        moveLeft:function(slider,offset){
            var that=this;
            if(slider.is(':animated')){
                return false;
            }
            index++;
            if(index>5){
                index=0;
            }
            that.dotBtn(index-1);
            var left=parseInt(slider.css('left'));
            if(left<-5400){
                slider.css('left','-900px').animate({'left':'-1800px'},that.cfg.speed)
            }else{
                slider.animate({'left':left+offset+'px'},that.cfg.speed);
            }
        },
        moveRight:function(slider,offset){
            var that=this;
            if(slider.is(':animated')){
                return false;
            }
            index--;
            if(index<0){
                index=5
            }
            that.dotBtn(index-1);
            var Ileft=parseInt(slider.css('left'));
            if(Ileft>-900){
                slider.css('left','-5400px').animate({'left':'-4500px'},that.cfg.speed)
            }else{
                slider.animate({'left':Ileft+offset+'px'},that.cfg.speed);
            }
        },
        arrowBtn:function(){
            var that=this;
            var slider=$("#slider-content");
            $("#slider-right").click(function(){
                that.moveLeft(slider,-900);
            });
            $("#slider-left").click(function(){
                that.moveRight(slider,900);
            })
        },
        dotBtn:function(index){
            index++;
            $(".dot-btn-li").eq(index).addClass('active').siblings().removeClass('active');
        },
        moveBtn:function(){
            var that=this;
            var sliders=$("#slider-content");
            $(".dot-btn-li").each(function(){
              $(this).click(function(){
                  if($(this).attr('class')=='active dot-btn-li'){
                      return false;
                  }
                  if(sliders.is(':animated')){
                      return false;
                  }
                  $(this).addClass('active').siblings().removeClass('active');
                  var myIndex=parseInt($(this).attr('data-index'));
                  var myOffset=-900*(myIndex-index);
                  index=myIndex-1;
                  that.moveLeft(sliders,myOffset);
              })
          })
        },
        autoPlay:function(){
            var that=this;
            timer=setTimeout(function(){
                $("#slider-right").click();
                that.autoPlay();
          },3000)
        },
        render:function(){
            this.hover();
            this.arrowBtn();
            this.moveBtn();
            this.autoPlay();
        }
    }

    window.Slider=Slider;
})()