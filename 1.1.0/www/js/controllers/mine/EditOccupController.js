/**
 * 修改工作经历控制器
 */
app.controller('EditOccupCtrl',
	['$scope', '$window', '$rootScope', 'MineService', '$filter', '$CommonFactory', '$state', '$stateParams',
		function ($scope, $window, $rootScope, MineService, $filter, $CommonFactory, $state, $stateParams) {
			$scope.accesstoken = $rootScope.getAccessToken();
			var userObj = $rootScope.getCurrentUser();
			$scope.work_id = $stateParams.work_id;
			$scope.work = [];
			
			//获取工作经历
			$scope.viewWork = function(){
				//获取个人信息
				var data = {
					accesstoken : $scope.accesstoken,
					user_career_id : $scope.work_id
				};
				MineService.viewCareer(data, function (response) {
					if (response.statuscode == CODE_SUCCESS && response.data.length > 0) {
						$scope.work = response.data[0];
					}
				})
			}
			$scope.viewWork();

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
			
			//保存工作经历
			$scope.saveWorkClick = function() {
				if(!$scope.work.start_date){
					$CommonFactory.showAlert("请填写入职时间!");
					return;
				}
				if(!$scope.work.end_time){
					$CommonFactory.showAlert("请填写离职时间!");
					return;
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
					start_date = $scope.work.start_date.replace(/-/g,"");
					end_time = ($scope.work.end_time).substring(0,10).replace(/-/g,"");
					if(start_date > end_time){
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
					user_career_id : $scope.work_id,
					com_name : $scope.work.com_name,
					post_name :  $scope.work.post_name,
					start_date : $scope.work.start_date,
					end_time : $scope.work.end_time,
					content : $scope.work.content
				};
				//编辑
				MineService.setCareer(data, function(response){
					//$.toast(response.message, "text");
					if (response.statuscode == CODE_SUCCESS) {
						//$CommonFactory.showAlert("修改成功！");
						$state.go("profile");
					} else {
						$CommonFactory.showAlert("修改失败，请重试!");
					}
				});
			}
			//删除工作经历
			$scope.deleteWorkClick = function() {
				$CommonFactory.showConfirm(function(){
					var data = {
						accesstoken : $scope.accesstoken,
						user_career_id : $scope.work_id,
					};
					//删除
					MineService.deleteCareer(data, function(response){
						if (response.statuscode == CODE_SUCCESS) {
							//$CommonFactory.showAlert("删除成功！");
							$state.go("profile");
						} else {
							$CommonFactory.showAlert("删除失败，请重试!");
						}
					});
				}, "您确认要删除吗");
			}
}]);