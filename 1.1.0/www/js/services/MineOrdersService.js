/**
 *我的订单
 */
app.factory('MineOrdersService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		//获取订单列表
		getOrdersList : {
			method:'GET',
			url:$window.platformServer + "service-reservation-datas/service-reserve-list?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				list_type: "@list_type"
			}
		},
		//获取订单详情
		getOrdersDetail : {
			method:'GET',
			url:$window.platformServer + "service-reservation-datas/:id?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				id: "@id"
			}
		},
		//获取全部订单列表
		mineList: {
			method:'GET',
			url: $window.platformServer + 'order-datas/list?accesstoken=:accesstoken',
			params: {
				'accesstoken' : '@accesstoken',
			}
		},
		//单个订单详情
		orderDetail: {
			method:'GET',
			url: $window.platformServer + 'order-datas/view/:order_id?accesstoken=:accesstoken',
			params: {
				'accesstoken' : '@accesstoken',
				'order_id':'@order_id'
			}
		},
		//获取购买记录列表
		memberList: {
			method:'GET',
			url: $window.platformServer + 'user-member-datas/get-member-reserve?accesstoken=:accesstoken',
			params: {
				'accesstoken' : '@accesstoken',
			}
		},
		//申请退款服务
		changeStatus: {
			method:'GET',
			url: $window.platformServer + 'order-datas/process-status/:order_id?accesstoken=:accesstoken',
			params: {
				'accesstoken' : '@accesstoken',
				'order_id':'@order_id'
			}
		},

	})
}]);
