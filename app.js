var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//自定义中间件
var uploadImg = require('./routes/CRM_Customer-management-system/login_register');//CRM注册、登录后台
var register_Login = require('./routes/CRM_Customer-management-system/login_register');//CRM注册、登录后台
var getData = require('./routes/CRM_Customer-management-system/Customer-information-data.js');//CRM-获取后台的数据和后台交互逻辑

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//设置session，使用这个中间件,必须要在设置路径之前写
app.use(session({
	secret:'1992',
	name:'zsl',
	resave:false,
	saveUninitialized:true
}))

//自定义调用变量
app.use('/upload',uploadImg);//CRM注册时将图片上传数据库后台
app.use('/userLogin',register_Login);//CRM注册后台
app.use('/userRegister',register_Login);//CRM登录后台
app.use('/judgeSession',getData);//CRM判断管理员是否登录
app.use('/SignOut',getData);//CRM管理员退出登录
app.use('/ECharts',getData);//CRM-获取后台客户信息数据并用柱状图展示
app.use('/getDataArr',getData);//CRM-获取后台数据
app.use('/CustomerDetail',getData);//CRM-客户信息详情
app.use('/modifyInfo',getData);//CRM-修改客户信息
app.use('/AddInfo',getData);//CRM-新增一条客户信息
app.use('/search',getData);//CRM-搜索客户信息
app.use('/adminDetail',getData);//CRM-管理员信息详情
app.use('/selectDepa',getData);//CRM选择部门功能
app.use('/deleteCustomerInfo',getData);//CRM-删除客户信息(假)
app.use('/recoveryInfo',getData);//CRM-还原删除的客户信息
app.use('/RemoveCompletely',getData);//CRM-彻底删除客户信息(真)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



app.listen('1967',function(){
	console.log('server start...');
})
module.exports = app;
