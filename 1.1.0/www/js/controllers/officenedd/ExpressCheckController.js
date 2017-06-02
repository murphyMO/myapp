/**
 * 保洁申请
 */
app.controller('ExpressCkeckCtrl',
	['$scope', '$window', '$rootScope','$ionicModal','$CommonFactory','ExpressService',
		function ($scope, $window, $rootScope,$ionicModal,$CommonFactory,ExpressService) {
			$scope.user = $rootScope.getCurrentUser();

		$scope.checkExpress = function(){
			var data = {
				'LogisticCode':$scope.expressid
			}
			ExpressService.checkLogistic(data,function(response){
				console.log(response);
			})
		}


	}]);
