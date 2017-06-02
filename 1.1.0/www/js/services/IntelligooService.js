/**
 * 智果开门--服务
 */
app.factory('IntelligooService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		//获取我的钥匙
		myKeys : {
			method : 'GET',
			url : $window.platformServer + "meeting-room-reserve-datas/my-key?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				lat: "@lat",
				lon: "@lon"
			}
		},
		//检查开门权限
		openRightsCheck : {
			method : 'GET',
			url : $window.platformServer + "meeting-room-reserve-datas/open-rights-check/:id?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				id: "@id"
			}
		},
		//保存开门操作记录
		saveOpenHistory : {
			method : 'POST',
			url : $window.platformServer + "meeting-room-reserve-datas/open-door?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
	})
}]);
