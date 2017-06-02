/**
 * 添加教育经验经历控制器
 */
app.controller('AddEduCtrl',
	['$scope', '$window', '$rootScope', 'MineService', '$filter', '$CommonFactory', '$state',
		function ($scope, $window, $rootScope, MineService, $filter, $CommonFactory, $state) {
			$scope.accesstoken = $rootScope.getAccessToken();
			var userObj = $rootScope.getCurrentUser();
			$scope.education = {};
			
			//保存教育经历
			$scope.saveEducationClick = function() {
				if (!$scope.education.end_date) {
					$CommonFactory.showAlert("请填写毕业日期!");
					return;
				}
				if (!$scope.education.school) {
					$CommonFactory.showAlert("请填写学校!");
					return;
				}
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
					user_id : userObj.id,
					user_education_experience_id : $scope.education.user_education_experience_id,
					school : $scope.education.school,
					Specialty : $scope.education.Specialty,
					start_date :  $scope.education.start_date,
					end_date : $scope.education.end_date,
					//type : $("#education_type").val()
					type : $scope.education.type
				};
				
				if ($scope.education.user_education_experience_id) {
					//编辑
					MineService.setEducationExperience(data, function(response){
						if (response.statuscode == CODE_SUCCESS) {
							
						}
						$scope.message = response.message;
					});
				} else {
					// 新增
					MineService.createEducationExperience(data, function(response){
						if (response.statuscode == CODE_SUCCESS) {
							//$CommonFactory.showAlert("教育经历添加成功!");
							$state.go("profile");
						} else {
							$CommonFactory.showAlert("添加失败，请重试 !");
						}
						$scope.message = response.message;

					});
				}

			}

			//页面返回按钮
			$scope.back = function(){
				$state.go('profile');
			}
			//日期插件调用
			$scope.startDate = function(){
				$CommonFactory.showDatePicker(function(date){
					$scope.education.start_date = date;
					
				});
			}
			$scope.showDate = function(){
				$CommonFactory.showDatePicker(function(date){
					$scope.education.end_date = date;
				});
			}
		}]);