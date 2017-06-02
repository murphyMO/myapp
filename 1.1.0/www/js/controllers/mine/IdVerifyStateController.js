/*
 * 身份验证状态的控制器
 */

app.controller('IdVerifyStateCtrl',
	['$scope','$stateParams','$state', '$localStorage','$rootScope', '$CommonFactory', 'UserService',
	function ($scope,$stateParams,$state, $localStorage, $rootScope,$CommonFactory, UserService) {

		var commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		var user = $rootScope.getCurrentUser();
		var accesstoken = $localStorage.get("accesstoken");
		var picPath = commonPath.route_path +'/';
		var imgPath = commonPath.route_path;
		$scope.img = [];
		$scope.stateText = '';


		//获取数据库数据初始化界面
		$scope.getImgs = function() {
			//重新获取数据的时候需要设置$scope.img的变量
			var data = {
				accesstoken : accesstoken
			};
			$CommonFactory.showLoading();
			UserService.getUserImg(data, function(res) {
				$CommonFactory.hideLoading();
				if (res.statuscode == CODE_SUCCESS) {
					$scope.img = [];
					var data = res.data;
					if (data.image && data.image.length > 0) {
						for(var i = 0; i < data.image.length; i++){
							if (data.image[i].img_type != 1 && data.image[i].img_type != 2) {
								$scope.img.push({src : picPath + data.image[i].img_url});
							}
						}
					}
				}
			});
		};

		$scope.getImgs();
		// 更换照片
		$scope.updatePhoto = function(){
			$state.go("idverify")
		}
		// 获取照片审核状态
		$scope.getUserImgState = function(){
			var data = {
				accesstoken : accesstoken
			}
			UserService.getUserImgState(data,function(res){
				if (res.statuscode == CODE_SUCCESS) {
					$scope.state = res.data;
					switch(res.data){
						case 0:
							$scope.stateText = '小师妹正在紧张审核中，请耐心等待。';
							break;
						case 1:
							$scope.stateText = '您的身份验证已通过。';
							break;
						case 2:
							$scope.stateText = '您的信息存在问题，需要更换照片重新提交审核哦。';
							break;
						case 3:
							$scope.stateText = '您的信息已失效，请重新上传照片。';
							break;
					}
				}
			})
		}
		$scope.getUserImgState();




	}]);