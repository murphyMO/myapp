var express = require('express');
var router = express.Router();

var AV = require('leanengine');

// router.all('*',function(req,res,next){
//   if (!req.AV.user){
//     res.redirect('/user/login');
//   }else{
//     next();
//   }
// });

//获取所有动态
router.get('/all', function(req, res, next) {
  // and查询
  var firstquery = new AV.Query('obj_article');
  firstquery.greaterThanOrEqualTo('type','3');
  var secquery = new AV.Query('obj_article');
  secquery.lessThanOrEqualTo('type','4');
  var query = AV.Query.and(firstquery, secquery);
  // 按照更新时间降序排列
  query.descending('updatedAt');
  query.limit(4);
  query.include('cre_user');

  query.find().then(function(results) {

      // include的pointer类型字段需要json化才能生效
      results.forEach(function(result){
      result.set('cre_user', result.get('cre_user') ?  result.get('cre_user').toJSON() : null);
    });
      //--end

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
    var currentUserId = req.query.currentUserId
    // 用户关注relation,获取当前用户的关注人id
    var query = new AV.Query('obj_focus');
    var currentUser = AV.Object.createWithoutData('_User', currentUserId);
    query.equalTo('user_id',currentUser);
    query.find().then(function(results){
        // 遍历每个id，查询发布的内容
        var focusArr = [];
        results.forEach(function(result){
          // focusArr.push(result.get('target_id').id);
          var focusId =result.get('target_id').id.toString();
          var focusquery = new AV.Query('obj_article');
          console.log(focusId);
          focusquery.get(focusId).then(function (focusData) {
            console.log(2222222222222222222222222)
            console.log(focusData)
            }, function (error) {
             JSON.stringify(error);
              console.log(error)
            });
        })

        // var focusquery = new AV.Query('obj_article');
        // console.log(focusArr);
        // focusquery.containsAll('objectId ', focusArr);
        // focusquery.find().then(function(focusData){
        //   console.log(focusData)
         
        // })

         var msg = {
              'statuscode': '1',
              'message': '操作成功',
              'data': focusArr
            }
          res.json(msg);
       

        
    },function(err){
      JSON.stringify(err);
      var msg = {
         'statuscode': '-1',
         'message': '操作失败',
         'code': err.code
       }
       res.json(msg);
    }).catch(next);
})





module.exports = router;