/**
 * 单个需求控制器
 */
app.controller('DemandItemCtrl',
	['$scope', 'CommunityService','$rootScope','$state','$localStorage','$CommonFactory','$cordovaToast','chatFactory',
	function ($scope, CommunityService,$rootScope,$state,$localStorage,$CommonFactory,$cordovaToast,chatFactory) {
		$scope.replay_show = false;
		$scope.re = {};
		$scope.demandList = [];//需求列表
		$scope.demandImgItems = [];
		var accesstoken = $localStorage.get("accesstoken");

		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);


		// 获取单条需求
		$scope.getDemandItem = function(){
			var data = {
				"accesstoken" : accesstoken,
				"com_needs_id" : $state.params.id
			}
			CommunityService.getOneDemand(data,function(response){
				console.log(response)
				if(response.statuscode == CODE_SUCCESS){
					for (var i = 0, len = response.data.length; i < len; i++) {
						response.data[i].demandImgItems = [];
						for(var j = 0; j<response.data[i].com_needs_thumb.length; j++){
              response.data[i].demandImgItems.push({"src": $scope.commonPath.route_path + $scope.commonPath.needs_path + response.data[i].com_needs_thumb[j]});
              response.data[i].com_needs_thumb[j] = $scope.commonPath.route_path + $scope.commonPath.needs_path + response.data[i].com_needs_thumb[j];
            }
						$scope.demandList.push(response.data[i]);
					}
				}
			})
		}
		$scope.getDemandItem()

		//需求下拉刷新
		$scope.demandDoRefresh = function(){
			$scope.demandList = [];
			$scope.getDemandItem();
			$scope.$broadcast('scroll.refreshComplete');
		}

		// 返回按钮
		$scope.myGoBack = function(){
			if ($state.params.from) {
				$state.go($state.params.from)
			}
			else{
				$ionicHistory.goBack(-1);
			}
		}

		//点赞功能
		$scope.likeYou = function(type,ser,isLike){
//			if ($rootScope.getCurrentUser().opt_permission == 0) {
//				$CommonFactory.showAlert(noMoneyMessage);
//				return;
//			}
			//console.log(ser)
			var data = {
				"accesstoken" : accesstoken,
				"type_id":2,
				"target_id" : ser.com_needs_id,
				"com_needs_id" : ser.com_needs_id
			}
			if(isLike == 1){
				data.status = 0;
			}
			else if(isLike == 0){
				data.status = 1;
				//发送即时消息
				var temp = {};
				temp.name = ser.article_data_user_name || ser.cre_user_name;
				chatFactory.sendCustomMsg(ser.article_data_user_id || ser.cre_user_id,"dianzan",temp);
			}
			CommunityService.likeYou(data,function(res){
				if(res.statuscode == 1){
					CommunityService.getOneDemand(data,function(r){
						if(r.statuscode == 1){
							ser.service_like_info = r.data[0].service_like_info;
							ser.is_like = r.data[0].is_like;
						}
					})
				}
			})
		}



		//回复
		$scope.replayShow = function(type,ser,index,_type){
//			if ($rootScope.getCurrentUser().opt_permission == 0) {
//				$CommonFactory.showAlert(noMoneyMessage);
//				return;
//			}
			$scope.index = index;
			$scope._type = _type;
			$scope.type=type;
			$scope.appNav = !$scope.appNav;
			$scope.replay_show = !$scope.replay_show;
			$scope.serIttem = ser;
		}
		$scope.sendReplay = function(){
			$scope.replay_show = !$scope.replay_show;
			$scope.appNav = true;

			if($scope.type == 1){
				//一级回复
				$scope.parentId = "";
				var temp = {};
				temp.name = $scope.serIttem.article_data_user_name || $scope.serIttem.cre_user_name;
				chatFactory.sendCustomMsg($scope.serIttem.cre_user_id || $scope.serIttem.article_data_user_id,"liuyan",temp);
			}
			else if($scope.type == 2){
				//二级回复
				$scope.parentId=$scope.serIttem.service_message_info[$scope.index].message_id;
				var temp = {};
				temp.name = $scope.serIttem.service_message_info[$scope.index].message_user_name;
				chatFactory.sendCustomMsg($scope.serIttem.service_message_info[$scope.index].message_user_id,"liuyan",temp);
			}
			var data = {
				"accesstoken" : accesstoken,
				"target_id" : $scope.serIttem.com_needs_id,
				"type_id" : $scope._type,
				"message_content" : $scope.re.message_content,
				"parent_message_id" : $scope.parentId,
				"com_needs_id" : $scope.serIttem.com_needs_id
			}


			if(data.message_content == ''|| data.message_content == undefined){
				$CommonFactory.showAlert("回复内容不能为空");
				return;
			}
			// else{
			// 	$CommonFactory.showLoading();
			// }
			CommunityService.replay(data,function(res){
				$scope.re.message_content = "";//清空输入框
				if(res.statuscode == 1){
					// $CommonFactory.hideLoading();
					CommunityService.getOneDemand(data,function(r){
						if(r.statuscode == 1){
							$scope.serIttem.service_message_info = r.data[0].service_message_info;
						}
					})

				}
			})
		}
		$scope.replayBlur = function(){
			$scope.replay_show = false;
		}

		//长按回复-投诉
		$scope.onHold = function(name,id){
//			if ($rootScope.getCurrentUser().opt_permission == 0) {
//				$CommonFactory.showAlert(noMoneyMessage);
//				return;
//			}
			$scope.msg = {};
			$CommonFactory.showCustomPopup(function(){
				var data = {
					accesstoken : accesstoken,
					type_id : 5,
					target_id : id,
					report_comment : $scope.msg.message
				};
				CommunityService.report(data, function(response){
					if (response.statuscode == CODE_SUCCESS) {
						$cordovaToast.show("投诉成功，等待审核", "short", "center")
							.then(function(success) {
							// success
							}, function (error) {
							// error
						});
					}
				});
			}, $scope, '<textarea type="text" class="b-a padding-l-5" ng-model="msg.message" placeholder="投诉内容"></textarea>', '投诉 - '+'<strong>'+name+'</strong>');
		}


	}
]);
