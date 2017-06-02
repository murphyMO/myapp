/**
 * 商务产品详情控制器---企业列表用
 */

app.controller('CompanyBussinessProductCtrl',
	['$scope', '$rootScope', '$state','$stateParams', 'BusinessService', '$localStorage', '$ionicSlideBoxDelegate', '$timeout', 'CommunityService', '$CommonFactory', '$sce','$cordovaToast', '$ionicHistory',
	function ($scope, $rootScope, $state, $stateParams, BusinessService, $localStorage, $ionicSlideBoxDelegate, $timeout, CommunityService, $CommonFactory, $sce,$cordovaToast, $ionicHistory) {
		$scope.accesstoken = $rootScope.getAccessToken();
		/*获取当前服务id*/
		$scope.com_service_id = $stateParams.com_service_id;
//		$scope.com_service_id = $state.params.data.com_service_id;
		 
		//路径对象
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		//企业logo
		$scope.companyPath = $scope.commonPath.route_path + $scope.commonPath.com_logo_path;
		//服务缩略图地址
		$scope.serviceThumbPath = $scope.commonPath.route_path + $scope.commonPath.service_thumb_path;
		
		$scope.service = [];
		
		//点赞
		$scope.isLike = 0;
		
		//tab切换
		$scope.tabType = 1;
		//是否有素材
		$scope.hasMaterial = true;
		//是否显示回复
		$scope.hasreply = true;
		//底部聊天购买
		$scope.bottomRightText = "联系TA";
		$scope.from = $state.params.hasOwnProperty("from") ? $state.params.from : "";

		//获取服务详情
		$scope.getServiceDatasOne = function(){
			var data = {
				accesstoken: $scope.accesstoken,
				id: $scope.com_service_id
			};
			BusinessService.serviceDatasOne(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					$scope.service = response.data;
					//是否已经点赞
					$scope.isLike = $scope.service.is_like;
					//判断是否有素材
					if ($scope.service.com_article_material_id) {
						$scope.hasMaterial = true;
					} else {
						$scope.hasMaterial = false;
					}
					if ($scope.service.service_message_info.length > 0) {
						$scope.hasreply = true;
					} else {
						$scope.hasreply = false;
					};
					$scope.service.material_content = $sce.trustAsHtml($scope.service.material_content);
					$timeout(function(){
						$ionicSlideBoxDelegate.$getByHandle("bannerList").update();
						$ionicSlideBoxDelegate.$getByHandle("bannerList").loop(true);
					}, 500);
				}
			});
		};
		
		$scope.getServiceDatasOne();
		
		//tab切换
		$scope.changeTab = function(index) {
			$scope.tabType = index;
		}
		
		//向左滑
		/*$scope.onSwipeLeft=function(index){
			$scope.tabType = index;
		}*/

		//向右滑动的时候
		/*$scope.onSwipeRight=function(index) {
			$scope.tabType = index;
		}*/

		//点赞
		$scope.hiLickClick = function() {
//			if ($rootScope.getCurrentUser().opt_permission == 0) {
//				$CommonFactory.showAlert(noMoneyMessage);
//				return;
//			}
			if ($scope.isLike == 1) {
				$scope.isLike = 0;
			} else {
				$scope.isLike = 1;
			}
			
			var data = {
				accesstoken: $scope.accesstoken,
				type_id: 4,
				target_id: $scope.service.com_service_id,
				status: $scope.isLike
			};
			CommunityService.likeYou(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					
				}
			});
		}
		
		//回复
		$scope.hiMessageClick = function() {
//			if ($rootScope.getCurrentUser().opt_permission == 0) {
//				$CommonFactory.showAlert(noMoneyMessage);
//				return;
//			}
			$scope.msg = {};
//			if (!$scope.msg.message) {
//				$CommonFactory.showAlert("请输入内容");
//			};
			$CommonFactory.showCustomPopup(function(){
				var data = {
					accesstoken: $scope.accesstoken,
					type_id: 4,
					target_id: $scope.service.com_service_id,
					message_content: $scope.msg.message
				};
				CommunityService.replay(data, function(response){
					if (response.statuscode == CODE_SUCCESS) {
						$scope.getServiceDatasOne();
					}
				});
			}, $scope, '<input type="text" class="b-a" ng-model="msg.message">', '回复');
		};
		
		//判断是聊天还是购买
		if ($scope.from == "contactcommentlist" || $scope.from == "chat") {
			//购买
			$scope.bottomRightText = "购买";
		}

		//长按回复-投诉
		$scope.onHold = function(mess){
//			if ($rootScope.getCurrentUser().opt_permission == 0) {
//				$CommonFactory.showAlert(noMoneyMessage);
//				return;
//			}
			console.log(mess)
			$scope.reportmsg = {};
			$CommonFactory.showCustomPopup(function(){
				var data = {
					accesstoken : $scope.accesstoken,
					type_id : 5,
					target_id : mess.message_id,
					report_comment : $scope.reportmsg.message
				};
				CommunityService.report(data, function(response){
					if (response.statuscode == CODE_SUCCESS) {
						$cordovaToast.show("投诉成功，等待审核", "short", "center")
							.then(function(success) {
							// success
							}, function (error) {
							// error
						});
					}
				});
			}, $scope, '<textarea type="text" class="b-a padding-l-5" ng-model="reportmsg.message" placeholder="投诉内容"></textarea>', '投诉 - '+'<strong>'+mess.message_user_name+'</strong>');
		}
		
		//聊天-购买
		$scope.bottomRightClick = function() {
			if ($rootScope.getCurrentUser().opt_permission == 0) {
				$CommonFactory.showAlert(noMoneyMessage);
				return;
			}
			if ($state.params.from && ($state.params.from == "contactcommentlist" || $state.params.from == "chat")) {
				//购买
				$scope.myBack();
				return;
			}
			//根据服务ID获取产品信息
			var data = {
				accesstoken: $scope.accesstoken,
				id: $scope.service.com_service_id
			};
			BusinessService.getChatUserByServiceId(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					var data = {
						chat_user_id : response.data.user_id, //必传  聊天对方id
						chat_user_name : response.data.user_name, // 必传 对方名字
						chat_user_face : response.data.user_face,//非必传 自己的头像  
						service_id : $scope.service.com_service_id, //必传 服务（产品）id 
						user_role : 'B',//必传 一般是买方（默认） ‘A’卖方，'B' 买方
						from : $state.current.name, //非必传 来的路由名，用作返回
						from_param: {
							from: $state.params.from,
							com_service_id: $scope.com_service_id //服务ID
						}
					};
					$state.go('chat',{data: data});
				}
			});
		}
		
		//返回
		$scope.myBack = function(){
//			var data = {
//				com_id: $scope.service.com_id,
//				from: $state.params.data.from_param.from
//			}
//			$state.go($state.params.data.from, data);
			
			$ionicHistory.goBack();
			//$state.go("commsg", data);
		}
		  
		//企业页面
		$scope.toCompanyPage = function(serviceObj) {
			$scope.myBack();
		}
	}
]);