/**
 * 商务服务详情控制器
 */

app.controller('BusinessNeedsDetailCtrl',
	['$scope', '$rootScope', '$state','$stateParams', 'BusinessService', '$localStorage', '$ionicSlideBoxDelegate', '$timeout', 'CommunityService', '$CommonFactory', '$sce','$cordovaToast', '$ionicHistory',
	function ($scope, $rootScope, $state, $stateParams, BusinessService, $localStorage, $ionicSlideBoxDelegate, $timeout, CommunityService, $CommonFactory, $sce,$cordovaToast, $ionicHistory) {
		$scope.accesstoken = $rootScope.getAccessToken();
		// angular.element(document.querySelector('#hasshare')).css("display","none");//初始分享不显示
		$scope.hasshare = false;
		/*获取当前服务id*/
		$scope.com_needs_id = $stateParams.com_needs_id;

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
		$scope.hasreply = false;
		//底部聊天购买
		$scope.bottomRightText = "联系TA";
		$scope.from = $state.params.hasOwnProperty("from") ? $state.params.from : "";
		$scope.page = $state.params.hasOwnProperty("page") ? $state.params.page : "";

		//分享
		$scope.openshare = function(){
			$scope.hasshare = true;
			//angular.element(document.querySelector('#hasshare')).css("display","block");
		}
		$scope.closeshare = function(){
			$scope.hasshare = false;
			//angular.element(document.querySelector('#hasshare')).css("display","none");
		}

		//获取需求详情
		$scope.getNeedDatasOne = function(){
			var data = {
				accesstoken: $scope.accesstoken,
				com_needs_id: $scope.com_needs_id
			};
			CommunityService.getNeedOne(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					$scope.need = response.data;
					//是否已经点赞
					$scope.isLike = $scope.need.is_like;
					// //判断是否有素材
					// if ($scope.need.com_article_material_id) {
					// 	$scope.hasMaterial = true;
					// } else {
					// 	$scope.hasMaterial = false;
					// }
					if ($scope.need.message.length > 0) {
						$scope.hasreply = true;
					} else {
						$scope.hasreply = false;
					};
					// $scope.service.material_content = $sce.trustAsHtml($scope.service.material_content);
					// $timeout(function(){
					// 	$ionicSlideBoxDelegate.$getByHandle("bannerList").update();
					// 	$ionicSlideBoxDelegate.$getByHandle("bannerList").loop(true);
					// }, 500);
				}
			});
		};

		$scope.getNeedDatasOne();

		//tab切换
		$scope.changeTab = function(index) {
			$scope.tabType = index;
		}


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
				type_id: 2,
				target_id: $scope.need.com_needs_id,
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
			$scope.replay_show = !$scope.replay_show;
			$scope.msg = {};
		};

		$scope.sendReplay = function(){
			$scope.replay_show = !$scope.replay_show;
			var data = {
					accesstoken: $scope.accesstoken,
					type_id: 2,
					target_id: $scope.need.com_needs_id,
					message_content: $scope.msg.message
				};
			if(data.message_content == ''|| data.message_content == undefined){
				$CommonFactory.showAlert("回复内容不能为空");
				return;
			}
			CommunityService.replay(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					$scope.getNeedDatasOne();
				}
			});
		}

		$scope.replayBlur = function(){
			$scope.replay_show = false;
		}

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
				//如果是空字符串
				if (!$scope.reportmsg.message || ($scope.reportmsg.message).trim() == "") {
					$cordovaToast.show("投诉失败，请输入投诉内容", "short", "center");
					return;
				}
				var data = {
					accesstoken : $scope.accesstoken,
					type_id : 2,
					target_id : mess.message_id,
					report_comment : $scope.reportmsg.message
				};
				CommunityService.report(data, function(response){
					if (response.statuscode == CODE_SUCCESS) {
						$cordovaToast.show("投诉成功，等待审核", "short", "center");
					}
				});
			}, $scope, '<textarea type="text" class="b-a padding-l-5" ng-model="reportmsg.message" placeholder="投诉内容"></textarea>', '投诉 - '+'<strong>'+mess.message_user_name+'</strong>');
		}

		//聊天-购买
		$scope.bottomRightClick = function() {
//			if ($rootScope.getCurrentUser().opt_permission == 0) {
//				$CommonFactory.showAlert(noMoneyMessage);
//				return;
//			}
			//根据服务ID获取产品信息
			var data = {
				accesstoken: $scope.accesstoken,
				id: $scope.need.com_needs_id
			};
			BusinessService.getChatUserByServiceId(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					if ($state.params.from && ($state.params.from == "contactcommentlist" || $state.params.from == "chat")) {
						//购买
						$scope.myBack();
					} else {
						var data = {
							chat_user_id : response.data.user_id, //必传  聊天对方id
							chat_user_name : response.data.user_name, // 必传 对方名字
							chat_user_face : response.data.user_face,//非必传 自己的头像  
							com_needs_id : $scope.need.com_needs_id, //必传 服务（产品）id 
							user_role : 'B',//必传 一般是买方（默认） ‘A’卖方，'B' 买方
							from : $state.current.name, //非必传 来的路由名，用作返回
							from_param: {
								// from: $state.params.data.from,
								com_needs_id: $scope.com_needs_id, //服务ID
								// type_id: $state.params.data.type_id //服务类型ID
							}
						};
						$state.go('chat',{data: data});
					}
				}
			});
		}

		//企业页面
		$scope.toCompanyPage = function(serviceObj) {
			var data = {
				com_id : serviceObj.com_id,
//				from : "companylist",
//				from_id: $scope.service.com_service_id
			};
			$state.go('commsg', data);
		};

		//举报
		$scope.report = function() {
			var report_id = $scope.com_needs_id;
			$scope.reportObj = {"report_id":report_id,"report_content":""};
			$CommonFactory.showCustomPopup(function(){
				if (!$scope.reportObj.report_content || ($scope.reportObj.report_content.trim() == "")) {
					$cordovaToast.show("举报失败,请输入举报内容","short","center");
				}
				var data = {
					"accesstoken": $scope.accesstoken,
					"type_id": 2,
					"target_id": report_id,
					"report_comment": $scope.reportObj.report_content
				};
				$CommonFactory.showLoading();
				CommunityService.report(data, function(res){
					$CommonFactory.hideLoading();
					if (res.statuscode == CODE_SUCCESS) {
						//$CommonFactory.showAlert("举报成功");
						$cordovaToast.show("举报成功，等待审核","short","center");
					} else {
						//$CommonFactory.showAlert("举报失败");
						$cordovaToast.show("举报失败","short","center");
					}
				});

			},$scope, '<textarea class="b-a" rows="3" ng-model="reportObj.report_content"></textarea>', '举报');
		}
		
		//返回
		$scope.myBack = function(){
			if ($scope.from && $scope.from.length > 0) {
				$state.go($scope.from);
				return;
			}
			if ($scope.page && $scope.page.length > 0) {
				$localStorage.SearchPage = $scope.page;
				return;
			}	
			$localStorage.SearchPage = 2;
			$state.go("businessallposts");
		}

	}
]);
