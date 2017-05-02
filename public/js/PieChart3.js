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
	url: "http://47.92.37.168:1992/ECharts/LineChart",
	cache:true,
	success: function(data) {//前端访问后台数据
		var nameAry = [],
			ageAry = [];
		if(data){
			for(var i=0; i<data.length; i++){
				nameAry.push(data[i].username);
				ageAry.push(data[i].age);
			}
			getPieChart3(nameAry, ageAry);
		}
	},
	error: function() {
		$('.banDel').fadeIn(200);
		$('.banDel .delP1').text('数据交互error，请联系维护人员!');
	}
});

//柱状图（平均年龄统计）
function getPieChart3(nameAry, ageAry) {
	var myChart = echarts.init(document.getElementById('PieChart3'));
	var option = {
	    title : {
	        text: '公司内部员工平均年龄统计图表',
	        subtext: 'Echarts',
	        x: 'center'//居中
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['年龄（岁）'],
	        x: 'left'//居左
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar']},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            data : nameAry,
	            axisLabel:{//让字倾斜显示，避免中间空出一格不显示名称
                    interval:0,  
                    rotate:45,//倾斜度 -90 至 90 默认为0  
                    margin:10
                }
	        }
	    ],
	    yAxis : [
	        {
	            type: 'value',
	            name: '年龄（岁）',
	            min: 0,
	            max: 100,
	            interval: 10,
	            axisLabel: {
	                formatter: '{value} 岁'
	            }
	        }
	    ],
	    series : [
	        {
	            name:'年龄（岁）',
	            type:'bar',
	            data:ageAry,
	            markPoint : {
	                data : [
	                    {type : 'max', name: '最大值'},
	                    {type : 'min', name: '最小值'}
	                ]
	            },
	            markLine : {
	                data : [
	                    {type : 'average', name: '平均值'}
	                ]
	            }
	        }
	    ]
	};
	
	
	//为echarts对象加载数据 
	myChart.setOption(option);
	window.onresize = myChart.resize;
}