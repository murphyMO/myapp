app.controller('MemberLevelCtrl',
    ['$scope', '$window', '$rootScope','HomeService',
        function ($scope, $window, $rootScope, HomeService) {
    	$scope.pageClass = 'slideLeft';
    	$rootScope.appTitle = '会员等级';

		$scope.tab = 1;
        }]);