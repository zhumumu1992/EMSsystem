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

//点击确定提示盒子隐藏
$('.yes, .no, .close').bind('click',function(){
	$('.banDel').fadeOut(100);
})


//获取客户信息数据
$.ajax({
	type: "get",
	url: "http://localhost:1967/ECharts/LineChart",
	success: function(data) {//前端访问后台数据
		var nameAry = [],
			ageAry = [],
			heightAry = [],
			weightAry = [];
		if(data){
			for(var i=0; i<data.length; i++){
				nameAry.push(data[i].username);
				ageAry.push(data[i].age);
				heightAry.push(data[i].height);
				weightAry.push(data[i].weight);
			}
			getBarLineChart(nameAry, ageAry, heightAry, weightAry);
		}
	},
	error: function() {
		console.log('失败');
	}
});

//柱线图(员工年龄、身高和体重统计)
function getBarLineChart(nameAry, ageAry, heightAry, weightAry) {
	var myChart = echarts.init(document.getElementById('BarLineChart'));
	option = {
		title: {
	        text: '公司内部员工年龄、身高和体重统计图表',
	        x: 'center'//居中
	    },
	    tooltip: {//提示
	        trigger: 'axis'//触发器：显示轴
	    },
	    toolbox: {
	    	show: true,//是否显示
	        feature: {//特性
	            dataView: {show: true, readOnly: false},//数据视图
	            magicType: {show: true, type: ['line', 'bar']},//切换视图（折线/柱状）
	            restore: {show: true},//重新加载视图
	            saveAsImage: {show: true}//保存该视图为图片
	        }
	    },
	    legend: {
	        data:['年龄（岁）','身高（cm）','体重（kg）'],
	        x: 'left'
	    },
	    xAxis: [
	        {
	            type: 'category',
	            data: nameAry,
	            axisLabel:{//让字倾斜显示，避免中间空出一格不显示名称
                    interval:0,  
                    rotate:45,//倾斜度 -90 至 90 默认为0  
                    margin:10
                }
	        }
	    ],
	    yAxis: [
	        {
	            type: 'value',
	            name: '年龄（岁）',
	            min: 0,
	            max: 200,
	            interval: 10,
	            axisLabel: {
	                formatter: '{value} 岁'
	            }
	        },
	        {
	            type: 'value',
	            name: '身高（cm）',
	            min: 0,
	            max: 200,
	            interval: 10,
	            axisLabel: {
	                formatter: '{value} cm'
	            }
	        }
	    ],
	    series: [
	        {
	            name:'年龄（岁）',
	            type:'bar',
	            data:ageAry
	        },
	        {
	            name:'身高（cm）',
	            type:'bar',
	            data:heightAry
	        },
	        {
	            name:'体重（kg）',
	            type:'line',
	            yAxisIndex: 1,
	            data:weightAry
	        }
	    ]
	};
	
	//为echarts对象加载数据 
	myChart.setOption(option);
	window.onresize = myChart.resize;
}