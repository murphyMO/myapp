/**
 * 入驻通知
 */
app.controller('EntryBookCtrl',
	['$scope', '$window','$ionicHistory',
		function ($scope, $window,$ionicHistory) {

			$scope.back = function(){
				$ionicHistory.goBack();
			}
	}]);
