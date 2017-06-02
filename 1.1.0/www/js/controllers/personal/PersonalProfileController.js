/*
 * 个人头像、用户名、公司、职位更改控制器
 */
app.controller('PersonalProfileCtrl',
	['$scope', '$window', '$ionicHistory', '$rootScope', "$state", 'PersonalService', '$CommonFactory', '$filter', '$stateParams', 'UserService', '$localStorage',
	function ($scope, $window, $ionicHistory, $rootScope, $state, PersonalService, $CommonFactory, $filter, $stateParams, UserService, $localStorage) {
		//$scope.user_id = $rootScope.getCurrentUser().id;
		var accesstoken = $rootScope.getAccessToken();
		$scope.user = $rootScope.getCurrentUser();
		$scope.person=[];
		$scope.path = $localStorage.getObject(KEY_COMMON_PATH);

		//获取个人信息
		$scope.getMineMessage = function(){
			var data = {
				
			};
			data = JSON.stringify(data);
			PersonalService.mine(data, function (response) {
				if (response.statuscode == CODE_SUCCESS) {
					$scope.person = response.data.userInfo;
					var ImgObj1=new Image();
					ImgObj1.src= $scope.path.route_path + $scope.path.photo_path + $scope.person.photo;
					if(ImgObj1.fileSize > 0 || (ImgObj1.width > 0 && ImgObj1.height > 0))
					{
						$scope.userImg = {'background-image':'url('+ImgObj1.src+')'};
					}
				}
			});
		}
		$scope.getMineMessage();

		//获取公司信息
		$scope.getCareerMessage = function(){
			var data = {
				accesstoken : accesstoken
			}
			PersonalService.career(data, function (response) {
				if (response.statuscode == CODE_SUCCESS) {
					$scope.work = response.data;
					//console.log($scope.work);
					for (var i=0,len=$scope.work.length;i<len;i++){
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
				accesstoken : accesstoken
			}
			PersonalService.education(data, function (response) {
				if (response.statuscode == CODE_SUCCESS) {
					$scope.study = response.data;
					//console.log($scope.study);
					for (var i=0,len=$scope.study.length;i<len;i++){
						$scope.study[i].start_date = $scope.study[i].start_date.replace(/-/g,".");
						$scope.study[i].end_date = $scope.study[i].end_date.replace(/-/g,".");

					}
				}
			});
		}
		$scope.getEducationMessage();

		//编辑工作经历
		$scope.editWorkClick = function(item) {
			$state.go("editoccup", {work_id: item.user_career_id});
		}

		//编辑教育经验
		$scope.editEducationModal = function(item) {
			$state.go("editedu", {edu_id: item.user_education_experience_id});
		}

		//获取兴趣
		$scope.getInterst = function(){
			UserService.getUserInterst({accesstoken:accesstoken},function(response){
				$scope.hobbies = response.data;
			})
		}
		$scope.getInterst();
		//选择地区
		$scope.selectAreaCity = function() {

			$state.go("profile_area");
		}

		//
		$scope.message=true;
		$scope.phone=false;
		$scope.qq = false;
		$scope.weixin = false;

		$scope.messageClick = function(){
			$scope.message=true;
			$scope.phone=false;
			$scope.qq = false;
			$scope.weixin = false;
		}

		$scope.phoneClick = function(){
			$scope.message=false;
			$scope.phone=true;
			$scope.qq = false;
			$scope.weixin = false;
		}

		$scope.qqClick = function(){
			$scope.message=false;
			$scope.phone=false;
			$scope.qq = true;
			$scope.weixin = false;
		}
		$scope.weixinClick = function(){
			$scope.message=false;
			$scope.phone=false;
			$scope.qq = false;
			$scope.weixin = true;
		}

		$scope.myBack = function(){
			$scope.message=true;
			$scope.phone=false;
			$scope.qq = false;
			$scope.weixin = false;
			$window.history.go();
		}

		//确认保存
		$scope.confirmClick = function() {
			if (!$scope.person.phone&&$scope.phone) {
				$CommonFactory.showAlert("请填写手机号！");
				return;
			}
			if (!$scope.person.qq&&$scope.qq) {
				$CommonFactory.showAlert("请填写QQ！");
				return;
			}
			if (!$scope.person.weixin_name&&$scope.weixin) {
				$CommonFactory.showAlert("请填写微信号！");
				return;
			}
			if ($scope.person.phone) {
				if (!(/^1[3|4|5|7|8]\d{9}$/.test($scope.person.phone))) {
				$CommonFactory.showAlert("手机号码有误！");
				return;
				}
			}
			if ($scope.person.weixin_name) {
				var weixin_nameReg = /^[a-zA-Z][a-zA-Z0-9_]{5,19}/ ;
				if (!weixin_nameReg.test($scope.person.weixin_name)) {
				$CommonFactory.showAlert("微信号格式不正确！");
				return;
				}
			}
			if ($scope.person.qq) {
				//var QQ_Reg = /^\d{5,10}$/ ;
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
			var data = {
				"accesstoken": accesstoken,
				full_name : $scope.person.name,
				phone : $scope.person.phone,
				qq : $scope.person.qq,
				weixin_name : $scope.person.weixin_name

			}

			PersonalService.setPersonMessage(data, function (response) {//待修改
				if (response.statuscode == CODE_SUCCESS) {
					//$CommonFactory.showAlert("修改成功!");
					$scope.messageClick();
				}else{
					$CommonFactory.showAlert("修改失败，请重试!");
					return;
				}
			});
		}

		//清空输入框
		$scope.deletePhone=function(){
			$scope.person.phone='';
		}
		$scope.deleteqq=function(){
			$scope.person.qq='';
		}
		$scope.deleteWeixin=function(){
			$scope.person.weixin_name='';
		}

		//无输入或乱输入情况下点返回
		$scope.backClick=function(){
			if($scope.phone){
				if (!$scope.person.phone||$scope.person.phone){
					$scope.getMineMessage();
					$scope.messageClick();
				}
			}
			if($scope.qq){
				if (!$scope.person.qq||$scope.person.qq){
					$scope.getMineMessage();
					$scope.messageClick();
				}
			}
			if($scope.weixin){
				if (!$scope.person.weixin_name||$scope.person.weixin_name){
					$scope.getMineMessage();
					$scope.messageClick();
				}
			}
		}
		$scope.ComBack = function(){
			if ($scope.fromStateName != 'tab.business' || $scope.fromStateName =='tab.mine') {
				$state.go('tab.mine')
			}
			else if($scope.fromStateName == 'tab.business'){
				$state.go($scope.fromStateName)
			}
			
		}
		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			$scope.fromStateName = fromState.name
		});

	}]);
