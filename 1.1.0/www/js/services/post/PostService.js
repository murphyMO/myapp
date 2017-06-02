/**
 * 部门服务
 */
app.factory('PostService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {

		getProvinceData: {
			method:'GET',
			url:  'data/province.json'
		}, 

		getCityData : {
			method:'GET',
			url:  'data/city.json'
		},

		//发布活动
		postActivity : {
			method : 'POST',
			url : $window.platformServer + "party-datas?accesstoken=:accesstoken",
			params : {
				accesstoken : "@accesstoken"
			}
		},
		//发布需求
		postNeed : {
			method : 'POST',
			url : $window.platformServer + "company-need-datas?accesstoken=:accesstoken",
			params : {
				accesstoken : "@accesstoken"
			}
		},
		//发布服务
		postService : {
			method : 'POST',
			url : $window.platformServer + "company-need-datas?accesstoken=:accesstoken",
			params : {
				accesstoken : "@accesstoken"
			}
		}

	})
}]);