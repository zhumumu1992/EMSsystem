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

//点击注销登录
// $('.logOff').click(function() {
// 	$.ajax({
// 		type: "post",
// 		url: "http://47.92.37.168:1992/SignOut/SignOut",
// 		cache:true,
// 		success: function(data) {
// 			if(data.flag == 1) {
// 				$('.banDel').fadeIn(200);
// 				$('.banDel .delP1').text('已成功退出，即将跳转到登录页面!');
// 				sessionStorage.removeItem('admin_name');
// 				sessionStorage.removeItem('admin_id');
// 				sessionStorage.removeItem('admin_HeadImg');
// 				$('.yes').bind('click',function(){
// 					window.location.href = 'index.html';
// 				})
// 				$('.no').bind('click',function(){
// 					window.location.href = 'index.html';
// 				})
// 			} else {
// 				alert('退出失败!');
// 			}
// 		},
// 		error: function() {
// 			$('.banDel').fadeIn(200);
// 			$('.banDel .delP1').text('数据交互error，请联系维护人员!');
// 		}
// 	});
// })

//点击跳转修改管理员信息页面
$('.ModifyAdmin').click(function() {
	window.location.href = "adminModifyInfo.html?adminId=" + sessionStorage.admin_id;
})
//点击跳转查看管理员信息详情页面
$('.adminDetails').click(function() {
	window.location.href = "adminViewDetails.html?adminId=" + sessionStorage.admin_id;
})

//主页判断管理员是否登录
//$.ajax({
//	type:"post",
//	url:"http://47.92.37.168:1992/judgeSession/getSession",
//	success:function(data){
//		if(data.flag == 0){
//			$('.profile_details>ul').hide();
//			var str = '<div class="user-name"><a href="index.html" class="userName">未登录，请登录！</a><span>Administrator</span></div>';
//			$('.profile_details').append(str);
//			$('.user-name').css('width','100%');
//			$('.banDel').fadeIn(200);
//			$('.banDel .delP1').text('检测到您尚未登录账号，3秒后将跳转登录页面，请您先登录账号!');
//			setTimeout(function(){
//				window.location.href = 'index.html';
//			},3000)
//			return;
//		}else{
//			$('.profile_details>ul').show();
//			$('.userName').html(sessionStorage.admin_name);
//			imgPath = ('../upload/'+sessionStorage.admin_HeadImg);//拼接管理员头像路径
//			//console.log(imgPath)
//			$('.adminHeadImg').css({
//				'background-image':('url("'+imgPath+'")'),//设置管理员头像背景图
//				'background-size':'45px 45px'
//			});
//		}
//	},
//	error:function(){
//					$('.banDel .delP1').text('数据交互error，请联系维护人员!');
//	}
//});

//点击确定提示盒子隐藏
$('.yes, .no, .close').bind('click', function() {
	$('.banDel').fadeOut(100);
})

//主页日常工作安排表
$.ajax({
	type: "get",
	url: "http://47.92.37.168:1992/getDataArr/getWorkSchedule",
	cache:true,
	success: function(workData) {//访问后台数据
		console.log(workData);
		var str = '';
		for(var i=0; i<workData.length; i++){
			str += '<article class="timeline-item"><div class="timeline-desk"><div class="panel"><div class="panel_body">'+
			'<span class="arrow"></span><span class="timeline-icon red"></span><span class="timeline-date">'+workData[i].time+'</span>'+
			'<h1 class="red">'+workData[i].PersonInCharge+'</h1><p>'+workData[i].JobContent+'</p>'+
			'<a href="javascript:;" class="btn btn-primary btn-sm deleteThisWork" thisId="'+workData[i].id+'">删除</a></div></div></div></article>';
		}
		$('.timeline').append(str);
		
		$('.timeline article:odd').attr('class','timeline-item alt');//偶数的article标签向左排列
		$('.timeline article:eq(1)').find('span.arrow').attr('class','arrow-alt');
		$('.timeline article:eq(1)').find('span.red').attr('class','timeline-icon green');
		$('.timeline article:eq(1)').find('h1.red').attr('class','green');
		$('.timeline article:eq(2)').find('span.red').attr('class','timeline-icon blue');
		$('.timeline article:eq(2)').find('h1.red').attr('class','blue');
		$('.timeline article:eq(3)').find('span.arrow').attr('class','arrow-alt');
		$('.timeline article:eq(3)').find('span.red').attr('class','timeline-icon purple');
		$('.timeline article:eq(3)').find('h1.red').attr('class','purple');
		$('.timeline article:eq(4)').find('span.red').attr('class','timeline-icon light-green');
		$('.timeline article:eq(4)').find('h1.red').attr('class','light-green');
	},
	error: function() {
		$('.banDel').fadeIn(200);
		$('.banDel .delP1').text('数据交互error，请联系维护人员!');
	}
});

//新增工作安排事项
$('.NewItems').bind('click',function(){
	if($('.PersonInCharge').val() == '' || $('.JobContent').val() == ''){
		$('.banDel').fadeIn(200);
		$('.banDel .delP1').text('信息不能为空，请填写完整！');
	}else{
		if(sessionStorage.admin_id == '1' || sessionStorage.admin_id == '2'){
			//设置点击新增工作安排事项时的当前时分
			var NewHours = new Date().getHours();
			var NewMinutes = new Date().getMinutes();
			//补零
			var NewItemsTime = (NewHours < 10 ? "0" : "") + NewHours + ':' + (NewMinutes < 10 ? "0" : "") + NewMinutes;
			$.ajax({
				type: "get",
				url: "http://47.92.37.168:1992/AddInfo/NewItems",
				cache:true,
				data:{
					'PersonInCharge':$('.PersonInCharge').val(),
					'JobContent':$('.JobContent').val(),
					'time':NewItemsTime
				},
				success: function(data) {//前端访问后台数据
					console.log(data);
					if(data.flag == 1){
						$('.banDel').fadeIn(200);
						$('.banDel .delP1').text('新增事项成功！');
						$('.yes').bind('click',function(){
							window.location.href = 'home.html';
						})
						$('.no').bind('click',function(){
							window.location.href = 'home.html';
						})
					}else{
						$('.banDel').fadeIn(200);
						$('.banDel .delP1').text('新增事项失败！');
					}
				},
				error: function() {
					$('.banDel').fadeIn(200);
					$('.banDel .delP1').text('数据交互error，请联系维护人员!');
				}
			});
		}else{
			$('.banDel').fadeIn(200);
			$('.banDel .delP1').text('您不是超级管理员，无权操作数据!');
		}
	}
})

//点击删除当前这条工作安排事项
$('body').delegate('.deleteThisWork','click',function(){
	//判断登陆者是否是超级管理员
	if(sessionStorage.admin_id == '1' || sessionStorage.admin_id == '2'){
		var thisID = $(this).attr('thisId');
		$('.banDel').fadeIn(200);
		$('.banDel .delP1').text('确认要删除该条客户信息数据？');
		$('.yes').bind('click',function(){
			$.ajax({
				type:"get",
				url:"http://47.92.37.168:1992/deleteCustomerInfo/deleteThisWork",
				cache:true,
				data:{
					id:thisID
				},
				success:function(data){
					if(data.flag == 1){
						$('.banDel').fadeOut(100);
					    window.location.reload();
					}else{
						$('.banDel').fadeIn(200);
						$('.banDel .delP1').text('删除失败!');
					}
				},
				error:function(){
					$('.banDel').fadeIn(200);
					$('.banDel .delP1').text('数据交互error，请联系维护人员!');
				}
			});
		})
	}else{
		$('.banDel').fadeIn(200);
		$('.banDel .delP1').text('您不是超级管理员，无权操作数据!');
	}
})