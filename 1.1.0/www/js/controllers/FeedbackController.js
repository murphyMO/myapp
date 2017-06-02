/*
 * “岛里”反馈表1控制器
 */
app.controller('FeedbackCtrl',
	['$scope', '$window', '$ionicHistory', '$rootScope', "$state", '$CommonFactory', '$filter', '$stateParams', 'UserService',
	function ($scope, $window, $ionicHistory, $rootScope, $state,  $CommonFactory, $filter, $stateParams, UserService) {

		var accesstoken = $rootScope.getAccessToken();
		$scope.test = {};
		$scope.tmpArray1 = [{
			id: 1,
			name: '“商务”'
		},
		{
			id: 2,
			name: '“社区”'
		},
		{
			id: 3,
			name: '“联系”'
		},
		{
			id: 4,
			name: '“我的”'
		},
		{
			id: 5,
			name: " 都不感兴趣"
		}
		];
		
		$scope.tmpArray2 = [{
			id: 1,
			name: '“商务”'
		},
		{
			id: 2,
			name: '“社区”'
		},
		{
			id: 3,
			name: '“联系”'
		},
		{
			id: 4,
			name: '“我的”'
		},
		{
			id: 5,
			name: " 都挺好的"
		}
		];
		
		$scope.tmpArray3 = [{
			id: 1,
			name: ' 年轻活力'
		},
		{
			id: 2,
			name: ' 商务专业'
		},
		{
			id: 3,
			name: ' 科技感爆棚'
		},
		{
			id: 4,
			name: ' 武侠风满满'
		}];
		
		$scope.checked = [];
		$scope.checked2 = [];
		$scope.checked3 = [];
		$scope.checkedIdArr = [];
		$scope.checkedIdArr2 = [];
		$scope.checkedIdArr3 = [];
		
		/**
		 * 选中砍掉
		 */
		$scope.checkedClick = function(index, item) {
			//console.log(index);
			$scope.checked[index] = !$scope.checked[index];
			
			if ($scope.checked[index]) {
				//插入数组
				$scope.checked[index] = 1;
				$scope.checkedIdArr.push(index);
			} else {
				//从数组中取出
				$scope.checked[index] = 0;
				$scope.checkedIdArr.splice($scope.checkedIdArr.indexOf(index),1);
			}
		}
		/**
		 * 选中有用
		 */
		$scope.checkedClick2 = function(index, item) {
			//console.log(index);
			$scope.checked2[index] = !$scope.checked2[index];
			
			if ($scope.checked2[index]) {
				//插入数组
				$scope.checked2[index] = 1;
				$scope.checkedIdArr2.push(index);
			} else {
				//从数组中取出
				$scope.checked2[index] = 0;
				$scope.checkedIdArr2.splice($scope.checkedIdArr2.indexOf(index),1);
			}
		}
		/**
		 * 选中风格
		 */
		$scope.checkedClick3 = function(index, item) {
			//console.log(index);
			$scope.checked3[index] = !$scope.checked3[index];
			
			if ($scope.checked3[index]) {
				//插入数组
				$scope.checked3[index] = 1;
				$scope.checkedIdArr3.push(index);
			} else {
				//从数组中取出
				$scope.checked3[index] = 0;
				$scope.checkedIdArr3.splice($scope.checkedIdArr3.indexOf(index),1);
			}
		}
		
		
		
		//上传用户反馈
		$scope.uploadInfoClick = function(){			
			if (!$scope.test.feel) {
				$CommonFactory.showAlert("请填写您对“岛里”APP的总体感受");
				return;
			}
			if (!$scope.test.fluency||!$scope.test.interfacee||!$scope.test.interfacee) {
				$CommonFactory.showAlert("请您对“岛里”APP进行打分");
				return;
			}
			if (!$scope.test.optimization_suggestions) {
				$CommonFactory.showAlert("请填写您对优化“岛里”以上三个方面的建议");
				return;
			}
			if (!$scope.checkedIdArr2.join(',')) {
				$CommonFactory.showAlert("请选择使用后，您对“岛里”最感兴趣的版块是什么");
				return;
			}
			if (!$scope.checkedIdArr.join(',')) {
				$CommonFactory.showAlert("请选择您认为“岛里”最不感兴趣的板块是什么");
				return;
			}
			if (!$scope.checkedIdArr3.join(',')) {
				$CommonFactory.showAlert("请选择您认为“岛里”的风格应该是什么");
				return;
			}
			if (!$scope.test.help) {
				$CommonFactory.showAlert("请填写您最希望“岛里”为您的企业提供哪方面的帮助");
				return;
			}
			if (!$scope.test.name) {
				$CommonFactory.showAlert("请填写您的姓名");
				return;
			}
			
			if ($scope.test.name) {
					if(!(/^.{4,20}|[\u4E00-\u9FA5]{2,16}$/.test($scope.test.name))){
					$CommonFactory.showAlert("姓名格式不对！");
					return;
				}
			}
			if (!$scope.test.mobile) {
				$CommonFactory.showAlert("请填写您的电话号码");
				return;
			}
			if ($scope.test.mobile) {
				if (!(/^1[3|4|5|7|8]\d{9}$/.test($scope.test.mobile))) {
				$CommonFactory.showAlert("您的电话号码有误！");
				return;
				}
			}
			if (!$scope.test.team) {
				$CommonFactory.showAlert("请填写您的团队/企业名称");
				return;
			}
			if (!$scope.test.user_type) {
				$CommonFactory.showAlert("请选择您是否是侠客岛入驻企业员工");
				return;
			}
			var data = {
				"accesstoken" : accesstoken,
				'feel' : $scope.test.feel,//感受
				'fluency' : $scope.test.fluency,//流畅度
				'interface' : $scope.test.interfacee,//界面
				'perfect_degree' : $scope.test.perfect_degree,//完善
				'userful_section' : $scope.checkedIdArr2.join(','),//有用
				'remove_section' : $scope.checkedIdArr.join(','),//没用
				'optimization_suggestions' : $scope.test.optimization_suggestions,//建议
				'mobile' : $scope.test.mobile,//手机号
				'name' : $scope.test.name,//姓名
				'user_type' : $scope.test.user_type,//是否入驻企业员工
				'com_name' : $scope.test.team,//团队/企业名称
				'style' : $scope.checkedIdArr3.join(','),//风格
				'offer_help' : $scope.test.help//提供帮助
			};
			UserService.uploadInfo(data, function (response) {
				if (response.statuscode == CODE_SUCCESS) {
					$CommonFactory.showAlert("提交成功");
					$scope.back();
				}
			});
		}
		//返回
		$scope.back=function(){
			$state.go("tab.business");
		}
		
	}]);
