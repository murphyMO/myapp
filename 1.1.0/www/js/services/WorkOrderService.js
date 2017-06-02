/**
 * 个人信息、管理员信息服务
 */
app.factory('WorkOrderService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		//新增人事档案
		addWorkOrder : {
			method : 'POST',
			url : $window.workPlatformServer + 'gd/gd-assignments?accesstoken=:accesstoken',
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取所有岛
		getAllIsland : {
			method : 'GET',
			url : $window.platformServer + 'store-datas?accesstoken=:accesstoken',
			params : {
				accesstoken: "@accesstoken"
			}
		}
	})
}]);