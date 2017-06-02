/**
 * 获取用户融云token
 */
 angular.module('rongCloudService',[])
 .factory('rongCloudService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		//获取融云token
		rongCloudToken: {
			method:'GET',
			url:  $window.platformServer + 'cloud-messages/gettoken?accesstoken=:accesstoken',
			params: {accesstoken: '@accesstoken'}
		},
		//获取小师妹
		getServiceId : {
			method : 'GET',
			url : $window.platformServer + "commons/get-customer-service?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				store_id: "@store_id"
			}
		},
		//版本检查
		versionCheck : {
			method : 'GET',
			url : $window.platformServer + "app-version-datas?type=:type",
			params : {
				type : '@type'
			}
		},
		//设置deviceToken
		deviceToken : {
			method : 'GET',
			url : $window.platformServer + "user-datas/set-device-token?accesstoken=:accesstoken&device_token=:device_token",
			params : {
				accesstoken : '@accesstoken',
				device_token : '@device_token'
			}
		},
	})
}]);