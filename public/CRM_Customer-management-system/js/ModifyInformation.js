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


//和详情接口一样 先获取当前客户的详细数据
var commId = window.location.href.split('=')[1];
$.ajax({
	type: "get",
	url: "http://localhost:1967/CustomerDetail/CustomerDetail",
	data:{
		'id':commId
	},
	success: function(data) {//前端访问后台数据
		var str = '<div class="mCSB_container"><h1 class="h-bloc">Personal profile</h1><div class="row top-p"><div class="col-md-7 profile-l">'+
		'<div class="title_content"><div class="name">'+data.username+'<img src="../upload/'+data.HeadPortrait+'" class="HeadPortrait"></div></div>'+
		'<ul class="about clear"><li><i class="fa fa-id-card" class="fa_Icon"></i><label>编号ID</label><span class="value" style="width: 300px;">'+data.id+'</span></li>'+
		'<li><i class="glyphicon glyphicon-user"></i><label>姓名</label><input type="text" class="form-control1 modifyName" value="'+data.username+'"></li>'+
		'<li><i class="fa fa-male" class="fa_Icon" style="font-size: 24px;"></i>性别</label><div class="adminSex"><i>男</i><input type="radio" name="sexL" value="男" checked="checked">&nbsp;<i style="margin-left: 15px;">女</i><input type="radio" name="sexL" value="女"></div></li>'+
		'<li><i class="fa fa-handshake-o" class="fa_Icon"></i><label>职业</label><input type="text" class="form-control1 modifyJob" value="'+data.job+'"></li>'+
		'<li><i class="glyphicon glyphicon-folder-open"></i><label>优秀作品</label><input type="text" class="form-control1 modifyWorks" value="'+data.works+'"></li>'+
		'<li><i class="glyphicon glyphicon-earphone"></i><label>联系方式</label><input type="text" class="form-control1 modifyTel" value="'+data.tel+'"></li>'+
		'<li><i class="glyphicon glyphicon-envelope"></i><label>邮箱</label><input type="text" class="form-control1 modifyEmail" value="'+data.email+'"></li></ul>'+
		'<div class="title_content"><div class="name">detailed information</div></div><ul class="about clear">'+
		'<li><i class="fa fa-address-card" class="fa_Icon"></i><label>年龄</label><input type="number" class="form-control1 modifyAge" value="'+data.age+'"></li>'+
		'<li><i class="glyphicon glyphicon-calendar"></i><label>出生日期</label><input type="text" class="form-control1 modifyBirthDate" value="'+data.BirthDate+'"></li>'+
		'<li><i class="fa fa-universal-access" class="fa_Icon"></i><label>身高</label><input type="number" class="form-control1 modifyHeight" value="'+data.height+'"></li>'+
		'<li><i class="fa fa-balance-scale" class="fa_Icon"></i><label>体重</label><input type="number" class="form-control1 modifyWeight" value="'+data.weight+'"></li>'+
		'<li><i class="glyphicon glyphicon-heart"></i><label>婚姻状况</label><input type="text" class="form-control1 modifyMariteal" value="'+data.MaritalStatus+'"></li>'+
		'<li><i class="glyphicon glyphicon-map-marker"></i><label>住址</label><input type="text" class="form-control1 modifyAddress" value="'+data.address+'"></li>'+
		'<li><i class="fa fa-users" class="fa_Icon"></i><label>所在部门</label><select class="form-control selectLine"><option>技术部</option><option>人事部</option><option>运营部</option><option>市场部</option><option>销售部</option><option>财务部</option> </select></li>'+
		'<li><i class="glyphicon glyphicon-time"></i><label>入职时间</label><input type="text" class="form-control1 modifyInductionTime" value="'+data.InductionTime+'"></li>'+
		'<li><i class="glyphicon glyphicon-tags"></i><label>工作状态</label><input type="text" class="form-control1 modifyCat" value="'+data.cat+'"></li>'+
		'<li><i class="glyphicon glyphicon-paperclip"></i><label>岗位类别</label><input type="text" class="form-control1 modifyJobCategory" value="'+data.JobCategory+'"></li></ul>'+
		'</div></div><a href="javascript:;" class="btn btn_5 btn-lg btn-primary submit">提交</a><a href="javascript:;" class="btn btn_5 btn-lg btn-primary cancel">取消</a></div>';
		$('.baBody').append(str);
		sessionStorage.Custid = commId;
	},
	error: function() {
		console.log('失败');
	}
});

//点击提交时判断输入框是否为空  执行Ajax修改客户信息
$('.baBody').delegate('.submit','click',function(){
	if($('.modifyName').val() == '' || $('.modifyJob').val() == ''
	|| $('.modifyWorks').val() == '' || $('modifyTel').val() == '' || $('.modifyEmail').val() == ''
	|| $('.modifyAge').val() == '' || $('.modifyBirthDate').val() == '' || $('.modifyHeight').val() == ''
	|| $('.modifyWeight').val() == '' || $('.modifyMariteal').val() == '' || $('.modifyAddress').val() == ''
	|| $('.modifyInductionTime').val() == '' || $('.modifyCat').val() == '' || $('.modifyJobCategory').val() == ''){
		alert('信息不能为空，请填写完整！');
		return;
	}else{
		$.ajax({
			type: "post",
			url: "http://localhost:1967/modifyInfo/modify",
			data:{
				'modifyID':sessionStorage.Custid,
				'modifyName':$('.modifyName').val(),
				'modifySex':$('.about li input[type=radio]:checked').val(),
				'modifyJob':$('.modifyJob').val(),
				'modifyWorks':$('.modifyWorks').val(),
				'modifyTel':$('.modifyTel').val(),
				'modifyEmail':$('.modifyEmail').val(),
				'modifyAge':$('.modifyAge').val(),
				'modifyBirthDate':$('.modifyBirthDate').val(),
				'modifyHeight':$('.modifyHeight').val(),
				'modifyWeight':$('.modifyWeight').val(),
				'modifyMariteal':$('.modifyMariteal').val(),
				'modifyAddress':$('.modifyAddress').val(),
				'modifyDepartment':$(".selectLine").find("option:selected").text(),
				'modifyInductionTime':$('.modifyInductionTime').val(),
				'modifyCat':$('.modifyCat').val(),
				'modifyJobCategory':$('.modifyJobCategory').val()
			},
			success: function(data) {//前端访问后台数据
				console.log(data);
				if(data.flag == 1){
					var r = confirm("修改成功！")
				  	if(r == true){
				    	window.location.href = 'Customer-information.html';
				   	}else{
					    window.location.href = 'Customer-information.html';
				    }
					sessionStorage.removeItem('Custid');
				}else if(data.flag == 2){
					alert('数据信息不存在！');
				}else if(data.flag == 3){
					alert('数据信息相同，修改失败！');
				}
			},
			error: function() {
				console.log('修改失败');
			}
		});
	}
})


//返回上一个历史记录页面
$('.baBody').delegate('.cancel','click',function(){
	window.history.back(-1);
})

//点击确定提示盒子隐藏
$('.yes, .no, .close').bind('click',function(){
	$('.banDel').fadeOut(100);
})