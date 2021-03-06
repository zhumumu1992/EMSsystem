//判断用户是否登录了账号
if(sessionStorage.admin_name) {
	$('.profile_details>ul').show();
	$('.userName').html(sessionStorage.admin_name);
	imgPath = ('upload/' + sessionStorage.admin_HeadImg); //拼接管理员头像路径
	//console.log(imgPath)
	$('.adminHeadImg').css({
		'background-image': ('url("' + imgPath + '")'), //设置管理员头像背景图
		'background-size': '45px 45px'
	});
} else {
	$('.profile_details>ul').hide();
	var str = '<div class="user-name"><a href="index.html" class="userName">未登录，请登录！</a><span>Administrator</span></div>';
	$('.profile_details').append(str);
	$('.user-name').css('width', '100%');
	$('.banDel').fadeIn(200);
	$('.banDel .delP1').text('检测到您尚未登录账号，请您先登录账号!');
	$('.yes').bind('click',function(){
		window.location.href = 'index.html';
	})
	$('.no').bind('click',function(){
		window.location.href = 'index.html';
	})
}

//点击注销账号
$('.logOff').click(function() {
	$('.banDel').fadeIn(200);
	$('.banDel .delP1').text('已成功退出，即将跳转到登录页面!');
	sessionStorage.removeItem('admin_name');
	sessionStorage.removeItem('admin_id');
	sessionStorage.removeItem('admin_HeadImg');
	$('.yes').bind('click',function(){
		window.location.href = 'index.html';
	})
	$('.no').bind('click',function(){
		window.location.href = 'index.html';
	})
})

//点击跳转修改管理员信息页面
$('.ModifyAdmin').click(function(){
	window.location.href = "adminModifyInfo.html?adminId="+sessionStorage.admin_id;
})
//点击跳转查看管理员信息详情页面
$('.adminDetails').click(function(){
	window.location.href = "adminViewDetails.html?adminId="+sessionStorage.admin_id;
})

//获取管理员详情信息
$.ajax({
	type: "get",
	url: "http://47.92.37.168:1992/adminDetail/adminDetail",
	cache:true,
	data:{
		'id':sessionStorage.admin_id
	},
	success: function(data) {//前端访问后台数据
		var str = '<div class="mCSB_container"><h1 class="h-bloc">Personal profile</h1><div class="row top-p"><div class="col-md-7 profile-l">'+
		'<div class="title_content"><div class="name">'+data.adminName+'<img src="upload/'+data.adminHeadPortrait+'" class="HeadPortrait"></div></div>'+
		'<ul class="about clear"><li><i class="fa fa-id-card" class="fa_Icon"></i><label>编号ID</label><span class="value">'+data.id+'</span></li>'+
		'<li><i class="fa fa-user-o"></i><label>姓名</label><span class="value">'+data.adminName+'</span></li>'+
		'<li><i class="fa fa-male" class="fa_Icon" style="font-size: 24px;"></i>性别</label><span class="value">'+data.adminSex+'</span></li>'+
		'<li><i class="fa fa-phone"></i><label>联系方式</label><span class="value">'+data.adminTel+'</span></li>'+
		'<li><i class="fa fa-envelope-o"></i><label>邮箱</label><span class="value">'+data.adminEmail+'</span></li></ul>'+
		'</div></div><a href="javascript:;" class="btn btn_5 btn-lg btn-primary goback" style="padding: 6px 30px;">返回</a></div>';
		$('.baBody').append(str);
	},
	error: function() {
		$('.banDel').fadeIn(200);
		$('.banDel .delP1').text('数据交互error，请联系维护人员!');
	}
});

//返回主页
$('.baBody').delegate('.goback','click',function(){
	window.location.href = 'home.html';
})

//点击确定提示盒子隐藏
$('.yes, .no, .close').bind('click',function(){
	$('.banDel').fadeOut(100);
})