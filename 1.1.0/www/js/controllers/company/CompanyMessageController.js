/**
 * 企业简介管理器
 */
app.controller('CompanyMessageCtrl',
	['$scope', '$window','$state', '$rootScope', '$timeout', '$stateParams', '$localStorage', '$ionicHistory', '$CommonFactory', '$cordovaToast', 'CompanySummaryService', 'UserService','$ionicSlideBoxDelegate','CommunityService', '$ionicHistory',
		function ($scope, $window,$state, $rootScope, $timeout, $stateParams, $localStorage, $ionicHistory, $CommonFactory, $cordovaToast, CompanySummaryService, UserService,$ionicSlideBoxDelegate,CommunityService, $ionicHistory) {

		$scope.dynamicList = [];//动态列表
		$scope.demandList = [];//需求列表
		$scope.activityList = [];//活动列表
		$scope.dynamicImgItems = [];
		$scope.demandImgItems = [];
		$scope.activityImgItems = [];
		$scope.demandCurrentPage = 1; //第1页开始
		$scope.dynamicCurrentPage = 1; //第1页开始
		$scope.activityCurrentPage = 1; //第1页开始
		$scope.tabType = 1;
		$scope.hasshare = false;//初始分享不显示

		//当前岛
		$scope.currentCity = $localStorage.getObject(KEY_CITY_SELECT);
		if (!$scope.currentCity.city_name) {
			$scope.currentCity = {
				city_id: 2,
				city_name: "航天岛"
			}
		}
		
		$scope.currentStoreId = $scope.currentCity.city_id;
		//路径对象
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		//推荐企业
		$scope.companyPath = $scope.commonPath.route_path + $scope.commonPath.com_logo_path;
		//服务缩略图地址
		$scope.serviceThumbPath = $scope.commonPath.route_path + $scope.commonPath.service_thumb_path;

		$scope.serviceTypeList = [];
		$scope.recomCompanyList = [];
		$scope.serviceList = [];

		//tab切换
		$scope.changeTab = function(index) {
			$scope.tabType = index;
		}

		//向左滑
		$scope.onSwipeLeft=function(index){
			$scope.tabType = index;
		}

		//向右滑动的时候
		$scope.onSwipeRight=function(index) {
			$scope.tabType = index;
		}


			if($rootScope.getCurrentUser()) {
				$rootScope.appTitle = ($rootScope.getCurrentUser().com_name?$rootScope.getCurrentUser().com_name:"侠客岛联合办公室");
				$rootScope.comLogo = ($rootScope.getCurrentUser().com_logo?$rootScope.getCurrentUser().com_logo:"img/icon_empty_head.png");
			}else {
				$rootScope.appTitle = '侠客岛联合办公室';
				$rootScope.comLogo = 'img/icon_empty_head.png';
			}
			var accesstoken = $rootScope.getAccessToken();

			var current_user = $rootScope.getCurrentUser();

			$scope.path = $localStorage.getObject(KEY_COMMON_PATH);
			var com_id = '';
			if(current_user) {
				com_id = current_user.com_id;
			}
			$scope.followText = "关注即可查看全部";

			$scope.getComSummary = function() {
				var data = {
					accesstoken : accesstoken,
					com_id : $stateParams.com_id,
				};
				CompanySummaryService.getComSummary(data, function (res) {
					$scope.item = res.data;
					$rootScope.appTitle = res.data.com_name;
				});
				var confirmData = {
					accesstoken : accesstoken,
					id : $stateParams.com_id,
					type: 2
				};
				UserService.confirmFollow(confirmData, function (res){
					$scope.followText = res.data.status == 2 ? '关注即可查看全部 ' : '进入企业';
					$scope.unfollowed = res.data.status == 2 ? true : false;
				});
			};
			$scope.getComSummary();


			$scope.followCompany = function(com_id) {

				var data = {
					accesstoken : accesstoken,
					concerned_user_id : com_id,
					fans_user_id : current_user.user_id,
					type : 2
				};

				UserService.follow(data, function(res){
					if(res.statuscode != 1){
						if($scope.followStatus == 2){
							$CommonFactory.showAlert("关注失败");
							return;
						}else{
							$CommonFactory.showAlert("取消关注失败");
							return;
						}
					}else {
						$scope.followText = res.data == 2 ? '关注即可查看全部' : '进入企业';
						$scope.unfollowed = res.data.status == 2 ? true : false;
						if(res.data == 2) {
							$CommonFactory.showAlert("取消关注成功");
							return;
						}else {
							$CommonFactory.showAlert("关注成功");
							return;
						}openshare
					}
				});

			};

		$scope.showActionSheet = function(){
			$.showActionSheet();
		}

		//分享
		$scope.openshare = function(){
			$scope.hasshare = true;
		}
		$scope.closeshare = function(){
			$scope.hasshare = false;
		}

		//获取服务列表
		$scope.getServiceDatas = function(){
			var data = {
				accesstoken: accesstoken,
				currentPage: $scope.currentPage,
				itemsPerPage: $scope.itemsPerPage,
				store_id: $scope.currentStoreId,
				com_id: $stateParams.com_id
			}
			CompanySummaryService.serviceDatas(data, function(response){
				//没有数据
				if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
					$scope.isEmptyData = false;
					return;
				}
				//有数据
				var tmpData = response.data;
				for (var i = 0, len = tmpData.length; i < len; i++) {
					//缩略图去第一张
					tmpData[i].com_service_thumb_img = "";
					if (tmpData[i].com_service_thumb && tmpData[i].com_service_thumb.length > 0) {
						tmpData[i].com_service_thumb_img = tmpData[i].com_service_thumb[0];
					}
					//所属岛
					tmpData[i].range_last = "";
					if (tmpData[i].range && tmpData[i].range.length > 0) {
						if (tmpData[i].range[0].store) {
							tmpData[i].range_last = tmpData[i].range[0].store;
						} else if (tmpData[i].range[0].city) {
							tmpData[i].range_last = tmpData[i].range[0].city;
						} else if (tmpData[i].range[0].province) {
							tmpData[i].range_last = tmpData[i].range[0].province;
						}
					}
					$scope.serviceList.push(tmpData[i]);
				}
				//判断总数，防止无线滚动加载
				$scope.itemTotal = response.page_info;
				if ($scope.currentPage * $scope.itemsPerPage > $scope.itemTotal) {
					$scope.isEmptyData = true;
				} else {
					$scope.currentPage++;
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
			});
		};

		$scope.getServiceDatas();

		// 需求列表
		$scope.getDemandList = function(){

			var data = {
				"accesstoken" : accesstoken,
				"currentPage" : $scope.demandCurrentPage,
				"itemsPerPage" : $scope.itemsPerPage,
				"com_id": $stateParams.com_id,
				"type": 0

			}
			CompanySummaryService.getDemandList(data,function(response){

				//没有数据
				if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
					$scope.demandIsEmptyData = true;
					$scope.demandIsOverLoad = true;
					return;
				}
				if(response.statuscode == CODE_SUCCESS){
					for (var i = 0, len = response.data.length; i < len; i++) {
						response.data[i].demandImgItems = [];
						for(var j = 0; j<response.data[i].com_needs_thumb.length; j++){
              response.data[i].demandImgItems.push({"src": $scope.commonPath.route_path + $scope.commonPath.needs_path + response.data[i].com_needs_thumb[j]});
              response.data[i].com_needs_thumb[j] = $scope.commonPath.route_path + $scope.commonPath.needs_path + response.data[i].com_needs_thumb[j];
            }
						$scope.demandList.push(response.data[i]);
					}
				}
				//判断总数，防止无线滚动加载
				$scope.demandItemTotal = response.page_info;
				if ($scope.demandCurrentPage * $scope.itemsPerPage > $scope.demandItemTotal) {
					$scope.demandIsEmptyData = true;
				} else {
					$scope.demandCurrentPage++;
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
			})
		};
		$scope.getDemandList();


		//活动列表
		$scope.getActivityList = function(){
			var data = {
				"accesstoken" : accesstoken,
				"currentPage" : $scope.activityCurrentPage,
				"itemsPerPage" : $scope.itemsPerPage,
				"com_id": $stateParams.com_id,
				"listType": "comParty"
			};
			CompanySummaryService.getActivityList(data,function(response){
				//没有数据
				if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
					$scope.activityIsEmptyData = true;
					$scope.activityIsOverLoad = true;
					return;
				}
				if(response.statuscode == CODE_SUCCESS){
					for (var i = 0, len = response.data.length; i < len; i++) {
						response.data[i].activityImgItems = [];
						for(var j = 0; j<response.data[i].party_thumb.length; j++){
							response.data[i].activityImgItems.push({"src": $scope.commonPath.route_path +$scope.commonPath.article_photo_path + response.data[i].party_thumb[j]});
						}
						$scope.activityList.push(response.data[i]);
					}
				}
				//判断总数，防止无线滚动加载
				$scope.activityItemTotal = response.page_info;
				if ($scope.activityCurrentPage * $scope.itemsPerPage > $scope.activityItemTotal) {
					$scope.activityIsEmptyData = true;
				} else {
					$scope.activityCurrentPage++;
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
			})
		};
		$scope.getActivityList();

		//聊天-购买
		$scope.bottomRightClick = function() {
			if ($rootScope.getCurrentUser().opt_permission == 0) {
				$CommonFactory.showAlert(noMoneyMessage);
				return;
			}
			//根据服务ID获取产品信息
			var data = {
				"accesstoken" : accesstoken,
				"id": $scope.item.com_id
			};
			CompanySummaryService.getChatUserByComId(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					if ($state.params.from && ($state.params.from == "contactcommentlist" || $state.params.from == "chat")) {
						//购买
						var data = {
							target_id : response.data.user_id, //必传  卖方id，即聊天的chat_user_id
							com_service_id : 0, // 必传  服务id
							com_id : $scope.service.com_id,//服务所在公司id
							from : $state.current.name, //非必传 来的路由名，用作返回
							from_param: {
								from: $scope.from,
								com_service_id: 0, //服务ID
							} 
						};
						$state.go('purchase',{data: data});
					} else {
						var data = {
							chat_user_id : response.data.user_id, //必传  聊天对方id
							chat_user_name : response.data.user_name, // 必传 对方名字
							chat_user_face : response.data.user_face,//非必传 自己的头像  
							service_id : 0, //必传 服务（产品）id 
							user_role : 'B',//必传 一般是买方（默认） ‘A’卖方，'B' 买方
							from : $state.current.name, //非必传 来的路由名，用作返回
							from_param: {
								from: $scope.from,
								com_service_id: 0, //服务ID
								type_id: 0,//服务类型ID
								com_id:$stateParams.com_id //公司Id
							}
						};
						$state.go('chat',{data: data});
					}
				}
			});
		}

			//页面返回按钮
			$scope.myBack = function(){
				$ionicHistory.goBack();


//				if ($state.params.from) {
//					if ($state.params.from == 'businessProduct') {
//						$state.go('businessProduct',{com_service_id:$state.params.from_id});
//					} else if ($state.params.from == 'companysearchlist') {
//						var data = {
//							"keyword" : $state.params.data.keyword
//						};
//						$state.go('companysearchlist',{data:data});
//					}else {
//						$state.go($state.params.from);
//					}
//				}
//				else{
//					$state.go('tab.business');
//				}
			}

			//产品详情
			$scope.toCompanyBusinessProduct = function(service) {
//				var data = {
//					com_service_id: service.com_service_id,
//					from : $state.current.name,
//					from_param: {
//						from: $state.params.from
//					}
//				};

				var data = {
					com_service_id: service.com_service_id,
//					from : $state.current.name,
//					from_param: {
//						from: $state.params.from
//					}
				};
				$state.go('commsgBusinessProduct', data);
			}

			//ui-sref="businessProduct({com_service_id:service.com_service_id,from:'tab.business'})"
			//举报公司
			$scope.report = function() {
				var report_id = $stateParams.com_id;
				$scope.reportObj = {"report_id":report_id,"report_content":""};
				$CommonFactory.showCustomPopup(function(){
					if (!$scope.reportObj.report_content || ($scope.reportObj.report_content.trim() == "")) {
						$cordovaToast.show("举报失败,请输入举报内容","short","center");
						return;
					}
					var data = {
						"accesstoken": accesstoken,
						"type_id": 7,
						"target_id": report_id,
						"report_comment": $scope.reportObj.report_content
					};
					$CommonFactory.showLoading();
					CommunityService.report(data, function(res){
						$CommonFactory.hideLoading();
						if (res.statuscode == CODE_SUCCESS) {
							// $CommonFactory.showAlert("举报成功");
							$cordovaToast.show("举报成功，等待审核","short","center");
						} else {
							// $CommonFactory.showAlert("举报失败");
							$cordovaToast.show("举报失败","short","center");
						}
					});

				},$scope, '<textarea class="b-a" rows="3" ng-model="reportObj.report_content"></textarea>', '举报');
			}


}]);
