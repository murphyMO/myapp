/**
 * 我的页面控制器
 */
app.controller('PersonalMessageCtrl',
	['$scope', '$window', '$rootScope', '$timeout','MineService','$state', '$localStorage', '$CommonFactory', '$stateParams', '$cordovaToast', 'UserService', 'CommunityService','CompanySummaryService','PersonalService','$ionicHistory',
		function ($scope, $window, $rootScope, $timeout, MineService, $state, $localStorage, $CommonFactory, $stateParams, $cordovaToast, UserService, CommunityService,CompanySummaryService,PersonalService,$ionicHistory) {
			$scope.accesstoken = $rootScope.getAccessToken();

			//$scope.commonPath = $rootScope.getCommonPath();
			$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
			var target_user_id = $stateParams.user_id;
			var target_com_id = $stateParams.com_id;
			var from = $stateParams.from;

			var accesstoken = $rootScope.getAccessToken();
			var current_user = $rootScope.getCurrentUser();
			$scope.is_public_id = current_user.id;
			/*
			个人名片权限逻辑：
			发自聊天的名片不管是否公开都可看，其余按设置的公开状况来
			chatSend--聊天中发送的个人名片，chatHead--聊天头像点击进来的
			*/
			$scope.from = from;

			//获取个人信息
			$scope.getPersonProfile = function(){
				var data = {
					accesstoken: accesstoken,
					user_id : target_user_id
				};
				if (target_com_id) {
					data = {
						accesstoken: accesstoken,
						user_id : target_user_id,
						com_id : target_com_id
					};
				}
				UserService.getPersonMessage(data, function (response) {
					if (response.statuscode == CODE_SUCCESS) {
						$scope.person = response.data;
						//console.log($scope.person);
						if($rootScope.locate_city){
							$scope.person.locate_city = $rootScope.locate_city;
						}
					}

				});

				if (target_com_id) {
					var comData = {
						accesstoken : accesstoken,
						com_id : target_com_id,
					};
					CompanySummaryService.getComSummary(comData, function (response2) {
						$scope.company= response2.data;
					});
				}

				var confirmData = {
					accesstoken : accesstoken,
					id : target_user_id,
					type: 1
				};
				UserService.confirmFollow(confirmData, function (res){
					$scope.followText = res.data.status == 2 ? '关注' : '取消关注';
					$scope.unfollowed = res.data.status == 2 ? true : false;
				});
			}
			$scope.getPersonProfile();
			//获取工作经历信息
			$scope.getCareerMessage = function() {
				var data = {
					accesstoken : accesstoken,
					user_id : target_user_id,
				}
				PersonalService.career(data, function (response) {
					if (response.statuscode == CODE_SUCCESS) {
						$scope.work = response.data;
						$scope.workLen = $scope.work.length;
						for (var i = 0 ; i < $scope.workLen ; i++) {
							$scope.work[i].start_date = $scope.work[i].start_date.replace(/-/g,".");
							$scope.work[i].end_time = $scope.work[i].end_time.replace(/-/g,".");

						}
					}
				});
			}
			$scope.getCareerMessage();

			//获取教育信息
			$scope.getEducationMessage = function(){
				var data = {
					accesstoken : accesstoken,
					user_id : target_user_id
				}
				PersonalService.education(data, function (response) {
					if (response.statuscode == CODE_SUCCESS) {
						$scope.study = response.data;
						$scope.studyLen = $scope.study.length;
						for (var i = 0 ; i < $scope.studyLen ; i++) {
							$scope.study[i].start_date = $scope.study[i].start_date.replace(/-/g,".");
							$scope.study[i].end_date = $scope.study[i].end_date.replace(/-/g,".");

						}
					}
				});
			}
			$scope.getEducationMessage();

			//获取兴趣
			$scope.getInterst = function(){
				var data = {
					accesstoken : accesstoken,
					user_id : target_user_id
				}
				UserService.getUserInterst(data,function(response){
					$scope.hobbies = response.data;
				})
			}
			$scope.getInterst();


			$scope.followPerson = function() {
				if($rootScope.isGuest){
					$state.go('login');
					// $CommonFactory.showAlert("大侠您好，该功能需登录查看");
				}else{

				var data = {
					accesstoken : accesstoken,
					concerned_user_id : target_user_id,
					fans_user_id : current_user.id,
					type : 1
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
						$scope.followText = res.data == 2 ? '关注' : '取消关注';
						$scope.unfollowed = res.data.status == 2 ? true : false;
						if(res.data == 2) {
							$CommonFactory.showAlert("取消关注成功");
							return;
						}else {
							 $CommonFactory.showAlert("关注成功");
							return;
						}
					}
				});

			}
		};

			$scope.concernUser = function(){
				if($rootScope.isGuest){
					$state.go('login');
					// $CommonFactory.showAlert("大侠您好，该功能需登录查看");
				}else{

				var data = { 
					chat_user_id : $scope.person.user_id,
					 //必传  聊天对方id 
					chat_user_name : $scope.person.full_name,
					// 必传 对方名字
					user_face : $scope.person.one_inch_photo_url,
					//非必传 自己的头像
					service_id : 0,
					//必传 服务（产品）id 
					user_role : 'B',
					//必传    一般是买方（默认） ‘A’卖方，'B' 买方
					from : $state.params.from
				}; 
					$state.go('chat',{data: data});
			}
		}


			$scope.showActionSheet = function(){
				$.showActionSheet();
			};

			$scope.myBack = function() {
				$ionicHistory.goBack();
				// if($state.params.from){
				// 	if ($state.params.from == 'activityforme') {
				// 		window.history.back();
				// 		return;
				// 	}
				// 	$state.go($state.params.from);
				// } else {
				// 	javascript:history.back();
				// }
			};

			//分享
			$scope.openshare = function(){
				$scope.hasshare = true;
			};

			$scope.closeshare = function(){
				$scope.hasshare = false;
			}

			//举报个人
			$scope.report = function() {
				if($rootScope.isGuest){
					$state.go('login');
					// $CommonFactory.showAlert("大侠您好，该功能需登录查看");
				}else{
				var report_id = $stateParams.user_id;
				$scope.reportObj = {"report_id":report_id,"report_content":""};
				$CommonFactory.showCustomPopup(function(){
					if (!$scope.reportObj.report_content || ($scope.reportObj.report_content.trim() == "")) {
						$cordovaToast.show("举报失败,请输入举报内容","short","center");
						return;
					}
					var data = {
						"accesstoken": accesstoken,
						"type_id": 6,
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

}]);
