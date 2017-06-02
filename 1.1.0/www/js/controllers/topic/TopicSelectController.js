/**
 * 社区-话题发布-选择话题控制器
 */
app.controller('TopicSelectController',
	['$scope', '$rootScope', '$state', '$localStorage', '$CommonFactory', '$timeout',  '$cordovaToast', 'TopicService',
	function ($scope, $rootScope, $state, $localStorage, $CommonFactory, $timeout, $cordovaToast, TopicService) {
		//用户凭证
		$scope.accesstoken = $rootScope.getAccessToken();
	}
]);
