/**
 *服务-服务
 */
app.factory('ServiceService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		//获取聊天列表
		getServiceList : {
			method : 'GET',
			url : "data/service.json",
//			url : $window.platformServer + "user-datas/set-user-archives?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		}
	})
}]);