/**
 * 个人信息、管理员信息服务
 */
app.factory('AdminService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		//新增人事档案
		setUserArchives : {
			method : 'PUT',
			url : $window.platformServer + "user-datas/set-user-archives?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		// 获取单个人事档案
		viewArchives : {
			method : 'GET',
			url : $window.platformServer + "user-datas/view-archives?accesstoken=:accesstoken"
		},
		//新增教育经历
		createEducationExperience : {
			method : 'POST',
			url : $window.platformServer + "user-datas/create-education?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//编辑教育经历
		setEducationExperience : {
			method : 'PUT',
			url : $window.platformServer + "user-datas/set-education-experience?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//删除教育经历
		deleteEducation : {
			method : 'DELETE',
			url : $window.platformServer + "user-datas/delete-education?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		// 获取单个人教育经历
		viewEducation : {
			method : 'GET',
			url : $window.platformServer + "user-datas/view-education?accesstoken=:accesstoken"
		},
		//新增工作经历
		createCareer : {
			method : 'POST',
			url : $window.platformServer + "user-datas/create-career?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//编辑工作经历
		setCareer : {
			method : 'PUT',
			url : $window.platformServer + "user-datas/set-career?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//删除工作经历
		deleteCareer : {
			method : 'DELETE',
			url : $window.platformServer + "user-datas/delete-career?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		// 获取单个人工作经历
		viewCareer : {
			method : 'GET',
			url : $window.platformServer + "user-datas/view-career?accesstoken=:accesstoken"
		},
		//新增技能标签
		createTag : {
			method : 'POST',
			url : $window.platformServer + "user-datas/create-tag?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//编辑技能标签
		setTag : {
			method : 'PUT',
			url : $window.platformServer + "user-datas/set-tag?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//删除技能
		deleteTag : {
			method : 'DELETE',
			url : $window.platformServer + "user-datas/delete-tag?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取技能标签列表
		viewTag : {
			method : 'GET',
			url : $window.platformServer + "user-datas/view-tag?accesstoken=:accesstoken"
		},
		/**
		 * 用户基本信息部分
		 */
		//获取用户基本信息
		userGetSetting : {
			method : 'GET',
			url : $window.platformServer + "user-datas/get-setting?accesstoken=:accesstoken"
		},
		//修改个人信息
		setSetting : {
			method : 'PUT',
			url : $window.platformServer + "user-datas/setting?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//修改职业生涯基本信息
		setDetail : {
			method : 'PUT',
			url : $window.platformServer + "user-datas/set-detail?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//修改头像-测试
		setHeadImg : {
			method : 'POST',
			url : $window.platformServer + "user-datas/upload-face?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		userDel: {
			method: 'DELETE',
			url: $window.platformServer + "user-datas/delete-user?accesstoken=:accesstoken",
			params: {
				accesstoken: '@accesstoken',
				com_id : '@com_id'
			}
		},
		//获取公司所有会员个数
		getCompanyMember: {
			method: 'GET',
			url: $window.platformServer + "company-datas/members?accesstoken=:accesstoken",
			params: {
				accesstoken: '@accesstoken'
			}
		}
	})
}]);