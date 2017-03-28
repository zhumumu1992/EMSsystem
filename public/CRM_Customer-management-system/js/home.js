//判断用户是否登录了账号
if(sessionStorage.admin_name){
	$('.profile_details>ul').show();
	$('.userName').html(sessionStorage.admin_name);
	imgPath = ('../upload/'+sessionStorage.admin_HeadImg);//拼接管理员头像路径
	//console.log(imgPath)
	$('.adminHeadImg').css({
		'background-image':('url("'+imgPath+'")'),//设置管理员头像背景图
		'background-size':'45px 45px'
	});
}else{
	$('.profile_details>ul').hide();
	var str = '<div class="user-name"><a href="Login.html" class="userName">未登录，请登录！</a><span>Administrator</span></div>';
	$('.profile_details').append(str);
	$('.user-name').css('width','100%');
	$('.banDel').fadeIn(200);
	$('.banDel .delP1').text('检测到您尚未登录账号，5秒后将跳转登录页面，请您先登录账号!');
	setTimeout(function(){
		window.location.href = 'Login.html';
	},5000)
}

//点击注销账号
$('.logOff').click(function(){
	$('.banDel').fadeIn(200);
	$('.banDel .delP1').text('已成功退出，5秒后将跳转登录页面!');
	sessionStorage.removeItem('admin_name');
	sessionStorage.removeItem('admin_id');
	sessionStorage.removeItem('admin_HeadImg');
	setTimeout(function(){
		window.location.href = 'Login.html';
	},5000)
})

//点击注销登录
$('.logOff').click(function(){
	$.ajax({
		type:"post",
		url:"http://localhost:1967/SignOut/SignOut",
		success:function(data){
			if(data.flag == 1){
				$('.banDel').fadeIn(200);
				$('.banDel .delP1').text('已成功退出，3秒后将跳转登录页面!');
				sessionStorage.removeItem('admin_name');
				sessionStorage.removeItem('admin_id');
				sessionStorage.removeItem('admin_HeadImg');
				setTimeout(function(){
					window.location.href = 'Login.html';
				},3000)
			}else{
				alert('退出失败!');
			}
		},
		error:function(){
			console.log('error');
		}
	});
})


//点击跳转修改管理员信息页面
$('.ModifyAdmin').click(function(){
	window.location.href = "adminModifyInfo.html?adminId="+sessionStorage.admin_id;
})
//点击跳转查看管理员信息详情页面
$('.adminDetails').click(function(){
	window.location.href = "adminViewDetails.html?adminId="+sessionStorage.admin_id;
})

//主页判断管理员是否登录
$.ajax({
	type:"post",
	url:"http://localhost:1967/judgeSession/getSession",
	success:function(data){
		if(data.flag == 0){
			$('.profile_details>ul').hide();
			var str = '<div class="user-name"><a href="Login.html" class="userName">未登录，请登录！</a><span>Administrator</span></div>';
			$('.profile_details').append(str);
			$('.user-name').css('width','100%');
			$('.banDel').fadeIn(200);
			$('.banDel .delP1').text('检测到您尚未登录账号，3秒后将跳转登录页面，请您先登录账号!');
			setTimeout(function(){
				window.location.href = 'Login.html';
			},3000)
			return;
		}else{
			$('.profile_details>ul').show();
			$('.userName').html(sessionStorage.admin_name);
			imgPath = ('../upload/'+sessionStorage.admin_HeadImg);//拼接管理员头像路径
			//console.log(imgPath)
			$('.adminHeadImg').css({
				'background-image':('url("'+imgPath+'")'),//设置管理员头像背景图
				'background-size':'45px 45px'
			});
		}
	},
	error:function(){
		console.log('error');
	}
});

//点击确定提示盒子隐藏
$('.yes, .no, .close').bind('click',function(){
	$('.banDel').fadeOut(100);
})