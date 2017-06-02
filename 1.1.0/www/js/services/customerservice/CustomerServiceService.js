/**
 * 小师妹服务登记
 */
app.factory('CustomerServiceService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		CustomerService:{
			method:'POST',
			url:$window.platformServer + "register-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		}
	})
}]);
