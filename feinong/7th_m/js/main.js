$(function(){
    var $body = $('body');
    var $tip  = $('#tip');
    $body.on('click', '[data-action=moveout]', function(e){
        $(this).parent().addClass('moveout');
    });
    $body.on('click', '[data-action=reset]', function(e){
        $('.bg').each(function(){
            $(this).removeClass('moveout');
        });
    });
    $body.on('click', '[data-action=tip]', function(e){
        $tip.fadeIn();    
    });
    $tip.on('click', function(e){
        if (e.target == this) {
            $tip.fadeOut(); 
        }
    });
});