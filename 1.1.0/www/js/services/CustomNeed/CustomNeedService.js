/**
 * 定制办公所属行业服务
 */
app.factory('CustomNeedService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {

		//定制办公服务
		CustomOffice:{
			method:'POST',
			url:$window.platformServer + "customize-needs-datas?accesstoken=:accesstoken",
			params:{
				accesstoken:'@accesstoken'
			}
		},
		//闲置出租服务
		LeaveRent:{
			method:'POST',
			url:$window.platformServer + "customize-needs-datas?accesstoken=:accesstoken",
			params:{
				accesstoken:'@accesstoken'
			}
		},

		//侠客寓出租
		uploadInfo2 : {
			method : 'POST',
			url : $window.platformServer + 'feedback-info-datas/create-lease?accesstoken=:accesstoken',
			params: {
				accesstoken: '@accesstoken',
				'mobile':'@mobile',
				'name':'@name',
				'com_name' : '@com_name',
				'lease_time' : '@lease_time'
			}
		},

		//用户个人信息
		userMine: {
			method: 'GET',
			url: $window.platformServer + "user-datas/mine",
			params: {
				accesstoken: '@accesstoken'
			}
		},
		//获取用户的所属行业
		getUserInterst:{
			method:'GET',
			url:$window.platformServer + "user-datas/get-user-interest?accesstoken=:accesstoken",
			params:{
				accesstoken:'@accesstoken'
			}
		},
		//删除行业
		deleteOneInterest:{
			method:'GET',
			url:$window.platformServer + "user-datas/delete-one-interest",
			params:{
				accesstoken:'@accesstoken',
				interest_id:'@interest_id'
			}
		},
		//添加行业
		createInterest:{
			method:'POST',
			url:$window.platformServer + "user-datas/create-interest",
			params:{
				accesstoken:'@accesstoken',
				interest_name:'@interest_name'
			}
		},


	})
}]);
