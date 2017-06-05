var express = require('express');
var router = express.Router();

var AV = require('leanengine');

// 上传文件
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.post('/login', function(req, res, next) {
  console.log(111111111111111111);
  var username = req.body.username;
  var password = req.body.password;
  if (!username || username.trim().length == 0       //trim()函数：去掉左右空格
    || !password || password.trim().length == 0) {
     var msg = {
      'statuscode': '-1',
      'message': '用户名或密码不能为空'
    }
    res.json(msg);
    return;
  }
  AV.User.logIn(username, password).then(function(user) {
    var currentUser = AV.User.current();
    console.log(55555555555555555555);
    console.log(currentUser)
    res.saveCurrentUser(user);   // 保存当前用户到 Cookie
    var msg = {
      'statuscode': '1',
      'message': '操作成功',
      'currentUser': currentUser   //返回当前用户信息
    }
    res.json(msg);
    // res.redirect('/todos');
  }, function(err) {
     JSON.stringify(err);
     var msg = {
      'statuscode': '-1',
      'message': '操作失败',
      'code': err.code
    }
    if(err.code == 210){
      msg.message = '用户名和密码不匹配';
    }
    if(err.code == 211){
      msg.message = '找不到该用户';
    }
    res.json(msg);
    // res.redirect('/users/login?errMsg=' + JSON.stringify(err));
  }).catch(next);
});
// 注册
router.post('/register', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  if (!username || username.trim().length == 0       //trim()函数：去掉左右空格
    || !password || password.trim().length == 0) {
     var msg = {
      'statuscode': '-1',
      'message': '用户名或密码不能为空'
    }
    res.json(msg);
    return;
    // return res.redirect('/users/register?errMsg=用户名或密码不能为空');
  }
  var user = new AV.User();
  user.set("username", username);
  user.set("password", password);
  user.signUp().then(function(user) {    //调用登陆接口
    res.saveCurrentUser(user);    // 保存当前用户到 Cookie
    var msg = {
      'statuscode': '1',
      'message': '操作成功'
    }
    res.json(msg);
  }, function(err) {
    JSON.stringify(err);
    var msg = {
      'statuscode': '-1',
      'message': '操作失败',
      'code': err.code
    }
    if(err.code == 202){
      msg.message = '用户名已被占用';
    }
    res.send(msg);
    // res.redirect('/users/register?errMsg=' + JSON.stringify(err));
  }).catch(next);
});



//获取用户基本信息
router.get('/current-user', function(req, res, next) {
    var currentUserId = req.query.currentUserId;
    console.log(currentUserId);
    var query = new AV.Query('_User');
    query.get(currentUserId).then(function (User) {
         var msg = {
             'statuscode': '1',
             'message': '操作成功',
             'user': User
           }
           res.json(msg);
    }, function (error) {
          var msg = {
            'statuscode': '-1',
            'message': '操作失败',
            'error': error
          }
          res.json(msg);
    }); 
})

//编辑用户基本信息
router.post('/current-user-edit', function(req, res, next) {
     var objectId = req.body.objectId;
     var user = AV.Object.createWithoutData('_User', objectId);
     user.set('username',req.body.username);
     user.set('description',req.body.description);
     user.set('mobilePhoneNumber',req.body.phone);
     user.set('weixin',req.body.weixin);
     user.set('qq',req.body.qq);
     user.set('sex',req.body.sex);

    user.save().then(function (User) {
         var msg = {
             'statuscode': '1',
             'message': '操作成功',
             'user': User
           }
           res.json(msg);
    }, function (error) {
          var msg = {
            'statuscode': '-1',
            'message': '操作失败',
            'error': error
          }
          res.json(msg);
    }); 
})


//获取用户喜欢的内容
router.get('/current-user-likes', function(req, res, next) {
    //判断是否当前登录用户
    var currentUserId = req.query.currentUserId;
    var User = AV.Object.createWithoutData('_User', currentUserId);
    // 用户收藏relation
    var currentUser = AV.Object.createWithoutData('_User', currentUserId);
     var relation = currentUser.relation('containedLikes');
     var query = relation.query();
     query.find().then(function (results) {
       var msg = {
             'statuscode': '1',
             'message': '操作成功',
             'data': results,
             'user': User
           }
        res.json(msg);
     }, function (error) {
      var msg = {
            'statuscode': '-1',
            'message': '操作失败',
            'error': error
          }
       res.json(msg);
     });
   
})

//获取用户收藏的话题
router.get('/current-user-topics', function(req, res, next) {
    // 当前用户id
    var currentUserId =  req.query.currentUserId;
    // 用户收藏话题relation
    var currentUser = AV.Object.createWithoutData('_User', currentUserId);
     var relation = currentUser.relation('containedTopics');
     var query = relation.query();
     query.find().then(function (results) {
       var msg = {
             'statuscode': '1',
             'message': '操作成功',
             'data': results
           }
        res.json(msg);
     }, function (error) {
      var msg = {
            'statuscode': '-1',
            'message': '操作失败',
            'error': error
          }
       res.json(msg);
     });
   
})

//关注的人
router.get('/current-user-focus', function(req, res, next) {
     var currentUserId = req.query.currentUserId
    var User = AV.Object.createWithoutData('_User', currentUserId);
    // 用户收藏话题relation
    var query = new AV.Query('obj_focus');
    var currentUser = AV.Object.createWithoutData('_User', currentUserId);
    query.equalTo('user_id',currentUser);
     query.include('target_id');
     query.find().then(function (results) {

        // include的pointer类型字段需要json化才能生效
        results.forEach(function(result){
        result.set('target_id', result.get('target_id') ?  result.get('target_id').toJSON() : null);
      });
        //--end

       var msg = {
             'statuscode': '1',
             'message': '操作成功',
             'data': results
           }
        res.json(msg);
     }, function (error) {
      var msg = {
            'statuscode': '-1',
            'message': '操作失败',
            'error': error
          }
       res.json(msg);
     });
})



//粉丝
router.get('/current-user-follow', function(req, res, next) {
    // 当前用户id
    // var currentUserId =  req.query.currentUserId;
    var User = AV.Object.createWithoutData('_User', currentUserId);
    var currentUserId = req.query.currentUserId
    // 用户收藏话题relation
    var query = new AV.Query('obj_focus');
    var user = AV.Object.createWithoutData('_User', currentUserId);
    query.equalTo('target_id',user);
    query.include('user_id');
     query.find().then(function (results) {

      // include的pointer类型字段需要json化才能生效
      results.forEach(function(result){
      result.set('user_id', result.get('user_id') ?  result.get('user_id').toJSON() : null);
    });
      //--end
       var msg = {
             'statuscode': '1',
             'message': '操作成功',
             'data': results
           }
        res.json(msg);
     }, function (error) {
      var msg = {
            'statuscode': '-1',
            'message': '操作失败',
            'error': error
          }
       res.json(msg);
     });
   
})



// 头像上传
var fs = require('fs');
router.post('/upload', multipartMiddleware,function(req, res, next){
  var avatar = req.files.file;
  if(avatar){
     fs.readFile(avatar.path, function(err, data){
            if(err){
              console.log("读取文件失败"+err);
              msg = {
                'statuscode': -1,
                'message': '读取文件失败'
              }
              res.json(msg);
            }  
            var base64Data = data.toString('base64');
            var theFile = new AV.File(avatar.name, {base64: base64Data});

            // 上传头像到_File
            theFile.save().then(function(result){
              console.log("上传头像成功！"+result);
              // 保存头像到当前用户
              var currentUser = AV.User.current();
              currentUser.set('avatar', theFile);
              currentUser.save().then(function() {
                console.log('保存头像到用户成功');
                  msg = {
                    'statuscode': 1,
                    'message': '保存头像到用户成功'
                  }
                  res.json(msg);
               }, function(error) {
                  error = JSON.stringify(error);
                  msg = {
                    'data': error,
                    'statuscode': -1,
                    'message': '保存头像到用户失败'
                  }
                  res.json(msg);
                  console.log('保存头像到用户失败'+error);
                });
            });
        });

      
  }

})



//获取当前用用户
router.get('/current-user', function(req, res, next){
  var user = req.AV.user;
  console.log(user)
  var msg = {};
  if(user){
    msg = {
      'data': user,
      'statuscode': 1,
      'message': '操作成功'
    }
  }else{
    msg = {
      'data': [],
      'statuscode': -1,
      'message': '操作失败'
    }
  }
  res.json(msg);
})


// demo： user表和喜欢的文章article建立relation
//   var user = new AV.Object('_User');
//   user.set('username', '5');
//   user.set('password', '5');

//   var like1 = new AV.Object('obj_article');
//   like1.set('title', '1111111111111111111');
//   like1.set('content', '111111111111111111111');
//   like1.set('type', '4');

//  var like2 = new AV.Object('obj_article');
//   like2.set('title', '333333333333333333333');
//   like2.set('content', '3333333333333333333');
//   like2.set('type', '4');

//   var like3 = new AV.Object('obj_article');
//   like3.set('title', '222222222222222');
//   like3.set('content', '2222222222222');
//   like3.set('type', '4');


// var likes = [like1, like2, like3];
// AV.Object.saveAll(likes).then(function () {
//   var relation = user.relation('containedLikes'); // 创建 AV.Relation
//   likes.map(relation.add.bind(relation));
//   return user.save();// 保存到云端
// }).then(function(user) {
//   console.log(user)
// }, function (error) {
//   console.log(error)
// });


router.post('/logout', function(req, res, next) {
  // req.currentUser.logOut();
  // res.clearCurrentUser();
  console.log('111111111111111111111111111111111');
  console.log(AV.User.current())
  AV.User.logOut();
  var currentUser = AV.User.current();
  if(currentUser){
    var msg = {
            'statuscode': '-1',
            'message': '退出失败'
          }
    res.json(msg);
  }else{
    var msg = {
            'statuscode': '1',
            'message': '退出成功'
          }
    res.json(msg);
  }
})

module.exports = router;
