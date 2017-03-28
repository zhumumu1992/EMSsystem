(function() {
	//自定义滚动条
	$("html").niceScroll({ styler: "fb", cursorcolor: "#27cce4", cursorwidth: '5', cursorborderradius: '10px', background: '#424f63', spacebarenabled: false, cursorborder: '0', zindex: '1000' });
	$(".left-side").niceScroll({ styler: "fb", cursorcolor: "#27cce4", cursorwidth: '3', cursorborderradius: '10px', background: '#424f63', spacebarenabled: false, cursorborder: '0' });
	$(".left-side").getNiceScroll();
	if($('body').hasClass('left-side-collapsed')) {
		$(".left-side").getNiceScroll().hide();
	}
	
	//左边栏导航切换
	$('.toggle-btn').click(function() {
		$(".left-side").getNiceScroll().hide();
		if($('body').hasClass('left-side-collapsed')) {
			$(".left-side").getNiceScroll().hide();
		}
		var body = $('body');
		var bodyposition = body.css('position');
		if(bodyposition != 'relative') {
			if(!body.hasClass('left-side-collapsed')) {
				body.addClass('left-side-collapsed');
				$('.custom-nav ul').attr('style', '');
				$(this).addClass('menu-collapsed');
			} else {
				body.removeClass('left-side-collapsed chat-view');
				$('.custom-nav li.active ul').css({ display: 'block' });
				$(this).removeClass('menu-collapsed');
			}
		} else {
			if(body.hasClass('left-side-show')){
				body.removeClass('left-side-show');
			}else{
				body.addClass('left-side-show');
			}
		}
	});
	
	//添加鼠标悬停
	$('.custom-nav > li').hover(function() {
		$(this).addClass('nav-hover');
	}, function() {
		$(this).removeClass('nav-hover');
	});
	
	
})(jQuery)//封闭空间传参

