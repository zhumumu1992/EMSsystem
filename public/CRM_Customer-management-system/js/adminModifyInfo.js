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


//点击跳转修改管理员信息页面
$('.ModifyAdmin').click(function(){
	window.location.href = "adminModifyInfo.html?adminId="+sessionStorage.admin_id;
})
//点击跳转查看管理员信息详情页面
$('.adminDetails').click(function(){
	window.location.href = "adminViewDetails.html?adminId="+sessionStorage.admin_id;
})

//和详情接口一样 先获取当前管理员的详细数据
$.ajax({
	type: "get",
	url: "http://localhost:1967/adminDetail/adminDetail",
	data:{
		'id':sessionStorage.admin_id
	},
	success: function(data) {//前端访问后台数据
		var str = '<div class="mCSB_container"><h1 class="h-bloc">Personal profile</h1><div class="row top-p"><div class="col-md-7 profile-l">'+
		'<div class="title_content"><div class="name">'+data.adminName+'<img src="../upload/'+data.adminHeadPortrait+'" class="HeadPortrait"></div></div>'+
		'<ul class="about clear"><li><i class="fa fa-id-card" class="fa_Icon"></i><label>编号ID</label><span class="value" style="width: 300px;">'+data.id+'</span></li>'+
		'<li><i class="glyphicon glyphicon-user"></i><label>姓名</label><input type="text" class="form-control1 modifyName" value="'+data.adminName+'"></li>'+
		'<li><i class="fa fa-asterisk" class="fa_Icon"></i><label>密码</label><input type="text" class="form-control1 modifyPwd" value="'+data.adminPwd+'"></li>'+
		'<li><i class="fa fa-male" class="fa_Icon" style="font-size: 24px;"></i>性别</label><input type="text" class="form-control1 modifySex" value="'+data.adminSex+'"></li>'+
		'<li><i class="glyphicon glyphicon-earphone"></i><label>联系方式</label><input type="text" class="form-control1 modifyTel" value="'+data.adminTel+'"></li>'+
		'<li><i class="glyphicon glyphicon-envelope"></i><label>邮箱</label><input type="text" class="form-control1 modifyEmail" value="'+data.adminEmail+'"></li></ul>'+
		'</div></div><a href="javascript:;" class="btn btn_5 btn-lg btn-primary submit">提交</a>'+
		'<a href="javascript:;" class="btn btn_5 btn-lg btn-primary cancel">取消</a></div>';
		$('.baBody').append(str);
	},
	error: function() {
		console.log('失败');
	}
});

//点击提交时判断输入框是否为空  执行Ajax修改客户信息
$('.baBody').delegate('.submit','click',function(){
	if($('.modifyName').val() == '' || $('.modifyPwd').val() == '' || $('.modifySex').val() == ''
	|| $('.modifyTel').val() == '' || $('.adminEmail').val() == ''){
		alert('信息不能为空，请填写完整！');
		return;
	}else{
		$.ajax({
			type: "post",
			url: "http://localhost:1967/modifyInfo/modifyAdmin",
			data:{
				'modifyID':sessionStorage.admin_id,
				'modifyName':$('.modifyName').val(),
				'modifyPwd':$('.modifyPwd').val(),
				'modifySex':$('.modifySex').val(),
				'modifyTel':$('.modifyTel').val(),
				'modifyEmail':$('.modifyEmail').val()
			},
			success: function(data) {//前端访问后台数据
				console.log(data);
				if(data.flag == 1){
					var r=confirm("管理员信息修改成功！")
				  	if(r==true){
				    	window.location.href = 'home.html';
				   	}else{
					    window.location.href = 'home.html';
				    }
				}else if(data.flag == 2){
					alert('数据信息不存在！');
				}else if(data.flag == 3){
					alert('数据信息相同，修改失败！');
				}
			},
			error: function() {
				console.log('失败');
			}
		});
	}
})

//返回主页
$('.baBody').delegate('.cancel','click',function(){
	window.location.href = 'home.html';
})

//点击确定提示盒子隐藏
$('.yes, .no, .close').bind('click',function(){
	$('.banDel').fadeOut(100);
})