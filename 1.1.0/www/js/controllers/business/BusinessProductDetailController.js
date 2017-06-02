/**
 * 服务产品详情控制器---详情
 */
app.controller('BusinessProductDetailCtrl',
	['$scope', '$rootScope', '$stateParams', 'MaterialService', '$CommonFactory', 'CommunityService',
	function ($scope, $rootScope, $stateParams, MaterialService, $CommonFactory, CommunityService) {
		$scope.accesstoken = $rootScope.getAccessToken();
		/*获取当前服务id*/
		$scope.com_article_material_id = $stateParams.com_article_material_id;
//		//路径对象
//		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
//		//企业logo
//		$scope.companyPath = $scope.commonPath.route_path + $scope.commonPath.com_logo_path;
//		//服务缩略图地址
//		$scope.serviceThumbPath = $scope.commonPath.route_path + $scope.commonPath.service_thumb_path;
		$scope.com_service_id = $stateParams.com_service_id;
		
		//点赞
		$scope.isLike = 0;
		
		$scope.hasMaterial = true;
		if (!$scope.com_article_material_id) {
			$scope.hasMaterial = false;
			return;
		}
		
		$scope.material = {};
			
		$scope.materialOnes = function(){
			var data = {
				"id" : $scope.com_article_material_id,
				"accesstoken" : $scope.accesstoken
			};
			MaterialService.materialOnes(data, function(response){
				$scope.material = response.data;
//				$("#material_content").html($scope.material.material_content);
			});
		};

		$scope.materialOnes();
		
		
		//点赞
		$scope.hiLickClick = function() {
			if ($scope.isLike == 1) {
				$scope.isLike = 0;
			} else {
				$scope.isLike = 1;
			}
			
			var data = {
				accesstoken: $scope.accesstoken,
				type_id: 4,
				target_id: $scope.com_service_id,
				status: $scope.isLike
			};
			CommunityService.likeYou(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
				}
			});
		}
		
		//回复
		$scope.hiMessageClick = function() {
			$scope.msg = {};
//			if (!$scope.msg.message) {
//				$CommonFactory.showAlert("请输入内容");
//			};
			$CommonFactory.showCustomPopup(function(){
				var data = {
					accesstoken: $scope.accesstoken,
					type_id: 4,
					target_id: $scope.com_service_id,
					message_content: $scope.msg.message
				};
				CommunityService.replay(data, function(response){
					if (response.statuscode == CODE_SUCCESS) {
					}
				});
			}, $scope, '<input type="text" class="b-a" ng-model="msg.message">', '回复');
		}
	}
]);