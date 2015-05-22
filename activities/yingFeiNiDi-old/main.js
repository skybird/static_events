/**
 * Created by zilong on 5/19/15.
 */
var pagePerHeight = 14.2857;//1/7

var allPage = $('#all-page')

$('#set-off').on(touch_event,function(){
    setTimeout(function(){
        allPage.velocity({
            translateY:-1*pagePerHeight+'%'
        },{
            duration:800,
            complete:function(){
                setTimeout(function(){
                    $('#img-5').velocity({
                        opacity:1
                    },{
                        duration:800
                    })
                },100)

            }
        })
    },100)
})

$('.page-2-bottom.start').on(touch_event,function(){
    setTimeout(function(){
        allPage.velocity({
            translateY:-2*pagePerHeight+'%'
        },{
            duration:800
        })
    },100)
})

$('[data-arrow-to]').on(touch_event,function(){
    var index = + ($(this).attr('data-arrow-to'));
    $('#inner-container').velocity({
        'margin-left':-index*100+'%'
    })
})

$('.page-3-bottom-text').on(touch_event,function(){
    $('#page-3 .img').addClass('hide');
    var targetId = $(this).attr('data-target-id');
    $('#'+targetId).removeClass('hide')
})