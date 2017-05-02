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


//获取客户信息数据
var thisPage = 1, //当前页码
	total,//数据总数量
	everyPageNum,//每页展示8条数据
	totalPage;//总页数
function getThisPage(page){
	$.ajax({
		type: "get",
		url: "http://47.92.37.168:1992/getDataArr/recycleBin",
		cache:true,
		data:{
			'thisPage':page//当前页码
		},
		success: function(everyPageData) {//访问后台数据
			console.log(everyPageData);
			$(".table tbody tr").remove();//跳转到下一页时清空tbody，避免叠加DOM树。
			thisPage = page;//当前点击的页码
			total = everyPageData.total;//数据总数量
			everyPageNum = everyPageData.everyPageNum;//每页展示5条数据
			totalPage = everyPageData.totalPage;//总页数
			sliceArr = everyPageData.arr;//截取后的数组
			//console.log(sliceArr)
			var str = '';
			for(var i = 0; i < sliceArr.length; i++){
				//console.log(sliceArr[i].HeadPortrait);
				str += '<tr><td class="col-md-1"><img src="upload/'+sliceArr[i].HeadPortrait+'"/></td>'+
				'<td class="col-md-1">'+sliceArr[i].id+'</td>'+
				'<td class="col-md-1">'+sliceArr[i].username+'</td>'+
				'<td class="col-md-1">'+sliceArr[i].sex+'</td>'+
				'<td class="col-md-1">'+sliceArr[i].job+'</td>'+
				'<td class="col-md-1">'+sliceArr[i].department+'</td>'+
				'<td class="col-md-2"><a href="ViewDetails.html?thisId='+sliceArr[i].id+'" class="btn btn-primary btn-sm">查看详情</a>'+
				'<a href="javascript:;" class="btn btn-primary btn-sm recovery" thisId='+sliceArr[i].id+'>恢复</a>'+
				'<a href="javascript:;" class="btn btn-primary btn-sm RemoveCompletely" thisId="'+sliceArr[i].id+'">彻底删除</a></td></tr>';
			}
			$('.table tbody').append(str);
		},
		complete:function() {//生成分页条
			getPageData();
		},
		error: function() {
			$('.banDel').fadeIn(200);
			$('.banDel .delP1').text('数据交互error，请联系维护人员!');
		}
	});
}

//默认显示第一页
$(function(){
	getThisPage(1);
})

function getPageData(){
	//页码大于最大页数
	if(thisPage > totalPage) thisPage = totalPage;
	//页码小于1
	if(thisPage < 1) thisPage = 1;
	//分页布局结构
	pageStr = '<li class="first"><a href="javascript:void(0);" onclick="fn(1)">首页</a></li>'+
		'<li class="prev"><a href="javascript:void(0);" onclick="fn('+(thisPage - 1)+')">上一页</a></li>'+
		'<li class="page"><span>第'+ thisPage +'页/共'+ totalPage +'页</span></li>'+
		'<li class="next"><a href="javascript:void(0);" onclick="fn('+(parseInt(thisPage) + 1)+')">下一页</a></li>'+
		'<li class="last"><a href="javascript:void(0);" onclick="fn('+ totalPage +')">尾页</a></li>'+
		'<li class="page"><span>共'+ total +'条数据</span></li>';
	$(".pagination").html(pageStr);
}

//点击跳转页码时调用
function fn(page){
	if(page > totalPage){
		return;
	}else if(page < 1){
		page = 1;
	}else{
		getThisPage(page);
	}
}

//选择部门功能
$(".selectLine").change(function(){
	var optionText = $(".selectLine").find("option:selected").text();
	$.ajax({
		type: "get",
		url: "http://47.92.37.168:1992/selectDepa/Deletedepa",
		cache:true,
		data:{
			'getDepartment':optionText
		},
		success: function(data) {//前端访问后台数据
			console.log(data)
			$(".table tbody tr").remove();//跳转到下一页时清空tbody，避免叠加DOM树。
			var str = '';
			for(var i = 0; i < data.length; i++){
				str += '<tr><td class="col-md-1"><img src="upload/'+data[i].HeadPortrait+'"/></td>'+
				'<td class="col-md-1">'+data[i].id+'</td>'+
				'<td class="col-md-1">'+data[i].username+'</td>'+
				'<td class="col-md-1">'+data[i].sex+'</td>'+
				'<td class="col-md-1">'+data[i].job+'</td>'+
				'<td class="col-md-1">'+data[i].department+'</td>'+
				'<td class="col-md-2"><a href="ViewDetails.html?thisId='+data[i].id+'" class="btn btn-primary btn-sm">查看详情</a>'+
				'<a href="javascript:;" class="btn btn-primary btn-sm recovery" thisId='+data[i].id+'>还原</a>'+
				'<a href="javascript:;" class="btn btn-primary btn-sm RemoveCompletely" thisId="'+data[i].id+'">彻底删除</a></td></tr>';
			}
			$('.table tbody').append(str);
		},
		error: function() {
			$('.banDel').fadeIn(200);
			$('.banDel .delP1').text('数据交互error，请联系维护人员!');
		}
	});
})


//点击还原此删除的数据
$('.table').delegate('.recovery','click',function(){
	var thisId = $(this).attr('thisId');
	$('.banDel').fadeIn(200);
	$('.banDel .delP1').text('确认要恢复该条客户信息数据？');
	$('.yes').on('click',function(){
		if(sessionStorage.admin_id == '1' || sessionStorage.admin_id == '2'){
			$.ajax({
				type:"get",
				url:"http://47.92.37.168:1992/recoveryInfo/recovery",
				cache:true,
				data:{
					id:thisId
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
		}else{
			$('.banDel').fadeIn(200);
			$('.banDel .delP1').text('您不是超级管理员，无权操作数据!');
		}
	})
})

//点击彻底此删除的数据
$('.table').delegate('.RemoveCompletely','click',function(){
	var thisId = $(this).attr('thisId');
	$('.banDel').fadeIn(200);
	$('.banDel .delP1').text('确认要彻底删除该条客户信息数据？');
	$('.yes').on('click',function(){
		if(sessionStorage.admin_id == '1' || sessionStorage.admin_id == '2'){
			$.ajax({
				type:"get",
				url:"http://47.92.37.168:1992/RemoveCompletely/ConfirmDelete",
				cache:true,
				data:{
					id:thisId
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
		}else{
			$('.banDel').fadeIn(200);
			$('.banDel .delP1').text('您不是超级管理员，无权操作数据!');
		}
	})
})


//点击确定提示盒子隐藏
$('.yes, .no, .close').bind('click',function(){
	$('.banDel').fadeOut(100);
})
