/**
 * 商务服务
 */
app.factory('BusinessService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		//获取轮播图片
		bannerDatas : {
			method : 'GET',
			url : $window.platformServer + "banner-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//合作伙伴
		cooperativePartner : {
			method : 'GET',
			url : $window.platformServer + "partner-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//推荐企业
		recommengDatas : {
			method : 'GET',
			url : $window.platformServer + "recommend-datas/get-recommend-id?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//服务排序列表
		sortService : {
			method : 'GET',
			url : $window.platformServer + "service-type-datas/recommend-service-type?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//服务分类列表
		serviceTypeDatas : {
			method : 'GET',
			url : $window.platformServer + "service-type-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//单个服务分类列表
		serviceTypeDatasOne : {
			method : 'GET',
			url : $window.platformServer + "service-type-datas/:id?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				id: "@id"
			}
		},
		//最近搜索
		searchHistory : {
			 method : 'GET',
			url : $window.platformServer + "user-search-record-datas?accesstoken=:accesstoken",
			params : {
			accesstoken: "@accesstoken",
			}
		},
		//服务列表
		serviceDatas : {
			method : 'GET',
			url : $window.platformServer + "service-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				com_service_type: "@com_service_type",
				city_official_code: "@city_official_code",
				unit_value: "@unit_value",
				latitude: "@latitude",
				longitude: "@longitude",
				store_id: "@store_id"
			}
		},
		//岛平方米
		storeDatas : {
			method : 'GET',
			url : $window.platformServer + "store-datas/get-store-position?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
			}
		},
		//服务单条详情
		serviceDatasOne : {
			method : 'GET',
			url : $window.platformServer + "service-datas/:id?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				id: "@id"
			}
		},

		//岛简介
		getintroduction: {
			method : 'GET',
			url : $window.platformServer + "store-introduction-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
			}
		},

		//获取城市、省份列表
		getCitys: {
			method : 'GET',
			url : $window.platformServer + "common/area-list?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
			}
		},


		getChatUserByServiceId : {
			method : 'GET',
			url : $window.platformServer + "company-datas/get-chat-user-by-service-id?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//公司搜索列表
		getCompanyDatas : {
			method : 'GET',
			url : $window.platformServer + 'company-datas?accesstoken=:accesstoken',
			params : {
				accesstoken : '@accesstoken'
			}
		},
		//选岛列表获取位置信息
		getAllPosition : {
			method : 'GET',
			url : $window.platformServer + 'store-datas?accesstoken=:accesstoken',
			params : {
				accesstoken : '@accesstoken'
			}
		},
		//获取推荐服务，需求，活动
		getRecommendDatas : {
			method : 'GET',
			url : $window.platformServer + 'recommend-datas/get-recommend?accesstoken=:accesstoken',
			params : {
				'accesstoken' : '@accesstoken'
			}
		},
		//获取会议室列表
		getConferenceList : {
			method : 'GET',
			url : $window.platformServer + 'meeting-room-datas/index?accesstoken=:accesstoken',
			params : {
				'accesstoken' : '@accesstoken'
			}
		},
		//获取会议室已占用的时间段
		getDisabledConference : {
			method : 'GET',
			url : $window.platformServer + 'meeting-room-reserve-datas/reserved-time/:id?accesstoken=:accesstoken',
			params : {
				'accesstoken' : '@accesstoken'
			}
		},
		//提交预订会议室
		create : {
			method : 'POST',
			url : $window.platformServer + 'meeting-room-reserve-datas/create?accesstoken=:accesstoken',
			params : {
				'accesstoken' : '@accesstoken'
			}
		},
		//获取未读消息
		getUnPay : {
			method : 'GET',
			url : $window.platformServer + "user-datas/mine-company-statistics?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取天气
		// getweather : {
		// 	method : 'GET',
		// 	url : "http://api.map.baidu.com/telematics/v3/weather?",
		// 	params : {
		// 		//accesstoken: "@accesstoken"
		// 	}
		// },
		getweather : {
			method : 'GET',
			url : "https://api.thinkpage.cn/v3/weather/daily.json?",
			params : {
				//accesstoken: "@accesstoken"
			}
		},
		//提交招聘信息
		submitemploy : {
			method : 'POST',
			url : $window.platformServer + 'hi-recruit-forms?accesstoken=:accesstoken',
			params : {
				'accesstoken' : '@accesstoken'
			}
		},
		//获取所有岛
		getAllIsland : {
			method : 'GET',
			url : $window.platformServer + 'store-datas?accesstoken=:accesstoken',
			params : {
				accesstoken: "@accesstoken"
			}
		},
		getMineInfo: {
			method: 'GET',
			url: $window.platformServer + "user-datas/mine?accesstoken=:accesstoken",
			params: {accesstoken: '@accesstoken'}
		},
		setMineInfo: {
			method: 'POST',
			url: $window.platformServer + "user-datas/setting?accesstoken=:accesstoken",
			params: {accesstoken: '@accesstoken'}
		},
		getNotice: {
			method: 'GET',
			url: $window.platformServer + "notice-datas?accesstoken=:accesstoken",
			params: {accesstoken: '@accesstoken'}
		},

		//获取待办事项
		todoData:{
			method:'GET',
			url: $window.platformServer + 'user-datas/no-start-work?accesstoken=:accesstoken',
			params: {
				accesstoken: '@accesstoken',
			}
		},

		//获取今日会务
		getTodayOrders: {
			method: 'GET',
			url: $window.platformServer + 'user-datas/get-mine-info?accesstoken=:accesstoken',
			params: {
				accesstoken : '@accesstoken'
			}
		},
		//获取今日活动
		todayactData:{
			method:'GET',
			url: $window.platformServer + 'party-datas?accesstoken=:accesstoken',
			params: {
				accesstoken: '@accesstoken'
			}
		},
		// //获取会议室预订
		// meetingroomData:{
		// 	method:'GET',
		// 	url: $window.platformServer + 'meeting-room-datas/index?accesstoken=:accesstoken',
		// 	params: {
		// 		accesstoken: '@accesstoken',
		// 		latitude: "@latitude",
		// 		longitude: "@longitude",
		// 		store_id: "@store_id"
		// 	}
		// },
		


	})
}]);
