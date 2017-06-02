/**
 * 我的话题
 * 2016/10/12
 */
app.controller('MyReleaseCtrl', ['$scope','$window','$state','$stateParams','$localStorage', '$resource', 'MineTopicService','$CommonFactory','$rootScope',
	function ($scope,$window,$state,$stateParams,$localStorage,$resource, MineTopicService,$CommonFactory,$rootScope) {
		//初始数据为空
		$scope.item = [];
		//获取数据传递的参数
		var accesstoken = $rootScope.getAccessToken();
		$scope.topic_id = $stateParams.topic_id;
		//获取数据
		$scope.getTopicDetail = function(){
			var data={
				"accesstoken": "3fb7b4bb59ba92cb4e734c89999ee62a",
				"topic_id": $scope.topic_id,
				"type": 2
			};
			MineTopicService.getTopicDetail(data,function(response){
				if (response.statuscode == 1) {
					$scope.item = response.data;
					switch($scope.item.status) {
						case "1":
							$scope.statustext = "已同意";
							break;
						case "2":
							$scope.statustext = "未同意";
							break;
						case "3":
							$scope.statustext = "待审核";
							break;							
					}
					 
				}
			})
		};
		// 加载数据
		$scope.getTopicDetail();
		//下拉刷新数据
		$scope.doTopicDetailRefresh = function(){
			$scope.getTopicDetail;
			$scope.$broadcast('scroll.refreshComplete');
		};
		//页面返回按钮
		$scope.prevpage_slide = $stateParams.prevpage_slide;
		$scope.back = function(){
			$state.go('minetopic',{current_slide:$scope.prevpage_slide});
		}
	}
]);
