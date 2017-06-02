/**
 * 部门服务
 */
app.factory('DeptService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		//获取部门列表
		deptViewJunior : {
			method : 'GET',
			url : $window.platformServer + "dept-datas/view-junior?accesstoken=:accesstoken"
		},
		deptDatasAll : {
			method : 'GET',
			url : $window.platformServer + "dept-datas"
		},
		deptDatasPart : {
			method : 'GET',
			url : $window.platformServer + "dept-datas/dept"
		},
		deptCreate : {
			method : 'POST',
			url : $window.platformServer + "dept-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				_csrf: "@_csrf",
				dept_name: "@dept_name",
				sub_dept_type: "@sub_dept_type",
				sup_dept_id: "@sup_dept_id"
			}
		},
		deptUpdate : {
			method : 'PUT',
			url : $window.platformServer + "dept-datas/:id?accesstoken=:accesstoken",
			params : {
				id: "@id",
				accesstoken: "@accesstoken",
				_csrf: "@_csrf",
				dept_name: "@dept_name"
			}
		},
		phoneCheck: {
			method:'GET',
			url: $window.platformServer + "dept-datas/get-user-by-mobile",
			params : {
				accesstoken: "@accesstoken",
				mobile: "@mobile"
			}
		},
		getMemberList: {
			method:'GET',
			url: $window.platformServer + "user-datas/members?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				com_id : "@com_id"
			}
		}
	})
}]);