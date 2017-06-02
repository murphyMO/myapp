/**
 * 我的关注
 */
app.factory('MineConcernService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		//我的关注--动态
		myFollowDynamicDatas : {
			method : 'GET',
			url : $window.platformServer + "concern-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//我的关注--公司
		myFollowCompanyDatas : {
			method : 'GET',
			url : $window.platformServer + "concern-datas/concern-company?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//我的关注--人
		myFollowPersonalDatas : {
			method : 'GET',
			url : $window.platformServer + "concern-datas/concern-person?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				currentPage:"@currentPage",
				itemsPerPage:"@itemsPerPage"
				
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
	})
}]);