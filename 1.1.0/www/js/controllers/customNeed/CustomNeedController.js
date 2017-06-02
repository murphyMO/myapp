/**
 * 客户定制需求
 */
app.controller('CustomNeedController',
	['$scope', '$rootScope', "$state", '$window', '$timeout', 'CustomNeedService', '$CommonFactory', '$stateParams', '$filter', '$localStorage',
	function ($scope, $rootScope, $state, $window, $timeout, CustomNeedService, $CommonFactory, $stateParams, $filter, $localStorag) {
		var accesstoken = $rootScope.getAccessToken();


		//获取兴趣
		$scope.getInterst = function(){
			CustomNeedService.getUserInterst({accesstoken:accesstoken},function(response){
				$scope.hobbies = response.data;
			})
		}
		$scope.getInterst();

		//跳转返回
		$scope.topBack = function(){
			window.history.back();
		}

	//保存基础信息
	$scope.create = function(){
		if(!$scope.comObj.com_name){
			$CommonFactory.showAlert("请填写公司名称!");
			return;
		}
		if(!$scope.comObj.com_phone){
			$CommonFactory.showAlert("请填写客户姓名!");
			return;
		}
		if(!$scope.comObj.com_phone){
			$CommonFactory.showAlert("请填写联系方式!");
			return;
		}
		if(!$scope.comObj.com_address){
			$CommonFactory.showAlert("请填写企业邮箱!");
			return;
		}
		if(!$scope.comObj.com_scale){
			$CommonFactory.showAlert("请填写场地容纳人数!");
			return;
		}
		if(!$scope.comObj.com_scale){
			$CommonFactory.showAlert("请填写面积需求!");
			return;
		}
		if(!$scope.comObj.com_scale){
			$CommonFactory.showAlert("请填写位置筛选!");
			return;
		}

		if($scope.comObj.com_phone){
			if($scope.comObj.com_phone.length!=11){
				$CommonFactory.showAlert("联系方式格式不对!");
				return;
			}
		}
		if ($scope.person.weixin_name) {
				var emailReg = /^\w+((-\w+)|(\.\w+))*\@("@")[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/ ;
				if (!emailReg.test($scope.person.weixin_name)) {
				$CommonFactory.showAlert("邮箱格式不正确！");
				return;
				}
			}

		var data = {
			'accesstoken' : accesstoken,
			'com_name' : $scope.comObj.com_name,
			'com_phone':$scope.comObj.com_phone,
			'com_address' : $scope.comObj.com_address,
			'com_email' : $scope.comObj.com_email,
			'com_number' : $scope.comObj.number,
			'mianji':$scope.comObj.mianji,
			'weizhi':$scope.comObj.weizhi,

		};
		CompanyService.companyUpdateMine(data,function(response){
			if(response.statuscode==1){
				$CommonFactory.showAlert("提交成功！");
				$state.go('tab.mine',{thisItem:1});
			}
		})
	}


}]);
