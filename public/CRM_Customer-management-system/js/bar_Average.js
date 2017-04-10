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
			heightAry = [],
			weightAry = [];
		if(data){
			for(var i=0; i<data.length; i++){
				nameAry.push(data[i].username);
				heightAry.push(data[i].height);
				weightAry.push(data[i].weight);
			}
			getBar_Average(nameAry, heightAry, weightAry);
		}
	},
	error: function() {
		console.log('失败');
	}
});

//柱状图（平均身高、体重统计）
function getBar_Average(nameAry, heightAry, weightAry) {
	var myChart = echarts.init(document.getElementById('Bar_Average'));
	var option = {
	    title : {
	        text: '公司内部员工平均身高、体重统计图表',
	        subtext: 'Echarts',
	        x: 'center'//居中
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['身高（cm）','体重（kg）'],
	        y:'20px',
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
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:'身高（cm）',
	            type:'bar',
	            data:heightAry,
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
	        },
	        {
	            name:'体重（kg）',
	            type:'bar',
	            data:weightAry,
	            markPoint : {
	                data : [
	                    {type : 'max', name: '最大值'},
	                    {type : 'min', name: '最小值'}
	                ]
	            },
	            markLine : {
	                data : [
	                    {type : 'average', name : '平均值'}
	                ]
	            }
	        }
	    ]
	};
	
	
	//为echarts对象加载数据 
	myChart.setOption(option);
	window.onresize = myChart.resize;
}