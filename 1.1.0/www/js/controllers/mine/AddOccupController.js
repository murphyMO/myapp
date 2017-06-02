/**
 * 添加工作经历控制器
 */
app.controller('AddOccupCtrl',
	['$scope', '$window', '$rootScope', 'MineService', '$CommonFactory', '$filter', '$state',
		function ($scope, $window, $rootScope, MineService, $CommonFactory, $filter, $state) {
			$scope.accesstoken = $rootScope.getAccessToken();
			var userObj = $rootScope.getCurrentUser();
			$scope.work={};
			 $scope.isWork = {};
			$scope.isWork.isWorkBox = false;
			//保存工作经历
			$scope.saveWorkClick = function() {
				if(!$scope.work.start_date){
					$CommonFactory.showAlert("请填写入职时间!");
					return;
				}
				if($scope.isWork.isWorkBox == true){
					if(!$scope.work.end_time){
					$CommonFactory.showAlert("请填写离职时间!");
					return;
				}
				}
				if (!$scope.work.com_name) {
					$CommonFactory.showAlert("请填写公司名称!");
					return;
				}
				if (!$scope.work.post_name) {
					$CommonFactory.showAlert("请填写职位!");
					return;
				}
				if (!$scope.work.content) {
					$CommonFactory.showAlert("请填写工作内容!");
					return;
				}
				if($scope.work.start_date && $scope.work.end_time){
					start_date = $scope.work.start_date.replace(/-/g,'/');
					end_time = ($scope.work.end_time).substring(0,10).replace(/-/g,'/');
					if(start_date>end_time){
						$CommonFactory.showAlert("离职时间不能早于入职时间");
						return;
					}
				}
				if($scope.work.start_date && $scope.work.end_time){
					start_date = $scope.work.start_date.replace(/-/g,"");
					end_time = ($scope.work.end_time).substring(0,10).replace(/-/g,"");
					if(start_date == end_time){
						$CommonFactory.showAlert("离职时间不能等于入职时间");
						return;
					}
				}
				if ($scope.work.start_date) {
					start_date = $scope.work.start_date.replace(/-/g,"");
					var nowDate = ($filter('date')(new Date(),'yyyy-MM-dd')).replace(/-/g,"");
					if(start_date > nowDate){
						$CommonFactory.showAlert("入职日期超过今天,请重新选择!");
						return;
					}
				}
				if ($scope.work.end_time) {
					end_time = ($scope.work.end_time).substring(0,10).replace(/-/g,"");
					var nowDate = ($filter('date')(new Date(),'yyyy-MM-dd')).replace(/-/g,"");
					if(end_time > nowDate){
						$CommonFactory.showAlert("离职日期超过今天,请重新选择!");
						return;
					}
				}
				var data = {
					accesstoken : $scope.accesstoken,
					user_id : userObj.id,
					user_career_id : $scope.work.user_career_id,
					com_name : $scope.work.com_name,
					industry : $scope.work.industry,
					post_name :  $scope.work.post_name,
					start_date : $scope.work.start_date,
					end_time : $scope.work.end_time,
					content : $scope.work.content
				};

					// 新增
					MineService.createCareer(data, function(response){

						if (response.statuscode == CODE_SUCCESS) {
							//$CommonFactory.showAlert("添加成功！");
							$state.go("profile");
						} else {
							$CommonFactory.showAlert("添加失败，请重试!");
						}
						$scope.message = response.message;
					});

			}
			//是否离职
			$scope.isWorkfun =function(){
				$scope.isWork.isWorkBox = !$scope.isWork.isWorkBox;
			}
			//页面返回按钮
			$scope.back = function(){
				$state.go('profile');
			}
			//日期插件调用
			$scope.showDate = function(){
				$CommonFactory.showDatePicker(function(date){
					$scope.work.start_date = date;
					//console.log(date)
				});
			}
			 $scope.showDate1 = function(){
				$CommonFactory.showDatePicker(function(date){
					$scope.work.end_time = date;
					//console.log(date)
				});
			}
		}]);