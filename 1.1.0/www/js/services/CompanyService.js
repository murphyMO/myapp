/**
 * 公司服务
 */
app.factory('CompanyService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		//添加公司
		companyAdd : {
			method : 'POST',
			url : $window.platformServer + "company-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//修改公司
		companyUpdate :{
			method:'PUT',
			url: $window.platformServer + "company-datas/:id?accesstoken=:accesstoken",
			params :{
				accesstoken:'@accesstoken'
			}
		},
		//修改当前公司
		companyUpdateMine :{
			method:'PUT',
			url: $window.platformServer + "company-datas/update-mine?accesstoken=:accesstoken",
			params :{
				accesstoken:'@accesstoken'
			}
		},

		//行业标签
		businessLabel:{
			method:'GET',
			//url: "data/businesslabel.json",
			url:$window.platformServer + "company-datas/business-label-list?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//根据id获取企业详情
		companyData:{
			method:'GET',
			url:$window.platformServer + "company-datas/:id?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				id:"@id"
			}
		},
		//自己的企业详情
		companyMine:{
			method:'GET',
			url:$window.platformServer + "company-datas/mine?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//企业列表
		companyDatas:{
			method:'GET',
			url:$window.platformServer + "company-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取服务类型
		serviceTypeList:{
			method:'GET',
			url:$window.platformServer + "company-datas/service-type-list?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取标签数组
		tagInfoList:{
			method:'GET',
			url:$window.platformServer + "company-datas/tag-info-list?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//添加服务
		createService:{
			method:'POST',
			url:$window.platformServer + "company-datas/create-service?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},

		//服务列表
		serviceList:{
			method:'GET',
			url:$window.platformServer + "company-datas/service-list?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//根据公司ID查看相应的服务
		viewService:{
			method:'GET',
			url:$window.platformServer + "company-datas/view-service?accesstoken=:accesstoken&com_id=:com_id",
			params : {
				accesstoken: "@accesstoken",
				com_id:"@com_id"
			}
		},
		//新增预约服务
		serviceReserve:{
			method:'POST',
			url:$window.platformServer + "company-datas/service-reserve?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//服务详情
		serviceDetail:{
			method:'GET',
			url:$window.platformServer + "company-datas/view-service?accesstoken=:accesstoken&com_service_id=:com_service_id",
			params : {
				accesstoken: "@accesstoken",
				com_service_id:"@com_service_id"
			}
		},
		//服务修改
		serviceUpdate:{
			method:'PUT',
			url:$window.platformServer + "company-datas/update-service?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//我的公司账户信息
		companyAccount:{
			method:'GET',
			url:$window.platformServer + "user-asset-datas/mine?accesstoken=:accesstoken&type_id=1",
			params : {
				accesstoken: "@accesstoken"
			}
		},

		//公司消费流水
		balanceRecord:{
			method:'GET',
			url:$window.platformServer + "user-asset-datas/balance-record?accesstoken=:accesstoken&type_id=1",
			params : {
				accesstoken:"@accesstoken"
			}
		},
		//公司消费明细
		userExpenseRecordDatas:{
			method:'GET',
			url:$window.platformServer + "user-expense-record-datas/:id?accesstoken=:accesstoken",
			params : {
				id:"@id",
				accesstoken:"@accesstoken"
			}
		},
		//公司充值消费明细
		userRechargeRecordDatas:{
			method:'GET',
			url:$window.platformServer + "user-recharge-record-datas/:id?accesstoken=:accesstoken",
			params : {
				id:"@id",
				accesstoken:"@accesstoken"
			}
		},
		//公司积分记录列表
		pointsRecord:{
			method:'GET',
			url:$window.platformServer + "user-asset-datas/points-record?accesstoken=:accesstoken&type_id=1",
			params : {
				accesstoken:"@accesstoken"
			}
		},
		//公司积分获取记录详情
		pointsIncreaseRecord:{
			method:'GET',
			url:$window.platformServer + "user-points-increase-record-datas/:id?accesstoken=:accesstoken&type_id=1",
			params : {
				id:"@id",
				accesstoken:"@accesstoken"
			}
		},
		//公司积分消费记录详情
		pointsDecreaseRecord:{
			method:'GET',
			url:$window.platformServer + "user-points-decrease-record-datas/:id?accesstoken=:accesstoken&type_id=1",
			params : {
				id:"@id",
				accesstoken:"@accesstoken"
			}
		},
		//获取单个公司信息
		getCompanyOnes:{
			method:'GET',
			url:$window.platformServer + "home-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//修改企业LOGO
		uploadCompanyLogo:{
			method:'POST',
			url:$window.platformServer + "company-datas/upload-logo?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
//				com_id: "@com_id",
//				logo: "@logo"
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
		//加入企业
		joinCom : {
			method : 'POST',
			url : $window.platformServer + "company-datas/join-com?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//企业认证审核
		applychenck : {
			method : 'POST',
			url : $window.platformServer + "company-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取邀请码
		getInviteCode : {
			method : 'GET',
			url : $window.platformServer + "company-datas/set-com-invite-code?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
	})
}]);
