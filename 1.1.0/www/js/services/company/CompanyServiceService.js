/**
 * 企业发布的服务
 */
app.factory('CompanyServiceService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		//投给我的
		getCompanyServiceList:{
			method:'GET',
			url:$window.platformServer + "company-need-datas/to-my-com?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				article_target_id: "@article_target_id",
				article_type_id:"@article_type_id"
			}
		},
		//投给我的
		getaActivityList:{
			method:'GET',
			url:$window.platformServer + "party-datas/enroll-list?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
			}
		},
		//发布管理
		getCompanyPublishList:{
			method:'GET',
			url:$window.platformServer + "company-article-datas/view-needs?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				com_id: "@com_id"
			}
		},
		//需求管理
		getCompanyNeedList:{
			method:'GET',
			url:$window.platformServer + "company-article-datas/needs-list?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				com_id: "@com_id"
			}
		},
		//获取一条需求
		getOneNeed:{
			method:'GET',
			url:$window.platformServer + "company-article-datas/view-needs?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//销售管理
		getCompanyMailingList:{
			method:'GET',
			url:$window.platformServer + "company-datas/sale-record?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				com_id: "@com_id"
			}
		},
		//获取联系的人id
		getChatUserId : {
			method : "GET",
			url : $window.platformServer + "company-datas/get-chat-user-by-service-id?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				id : "@id"
			}
		},
		//点赞
		likeYou : {
			method : 'POST',
			url : $window.platformServer + "hi-like-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取一条服务的信息
		getOneService : {
			method : "GET",
			url : $window.platformServer + "company-article-datas/:target_id?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				target_id:"@target_id"
			}
		},
		//回复
		replay : {
			method : "POST",
			url : $window.platformServer + "hi-message-datas?accesstoken=:accesstoken",
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
		//企业投递详情
		getCompanyMaDeList : {
			method : "GET",
			url : $window.platformServer + "company-article-datas/view-feedback?accesstoken=:accesstoken",
			params : {
			accesstoken: "@accesstoken",
				com_service_id:"@com_service_id"

		}
	},
	})
}]);