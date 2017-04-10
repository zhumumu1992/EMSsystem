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
	url: "http://localhost:1967/ECharts/PieChart",
	success: function(data) {//前端访问后台数据
		console.log(data);
		if(data){
			getPieChart(data);
			getPieChartSex(data)
		}
	},
	error: function() {
		console.log('error');
	}
});

//饼图(员工年龄区间统计)
function getPieChart(ageSort) {
	var myChart = echarts.init(document.getElementById('PieChart'));
	var Twenty = Thirty = Forty = Fifty = Sixty = 0;
	for(var i=0; i<ageSort.length; i++){
		if(ageSort[i].age >= 20 && ageSort[i].age < 30){
			Twenty++;
		}else if(ageSort[i].age >= 30 && ageSort[i].age < 40){
			Thirty++;
		}else if(ageSort[i].age >= 40 && ageSort[i].age < 50){
			Forty++;
		}else if(ageSort[i].age >= 50 && ageSort[i].age < 60){
			Fifty++;
		}else if(ageSort[i].age >= 60 && ageSort[i].age < 70){
			Sixty++;
		}
	}
	console.log(Twenty,Thirty,Forty,Fifty,Sixty);
	var option = {
		title : {
	        text: '公司内部员工年龄区间统计表',
	        subtext: 'Echarts',
         	x: 'center'
	    },
	    tooltip : {
	    	show: true,//显示提示
	        trigger: 'item',
	        formatter: "占比例： <br/>{b}: {c} ({d}%)"
	    },
	    legend: {//图例
	    	orient: 'horizontal',//方向：垂直/横向
	        x: 'right',//向右排列
	        y:'50px',
			data: ['20~30','30~40','40~50','50~60','60~70']//必须和series里的data里的name值一样
		},
	    series : [
	        {
	            name: '访问来源',
	            type: 'pie',
	            radius : '55%',//半径
	            center: ['50%', '60%'],//x，y轴排列
	            selectedMode: 'single',//选择模式：单一
	            data:[
	                { value: Twenty, name: '20~30' },
					{ value: Thirty, name: '30~40' },
					{ value: Forty, name: '40~50' },
					{ value: Fifty, name: '50~60' },
					{ value: Sixty, name: '60~70' }
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


//饼图(员工性别统计)
function getPieChartSex(sexSort) {
	var myChart = echarts.init(document.getElementById('PieChart_Sex'));
	var man = woman = 0;
	for(var i=0; i<sexSort.length; i++){
		if(sexSort[i].sex == '男'){
			man++;
		}else if(sexSort[i].sex == '女'){
			woman++;
		}
	}
	console.log(man,woman);
	var option = {
		title : {
	        text: '公司内部员工性别统计表',
	        subtext: 'Echarts',
         	x: 'center'
	    },
	    tooltip : {
	    	show: true,//显示提示
	        trigger: 'item',
	        formatter: "占比例： <br/>{b}: {c} ({d}%)"
	    },
	    legend: {//图例
	    	orient: 'horizontal',//方向：垂直/横向
	        x: 'right',//向右排列
			data: ['男生','女生']//必须和series里的data里的name值一样
		},
	    series : [
	        {
	            name: '访问来源',
	            type: 'pie',
	            radius : '55%',//半径
	            center: ['50%', '60%'],//x，y轴排列
	            selectedMode: 'single',//选择模式：单一
	            data:[
	                { value: man, name: '男生' },
					{ value: woman, name: '女生' }
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
//	window.onresize = myChart.resize;
}
