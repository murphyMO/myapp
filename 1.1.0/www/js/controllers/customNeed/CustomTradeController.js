/**
 * 客户定制需求
 */
app.controller('CustomTradeCtrl',
	['$scope', '$rootScope', '$stateParams', '$CommonFactory','CustomNeedService',
	function($scope, $rootScope, $stateParams, $CommonFactory, CustomNeedService) {
	var accesstoken = $rootScope.getAccessToken();
	//var csrfToken = $rootScope.getCsrfToken();
	$scope.addHob = {};
	//取个人信息
	$scope.MineData = function(){
		CustomNeedService.userMine({accesstoken:accesstoken},function(response){
			$scope.mine = response.data.userInfo;
		})
	}
	$scope.MineData();

	//获取行业
	$scope.getInterst = function(){
		CustomNeedService.getUserInterst({accesstoken:accesstoken},function(response){
			$scope.hobbies = response.data;
		})
	}
	$scope.getInterst();
	//更新行业标签
	$scope.updateHobbies = function(){

	}
	//删除行业标签
	$scope.deletehobbies = function(id,$index){
		var data = {
			accesstoken:accesstoken,
			interest_id:id
		}
		CustomNeedService.deleteOneInterest(data,function(response){
			if(response.statuscode == 1){
				$scope.hobbies.splice($index,1);
			}
		})
	}
	var i = 1;
	//添加一条行业标签
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
		CustomNeedService.createInterest(data,function(response){
			if(response.statuscode == 1){
				$CommonFactory.showAlert("操作成功");
				$scope.hobbies.push({interest_id:response.data.insert_id,interest_name:str});
			}
		})
	}
	//添加其他行业
	$scope.addOtherhobbies = function(){
		console.log("hhdjajds");
		var data = {
			accesstoken:accesstoken,
			interest_name:$scope.addHob.name
		}
		CustomNeedService.createInterest(data,function(response){

			if(response.statuscode == 1){
				$CommonFactory.showAlert("操作成功");
				$scope.hobbies.push({interest_id:response.data.insert_id,interest_name:$scope.addHob.name});
				$scope.addHob.name = '';
			}
		})
	}

	//跳转返回
		$scope.myBack = function(){
			window.history.back();
		}

}]);
