/**
 * 发布类型列表控制器
 */
app.controller('PostProductAreaCtrl',
	['$rootScope', '$scope', '$ionicHistory','$state', 'CommunityService', 'TransferPostDataService', 
	function ($rootScope, $scope, $ionicHistory, $state, CommunityService, TransferPostDataService) {
		$scope.myGoBack = function() {
			$ionicHistory.goBack();
		};

		//$scope.businessLabelList = [];
		var accesstoken = $rootScope.getAccessToken();

		$scope.getProductArea = function () {
			// var areas = [{
			// 	"text":"全国",
			// 	"id":1,
			// 	"path":"1",
			// 	"children": [
			// 	{
			// 		"id":2,
			// 		"path":"1-2",
			// 		"text":"四川省",
			// 		"children":[{
			// 			"id": 3,
			// 			"text":"成都市",
			// 			"path" : "1-2-3",
			// 			"children" : [
			// 				{"id":4, "path":"1-2-3-4", "text":"航天岛"},
			// 				{"id":5, "path":"1-2-3-5", "text":"磨子桥"},
			// 				{"id":6, "path":"1-2-3-6", "text":"菁蓉岛"},
			// 				{"id":7, "path":"1-2-3-7", "text":"节能岛"}
			// 			]
			// 		}]
			// 	},{
			// 		"id":8,
			// 		"path":"1-8",
			// 		"text":"上海市",
			// 		"children":[{"id":9, "path":"1-8-9", "text":"虹桥岛"}]
			// 	},{
			// 		"id":10,
			// 		"path":"1-10",
			// 		"text":"重庆市",
			// 		"children":[{"id":11, "path":"1-10-11", "text":"金山岛"}]
			// 	}]
			// }];
			CommunityService.getServiceArea(function(res){
				//$scope.areas = res.data;
				$scope.areas = handleArray(res.data);
				console.log($scope.areas);
			});

			function handleArray (item) {
				angular.forEach(item, function(subItem, index){
					if(subItem.children && subItem.children.length > 0){
						subItem.children = [{"label":"不限"}].concat(subItem.children);
						handleArray(subItem.children);
					}
				});
				return item;
			}
		};
		$scope.getProductArea();
		
		

		$scope.confirmSelectArea = function(thisItem) {
			var article = TransferPostDataService.getArticle();
			if(!article){
				article = {};
			}
			article.productArea = {};
			var selectedArea = "";
			if(thisItem.children){
				$scope.areas = thisItem.children;
				$scope.parent = thisItem;
			}else {
				if(thisItem.label == "不限"){
					selectedArea = $scope.parent;
				}else{
					selectedArea = thisItem;
				}
				console.log(selectedArea);
				article.productArea = selectedArea;
				$state.go('postservice');
			}
			
		}


		
}]);