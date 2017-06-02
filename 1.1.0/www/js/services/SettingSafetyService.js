/**
 * 客服服务
 */
app.factory('SettingSafetyService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		getsettingsafety:{
			method:'GET',
			url : $window.platformServer + "dept-datas/view-junior?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		getsafety : {
			method : 'GET',
			url: $window.platformServer + "dept-datas/view-junior?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				dept_id : "@dept_id"
			}
		},
		comStaffRelatioDatas : {
			method : 'POST',
			url: $window.platformServer + "com-staff-relation-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		deletePerson : {
			method : 'DELETE',
			url: $window.platformServer + "com-staff-relation-datas/:id?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				id: "@id"
			}
		},
		getpersonlist : {
			method : 'get',
			url: $window.platformServer + "com-staff-relation-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		}
	})
}]);