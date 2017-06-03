var express = require('express');
var router = express.Router();

var AV = require('leanengine');

router.all('*',function(req,res,next){
  if (!req.AV.user){
    res.redirect('/user/login');
  }else{
    next();
  }
});

//获取所有文字动态
router.get('/', function(req, res, next) {
  var query = new AV.Query('obj_article');
  query.equalTo('type','4');
  query.descending('updatedAt');//按照更新时间降序排列
  query.limit(10);
  query.find().then(function(results) {
     var msg = {
        'statuscode': '1',
        'message': '操作成功',
        'data': results
      }
      res.json(msg);
  }, function(err) {
      JSON.stringify(err);
      var msg = {
         'statuscode': '-1',
         'message': '操作失败',
         'code': err.code
       }
       res.json(msg);
  }).catch(next);
});

// 我发布的所有动态
router.get('/mine',function(req, res, next) {
  // var currentUser = AV.User.current();

    var query = new AV.Query('obj_article');
    query.equalTo('cre_user_id', '5927ca2944d904006411e5b0');
    query.find().then(function(results){
        var msg = {
      'statuscode': '1',
      'message': '操作成功',
      'mine': results
     }
    res.json(msg);
    },function(err){
       var msg = {
      'statuscode': '-1',
      'message': '操作失败'
      }
      res.json(msg);
    }).catch(next)
})





module.exports = router;
