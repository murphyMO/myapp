/**
 * 活动详情控制器
 */

app.controller('ActivityItemCtrl',
	['$scope', '$rootScope', '$state','$stateParams', 'CommunityService', '$localStorage', '$ionicSlideBoxDelegate', '$timeout', 'CommunityService', '$CommonFactory', '$sce','$cordovaToast', '$ionicHistory',
	function ($scope, $rootScope, $state, $stateParams, CommunityService, $localStorage, $ionicSlideBoxDelegate, $timeout, CommunityService, $CommonFactory, $sce,$cordovaToast, $ionicHistory) {
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.user = $rootScope.getCurrentUser();
		/*获取当前服务id*/
		 $scope.com_service_id = $stateParams.com_service_id;

		//路径对象
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		//企业logo
		$scope.companyPath = $scope.commonPath.route_path + $scope.commonPath.com_logo_path;
		//活动轮播图
		$scope.activityThumbPath = $scope.commonPath.route_path + $scope.commonPath.party_path

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

		$scope.from = $state.params.hasOwnProperty("from") ? $state.params.from : "";
		$scope.page = $state.params.hasOwnProperty("page") ? $state.params.page : "";
		//分享
		$scope.openshare = function(){
			if($rootScope.isGuest){
					$state.go('login');
				}else{
			$scope.hasshare = true;
			}
		}
		$scope.closeshare = function(){
			$scope.hasshare = false;
		}


		//获取活动详情
		$scope.getServiceDatasOne = function(){
			var data = {
				accesstoken: $scope.accesstoken,
				target_id: $stateParams.id
			};
			$CommonFactory.showLoading();
			CommunityService.getOneActivity(data, function(response){
				$CommonFactory.hideLoading();
				if (response.statuscode == CODE_SUCCESS) {
					$scope.service = response.data[0];
					//是否已经点赞
					$scope.isLike = $scope.service.is_like;
					if ($scope.service.is_enroll == 1) {
						$scope.bottomRightText = "已参与";
					}
					else if ($scope.service.is_enroll == 0) {
						$scope.bottomRightText = "参与";
					}
					//判断是否有素材
					if ($scope.service.com_article_material_id) {
						$scope.hasMaterial = true;
					} else {
						$scope.hasMaterial = false;
					}
					//判断是否有回复
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
		$scope.onSwipeLeft=function(index){
			$scope.tabType = index;
		}

		//向右滑动的时候
		$scope.onSwipeRight=function(index) {
			$scope.tabType = index;
		}

		//点赞
		$scope.hiLickClick = function() {
//			if ($rootScope.getCurrentUser().opt_permission == 0) {
//				$CommonFactory.showAlert(noMoneyMessage);
//				return;
//			}
			if($rootScope.isGuest){
					$state.go('login');
				}else{
			if ($scope.isLike == 1) {
				$scope.isLike = 0;
			} else {
				$scope.isLike = 1;
			}

			var data = {
				accesstoken: $scope.accesstoken,
				type_id: 3,
				target_id: $scope.service.party_id,
				status: $scope.isLike
			};
			CommunityService.likeYou(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {

				}
			});
		}
	}

//回复
		$scope.hiMessageClick = function() {
//			if ($rootScope.getCurrentUser().opt_permission == 0) {
//				$CommonFactory.showAlert(noMoneyMessage);
//				return;
//			}
			if($rootScope.isGuest){
					$state.go('login');
				}else{
			$scope.replay_show = !$scope.replay_show;
			$scope.msg = {};
			}
		};

		$scope.sendReplay = function(){
			$scope.replay_show = !$scope.replay_show;
			if(!$scope.msg.message){
				$CommonFactory.showAlert("请输入评价内容");
					return;
			}
			var data = {
					accesstoken: $scope.accesstoken,
					type_id: 3,
					target_id: $scope.service.party_id,
					message_content: $scope.msg.message,
					parent_message_id : ""
				};
			CommunityService.replay(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					$scope.getServiceDatasOne();
				}
			});
		}
		$scope.replayBlur = function(){
			$scope.replay_show = false;
		}

		//参与活动
		$scope.enroll =function(item){
//			if ($rootScope.getCurrentUser().opt_permission == 0) {
//				$CommonFactory.showAlert(noMoneyMessage);
//				return;
//			}
			//报名
			if (item.is_enroll == 0) {
				if (item.apply_status == 0) {
					$CommonFactory.showAlert("活动方设置不允许报名");
					return;
				}
				else if (item.apply_status == 1) {
					if (item.apply_end_time_flag == 0) {
						$CommonFactory.showAlert("报名时间已过,不能报名");
						return;
					}
					if (item.apply_limit_flag == 0) {
						$CommonFactory.showAlert("人员已满,不能报名");
						return;
					}
					if (item.start_time_flag == 0) {
						$CommonFactory.showAlert("活动已开始,不能报名");
						return;
					}
				}

			}
			//取消报名
			else if (item.is_enroll == 1) {
				if (item.start_time_flag == 0) {
					$CommonFactory.showAlert("活动已开始,不能取消");
					return;
				}
			}
			var data = {
				"accesstoken" : $scope.accesstoken,
				"party_id" : item.party_id,
				"target_id" : item.party_id
			};
			CommunityService.partyEnroll(data,function(response){
				if (response.statuscode == 1) {
					if ($scope.bottomRightText != "已参与") {
						$CommonFactory.showAlert("您的报名已成功，请在我的报名页面查看详情");
					}
					CommunityService.getOneActivity(data,function(r){
						console.log(r)
						if(r.statuscode == 1){
							$scope.getServiceDatasOne();
						}
					})
				}
			})
		}
		//返回
		$scope.myBack = function(){
			// if ($scope.from && $scope.from.length > 0) {
			// 	if ($scope.from == 'activityforme') {
			// 		window.history.back();
			// 		return;
			// 	}
			// 	$state.go($scope.from);
			// 	return;
			// }
			// if ($scope.page && $scope.page.length > 0) {
			// 	$localStorage.SearchPage = $scope.page;
			// 	return;
			// }
			// $localStorage.SearchPage = 3;
			// $state.go("businessallposts");
			$ionicHistory.goBack();
		}

		//企业页面
		$scope.toCompanyPage = function(serviceObj) {
			var data = {
				com_id : serviceObj.cre_com_id,
				from : "companylist",
				from_id: $scope.service.com_service_id
			};
			$state.go('commsg', data);
		};

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
			}, $scope, '<textarea type="text" class="b-a padding-l-5" ng-model="reportmsg.message" placeholder="投诉内容"></textarea>', '投诉 - '+'<strong>'+mess.repley_user_name+'</strong>');
		};

		//举报活动
		//举报
		$scope.report = function() {
			if($rootScope.isGuest){
					$state.go('login');
				}else{
			var report_id = $state.params.id;
			$scope.reportObj = {"report_id":report_id,"report_content":""};
			$CommonFactory.showCustomPopup(function(){
				if (!$scope.reportObj.report_content || ($scope.reportObj.report_content.trim() == "")) {
					$cordovaToast.show("举报失败,请输入举报内容","short","center");
					return;
				}
				var data = {
					"accesstoken": $scope.accesstoken,
					"type_id": 3,
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
	}



	}
]);
