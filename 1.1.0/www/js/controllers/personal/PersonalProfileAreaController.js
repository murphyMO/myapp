app.controller('PersonalAreaCtrl',['$scope', '$window', '$rootScope', 'PersonalAreaService', 
		function ($scope, $window, $rootScope, PersonalAreaService) {
		var accesstoken = $rootScope.getAccessToken();

		$scope.getArea = function(){
			var data = {
				"accesstoken" : accesstoken
			};
			PersonalAreaService.getPersonalArea(data,function(response){
				$scope.areas = response.data;
			});
		}
		$scope.getArea();
	}]);