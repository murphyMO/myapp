/**
 * 我的发布
 */
app.factory('getMineReleaseListService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		//获取我发布的服务
		getMineReleaseList:{
			method:'GET',
			url : $window.platformServer + "publish-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取我的动态
		getMineRelease:{
			method:'GET',
			url : $window.platformServer + "company-article-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
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
		//回复
		replay : {
			method : "POST",
			url : $window.platformServer + "hi-message-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取一条动态的信息
		getOneRelease : {
			method : "GET",
			url : $window.platformServer + "company-article-datas/:target_id?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				target_id:"@target_id"
			}
		},
		getOneDemand : {
			method : "GET",
			url : $window.platformServer + "company-article-datas/view-needs?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取一条活动的信息
		getOneActivity : {
			method : "GET",
			url : $window.platformServer + "party-datas/:target_id?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				target_id : "@target_id"
			}
		}
	})
}]);
