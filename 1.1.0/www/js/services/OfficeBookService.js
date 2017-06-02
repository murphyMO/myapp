/**
 * 办公手册
 */
app.factory('OfficeBookService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		//获取公司信息
		getCompanyOnes:{
			method:'GET',
			url:$window.platformServer + "home-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取列表
		getOfficeBookList : {
			method : 'GET',
			url : $window.platformServer + 'contract-datas/get-checkin-list?accesstoken=:accesstoken',
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//入驻通知书详情
		getEntryNoticeDetail : {
			method : 'GET',
			url : $window.platformServer + 'contract-datas/:id?accesstoken=:accesstoken',
			params : {
				accesstoken: "@accesstoken",
				id : "@id"
			}
		},
		//入驻清单
		getEntryList : {
			method : 'GET',
			url : $window.platformServer + 'contract-datas/get-checkin-view?accesstoken=:accesstoken',
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//入驻清单确认
		sure : {
			method : 'GET',
			url : $window.platformServer + 'contract-datas/confirm-checkin?accesstoken=:accesstoken',
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//离店登记列表
		getCheckOutRegListData: {
			method: 'GET',
			url: $window.platformServer + 'out-store-datas?accesstoken=:accesstoken',
			params: {
				accesstoken: '@accesstoken'
			}
		},
		//离店登记单条-获取
		getCheckOutRegData: {
			method: 'GET',
			url: $window.platformServer + 'out-store-datas/:id?accesstoken=:accesstoken',
			params: {
				accesstoken: '@accesstoken'
			}
		},
		//确认离店
		isCheckOutReg: {
			method: 'PUT',
			url: $window.platformServer + 'out-store-datas/:id?accesstoken=:accesstoken',
			params: {
				accesstoken: '@accesstoken',
				id :'@id'
			}
		},
	})
}]);