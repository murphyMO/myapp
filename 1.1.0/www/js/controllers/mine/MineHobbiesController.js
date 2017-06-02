/**
 * 我的兴趣爱好控制器
 */
app.controller('MineHobbiesController',
	['$scope', '$rootScope', '$stateParams', '$CommonFactory','UserService',
	function($scope, $rootScope, $stateParams, $CommonFactory, UserService) {
	var accesstoken = $rootScope.getAccessToken();
	$scope.user = $rootScope.getCurrentUser();
	//var csrfToken = $rootScope.getCsrfToken();
	$scope.addHob = {};
	//取个人信息
	$scope.MineData = function(){
		UserService.userMine({accesstoken:accesstoken},function(response){
			$scope.mine = response.data.userInfo;
		})
	}
	$scope.MineData();

	//获取兴趣
	$scope.getInterst = function(){
		UserService.getUserInterst({accesstoken:accesstoken},function(response){
			$scope.hobbies = response.data;
		})
	}
	$scope.getInterst();
	//更新兴趣爱好标签
	$scope.updateHobbies = function(){

	}
	//删除兴趣爱好
	$scope.deletehobbies = function(id,$index){
		var data = {
			accesstoken:accesstoken,
			interest_id:id
		}
		UserService.deleteOneInterest(data,function(response){
			if(response.statuscode == 1){
				$scope.hobbies.splice($index,1);
			}
		})
	}
	var i = 1;
	//添加一条兴趣爱好
	$scope.addhobbies = function(str){
		var data = {
			accesstoken:accesstoken,
			interest_name:str
		}
		$scope.hobbiesFlag=false;
		for(i=0;i<$scope.hobbies.length;i++){
			if($scope.hobbies[i].interest_name==str){
				$scope.hobbiesFlag=true;
			}
		}
		if($scope.hobbiesFlag){
			return;
		}
		UserService.createInterest(data,function(response){
			if(response.statuscode == 1){
				//$CommonFactory.showAlert("操作成功");
				$scope.hobbies.push({interest_id:response.data.insert_id,interest_name:str});
			}
		})
	}
	//添加其他兴趣爱好
	$scope.addOtherhobbies = function(){
		console.log("hhdjajds");
		var data = {
			accesstoken:accesstoken,
			interest_name:$scope.addHob.name
		}

		UserService.createInterest(data,function(response){

			if(response.statuscode == 1){
				//$CommonFactory.showAlert("操作成功");
				$scope.hobbies.push({interest_id:response.data.insert_id,interest_name:$scope.addHob.name});
				$scope.addHob.name = '';
			}
		})
	}

}]);
