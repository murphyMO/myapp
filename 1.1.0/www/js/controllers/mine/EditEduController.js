/**
 * 修改教育经历控制器
 */
app.controller('EditEduCtrl',
	['$scope', '$window', '$rootScope', 'MineService', '$filter', '$CommonFactory', '$state', '$stateParams',
		function ($scope, $window, $rootScope, MineService, $filter, $CommonFactory, $state, $stateParams) {
			$scope.accesstoken = $rootScope.getAccessToken();
			var userObj = $rootScope.getCurrentUser();
			$scope.edu_id = $stateParams.edu_id;
			$scope.education = [];
	
			//获取教育经历
			$scope.viewEdu = function(){
				//获取个人信息
				var data = {
					accesstoken : $scope.accesstoken,
					user_education_experience_id : $scope.edu_id
				};
				MineService.viewEducation(data, function (response) {
					if (response.statuscode == CODE_SUCCESS && response.data.length > 0) {
						$scope.education = response.data[0];
					}
				})
			}
			$scope.viewEdu();

			//保存教育经历
			$scope.saveEducationClick = function() {
				if (!$scope.education.start_date) {
					$CommonFactory.showAlert("请填写入学日期!");
					return;
				}
				if (!$scope.education.end_date) {
					$CommonFactory.showAlert("请填写毕业日期!");
					return;
				}
//				if (!$scope.education.school) {
//					$CommonFactory.showAlert("请填写学校!");
//					return;
//				}
				if (!$scope.education.Specialty) {
					$CommonFactory.showAlert("请填写专业!");
					return;
				}
				if (!$scope.education.type) {
					$CommonFactory.showAlert("请填写学位!");
					return;
				}
				
				if ($scope.education.end_date) {
					end_date = $scope.education.end_date.replace(/-/g,"");
					var nowDate = ($filter('date')(new Date(),'yyyy-MM-dd')).replace(/-/g,"");
					if(end_date > nowDate){
						$CommonFactory.showAlert("毕业日期超过今天,请重新选择!");
						return;
					}
				}
				if ($scope.education.start_date) {
					start_date = $scope.education.start_date.replace(/-/g,"");
					var endDate = ($filter('date')($scope.education.end_date,'yyyy-MM-dd')).replace(/-/g,"");
					if(start_date > endDate){
						$CommonFactory.showAlert("入学日期超过毕业日期,请重新选择!");
						return;
					}
				}
				
				var data = {
					accesstoken : $scope.accesstoken,
					//user_career_id : $scope.user_career_id,
					user_id : userObj.id,
					user_education_experience_id : $scope.edu_id,
					school : $scope.education.school,
					Specialty : $scope.education.Specialty,
					start_date :  $scope.education.start_date,
					end_date : $scope.education.end_date,
					type : $scope.education.type
				};
				
				//编辑
				MineService.setEducationExperience(data, function(response){
					if (response.statuscode == CODE_SUCCESS) {
						//$CommonFactory.showAlert("修改成功!");
						$state.go("profile");
					}
				});
			}
			
			//删除教育经历
			$scope.deleteEducationClick = function() {
				$CommonFactory.showConfirm(function(){
					var data = {
						accesstoken : $scope.accesstoken,
						user_education_experience_id : $scope.edu_id,
					};
					
					//删除
					MineService.deleteEducationExperience(data, function(response){
						if (response.statuscode == CODE_SUCCESS) {
							//$CommonFactory.showAlert("删除成功!");
							$state.go("profile");
						} else {
							$CommonFactory.showAlert("删除失败，请重试!");
						}
					});
				}, "您确认要删除吗");
			}
			
			//页面返回按钮
			$scope.back = function(){
				$state.go('profile');
			}
			
			$scope.startDate = function(){
				$CommonFactory.showDatePicker(function(date){
					$scope.education.start_date = date;
					
				});
			}
			
			$scope.showDate = function(){
				$CommonFactory.showDatePicker(function(date){
					$scope.education.end_date = date;
					//console.log(date)
				});
			}
			
		}]);