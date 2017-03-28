var express = require('express');//引入模块
var router = express.Router();//引入函数方法
var fs = require('fs');//上传图片用的
var formidable = require('formidable');//上传图片用的

//连接数据库
var mysql = require('mysql');

var pool = mysql.createPool({
	host:'localhost',//ip地址
	user: 'root',//数据库用户名
	password: '1992',//数据库密码
	database:'zsl',//数据库名
	port:3306//端口号 
});

//封装一个公共的函数用来获取MySql数据
function getAdmin(param, callback, sql){
	pool.getConnection(function(err,connection){
		var sqlFun = sql;
		connection.query(sqlFun, param, function(err, result){
			callback(err, result, connection);
		})
	})
}

//CRM注册时将图片上传数据库后台
router.post('/uploadImg',function(req,res){
	var form = new formidable.IncomingForm();//创建IncomingForm对象
	form.uploadDir = "public/upload/temp/";//设置上传图片的路径
	//如果form.uploadDir不赋值，它默认的位置是c盘的用户文件夹里
	form.parse(req,function(err,fields,files){
//		console.log(files);
		for(var i in files){
			var file = files[i];
			var fName = (new Date()).getTime();//设置图片名称是时间戳
			switch(file.type){
				case "image/jpeg":
					fName = fName + ".jpg";
					break;
				case "image/png":
					fName = fName + ".png";
					break;
			}
			//实现重新命名
			var newPath = "public/upload/" + fName;
			fs.renameSync(file.path, newPath);//重命名
//			console.log(newPath);
			res.send(fName);
		}
	})
})

//注册后台
router.post('/register',function(req,res){
    var admin_Name = req.body.username,//向前台请求的用户名
        admin_Pswd = req.body.pasword,//向前台请求的密码
        admin_Sex = req.body['sex'],//向前台请求的性别
        admin_Tel = req.body['tel'],//向前台请求的电话
        admin_Email = req.body['email'],//向前台请求的年龄
        upImg = req.body.upImg;//向前台请求的头像
	getAdmin([admin_Name], function(err, result, connection){
		connection.release();
		//console.log(result.length);
		//console.log(admin_Name, admin_Pswd, admin_Sex, admin_Tel, admin_Email, upImg);
		if(result.length == 0){
			getAdmin([admin_Name, admin_Pswd, admin_Sex, admin_Tel, admin_Email, upImg], function(err, result, connection){
				console.log(result);
				connection.release();
				if(result.insertId > 0){
					res.send({flag:1})//注册成功
				}
			},'insert into register(adminName,adminPwd,adminSex,adminTel,adminEmail,adminHeadPortrait) values(?,?,?,?,?,?)')
		}else if(result.length > 0){
			res.send({flag:2})//用户名已存在
		}else{
			res.send({flag:3})//注册失败
		}
	},'select * from register where adminName = ?');
})


//登录后台
router.post('/Login',function(req,res){
    var adminName = req.body['adminName'],//向前台请求的用户名
        adminPwd = req.body['adminPwd'];//向前台请求的密码
	
	getAdmin([adminName], function(err, result, connection){
		connection.release();
		if(result.length == 0){
			res.send({flag:2})//用户名不存在
		}else if(result.length > 0){
			if(adminPwd == result[0].adminPwd){
				req.session.adminName = adminName;//设置session
				res.send({//登录成功
					flag:1, 
					adminID:result[0].id,
					adminHeadImg:result[0].adminHeadPortrait
				})
			}else{
				res.send({flag:3})//密码错误
			}
		}else{
			res.send({flag:4})//发生未知错误
		}
	},'select * from register where adminName = ?');
})













module.exports = router;