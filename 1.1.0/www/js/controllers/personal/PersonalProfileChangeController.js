/**
 * 我的页面控制器
 */
app.controller('PersonalChangeCtrl',
	['$scope', '$window', '$rootScope', "$state", 'MineService', '$CommonFactory', '$ionicActionSheet','$cordovaCamera', '$stateParams','$ionicActionSheet','$timeout', '$localStorage','$ionicHistory',
		function ($scope, $window, $rootScope, $state, MineService, $CommonFactory, $ionicActionSheet, $cordovaCamera, $stateParams,$ionicActionSheet,$timeout,$localStorage,$ionicHistory) {
		// 获取当前用户信息
		$scope.user = $rootScope.getCurrentUser();
		$scope.person = angular.copy($scope.user);
		console.log($scope.user);

		// 初始化数据
		$scope.usermsg=true;
		$scope.name=false;
		$scope.description=false;
		$scope.phone=false;
		$scope.weixin=false;
		$scope.qq=false;
		$scope.sex = false;

		$scope.usermsgClick=function(){
			$scope.usermsg=true;
			$scope.name=false;
			$scope.description=false;
			$scope.phone=false;
			$scope.weixin=false;
			$scope.qq=false;
			$scope.sex = false;
		}

		$scope.userNameClick=function(){
			$scope.name=true;
			$scope.description=false;
			$scope.phone=false;
			$scope.weixin=false;
			$scope.qq=false;
			$scope.sex = false;
			// $scope.positionName=false;

			$scope.usermsg=false;
		}
		$scope.descriptionClick = function(){
			$scope.name=false;
			$scope.description=true;
			$scope.phone=false;
			$scope.weixin=false;
			$scope.qq=false;
			$scope.sex = false;
			// $scope.positionName=false;

			$scope.usermsg=false;
		}
		$scope.phoneClick = function(){
			$scope.name=false;
			$scope.description=false;
			$scope.phone=true;
			$scope.weixin=false;
			$scope.qq=false;
			$scope.sex = false;
			// $scope.positionName=false;

			$scope.usermsg=false;
		}
		$scope.weixinClick = function(){
			$scope.name=false;
			$scope.description=false;
			$scope.phone=false;
			$scope.weixin=true;
			$scope.qq=false;
			$scope.sex = false;
			// $scope.positionName=false;

			$scope.usermsg=false;
		}
		$scope.qqClick = function(){
			$scope.name=false;
			$scope.description=false;
			$scope.phone=false;
			$scope.weixin=false;
			$scope.qq=true;
			$scope.sex = false;
			// $scope.positionName=false;

			$scope.usermsg=false;
		}
		$scope.sexClick = function(){
			$scope.name=false;
			$scope.description=false;
			$scope.phone=false;
			$scope.weixin=false;
			$scope.qq=false;
			$scope.sex = true;
			// $scope.positionName=false;

			$scope.usermsg=false;
		}


		$scope.positionNameClick=function(){
			$scope.usermsg=false;
			$scope.userName=false;
			$scope.positionName=true;
		}
		$scope.isPublicClick = function() {
			$scope.usermsg=false;
			$scope.userName=false;
			$scope.isPublic=true;
		}

		$scope.$on("user-img", function (event, data) {
			$scope.xkdUserImg = {'background-image':'url('+data+')'};
		})


		//确认保存修改的信息
		$scope.confirmClick = function() {
			if($scope.name){
				if(!$scope.person.username){
					$CommonFactory.showAlert("请填写姓名！");
					return;
				}
			}
			if($scope.description){
				if(!$scope.person.description){
					$CommonFactory.showAlert("请介绍以下你自己吧");
					return;
				}
			}
			if($scope.phone){
				if(!(/^1[3|4|5|7|8]\d{9}$/.test($scope.person.phone))){
					$CommonFactory.showAlert("手机号码有误！");
					return;
				}
			}
			if($scope.weixin){
				var weixin_nameReg = /^[a-zA-Z][a-zA-Z0-9_]{5,19}/ ;
				if (!weixin_nameReg.test($scope.person.weixin)) {
				$CommonFactory.showAlert("微信号格式不正确！");
				return;
				}
			}
			if ($scope.qq) {
				var QQ_Reg = /^[1-9][0-9]{4,}$/ ;
				if (!QQ_Reg.test($scope.person.qq)) {
				$CommonFactory.showAlert("QQ号格式不正确！");
				return;
				}
			}
			if($scope.person.qq){
				if(($scope.person.qq).length>12||($scope.person.qq).length<5){
				$CommonFactory.showAlert("QQ格式不正确!");
				return;
				}
			}
			$scope.person.sex = $scope.person.sex.toString();
			var data = {
				objectId : $scope.user.objectId,
				username : $scope.person.username,
				description : $scope.person.description,
				phone : $scope.person.phone,
				weixin : $scope.person.weixin,
				qq : $scope.person.qq,
				sex : $scope.person.sex
			}
			MineService.eidtUser(data, function (response) {
				if (response.statuscode == CODE_SUCCESS) {
					$CommonFactory.showAlert("修改成功!");
					$rootScope.setCurrentUser(response.user);
					$scope.user = response.user;
					$scope.usermsgClick();

				}else{
					$CommonFactory.showAlert("操作失败，请重试!");
				}
			});
		}

		$scope.myBack = function() {
				window.history.back();
			};

		$scope.backClick=function(){
			// $window.location.reload();
			// $ionicHistory.goBack();
			$scope.usermsgClick();
			// if($scope.userName){
			// 	if (!$scope.person.name||$scope.person.name){
			// 		$scope.getMineMessage();
			// 		$scope.usermsgClick();
			// 	}
			// }
			// if($scope.positionName){
			// 	if (!$scope.person.post_name||$scope.person.name){
			// 		$scope.getMineMessage();
			// 		$scope.usermsgClick();
			// 	}
			// }
			// if($scope.isPublic){
			// 	if (!$scope.person.is_public||$scope.person.name){
			// 		$scope.getMineMessage();
			// 		$scope.usermsgClick();
			// 	}
			// }
		}




		$scope.personMessage=true;
		$scope.username=false;
		$scope.changeUsernameClick = function(){
			$scope.personMessage=false;
			$scope.username=true;
		}


		$scope.back = function(){
			$scope.personMessage=true;
			$scope.username=false;
		}

		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		var imgPath = $scope.commonPath.route_path;
		// var uri = window.platformServer+'commons/common-upload?accesstoken='+accesstoken;
		var pictureSource;
		var destinationType;
		document.addEventListener("deviceready", onDeviceReady, false);
		function onDeviceReady() {
			pictureSource = navigator.camera.PictureSourceType;
			destinationType = navigator.camera.DestinationType;
		}
		//选择图片指令
		$scope.cameraOptions = {
			quality: 50,
			//sourceType: pictureSource.SAVEDPHOTOALBUM,
			maximumImagesCount:1,
			width: 200,
			height: 200,
			post_type: 7
		};
	}]);
