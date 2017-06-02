/**
 * 社区服务
 */
app.factory('CommunityService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		//获取社区全部、动态、话题专区列表
		getList : {
			method : 'GET',
			url : $window.platformServer + "company-article-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取需求列表
		getNeedList : {
			method : 'GET',
			url : $window.platformServer + "company-need-datas/all?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取需求详情列表
		getNeedOne : {
			method : 'GET',
			url : $window.platformServer + "company-need-datas/:com_needs_id?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				com_needs_id: "@com_needs_id"
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
		//参与活动
		partyEnroll : {
			method : 'POST',
			url : $window.platformServer + "party-datas/party-enroll?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取区域信息
		getRegionList : {
			method : 'GET',
			url : $window.platformServer + "commons/area-list?accesstoken=:accesstoken",
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
		//获取一条动态的信息
		getOneDynamic : {
			method : "GET",
			url : $window.platformServer + "company-article-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取一条需求的信息
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
		},
		//回复
		replay : {
			method : "POST",
			url : $window.platformServer + "hi-message-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//投诉
		report : {
			method : "POST",
			url : $window.platformServer + "report-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取行业分类
		getClass : {
			method : "GET",
			url : $window.platformServer + "company-datas/business-label-list?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取发布分类
		getSendClass : {
			method : "GET",
			url : $window.platformServer + "article-material-datas/get-type-list?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
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
		//清除单条消息
		clearUnread : {
			method : "DELETE",
			url : $window.platformServer + "hi-unread-info-datas/:type_id?accesstoken=:accesstoken",
			params : {
				type_id : "@type_id",
				accesstoken: "@accesstoken",
				target_id : "@target_id"
			}
		},
		//获取素材列表
		getMaterialList : {
			method : 'GET',
			url : $window.platformServer + "article-material-datas?accesstoken=:accesstoken",
			params : {
				accesstoken : '@accesstoken',
				material_type : '@material_type'
			}
		},
		//发布需求
		postNeeds : {
			method : 'GET',
			//TODO url
			url : $window.platformServer + "",
			params: {
				accesstoken : '@accesstoken'
			}
		},
		//获取产品类型
		getProductType : {
			method : 'GET',
			url : $window.platformServer + "service-type-datas?accesstoken=:accesstoken&show_all=true",
			params : {
				accesstoken : '@accesstoken'
			}
		},
		//发布需求
		postNeeds : {
			method : 'POST',
			url : $window.platformServer + "company-need-datas?accesstoken=:accesstoken",
			params : {
				accesstoken : '@accesstoken'
			}
		},
		//发布产品
		postProduct: {
			method : 'POST',
			url: $window.platformServer + "service-datas?accesstoken=:accesstoken",
			params : {
				accesstoken : '@accesstoken'
			}
		},
		//发布活动
		postActivity : {
			method : 'POST',
			url : $window.platformServer + "party-datas?accesstoken=:accesstoken",
			params : {
				accesstoken : '@accesstoken'
			}
		},
		//获取发布页面行业标签
		getBusinessLabel : {
			method : 'GET',
			url : $window.platformServer + "company-datas/tag-info-list?accesstoken=:accesstoken",
			params : {
				accesstoken : '@accesstoken'
			}
		},
		//获取服务范围
		getServiceArea : {
			method : 'GET',
			url : 'data/service_area.json'
		},
		postArticle : {
			method : 'POST',
			url : $window.platformServer + "company-article-datas?accesstoken=:accesstoken",
			params : {
				accesstoken : '@accesstoken'
			}
		},
		//获取素材详情
		getMaterialDetail : {
			method : 'GET',
			url :  $window.platformServer + "article-material-datas/:id?accesstoken=:accesstoken",
			params : {
				accesstoken : '@accesstoken',
				id : '@id'
			}
		},
		//根据公司ID获取公司服务列表
		getProductListByComId : {
			method : 'GET',
			url : $window.platformServer + "service-datas?accesstoken=:accesstoken",
			params : {
				accesstoken : '@accesstoken'
			}
		},
		//投递产品服务
		deliverProduct : {
			method : 'POST',
			url : $window.platformServer + "company-need-datas/need-reserve?accesstoken=:accesstoken",
			params : {
				accesstoken : '@accesstoken'
			}
		},
		//获取话题列表
		getTopicsList : {
			method : 'GET',
			url : $window.platformServer + "topic-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取话题列表
		getTopThree : {
			method : 'GET',
			url : $window.platformServer + "topic-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		}
	})
}]);
