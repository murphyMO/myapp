//我关注的-公司
app.controller('MyConcernCtrl',
	['$scope', '$window', '$rootScope', '$localStorage', '$state', '$CommonFactory', 'MineConcernService', "UserService","$ionicHistory",
		function ($scope, $window, $rootScope, $localStorage, $state, $CommonFactory, MineConcernService, UserService,$ionicHistory) {
			$scope.accesstoken = $rootScope.getAccessToken();
			var accesstoken = $rootScope.getAccessToken();
			$scope.path = $localStorage.getObject(KEY_COMMON_PATH);
			var current_user = $rootScope.getCurrentUser();
			//关注个人列表
			$scope.myFollowPersonalDatas = function(){
				var data = {
					accesstoken:$scope.accesstoken,
					currentPage : '1',
					itemsPerPage : '10000'
				};

				MineConcernService.myFollowPersonalDatas(data,function(response){
					if(response.statuscode == CODE_SUCCESS){
						$scope.items = response.data.data;
						console.log(response.data.data);
						var length = $scope.items.length;
						for (var i = length - 1; i >= 0; i--) {
							$scope.items[i].is_follow = true;
						}
					} else {
						$CommonFactory.showAlert("服务器请求错误");
						return;
					}
				});
			};

			$scope.myFollowPersonalDatas();

			//关注公司列表
			$scope.myFollowDynamicDatas = function(){
				var data = {
					accesstoken:$scope.accesstoken
				};

				MineConcernService.myFollowCompanyDatas(data,function(response){
					if(response.statuscode == CODE_SUCCESS){
						$scope.coms = response.data.data;
						var length = $scope.coms.length;
						for (var i = length - 1; i >= 0; i--) {
							$scope.coms[i].is_follow = true;
						}
					} else {
						$CommonFactory.showAlert("服务器请求错误");
						return;
					}
				});
			};

			$scope.myFollowDynamicDatas();

			//联系他
			/*$scope.toChat = function(item){
				var data = {
					id : item.article_data_id,
					accesstoken : $scope.accesstoken
				};
				MineConcernService.getChatUserId(data,function(response){
					if (response.statuscode = CODE_SUCCESS){
						var data2 = {
							chat_user_id : response.data.user_id,
							user_name : response.data.user_name,
							face : response.data.user_face,
							service_id : item.article_data_id
						};
						$state.go('app.chat',{data: data2});
					} else {
						//$.toast(response.message, "forbidden");
					}
				});
			}*/

			//关注公司
			$scope.followCompany = function(item) {

				var data = {
					accesstoken : accesstoken,
					concerned_user_id : item.com_id,
					fans_user_id : current_user.id,
					type : 2
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
						item.is_follow = (res.data == 2 ? false : true);
						if(res.data == 2) {
							$CommonFactory.showAlert("取消关注成功");
							return;
						}else {
							$CommonFactory.showAlert("关注成功");
							return;
						}
					}
				});
				
			};

			//关注个人
			$scope.followPersonal = function(item) {
				var data = {
					accesstoken : accesstoken,
					concerned_user_id : item.id,
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
						item.is_follow = (res.data == 2 ? false : true);
						if(res.data == 2) {
							$CommonFactory.showAlert("取消关注成功");
							return;
						}else {
							$CommonFactory.showAlert("关注成功");
							return;
						}
					}
				});
			};

			//页面返回按钮
			$scope.back = function(){
				$ionicHistory.goBack();
			}

		}]);