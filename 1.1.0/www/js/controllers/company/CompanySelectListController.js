/**
 * 企业选择列表控制器
 */
app.controller('CompanySelectListCtrl',
	['$scope', '$rootScope', '$state','$location','CommonService','$CommonFactory', 'CompanyService', '$ionicHistory','UserService', '$stateParams', '$localStorage',
	function($scope, $rootScope, $state,$location,CommonService,$CommonFactory, CompanyService, $ionicHistory, UserService, $stateParams, $localStorage) {
		//企业logo地址
		//$scope.com_log_path = $rootScope.getCommonPath().com_log_path;
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.dataItems = [];
		$scope.formto = $stateParams.formto;
		$scope.user = [];
		//$scope.company=[];
		$scope.comObj = {};
		
		//路径对象
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		$scope.companyPath = $scope.commonPath.route_path + "/" + $scope.commonPath.com_logo_path;
		
		//不是登陆页面跳过来的连接都要显示返回
		if ($scope.formto != 1) {
			$rootScope.appHeaderLeftShow = true;
		}

		//获取企业列表
		$scope.getCompanyList = function () {
			var data = {
				'accesstoken': $scope.accesstoken
			};
			CommonService.companyMine(data, function (response) {
				if (response.statuscode == CODE_SUCCESS) {
					$scope.dataItems = response.data;
				}
			});
		};
		$scope.getCompanyList();
		
		$scope.back = function(){
			$state.go("tab.mine",{thisItem:1});
		}
		
		//跳转连接
		$scope.selectCompanyListCick = function(item) {
			
			//根据选择的公司查询新的token
			var data = {
				'accesstoken': $scope.accesstoken,
				'comid': item.com_id
			};
			CommonService.getTokenByUserTokenAndComId(data, function (response) {
				if (response.statuscode == CODE_SUCCESS) {
					$rootScope.setAccessToken(response.accesstoken);
					
					//更新企业信息
					var userObj = $rootScope.getCurrentUser();
					userObj.com_id = item.com_id;
					userObj.com_name = item.com_name;
					userObj.com_logo_path = item.com_logo_path;
					$rootScope.setCurrentUser(userObj);
					$state.go('tab.mine',{thisItem:1});
					//$state.go("comsetting");
				}
			});
		}

		$scope.join = function() {
			$CommonFactory.showCustomPopup(function(){
				if (!$scope.comObj.invite_code) {
					//$cordovaToast.show("请输入公司邀请码","short","center");
					$CommonFactory.showAlert("请输入公司邀请码");
					return;
				}
				var data = {
					"accesstoken" : $scope.accesstoken,
					"invite_code" : $scope.comObj.invite_code
				};

				$CommonFactory.showLoading();
				CompanyService.joinCom(data, function(res){
					$CommonFactory.hideLoading();
					if (res.statuscode == CODE_SUCCESS) {
						$CommonFactory.showAlert("加入成功");
						$scope.getCompanyList();
						$scope.comObj.invite_code='';
					}else{
						$CommonFactory.showAlert("加入无效，邀请码错误或您已在此公司");
						$scope.getCompanyList();
						$scope.comObj.invite_code='';
					}
				});
			},$scope, '<textarea class="b-a" rows="3" ng-model="comObj.invite_code"></textarea>', '请输入公司邀请码');
		}
		
}]);