/**
 * 社区服务
 */
app.factory('CommunityService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		//获取社区全部、动态、话题专区列表
		getAll : {
			method : 'GET',
			url : $window.platformServer + "find/all",
			params : {
				
			}
		},
		getMine : {
			method : 'GET',
			url : $window.platformServer + "find/mine",
			params : {
				
			}
		},
	})
}]);
