var express = require('express');
var router = express.Router();

//连接数据库
var mysql = require('mysql');

//创建连接  
var pool = mysql.createPool({
	host:'127.0.0.1',//ip地址
	user: 'root',//数据库用户名
	password: 'root',//数据库密码
	database:'information',//数据库名
	port:3306//端口号 
});

//获取数据库信息（用于分页）
function getPaging(callback){
	pool.getConnection(function(err,connection){
		var getDatabase_Sql = 'select * from useinfo ';
		connection.query(getDatabase_Sql, function(err,result){
			console.log('成功'+result);
			connection.release();
			callback(err,result);
		})
	})
}

//获取客户数据库信息（用于查看详情）
function getId(id,callback){
	pool.getConnection(function(err,connection){
		var getDatabase_Sql = 'select * from useinfo where id = ?';
		connection.query(getDatabase_Sql, [id], function(err,result){
			console.log('成功'+result);
			connection.release();
			callback(err,result);
		})
	})
}
//获取管理员数据库信息（用于查看详情）
function getAdminId(id,callback){
	pool.getConnection(function(err,connection){
		var getDatabase_Sql = 'select * from register where id = ?';
		connection.query(getDatabase_Sql, [id], function(err,result){
			console.log('成功'+result);
			connection.release();
			callback(err,result);
		})
	})
}

//封装一个公共的函数用来获取MySql数据
function getAdmin(param, callback, sql){
	pool.getConnection(function(err,connection){
		var sqlFun = sql;
		connection.query(sqlFun, param, function(err, result){
			callback(err, result, connection);
		})
	})
}

//主页判断管理员是否登录
router.post('/getSession', function(req, res) {
	if(req.session.adminName != '' && req.session.adminName != null){
		res.send({flag:1});//已登录
	}else{
		res.send({flag:0});//未登录
//		res.redirect('http://localhost:1967/CRM_Customer-management-system/login.html');//未登录
	}
});

//点击注销账号
router.post('/SignOut', function(req, res) {
	req.session.destroy()//清除session
	res.send({flag:1});//已清除
});


//第一版本分页
//router.get('/paging', function(req, res) {
//	getPaging(function(err,result){
//		var thisPage = req.query.thisPage,
//		total = result.length,//数据总数量
//		everyPageNum = 8,//每页展示5条数据
//		totalPage = Math.ceil(total / everyPageNum),//算出总页数
//		start = everyPageNum * (thisPage-1),//起始位置
//  	end = everyPageNum * thisPage;//终点位置
//  	
//		var sliceArr = result.slice(start,end),
//			everyPageData = {
//				total:total,//数据总数量
//				everyPageNum:everyPageNum,//每页展示5条数据
//				totalPage:totalPage,//总页数
//				arr:sliceArr//截取后的数组
//			}
//		//console.log(sliceArr)
//		res.send(everyPageData);
//		//console.log(everyPageData)
//	})
//});
//第二版本分页
router.get('/paging', function(req, res) {
	var thisPage = req.query.thisPage,
		total = 0;
	getAdmin([0],function(err,result,connection){
		connection.release();
		total = result.length;
		if(err){
			console.log(err);
			return;
		}else if(total == 0){
			return;
		}else{
			pageSize = 8;
			totalPage = Math.ceil(total/pageSize);
			startPage = pageSize * (thisPage-1);
			getAdmin([0, startPage, pageSize],function(err,result,connection){
				connection.release();
				res.send({
					total:total,//数据总数量
					everyPageNum:pageSize,//每页展示5条数据
					totalPage:totalPage,//总页数
					arr:result//截取后的数组
				})
			},'select * from useinfo where deleteInfo=? limit ?,?');
		}
	},'select * from useinfo where deleteInfo=?');
});

//选择部门功能(未删除的)
router.get('/department',function(req,res){
	var selectDep = req.query.getDepartment;
//	console.log(selectDep);
	getAdmin([selectDep],function(err,result,connection){
		connection.release();
		//console.log(result)
		res.send(result);
	},'select * from useinfo where department=? and deleteInfo=0');
})

//查看客户信息详情
router.get('/CustomerDetail',function(req,res){
	var id = req.query.id;
	getId(id,function(err,result){
		for(var i=0; i<result.length; i++){
			if(id == result[i].id){
				res.send(result[i]);
			}
		}
	})
})

//查看管理员信息详情
router.get('/adminDetail',function(req,res){
	var id = req.query.id;
	getAdminId(id,function(err,result){
		for(var i=0; i<result.length; i++){
			if(id == result[i].id){
				res.send(result[i]);
			}
		}
	})
})

//修改客户信息
router.post('/modify',function(req,res){
	var modifyID = parseInt(req.body.modifyID),
		modifyName = req.body.modifyName,
		modifySex = req.body.modifySex,
		modifyJob = req.body.modifyJob,
		modifyTel = req.body.modifyTel,
		modifyEmail = req.body.modifyEmail,
		modifyAge = req.body.modifyAge,
		modifyBirthDate = req.body.modifyBirthDate,
		modifyHeight = req.body.modifyHeight,
		modifyWeight = req.body.modifyWeight,
		modifyMariteal = req.body.modifyMariteal,
		modifyAddress = req.body.modifyAddress,
		modifyDepartment = req.body.modifyDepartment,
		modifyInductionTime = req.body.modifyInductionTime,
		modifyCat = req.body.modifyCat,
		modifyJobCategory = req.body.modifyJobCategory;
	//console.log(typeof modifyID);
	
	//先按前台传的ID查找数据库，找到的话执行update更新数据库
	getAdmin([modifyID],function(err,result,connection){
		connection.release();
		//console.log(result.length,modifyID);
		if(result.length > 0){
			getAdmin([modifyName, modifySex, modifyAge, modifyBirthDate, modifyHeight, modifyWeight, modifyJob, modifyMariteal, modifyAddress, modifyTel, modifyEmail, modifyDepartment, modifyInductionTime, modifyCat, modifyJobCategory, modifyID], function(err, result, connection){
				connection.release();
				console.log(result);
				if(result.changedRows > 0){
					res.send({flag:1})//修改成功
				}else{
					res.send({flag:3})//修改失败
				}
			},'update useinfo set username=?,sex=?,age=?,BirthDate=?,height=?,weight=?,job=?,MaritalStatus=?,address=?,tel=?,email=?,department=?,InductionTime=?,cat=?,JobCategory=? where id=?');
		}else if(result.length == 0){
			res.send({flag:2})//数据不存在
		}
	},'select * from useinfo where id=?');
})

//修改管理员信息
router.post('/modifyAdmin',function(req,res){
	var modifyID = parseInt(req.body.modifyID),
		modifyName = req.body.modifyName,
		modifyPwd = req.body.modifyPwd,
		modifySex = req.body.modifySex,
		modifyTel = req.body.modifyTel,
		modifyEmail = req.body.modifyEmail;
	//console.log(typeof modifyID);
	
	//先按前台传的ID查找数据库，找到的话执行update更新数据库
	getAdmin([modifyID],function(err,result,connection){
		connection.release();
		//console.log(result.length,modifyID);
		if(result.length > 0){
			getAdmin([modifyName, modifyPwd, modifySex, modifyTel, modifyEmail, modifyID], function(err, result, connection){
				connection.release();
				console.log(result);
				if(result.changedRows > 0){
					res.send({flag:1})//修改成功
				}else{
					res.send({flag:3})//修改失败
				}
			},'update register set adminName=?,adminPwd=?,adminSex=?,adminTel=?,adminEmail=? where id=?');
		}else if(result.length == 0){
			res.send({flag:2})//数据不存在
		}
	},'select * from register where id=?');
})

//新增一条客户信息数据
router.post('/add',function(req,res){
	var modifyName = req.body.modifyName,
		modifySex = req.body.modifySex,
		modifyAge = req.body.modifyAge,
		modifyBirthDate = req.body.modifyBirthDate,
		modifyHeight = req.body.modifyHeight,
		modifyWeight = req.body.modifyWeight,
		modifyJob = req.body.modifyJob,
		modifyMariteal = req.body.modifyMariteal,
		modifyAddress = req.body.modifyAddress,
		modifyTel = req.body.modifyTel,
		modifyEmail = req.body.modifyEmail,
		modifyDepartment = req.body.modifyDepartment,
		modifyInductionTime = req.body.modifyInductionTime,
		modifyCat = req.body.modifyCat,
		modifyJobCategory = req.body.modifyJobCategory,
		upImg = req.body.upImg;
		
	getAdmin([modifyName, modifySex, modifyAge, upImg, modifyBirthDate, modifyHeight, modifyWeight, modifyJob, modifyMariteal, modifyAddress, modifyTel, modifyEmail, modifyDepartment, modifyInductionTime, modifyCat, modifyJobCategory], function(err, result, connection){
		connection.release();
		if(result.affectedRows > 0){
			res.send({flag:1})//新增成功
		}else{
			res.send({flag:2})//新增失败
		}
	},'insert into useinfo(username,sex,age,HeadPortrait,BirthDate,height,weight,job,MaritalStatus,address,tel,email,department,InductionTime,cat,JobCategory,deleteInfo) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,0)');
})


//搜索功能
router.post('/searchResult',function(req,res){
	var SearchName = req.body.keyword_name;
	pool.getConnection(function(err,connection){
		var getDatabase_Sql = 'select * from useinfo where concat(username,sex,age,HeadPortrait,BirthDate,height,weight,job,MaritalStatus,address,tel,email,department,InductionTime,cat,JobCategory) like "%" ? "%"';
		connection.query(getDatabase_Sql, [SearchName], function(err,result){
			connection.release();
			res.send(result);
		})
	})
	
})

//获取客户信息数据并用饼状图展示年龄
router.get('/PieChart', function(req, res) {
	getPaging(function(err,result){
		res.send(result);
	})
})

//获取客户信息数据并用饼状图展示身高、体重、年龄
router.get('/LineChart', function(req, res) {
	getPaging(function(err,result){
		res.send(result);
	})
})

//选择部门功能(已删除的)
router.get('/Deletedepa',function(req,res){
	var selectDep = req.query.getDepartment;
//	console.log(selectDep);
	getAdmin([selectDep],function(err,result,connection){
		connection.release();
		//console.log(result)
		res.send(result);
	},'select * from useinfo where department=? and deleteInfo=1');
})

//删除客户信息(假)
router.get('/delete',function(req,res){
	var deleteID = req.query.id;
	var del = 1;
	getAdmin([del,deleteID],function(err,result,connection){
		connection.release();
		console.log(result);
		res.send({flag:1});//删除成功
	},'update useinfo set deleteInfo=? where id=?');
})

//获取删除后的数据信息
function getDelete(callback){
	pool.getConnection(function(err,connection){
		var getDatabase_Sql = 'select * from useinfo where deleteInfo=1';
		connection.query(getDatabase_Sql, function(err,result){
			console.log('成功'+result);
			connection.release();
			callback(err,result);
		})
	})
}

//回收站列表
router.get('/recycleBin', function(req, res) {
	var thisPage = req.query.thisPage;
		total = 0;
	getDelete(function(err,result){
		var thisPage = req.query.thisPage,
		total = result.length,//数据总数量
		everyPageNum = 8,//每页展示5条数据
		totalPage = Math.ceil(total / everyPageNum),//算出总页数
		start = everyPageNum * (thisPage-1),//起始位置
    	end = everyPageNum * thisPage;//终点位置
    	
		var sliceArr = result.slice(start,end),
			everyPageData = {
				total:total,//数据总数量
				everyPageNum:everyPageNum,//每页展示5条数据
				totalPage:totalPage,//总页数
				arr:sliceArr//截取后的数组
			}
		//console.log(sliceArr)
		res.send(everyPageData);
		//console.log(everyPageData)
	})
});

//还原删除后的客户信息
router.get('/recovery',function(req,res){
	var recoveryID = req.query.id;
	var del = 0;
	getAdmin([del,recoveryID],function(err,result,connection){
		connection.release();
		console.log(result);
		res.send({flag:1});//删除成功
//		if(result.affectedRows > 0){
//			res.send({flag:1});//删除成功
//		}else{
//			res.send({flag:2});//删除失败
//		}
//	},'delete from useinfo where id=?');
	},'update useinfo set deleteInfo=? where id=?');
})

//彻底删除客户信息
router.get('/ConfirmDelete',function(req,res){
	var deleteID = req.query.id;
	getAdmin([deleteID],function(err,result,connection){
		connection.release();
		console.log(result);
		if(result.affectedRows > 0){
			res.send({flag:1});//删除成功
		}else{
			res.send({flag:2});//删除失败
		}
	},'delete from useinfo where id=?');
})

//主页日常工作安排表——获取数据
router.get('/getWorkSchedule',function(req,res){
	pool.getConnection(function(err,connection){
		var get_Sql = 'select * from workSchedule';
		connection.query(get_Sql, function(err,result){
			connection.release();
			res.send(result);
		})
	})
})

//主页日常工作安排表——添加事项
router.get('/NewItems',function(req,res){
	var PersonInCharge = req.query.PersonInCharge,
		JobContent = req.query.JobContent,
		time = req.query.time;
	getAdmin([PersonInCharge, JobContent, time], function(err, result, connection){
		connection.release();
		if(result.affectedRows > 0){
			res.send({flag:1})//新增事项成功
		}else{
			res.send({flag:2})//新增事项失败
		}
	},'insert into workSchedule(PersonInCharge, JobContent, time) values(?,?,?)');
})

//彻底删除日常工作安排表
router.get('/deleteThisWork',function(req,res){
	var deleteID = req.query.id;
	getAdmin([deleteID],function(err,result,connection){
		connection.release();
		console.log(result);
		if(result.affectedRows > 0){
			res.send({flag:1});//删除事项成功
		}else{
			res.send({flag:2});//删除事项失败
		}
	},'delete from workSchedule where id=?');
})











module.exports = router;