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

//点击设置头像
var _file;
function updat(el){
	var file = el.files[0];
	if(window.FileReader){
		var reader = new FileReader();
		reader.readAsDataURL(file);
		//监听文件读取结束后事件    
		reader.onloadend = function(e) {
			$("#pic img").attr("src", e.target.result); //e.target.result就是最后的路径地址
		};
	}
	var setFiles = function(el){
		_file=el.files[0];
	}
	setFiles(el);
}


//手机号验证
var userPhoneRE = /^(1)[3|4|5|7|8](\d){9}$/;//手机号正则
$(".modifyTel").blur(function() {
	if($('.modifyTel').val() == ''){
		$('.error_3').html('手机号不能为空,请您返回填写！').css('color', 'red');
	}else if(!userPhoneRE.test($('.modifyTel').val())) {
		$('.error_3').html('手机号格式错误，为11位数字！').css('color', 'red');
	} else {
		$('.error_3').html('√').css('color', 'green');
	}
})
//邮箱验证
var userEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;//邮箱正则
$(".modifyEmail").blur(function() {
	if($('.modifyEmail').val() == ''){
		$('.error_2').html('邮箱不能为空,请您返回填写！').css('color', 'red');
	}else if(!userEmail.test($('.modifyEmail').val())) {
		$('.error_2').html('邮箱格式错误！').css('color', 'red');
	} else {
		$('.error_2').html('√').css('color', 'green');
	}
})

//点击提交时判断输入框是否为空  执行Ajax修改客户信息
$('.submit').on('click',function(){
	//判断登陆者是否是超级管理员
	if(sessionStorage.admin_id == '1' || sessionStorage.admin_id == '2'){
		if($('.modifyName').val() == '' || $('.modifyJob').val() == ''
		|| $('.modifyTel').val() == '' || $('.modifyEmail').val() == ''
		|| $('.modifyAge').val() == '' || $('.modifyBirthDate').val() == '' || $('.modifyHeight').val() == ''
		|| $('.modifyWeight').val() == '' || $('.modifyMariteal').val() == '' || $('.modifyAddress').val() == ''
		|| $('.modifyInductionTime').val() == ''){
			$('.banDel').fadeIn(200);
			$('.banDel .delP1').text('信息不能为空，请填写完整！');
		}else{
			if($('.baBody .title_content #pic img').attr('src') == 'upload/huaji.jpg'){
				var defaultImgSrc = 'huaji.jpg';
				addInfo(defaultImgSrc);
			}else{
				// console.log(_file);
				var fd = new FormData();
				fd.append('uploadFile',_file);
				$.ajax({
					type:"post",
					url:"http://47.92.37.168:1992/upload/uploadImg",
					cache:true,
					data:fd,
					contentType:false,//表示要传一个文件
					processData:false,//对data参数进行序列化处理
					success:function(dataImg){
						// console.log(dataImg);
						addInfo(dataImg);
					},
					error:function(){
						$('.banDel').fadeIn(200);
						$('.banDel .delP1').text('数据交互error，请联系维护人员!');
					}
				});
			}
		}
	}else{
		$('.banDel').fadeIn(200);
		$('.banDel .delP1').text('您不是超级管理员，无权操作数据!');
	}
})

//向数据库添加数据
function addInfo(HeadPortrait){
	$.ajax({
		type: "post",
		url: "http://47.92.37.168:1992/AddInfo/add",
		cache:true,
		data:{
			'modifyName':$('.modifyName').val(),
			'modifySex':$('.about li .userSex input[type=radio]:checked').val(),
			'modifyJob':$('.modifyJob').val(),
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
			'modifyCat':$('.about li .userCat input[type=radio]:checked').val(),
			'modifyJobCategory':$('.about li .userJobCategory input[type=radio]:checked').val(),
			'upImg':HeadPortrait
		},
		success: function(data) {//前端访问后台数据
			// console.log(data);
			if(data.flag == 1){
				$('.banDel').fadeIn(200);
				$('.banDel .delP1').text('新增成功！');
				setTimeout(function(){
					window.location.href = 'Customer-information.html';
				},2000)
			}else{
				$('.banDel').fadeIn(200);
				$('.banDel .delP1').text('新增失败！');
			}
		},
		error: function() {
			$('.banDel').fadeIn(200);
			$('.banDel .delP1').text('数据交互error，请联系维护人员!');
		}
	});
}

//返回上一个历史记录页面
$('.baBody').delegate('.cancel','click',function(){
	window.history.back(-1);
})

//点击确定提示盒子隐藏
$('.yes, .no, .close').bind('click',function(){
	$('.banDel').fadeOut(100);
})