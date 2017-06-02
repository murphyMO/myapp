/**
 * 聊天控制器
 */
app.controller('CardTestCtrl', 
	['$scope', '$window','$timeout','$rootScope','$state',
		function ($scope, $window,$timeout, $rootScope,$state ) {
			$scope.personinfo = {};
			$scope.personinfo.name = "咸鱼";
			$scope.personinfo.com_name = "侠客岛联合办公室";
			$scope.personinfo.photo = "img/zheng.jpg";
			$scope.personinfo.id = "200";


			$scope.companyinfo = {};
			$scope.companyinfo.id = "133";
			$scope.companyinfo.logo = "img/logo2.png";
			$scope.companyinfo.com_name = "侠客岛联合办公室";
			$scope.companyinfo.summary = "侠客岛联合办公室侠客岛联合办公室侠客岛联合办公室侠客岛联合办公室侠客岛联合办公室";
			$scope.companyinfo.address = "高新区萃华路83号3楼";

			$scope.productinfo = {};
			$scope.productinfo.id = '123';
			$scope.productinfo.thumb = 'img/test/0.jpg';
			$scope.productinfo.title = '我的产品标题';
			$scope.productinfo.content = '我的产品内容';
			$scope.productinfo.com_name = '侠客岛联合办公室';

}]);