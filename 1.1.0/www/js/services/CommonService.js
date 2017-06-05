/**
 * 公共请求服务
 */
 app.factory('CommonService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		//登陆
		login : {
			method : 'POST',
			url : $window.platformServer + "users/login",
			params : {
				// uname: '@uname',
				// verify_code: '@verify_code'
			}
		},
		//登出
		logout : {
			method : 'POST',
			url : $window.platformServer + "users/logout",
			params : {
			}
		},
		// 注册
		register: {
			method:'POST',
			url : $window.platformServer + "users/register",
			params : {
				
			}
		},

		
	})
}]);