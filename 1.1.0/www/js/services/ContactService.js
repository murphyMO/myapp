/**
 * 联系服务
 */
app.factory('ContactService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		//获取联系列表
		contactList: {
			method:'GET',
			url:  $window.platformServer + 'chat-datas/get-chat-session?accesstoken=:accesstoken',
			params: {accesstoken: '@accesstoken'}
		},
		//获取联系列表
		chatInfo: {
			method:'GET',
			url:  $window.platformServer + 'chat-datas/get-chat-session?accesstoken=:accesstoken',
			params: {
				accesstoken: '@accesstoken',
				from_user_id: '@from_user_id'
			}
		},
		//获取留言列表
		messageDatas: {
			method:'GET',
			url:  $window.platformServer + 'hi-unread-info-datas/view-info?accesstoken=:accesstoken',
			params: {
				accesstoken: '@accesstoken',
				type_id : '1',
				currentPage : '@currentPage',
				itemsPerPage : '@itemsPerPage'
			}
		},
		//获取点赞列表
		likeDatas: {
			method:'GET',
			url:  $window.platformServer + 'hi-unread-info-datas/view-info?accesstoken=:accesstoken',
			params: {
				accesstoken: '@accesstoken',
				type_id : '2',
				currentPage : '@currentPage',
				itemsPerPage : '@itemsPerPage'
			}
		},
		//发送消息
		chatDatas: {
			method:'POST',
			url:  $window.platformServer + 'chat-datas?accesstoken=:accesstoken',
			params: {accesstoken: '@accesstoken'}
		},
		//历史聊天记录
		chatHistory: {
			method:'GET',
			url:  $window.platformServer + 'chat-datas?accesstoken=:accesstoken',
			params: {
				accesstoken: '@accesstoken',
				separate_time : '@separate_time',
				to_user_id : '@to_user_id',
				itemsPerPage : '10'
			}
		},
		//更新历史聊天记录
		updateHistory: {
			method:'POST',
			url:  $window.platformServer + 'chat-datas/read?accesstoken=:accesstoken',
			params: {
				accesstoken: '@accesstoken',
			}
		},
		//获取一条服务的信息
		getOneService : {
			method : "GET",
			url : $window.platformServer + "service-datas/:com_service_id?accesstoken=:accesstoken",
			params : {
				accesstoken : "@accesstoken",
				com_service_id : "@com_service_id"
			}
		},
		//获取公司产品详情
		getProductList : {
			method : "GET",
			url : $window.platformServer + "service-datas?accesstoken=:accesstoken&com_id=:com_id",
			params : {
				accesstoken : "@accesstoken",
				com_id : "@com_id"
			}
		},
		//更新留言已读未读状态
		updateCommentItemStatus : {
			method : "PUT",
			url : $window.platformServer + "hi-unread-info-datas/1?accesstoken=:accesstoken",
			params : {
				accesstoken : "@accesstoken"
			}
		},
		//更新点赞已读未读状态
		updateLikeItemStatus : {
			method : "PUT",
			url : $window.platformServer + "hi-unread-info-datas/2?accesstoken=:accesstoken",
			params : {
				accesstoken : "@accesstoken"
			}
		},
		//删除一条聊天会话
		deletSession : {
			method : "GET",
			url : $window.platformServer + "chat-datas/delete-session?accesstoken=:accesstoken&chat_user_id=:chat_user_id",
			params : {
				accesstoken : "@accesstoken",
				chat_user_id : "@chat_user_id"
			}
		},
		//系统消息标为已读
		readSysMsg : {
			method : "GET",
			url : $window.platformServer + "chat-datas/read-sys-msg?accesstoken=:accesstoken",
			params : {
				accesstoken : "@accesstoken"
			}
		},
		//普通息标为已读
		readMsg : {
			method : "GET",
			url : $window.platformServer + "chat-datas/read-mine-all-msg?accesstoken=:accesstoken&from_user_id=:from_user_id",
			params : {
				accesstoken : "@accesstoken",
				from_user_id : "@from_user_id"
			}
		}
	})
}]);