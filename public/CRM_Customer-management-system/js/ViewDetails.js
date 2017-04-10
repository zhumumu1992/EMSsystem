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
	var str = '<div class="user-name"><a href="index.html" class="userName">未登录，请登录！</a><span>Administrator</span></div>';
	$('.profile_details').append(str);
	$('.user-name').css('width','100%');
	$('.banDel').fadeIn(200);
	$('.banDel .delP1').text('检测到您尚未登录账号，5秒后将跳转登录页面，请您先登录账号!');
	setTimeout(function(){
		window.location.href = 'index.html';
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
		window.location.href = 'index.html';
	},5000)
})

//点击跳转修改管理员信息页面
$('.ModifyAdmin').click(function(){
	window.location.href = "adminModifyInfo.html?adminId="+sessionStorage.admin_id;
})
//点击跳转查看管理员信息详情页面
$('.adminDetails').click(function(){
	window.location.href = "adminViewDetails.html?adminId="+sessionStorage.admin_id;
})

//返回上一个历史记录页面
$('.baBody').delegate('.goback','click',function(){
	window.history.back(-1);
})

var commId = window.location.href.split('=')[1];
$.ajax({
	type: "get",
	url: "http://localhost:1967/CustomerDetail/CustomerDetail",
	data:{
		'id':commId
	},
	success: function(data) {//前端访问后台数据
		console.log(data);
		var str = '<div class="mCSB_container"><h1 class="h-bloc">Personal profile</h1><div class="row top-p"><div class="col-md-7 profile-l">'+
		'<div class="title_content"><div class="name">'+data.username+'<img src="../upload/'+data.HeadPortrait+'" class="HeadPortrait"></div></div>'+
		'<ul class="about clear"><li><i class="fa fa-id-card" class="fa_Icon"></i><label>编号ID</label><span class="value">'+data.id+'</span></li>'+
		'<li><i class="fa fa-user-o"></i><label>姓名</label><span class="value">'+data.username+'</span></li>'+
		'<li><i class="fa fa-male" class="fa_Icon" style="font-size: 24px;"></i>性别</label><span class="value">'+data.sex+'</span></li>'+
		'<li><i class="fa fa-handshake-o" class="fa_Icon"></i><label>职位</label><span class="value">'+data.job+'</span></li>'+
		'<li><i class="fa fa-phone"></i><label>联系方式</label><span class="value">'+data.tel+'</span></li>'+
		'<li><i class="fa fa-envelope-o"></i><label>邮箱</label><span class="value">'+data.email+'</span></li></ul>'+
		'<div class="title_content"><div class="name">detailed information</div></div><ul class="about clear">'+
		'<li><i class="fa fa-address-card" class="fa_Icon"></i><label>年龄</label><span class="value">'+data.age+' 岁</span></li>'+
		'<li><i class="fa fa-history"></i><label>出生日期</label><span class="value">'+data.BirthDate+'</span></li>'+
		'<li><i class="fa fa-universal-access" class="fa_Icon"></i><label>身高</label><span class="value">'+data.height+' cm</span></li>'+
		'<li><i class="fa fa-balance-scale" class="fa_Icon"></i><label>体重</label><span class="value">'+data.weight+' kg</span></li>'+
		'<li><i class="fa fa-heart"></i><label>婚姻状况</label><span class="value">'+data.MaritalStatus+'</span></li>'+
		'<li><i class="fa fa-home"></i><label>住址</label><span class="value">'+data.address+'</span></li>'+
		'<li><i class="fa fa-users" class="fa_Icon"></i><label>所在部门</label><span class="value">'+data.department+'</span></li>'+
		'<li><i class="fa fa-calendar"></i><label>入职时间</label><span class="value">'+data.InductionTime+'</span></li>'+
		'<li><i class="fa fa-user-plus"></i><label>工作状态</label><span class="value">'+data.cat+'</span></li>'+
		'<li><i class="fa fa-suitcase"></i><label>岗位类别</label><span class="value">'+data.JobCategory+'</span></li></ul>'+
		'</div></div><a href="javascript:;" class="btn btn_5 btn-lg btn-primary goback" style="padding: 6px 30px; margin-left: 250px;">返回</a></div>';
		$('.baBody').append(str);
	},
	error: function() {
		console.log('error');
	}
});

//点击确定提示盒子隐藏
$('.yes, .no, .close').bind('click',function(){
	$('.banDel').fadeOut(100);
})