/**
 * 我的职业生涯控制器
 */
app.controller('MineOccupCtrl',
	['$scope', '$window', '$rootScope','MineService','$state',
		function ($scope, $window, $rootScope, MineService,$state) {
			$scope.accesstoken = $rootScope.getAccessToken();
			var userObj = $rootScope.getCurrentUser();
			$scope.work = [];

			$scope.target_user_id = $state.params.data.target_user_id;

			$scope.user_id = userObj.id;
			if($scope.target_user_id != userObj.id){
				$scope.user_id = $scope.target_user_id;
			}

			$scope.getOccpu = function(){
				//获取个人信息
				var data = {
					accesstoken : $scope.accesstoken,
					user_id : $scope.user_id
				};
				MineService.userGetSetting(data, function (response) {
					if (response.statuscode == CODE_SUCCESS) {
						$scope.my = response.data;
					}
				})
			}
			$scope.getOccpu();
			

			//页面返回按钮
			$scope.back = function(){
				var data = {'target_user_id':$scope.user_id};
				$state.go('mineindex',{'data':data});
			}

			//获取工作经历
			$scope.viewWork = function() {
				var data = {
					accesstoken : $scope.accesstoken,
					user_id : $scope.user_id
				};
				MineService.viewCareer(data, function(response){
					console.log(response);
					if (response.statuscode == CODE_SUCCESS) {
						$scope.workList = response.data;
					}
				});
			}
			$scope.viewWork();

			//教育经历数据列表
			$scope.educationList = [];
			//教育经历对象
			$scope.education = {};
			//获取教育经历
			$scope.viewEducation = function() {
				var data = {
					accesstoken : $scope.accesstoken,
					user_id : $scope.user_id
				};
				MineService.viewEducation(data, function(response){
					//console.log(response);
					if (response.statuscode == CODE_SUCCESS) {
						$scope.educationList = response.data;
					}
				});
			}
			$scope.viewEducation();

			//编辑工作经历
			$scope.editWorkClick = function(item) {
				$state.go("editoccup", {work_id: item.user_career_id});
			}

			//编辑教育经验
			$scope.editEducationModal = function(item) {
				$state.go("editedu", {edu_id: item.user_education_experience_id});
			}

		}]);

