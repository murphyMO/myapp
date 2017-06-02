
/**
 * 下单
 */
app.factory('PurchaseService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		//预约
		serviceReserve : {
			method : 'POST',
			url : $window.platformServer + "service-reservation-datas/service-reserve?accesstoken=:accesstoken",
			params : {accesstoken: "@accesstoken"}
		},
		//会议室获取订单
		getPayment :{
			method : 'GET',
			url : $window.platformServer + "order-datas/view/:id?accesstoken=:accesstoken",
			params : {
				id:'@id',
				accesstoken: "@accesstoken"
			}
		},
		//会员权限获取订单
		getMemPayment :{
			method : 'POST',
			url : $window.platformServer + "user-member-datas/create?accesstoken=:accesstoken",
			params : {
				id:'@id',
				accesstoken: "@accesstoken"
			}
		},
		//支付后发送数据
		sendData :{
			method : 'POST',
			url : $window.platformServer + "order-datas/order-pay-request?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//会员支付后发送数据
		sendMemData : {
			method : 'POST',
			url : $window.platformServer + "order-datas/order-pay-request?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//预订会议室、活动场地支付方式选择企业记账后
		pay : {
			method : 'GET',
			url : $window.platformServer + "order-datas/pay/:id?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				id : "@id",
				pay_method : "@pay_method"
			}
		}
	})
}]);