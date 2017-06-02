/**
 * 社区-活动控制器
 */
app.controller('CommunityActivityCtrl',
	['$scope', 'CommunityService','$rootScope','$state','$localStorage','$CommonFactory','$timeout','$ionicScrollDelegate','$cordovaToast','chatFactory', 'TransferPostDataService'
	function ($scope, CommunityService,$rootScope,$state,$localStorage,$CommonFactory,$timeout,$ionicScrollDelegate,$cordovaToast,chatFactory, TransferPostDataService) {
		$scope.replay_show = false;
		$scope.appNav = true; //底部导航为true显示
		$scope.re = {};
		$scope.activityList = [];//活动列表
		$scope.activityImgItems = [];
		$scope.activityCurrentPage = 1; //第1页开始
		$scope.itemsPerPage = 5; //每页10条
		$scope.hasshare = false;//初始分享不显示
		var accesstoken = $rootScope.getAccessToken();
		var hasMore =true;
		var timeout = null; //搜索延迟
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);


		//活动下拉刷新
		$scope.activityDoRefresh = function(){
			$scope.activityIsEmptyData = false;
			$scope.activityList = [];
			$scope.activityCurrentPage = 1;
			hasMore = true;
			$scope.getActivityList();
			hasMore = false;
			$scope.$broadcast('scroll.refreshComplete');
		}


		//点赞功能
		$scope.likeYou = function(type,ser,isLike){
//			if ($rootScope.getCurrentUser().opt_permission == 0) {
//				$CommonFactory.showAlert(noMoneyMessage);
//				return;
//			}
			var data = {
				"accesstoken" : accesstoken,
				"type_id":''
			}
			if (type==1) {
				data.type_id = 1;
				data.target_id = ser.article_data_id;
			}
			else if (type==2) {
				data.type_id = 2;
				data.target_id = ser.com_needs_id;
				data.com_needs_id = ser.com_needs_id;
			}
			else if (type==3) {
				data.type_id = 3;
				data.target_id = ser.party_id;
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
				chatFactory.sendCustomMsg(ser.article_data_user_id || ser.cre_user_id,"dianzan",temp);
			}
			CommunityService.likeYou(data,function(res){
				if(res.statuscode == 1){
					if (type==1) {
						CommunityService.getOneDynamic(data,function(r){
						if(r.statuscode == 1){
							ser.service_like_info = r.data[0].service_like_info;
							ser.is_like = r.data[0].is_like;
						}
					})
					}
					else if (type==2) {
						CommunityService.getOneDemand(data,function(r){
						if(r.statuscode == 1){
							ser.service_like_info = r.data[0].service_like_info;
							ser.is_like = r.data[0].is_like;
						}
					})
					}
					else if (type==3) {
						CommunityService.getOneActivity(data,function(r){
							console.log(r)
						if(r.statuscode == 1){
							ser.like = r.data[0].like;
							ser.is_like = r.data[0].is_like;
						}
					})
					}
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
				//发送即时消息
				var temp = {};
				temp.name = $scope.serIttem.article_data_user_name || $scope.serIttem.cre_user_name;
				chatFactory.sendCustomMsg($scope.serIttem.cre_user_id || $scope.serIttem.article_data_user_id,"liuyan",temp);
			}
			else if($scope.type == 2){
				//二级回复
				$scope.parentId=$scope.serIttem.service_message_info[$scope.index].message_id;
				//发送即时消息
				var temp = {};
				temp.name = $scope.serIttem.service_message_info[$scope.index].message_user_name;
				chatFactory.sendCustomMsg($scope.serIttem.service_message_info[$scope.index].message_user_id,"liuyan",temp);
			}
			var data = {
				"accesstoken" : accesstoken,
				"target_id" : '',
				"type_id" : $scope._type,
				"message_content" : $scope.re.message_content,
				"parent_message_id" : $scope.parentId
			}
			if ($scope._type == 1) {
				data.target_id = $scope.serIttem.article_data_id;
			}
			else if ($scope._type == 2) {
				data.target_id = $scope.serIttem.com_needs_id;
				data.com_needs_id = $scope.serIttem.com_needs_id;
			}
			else if ($scope._type == 3) {
				data.target_id = $scope.serIttem.party_id;
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
					if ($scope._type == 1) {
						CommunityService.getOneDynamic(data,function(r){
						$scope.serIttem.service_message_info = r.data[0].service_message_info;
					})
					}
					else if ($scope._type == 2) {
						CommunityService.getOneDemand(data,function(r){
						if(r.statuscode == 1){
							$scope.serIttem.service_message_info = r.data[0].service_message_info;
						}
					})
					}
					else if ($scope._type == 3) {
						CommunityService.getOneActivity(data,function(r){
						if(r.statuscode == 1){
							$scope.serIttem.service_message_info = r.data[0].service_message_info;
						}
					})
					}
				}
			})
		}

		$scope.replayBlur = function(){
			$scope.replay_show = false;
		}

		//活动向右滑
		$scope.activityOnSwipeRight = function(){
			$state.go("tab.communitydynamic");
		}



		//活动列表
		$scope.getActivityList = function(){
			if (hasMore) {
				var data = {
				"accesstoken" : accesstoken,
				"currentPage" : $scope.activityCurrentPage,
				"itemsPerPage" : $scope.itemsPerPage
			};
			CommunityService.getActivityList(data,function(response){
				console.log(response);
				//没有数据
				if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
					$scope.activityIsEmptyData = true;
					return;
				}
				if(response.statuscode == CODE_SUCCESS){
					for (var i = 0, len = response.data.length; i < len; i++) {
						response.data[i].activityImgItems = [];
						for(var j = 0; j<response.data[i].party_thumb.length; j++){
							response.data[i].activityImgItems.push({"src": $scope.commonPath.route_path +$scope.commonPath.article_photo_path + response.data[i].party_thumb[j]});
						}
						$scope.activityList.push(response.data[i]);
					}
				}
				//判断总数，防止无线滚动加载
				$scope.activityItemTotal = response.page_info;
				if ($scope.activityCurrentPage * $scope.itemsPerPage > $scope.activityItemTotal) {
					$scope.activityIsEmptyData = true; 
					hasMore = false;
				} else {
					$scope.activityCurrentPage++;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					hasMore = true;
				}
			})
			}
		};

		if ($state.params.refresh == 'activity') {
			$scope.activityDoRefresh();
		}

		$scope.scrollTop = function() {
			$ionicScrollDelegate.scrollTop(1000);
		};

	}
]);