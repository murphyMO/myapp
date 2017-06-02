/**
 * 我的控制器
 */
app.controller('MineCtrl',
	['$scope', '$window', '$rootScope', '$localStorage', '$CommonFactory','$stateParams', 'MineService', '$timeout','$state','$ionicSlideBoxDelegate','$sce','$ionicModal',
	function ($scope, $window, $rootScope, $localStorage, $CommonFactory,$stateParams, MineService,$timeout, $state,$ionicSlideBoxDelegate,$sce,$ionicModal) {


		// 获取用户信息
		$scope.user = $rootScope.getCurrentUser();
		$scope.user_id = $scope.user.objectId;

		// 获取基本信息
		$scope.getInfo = function(){
			var data = {};
			if($stateParams.id){
				data.currentUserId = $stateParams.id;
			}else{
				data.currentUserId = $scope.user_id;
			}
			//判断是否当前用户
			if(data.currentUserId == $scope.user_id){
				$scope.isCurrent = true;
			}else{
				$scope.isCurrent = false;
			}

			MineService.user(data, function (response) {
				if (response.statuscode == CODE_SUCCESS) {
					$scope.userInfo = response.user;
					$scope.avatar = $scope.userInfo.avatar.url? $scope.userInfo.avatar.url : 'img/icon_emptyPeron.png';
				}
			});
		}
		$scope.getInfo();
		

		// 获取关注的人
		$scope.getFocus = function(){
			var data = {};
			if($stateParams.id){
				data.currentUserId = $stateParams.id;
			}else{
				data.currentUserId = $scope.user_id;
			}

			MineService.focus(data, function (response) {
				if (response.statuscode == CODE_SUCCESS && response.data.length > 0) {
					$scope.focusData = [];
					$scope.focus = response.data;
					for(i in $scope.focus){
						$scope.focusData.push($scope.focus[i].target_id);
					}
					$scope.focusLen = response.data.length;
				}else{
					$scope.focusLen = 0;
				}
			});
		}
		$scope.getFocus();

		// 获取粉丝
		$scope.getFollow = function(){
			var data = {};
			if($stateParams.id){
				data.currentUserId = $stateParams.id;
			}else{
				data.currentUserId = $scope.user_id;
			}
			MineService.follow(data, function (response) {
				if (response.statuscode == CODE_SUCCESS && response.data.length > 0) {
					$scope.follow = response.data;
					$scope.followLen = response.data.length;
				}else{
					$scope.followLen = 0;
				}
			});
		}
		$scope.getFollow();





		$scope.likeIsEmpty = false;
		$scope.topicIsEmpty = false;
		//获取当前用户喜欢的内容
		$scope.getMineLike = function(){ 
			var data = {};
			if($stateParams.id){
				data.currentUserId = $stateParams.id;
			}else{
				data.currentUserId = $scope.user_id;
			}
			MineService.like(data, function (response) {
				if (response.statuscode == CODE_SUCCESS && response.data.length > 0) {
					$scope.likes = response.data;
					$scope.likeIsEmpty = false;
				}else{
					$scope.likeIsEmpty = true;
				}
			});
		}
		$scope.getMineLike();

		// 收藏话题
		$scope.getMineTopic = function(){ 
			var data = {};
			if($stateParams.id){
				data.currentUserId = $stateParams.id;
			}else{
				data.currentUserId = $scope.user_id;
			}
			MineService.topic(data, function (response) {
				if (response.statuscode == CODE_SUCCESS && response.data.length > 0) {
					$scope.topics = response.data;
					$scope.topicIsEmpty = false;
				}else{
					$scope.topicIsEmpty = true;
				}
			});
		}


		$scope.editInfo = function(){
			
		}

		$scope.goBack = function(){
			window.history.back();
		}


		// //检查是否有新版本
		// $rootScope.hasNewVersion();

		// //判断是否有公司
		// $scope.hasCompany = true;
		// var userObj = $rootScope.getCurrentUser();
		// //if (!userObj.multiplecom || userObj.multiplecom == 0) {
		// if (!userObj.com_name) {
		// 	$scope.hasCompany = false;
		// }

		if($stateParams.thisItem){
			$scope.thisItem = $stateParams.thisItem;
		}else{
			$scope.thisItem = 0;
		}
		// 	//获取个人信息
		// 	$scope.getHomeDatas = function(){
		// 		var data = {
				
		// 		};
		// 		data = JSON.stringify(data);

		// 		CompanyService.getCompanyOnes(data,function(response){
		// 			if(response.statuscode == 1){
		// 				$scope.deptCnt = response.data.deptCnt;
		// 				$scope.userCnt = response.data.userCnt;
		// 				$scope.comInfo = response.data.comInfo;
		// 				$scope.comBusinessLabelInfo = response.data.comBusinessLabelInfo;
		// 			}
		// 		});
		// 	};
		// 	$scope.getHomeDatas();

		// 	// $scope.clickInvite = function(){
		// 	// 	$CommonFactory.showConfirm($scope.invite,"确定更换公司邀请码吗？");
		// 	// }

		// 	$scope.clickInvite = function(){
		// 		if($scope.isManager != 1){
		// 			$CommonFactory.showAlert("你不是管理员，不能操作!");
		// 		}else{
		// 		$CommonFactory.showConfirm($scope.invite,"确定更换公司邀请码吗？");
		// 		}
		// 	}
		// 	// 组织架构
		// 	$scope.deptlist = function(){
		// 		if($scope.comInfo.com_verify_status != 1 && $scope.comInfo.com_title_type == 0){
		// 			$CommonFactory.showAlert("未通过审核，不能操作!");
		// 		}
		// 		/*else if($scope.comInfo.com_title_type == 1){
		// 			$CommonFactory.showAlert("你是团队成员，不能操作!");
		// 		}*/
		// 		else{
		// 			$state.go("deptlist");
		// 		}
		// 	}
		// 	// 资质信息团队提示
		// 	$scope.comaptitudemsg = function(){
		// 		if ($scope.comInfo.com_title_type == 1) {
		// 			$CommonFactory.showConfirm(function(){
		// 				$state.go('comcheck');
		// 			},'请完善信息升级成为企业用户','提示','去升级');
		// 		}else{
		// 			$state.go('comaptitudemsg');
		// 		}
		// 	}

		// 	$scope.invite = function(){
		// 		$scope.comInfo.invite_code = '';
		// 		var data = {
		// 			"accesstoken" : $scope.accesstoken
		// 		};
		// 		CompanyService.getInviteCode(data,function(response){
		// 			if(response.statuscode == 1){
		// 				$scope.getHomeDatas();
		// 			}
		// 		});
		// 	}
		// 	$scope.comObj = {};
		// 	//加入公司
		// 	$scope.join = function() {
		// 		$CommonFactory.showCustomPopup(function(){
		// 			if (!$scope.comObj.invite_code) {
		// 				$CommonFactory.showAlert("请输入公司邀请码");
		// 				return;
		// 			}
		// 			var data = {
		// 				"accesstoken" : $scope.accesstoken,
		// 				"invite_code" : $scope.comObj.invite_code
		// 			};

		// 			$CommonFactory.showLoading();
		// 			CompanyService.joinCom(data, function(res){
		// 				$CommonFactory.hideLoading();
		// 				if (res.statuscode == CODE_SUCCESS) {
		// 					$CommonFactory.showAlert("加入成功");
		// 					$scope.getCompanyList();
		// 					$state.go("tab.mine",{thisItem:1});
		// 				}else{
		// 					$CommonFactory.showAlert("加入无效，邀请码错误或您已在此公司");
		// 				}
		// 			});
		// 		},$scope, '<textarea class="b-a" rows="3" ng-model="comObj.invite_code"></textarea>', '请输入公司邀请码');
		// 	}

		// 	$scope.getMineList = function(){
		// 		//请求参数
		// 		var data = {
		// 			"accesstoken" : $scope.accesstoken
		// 		};
		// 		MineService.getMineList(data, function(response){
		// 			$scope.response=response.data;
		// 			var ImgObj1=new Image();
		// 			ImgObj1.src= $scope.path.route_path + $scope.path.photo_path + $scope.response.userInfo.one_inch_photo_url;
		// 			if(ImgObj1.fileSize > 0 || (ImgObj1.width > 0 && ImgObj1.height > 0))
		// 			{
		// 				$scope.xkdUserImg = {'background-image':'url('+ImgObj1.src+')'};
		// 			}
					
		// 			var ImgObj2=new Image();
		// 			ImgObj2.src= $scope.path.route_path + $scope.path.com_logo_path + $scope.response.comInfo.com_logo_path;
		// 			if(ImgObj2.fileSize > 0 || (ImgObj2.width > 0 && ImgObj2.height > 0))
		// 			{	
		// 				$scope.xkdUserCompany = {'background-image':'url('+ImgObj2.src+')'};
		// 			}
		// 		});
		// 	};
		// 	$scope.getMineList();

			// $scope.getUnPay = function(){
			// 	var data = {
			// 		"accesstoken" : $scope.accesstoken
			// 	}
			// 	MineService.getUnPay(data,function(response){
			// 		if (response.statuscode == 1) {
			// 			$scope.unPayInfo = response.data;
			// 		}
			// 	})
			// }
			// $scope.getUnPay();
			$scope.goBalanceList = function(){
				$localStorage.set('unPay',$scope.unPayInfo.unpaid.unpaid_amount);
				$state.go("balanceList")
			}
			$scope.goCouponList = function(){
				$localStorage.setObject('coupon',$scope.unPayInfo.coupon);
				$state.go("couponList")
			}

			//滑动
			$scope.slideHasChanged = function(i){
				//$state.go('tab.mine',{thisItem:i});
				$localStorage.set("Page",i);
				$scope.thisItem = i;
			}
			$scope.clickLike = function(){
				$ionicSlideBoxDelegate.slide(0);
			}
			$scope.clickTopic = function(){
				$ionicSlideBoxDelegate.slide(1)
				$scope.getMineTopic();
		}
			$scope.clickInfo = function(){
				$ionicSlideBoxDelegate.slide(2)
			}


			// $scope.minesetting = function(){
			// 	if($rootScope.isGuest){
			// 		$state.go('login');
			// 	}else{
			// 		$state.go('minesetting');
			// 	}
			// }
			// $scope.profile = function(){
			// 	if($rootScope.isGuest){
			// 		$state.go('login');
			// 	}else{
			// 		$state.go('profile');
			// 	}
			// }
			// $scope.goIdverify = function(){
			// 	$state.go('idverify');
			// }
			// $scope.idverify = function(){
			// 	if($rootScope.isGuest){
			// 		$state.go('login');
			// 	}else{
			// 		if ($scope.idState == 4 || $scope.idState == 100) {
			// 			$state.go('idverify');
			// 		}
			// 		else if ($scope.idState == 3) {
			// 			$CommonFactory.showConfirm($scope.goIdverify,"您的身份验证已失效，请重新上传验证");
			// 		}
			// 		else{
			// 			$state.go('idverifyState');
			// 		}
			// 	}
			// }
			// $scope.minememberlist = function(){
			// 	if($rootScope.isGuest){
			// 		$state.go('login');
			// 	}else{
			// 		$state.go('minememberlist');
			// 	}
			// }
			// $scope.minerelease = function(){
			// 	if($rootScope.isGuest){
			// 		$state.go('login');
			// 	}else{
			// 		$state.go('minerelease');
			// 	}
			// }
			// $scope.mineorderslist = function(){
			// 	if($rootScope.isGuest){
			// 		$state.go('login');
			// 	}else{
			// 		$state.go('mineorderslist');
			// 	}
			// }
			// $scope.mineenroll = function(){
			// 	if($rootScope.isGuest){
			// 		$state.go('login');
			// 	}else{
			// 		$state.go('mineenroll');
			// 	}
			// }
			// $scope.mineconcern = function(){
			// 	if($rootScope.isGuest){
			// 		$state.go('login');
			// 	}else{
			// 		$state.go('mineconcern');
			// 	}
			// }

		// $scope.mineSee = function(){
		// 	// $cordovaToast.show("暂未开放，敬请期待", "long", "center");
		// 	// return;
		// 	if($rootScope.isGuest){
		// 		$state.go("login");
		// 	}else{
		// 		$scope.openXiaKeYuModal();
		// 	}

		// }

		// $scope.checkIdState = function(){
		// 	var data = {
		// 		accesstoken : $scope.accesstoken
		// 	}
		// 	MineService.checkIdState(data,function(response){
		// 		if (response.statuscode == 1) {
		// 			$scope.idState = response.data;
		// 			if ($scope.idState == 1) {
		// 				$scope.idStateText = "已认证";
		// 			}
		// 			else{
		// 				$scope.idStateText = "未认证";
		// 			}
		// 		}
		// 	})
		// }
		// $scope.checkIdState();

		// 触发一个按钮点击，或一些其他目标
		// $ionicModal.fromTemplateUrl('templates/modal/mine_see_modal.html', {
		// 	scope: $scope,
		// 	animation: 'slide-in-up'
		// }).then(function(modal) {
		// 	$scope.xiaKeYuModal = modal;
		// });
		// $scope.openXiaKeYuModal = function() {
		// 	$scope.xiaKeYuModal.show();
		// };
		// $scope.closeXiaKeYuModal = function() {
		// 	$scope.xiaKeYuModal.hide();
		// };
		// var url = "http://59.110.7.58:8080/xiakeyu/app/1.0/www/#/booklist&accesstoken="+$scope.accesstoken;
		// $sce: $scope.targetUrl = $sce.trustAsResourceUrl(url);
		

	}
]);
