/**
 * 单个动态控制器
 */
app.controller('DynamicItemCtrl',
	['$scope', 'CommunityService','$rootScope','$state','$localStorage','$CommonFactory','$cordovaToast','chatFactory','$ionicHistory',
	function ($scope, CommunityService,$rootScope,$state,$localStorage,$CommonFactory,$cordovaToast,chatFactory,$ionicHistory) {
		$scope.replay_show = false;
		$scope.re = {};
		$scope.dynamicList = [];//动态列表
		$scope.dynamicImgItems = [];
		var accesstoken = $localStorage.get("accesstoken");

		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
	$scope.photo_path = $scope.commonPath.route_path + $scope.commonPath.photo_path;


				//动态下拉刷新
		$scope.dynamicDoRefresh = function(){
			$scope.dynamicList = [];
			$scope.getDynamicItem();
			$scope.$broadcast('scroll.refreshComplete');
		}

		// 返回按钮
		$scope.myGoBack = function(){
			if ($state.params.from) {
				$state.go($state.params.from)
			}
			else{
				$ionicHistory.goBack();
			}
		}

		$scope.getDynamicItem = function(){
			var data = {
				"accesstoken" : accesstoken,
				"type_id":1,
				"versions" : VERSIONS,
				"target_id" : $state.params.id,
				"article_data_id" : $state.params.id
			}
			CommunityService.getOneDynamic(data,function(response){
				if(response.statuscode == CODE_SUCCESS){
					var imgPath = "";
					switch (response.data.article_type_id) {
						case "1":
							imgPath = $scope.commonPath.needs_path;
							break;
						case "2":
							imgPath = $scope.commonPath.editer_uploads_path;
							break;
						case "3":
							imgPath = $scope.commonPath.companyIntr_path;
							break;
						case "4":
							imgPath = $scope.commonPath.userIntr_path;
							break;
						case "5":
							imgPath = $scope.commonPath.dynamic_path;
							break;
						case "6":
							imgPath = $scope.commonPath.party_path;
							break;
						case "8":
							imgPath = $scope.commonPath.party_path;
							break;
					}
					response.data.dynamicImgItems = [];
					if ( response.data.article_data_photo.length && response.data.article_data_photo.length > 0) {
						for (var j = 0; j < response.data.article_data_photo.length; j++) {
							response.data.dynamicImgItems.push({"src": $scope.commonPath.route_path + $scope.commonPath.dynamic_path + response.data.article_data_photo[j]});
							response.data.article_data_photo[j] = $scope.commonPath.route_path + $scope.commonPath.dynamic_path + response.data.article_data_photo[j];
						}
					}
					$scope.dynamicList.push(response.data);
				}
			})
		}
		$scope.getDynamicItem();



		//点赞功能
		$scope.likeYou = function(type,ser,isLike){
			var data = {
				"accesstoken" : accesstoken,
				"type_id":1,
				"versions" : VERSIONS,
				"target_id" : ser.article_data_id,
				"article_data_id" : ser.article_data_id
			}
			if(isLike == 1){
				data.status = 0;
			}
			else if(isLike == 0){
				//点赞
				data.status = 1;
				//发送即时消息
				var temp = {};
				temp.name = ser.article_data_user_name || ser.cre_user_name;
				// chatFactory.sendCustomMsg(ser.article_data_user_id || ser.cre_user_id,"dianzan",temp);
			}
			CommunityService.likeYou(data,function(res){
				if(res.statuscode == 1){
					CommunityService.getOneDynamic(data,function(r){
					if(r.statuscode == 1){
						ser.like = r.data.like;
						ser.is_like = r.data.is_like;
					}
					})
				}
			})
		}



		//回复
		$scope.replayShow = function(type,ser,index,_type){
			$scope.index = index;
			$scope._type = _type;
			$scope.type=type;
			$scope.replay_show = !$scope.replay_show;
			$scope.serIttem = ser;
			if (type == 1) {
				$scope.placeholder = "说点什么呢？";
			}
			else if (type == 2) {
				$scope.placeholder = "回复：" + $scope.serIttem.message[$scope.index].message_user_name;
			}
		}
		$scope.sendReplay = function(){
			$scope.replay_show = !$scope.replay_show;
			if($scope.type == 1){
				//一级回复
				$scope.parentId = "";
				//发送即时消息
				var temp = {};
				temp.name = $scope.serIttem.article_data_user_name || $scope.serIttem.cre_user_name;
				// chatFactory.sendCustomMsg($scope.serIttem.cre_user_id || $scope.serIttem.article_data_user_id,"liuyan",temp);
			}
			else if($scope.type == 2){
				//二级回复
				$scope.parentId=$scope.serIttem.message[$scope.index].message_id;

				//发送即时消息
				var temp = {};
				temp.name = $scope.serIttem.message[$scope.index].message_user_name;
				// chatFactory.sendCustomMsg($scope.serIttem.message[$scope.index].message_user_id,"liuyan",temp);
			}
			var data = {
				"accesstoken" : accesstoken,
				"target_id" : $scope.serIttem.article_data_id,
				"type_id" : $scope._type,
				"message_content" : $scope.re.message_content,
				"parent_message_id" : $scope.parentId,
				"versions" : VERSIONS,
				"article_data_id" : $scope.serIttem.article_data_id
			}
			if(data.message_content == ''|| data.message_content == undefined){
				$CommonFactory.showAlert("回复内容不能为空");
				return;
			}
			CommunityService.replay(data,function(res){
				$scope.re.message_content = "";//清空输入框
				if(res.statuscode == 1){
					CommunityService.getOneDynamic(data,function(r){
					$scope.serIttem.message = r.data.message;
					})
				}
			})
		}
		//长按回复-投诉
		$scope.onHold = function(name,id){
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
