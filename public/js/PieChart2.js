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

//点击确定提示盒子隐藏
$('.yes, .no, .close').bind('click',function(){
	$('.banDel').fadeOut(100);
})

//获取客户信息数据
$.ajax({
	type: "get",
	url: "http://47.92.37.168:1992/ECharts/PieChart",
	cache:true,
	success: function(data) {//前端访问后台数据
		//console.log(data);
		var departmentAry = [];
		if(data){
			for(var i=0; i<data.length; i++){
				departmentAry.push(data[i].department);
			}
			getPieChart2(departmentAry);
		}
	},
	error: function() {
		$('.banDel').fadeIn(200);
		$('.banDel .delP1').text('数据交互error，请联系维护人员!');
	}
});

//柱线图（员工所在部门统计）
function getPieChart2(departmentAry) {
	var myChart = echarts.init(document.getElementById('PieChart2'));
	var jishubu = renshibu = yunyingbu = shichangbu = xiaoshoubu = caiwubu = 0;
	for(var i=0; i<departmentAry.length; i++){
		if(departmentAry[i] == '技术部'){
			jishubu++;
		}else if(departmentAry[i] == '人事部'){
			renshibu++;
		}else if(departmentAry[i] == '运营部'){
			yunyingbu++;
		}else if(departmentAry[i] == '市场部'){
			shichangbu++;
		}else if(departmentAry[i] == '销售部'){
			xiaoshoubu++;
		}else if(departmentAry[i] == '财务部'){
			caiwubu++;
		}
	}
	console.log(jishubu,renshibu,yunyingbu,shichangbu,xiaoshoubu,caiwubu);
	var option = {
		title : {
	        text: '公司内部员工所在部门统计表',
	        subtext: 'Echarts',
         	x: 'center'
	    },
	    tooltip : {
	    	show: true,//显示提示
	        trigger: 'item',
	        formatter: "{b} : {c}<br/> 占比例： {d}%"
	    },
	    legend: {//图例
	    	orient: 'horizontal',//方向：垂直/横向
	        x: 'right',//向右排列
	        y:'50px',
			data: ['技术部','人事部','运营部','市场部','销售部','财务部']//必须和series里的data里的name值一样
		},
	    series : [
	        {
	            name: '访问来源',
	            type: 'pie',
	            radius : '55%',//半径
	            center: ['50%', '60%'],//x，y轴排列
	            selectedMode: 'single',//选择模式：单一
	            data:[
	                { value: jishubu, name: '技术部' },
					{ value: renshibu, name: '人事部' },
					{ value: yunyingbu, name: '运营部' },
					{ value: shichangbu, name: '市场部' },
					{ value: xiaoshoubu, name: '销售部' },
					{ value: caiwubu, name: '财务部' }
	            ],
	            itemStyle: {
	                emphasis: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
	            }
	        }
	    ]
	}
	
	
	//为echarts对象加载数据 
	myChart.setOption(option);
	window.onresize = myChart.resize;
}
