app.factory('PersonalService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {

		//个人信息
		mine: {
			method: 'GET',
			url: $window.platformServer + "users",
			params: {
				// accesstoken: '@accesstoken',
			}
		},
		
		//工作经验
		career: {
			method: 'GET',
			url: $window.platformServer + "user-datas/view-career?accesstoken=:accesstoken",
			params: {
				accesstoken: '@accesstoken',
				user_id: '@user_id',
			}
		},
		
		//教育经历
		education: {
			method: 'GET',
			url: $window.platformServer + "user-datas/view-education?accesstoken=:accesstoken",
			params: {
				accesstoken: '@accesstoken',
				user_id: '@user_id',
			}
		},
		//获取用户的兴趣爱好
		getUserInterst:{
			method:'GET',
			url:$window.platformServer + "user-datas/get-user-interest?accesstoken=:accesstoken",
			params:{
				accesstoken:'@accesstoken',
				user_id: '@user_id',
			}
		},
		//设置个人信息
		setPersonMessage:{
			method: 'POST',
			url: $window.platformServer + "user-datas/setting?accesstoken=:accesstoken",
			params: {
				accesstoken: '@accesstoken',
				//_csrf: '@_csrf',
				full_name : "@full_name",
				com_name : "@com_name",
				post_name : "@post_name"
			}
		},
		
	})
}]);