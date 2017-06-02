/**
 * 公司简介服务
 */
app.factory('CompanySummaryService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		getComSummary : {
			method : 'GET',
			//url : 'datas/com_summary.json',
			url : $window.platformServer + "company-datas/:com_id?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				com_id : "@com_id"
			}
		},
		//TODO : 等待确定需求
		getCompanyProjectList : {
			method : 'GET',
			url : 'datas/com_project.json',
			//url : $window.platformServer + "company-datas/:com_id?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				com_id : "@com_id"
			}
		},
		//企业简介
		getCompanyIntro : {
			method : 'GET',
			url: $window.platformServer + "company-datas/get-another-company-data?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				type_id : "@type_id"
			}
		},
		//员工简介
		getCompanyEmployee : {
			method : 'GET',
			url: $window.platformServer + "company-datas/get-another-company-data?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				type_id : "@type_id"
			}
		},

		//进入企业-企业服务
		getComSer : {
			method : 'GET',
			url: $window.platformServer + "company-article-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},

		//进入企业-企业服务列表
		getComService : {
			method : 'GET',
			url: $window.platformServer + "service-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				com_id: "@com_id"
			}
		},

		//进入企业-企业需求列表
		getComNeed : {
			method : 'GET',
			url: $window.platformServer + "company-need-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				com_id: "@com_id"
			}
		},

		//进入企业-公司动态
		getCompanyTrendsList : {
			method : 'GET',
			url: $window.platformServer + "company-datas/publish-manage?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				com_id: "@com_id",
				type : "@type"
			}
		},
		//服务列表
		serviceDatas : {
			method : 'GET',
			url : $window.platformServer + "service-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取需求列表
		getDemandList : {
			method : 'GET',
			url : $window.platformServer + "company-article-datas/needs-list?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取活动列表
		getActivityList : {
			method : 'GET',
			url : $window.platformServer + "party-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		
		getChatUserByComId : {
			method : 'GET',
			url : $window.platformServer + "company-datas/get-chat-user-by-com-id?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
	


	})
}]);