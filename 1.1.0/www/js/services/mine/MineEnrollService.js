/**
 * 社区服务
 */
app.factory('MineEnrollService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		//获取活动列表
		getActivityList : {
			method : 'GET',
			url : $window.platformServer + "party-datas/enroll-list?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				listType: "@listType"
			}
		},
		//获取一条活动的信息
		getOneActivity : {
			method : "GET",
			url : $window.platformServer + "party-datas/:target_id?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				target_id : "@target_id"
			}
		},
	})
}]);
