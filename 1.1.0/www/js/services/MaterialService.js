/**
 * 素材服务
 */
app.factory('MaterialService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
//		//发布文章
//		getMaterialList : {
//			method : 'GET',
//			url : $window.platformServer + "article-material-datas?accesstoken=:accesstoken",
//			params : {
//				accesstoken: "@accesstoken"
//			}
//		},
		//根据id获取
		materialOnes:{
			method:'GET',
			url:$window.platformServer + "article-material-datas/:id?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				id:"@id"
			}
		}
	})
}]);