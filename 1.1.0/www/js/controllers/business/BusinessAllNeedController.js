/**
 * 商务-需求控制器
 */
app.controller('BusinessAllNeedController',
	['$scope', 'CommunityService','$rootScope','$state','$localStorage','$CommonFactory','$timeout','$ionicScrollDelegate','$cordovaToast','chatFactory',
	function ($scope, CommunityService,$rootScope,$state,$localStorage,$CommonFactory,$timeout,$ionicScrollDelegate,$cordovaToast,chatFactory) {
		$scope.replay_show = false;
		$scope.appNav = true; //底部导航为true显示
		$scope.re = {};
		$scope.needList = [];//动态列表
		$scope.needImgItems = [];
		$scope.needCurrentPage = 1; //第1页开始
		$scope.itemsPerPage = 5; //每页10条
		$scope.hasshare = false;//初始分享不显示
//		var accesstoken = $localStorage.get("accesstoken");
		var accesstoken = $rootScope.getAccessToken();
		var hasMore =true;
		$scope.needIsOverLoad = false;
		var timeout = null; //搜索延迟
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		$scope.from = $state.params.hasOwnProperty("from") ? $state.params.from : "";
		//默认经纬度
			var latitude = 30.555211;//纬度
			var longitude = 104.07271;//经度

			//实际定位的位置
			if ($rootScope.locationInfo && !$rootScope.isEmptyObject($rootScope.locationInfo)) {
				if ($rootScope.locationInfo.latitude && $rootScope.locationInfo.longitude) {
					latitude = $rootScope.locationInfo.latitude;
					longitude = $rootScope.locationInfo.longitude;
				}
			}

		$scope.searchKeyword = $localStorage.SearchNeedKeyword;
		//搜索动态
		if(!$scope.searchKeyword){
			$scope.filterOptions=""
		}else{
			$scope.filterOptions= $scope.searchKeyword
		}
		
		// $scope.$watch("filterOptions",function(newVal,oldVal){
		// 	if (newVal != oldVal) {
		// 		if (timeout) {
		// 			$timeout.cancel(timeout);
		// 		}
		// 		timeout = $timeout(function(){
		// 			$scope.dynamicIsEmptyData = false;
		// 			$scope.dynamicIsOverLoad = false;
		// 			$scope.dynamicCurrentPage = 1;
		// 			$scope.dynamicList=[];
		// 			hasMore = true;
		// 			$scope.getDynamicList();
		// 			hasMore = false;
		// 		},500)
		// 	}
		// },true)

		//动态下拉刷新
		$scope.needDoRefresh = function(){
			$scope.needIsEmptyData = false;
			$scope.needIsOverLoad = false;
			$scope.needList = [];
			$scope.needCurrentPage = 1;
			hasMore = true;
			$scope.getNeedList();
			hasMore = false;
			$scope.$broadcast('scroll.refreshComplete');
		}


		$scope.getNeedList = function(){
			if (hasMore) {
				var data = {
					"accesstoken" : accesstoken,
					"currentPage" : $scope.needCurrentPage,
					"itemsPerPage" : $scope.itemsPerPage,
					'latitude' : latitude,
					'longitude' : longitude,
					"keyword" : $scope.filterOptions
				}

				CommunityService.getNeedList(data,function(response){
					//没有数据
					if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
						$scope.needIsEmptyData = true;
						$scope.needIsOverLoad = true;
						return;
					}
					if(response.statuscode == CODE_SUCCESS){
						for (var i = 0, len = response.data.length; i < len; i++) {
							response.data[i].needImgItems = [];
							var imgPath = "";
							switch (response.data[i].article_type_id) {
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
							for(var j = 0; j<response.data[i].com_needs_thumb.length; j++){
								response.data[i].needImgItems.push({"src": $scope.commonPath.route_path + imgPath + response.data[i].com_needs_thumb[j]});
							}
							// response.data[i].distance = (Math.round(response.data[i].distance)/1000).toFixed(2) + 'km';
							response.data[i].distance = $rootScope.handleDistance(response.data[i].distance);
							$scope.needList.push(response.data[i]);
						}
					}
					//判断总数，防止无线滚动加载
					$scope.needItemTotal = response.page_info;
					if ($scope.needCurrentPage * $scope.itemsPerPage >= $scope.needItemTotal) {
						$scope.needIsEmptyData = true;
						hasMore = false;
					}
					else {
						$scope.needCurrentPage++;
						$scope.$broadcast('scroll.infiniteScrollComplete');
						hasMore = true;
					}
				})
			}
		};

		// 需求详情
		$scope.toBusinessNeeds = function(needs) {
			var data = {
				com_needs_id: needs.com_needs_id 
			};
			$state.go('businessNeedsDetail',data);
		}
		$scope.scrollTop = function() {
			$ionicScrollDelegate.scrollTop(1000);
		};


		//点赞功能
		$scope.likeYou = function(type,ser,isLike){
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
				// chatFactory.sendCustomMsg(ser.article_data_user_id || ser.cre_user_id,"dianzan",temp);
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
							ser.like = r.data[0].service_like_info;
							ser.is_like = r.data[0].is_like;
						}
					})
					}
					else if (type==3) {
						CommunityService.getOneActivity(data,function(r){
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
				// chatFactory.sendCustomMsg($scope.serIttem.cre_user_id || $scope.serIttem.article_data_user_id,"liuyan",temp);
			}
			else if($scope.type == 2){
				//二级回复
				$scope.parentId=$scope.serIttem.message[$scope.index].message_id;
				//发送即时消息
				var temp = {};
				temp.name = $scope.serIttem.message[$scope.index].message_user_name;
				chatFactory.sendCustomMsg($scope.serIttem.message[$scope.index].message_user_id,"liuyan",temp);
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
							$scope.serIttem.message = r.data[0].service_message_info;
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

		//动态向左滑
		$scope.needOnSwipeLeft = function(){
			$state.go("tab.communityactivity");
		}
		//动态向右滑
		$scope.needOnSwipeRight = function(){
			$state.go("tab.community");
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




		if ($state.params.refresh == 'need') {
			$scope.needDoRefresh();
		}

		//返回
		$scope.myBack = function(){
			if ($scope.from && $scope.from.length > 0) {
				$state.go($scope.from);
				return;
			}
			$localStorage.SearchPage = 3;
			$state.go("businessallposts");
		};
		
		$scope.scrollTop = function() {
			$ionicScrollDelegate.scrollTop(1000);
		};
		//搜索
		$scope.searchClick = function(){
			$scope.needList = [];
			$scope.needIsEmptyData = false;
			$scope.needIsOverLoad = false;
			$scope.needCurrentPage = 1; //当前第几页
			hasMore = true;
			$scope.getNeedList();
			hasMore = false;
		}

		//查看个人名片
		$scope.viewPerson = function (arg1, arg2) {
			//user_id:needItem.cre_user_id,com_id:needItem.com_id,from:'tab.communitydynamic'
			// var data = {'user_id':arg1, 'com_id':arg2, 'from':'tab.communitydynamic','slideIndex': 2}；
			$state.go('personalmsg', {'user_id':arg1, 'com_id':arg2, 'from':'businessallposts'});
		}

		//查看企业
		$scope.viewCompany = function(arg1) {
			if ($rootScope.getCurrentUser().user_type == 1 || $rootScope.getCurrentUser().user_type == 2) {
				var message = "会员权限等级较低，请提升等级后查看";
				$CommonFactory.showConfirm($scope.goToMemauthority, message);
				return true;
			}

			$state.go('commsg', {'com_id':arg1});
		}

		//跳转到会员购买页面
		$scope.goToMemauthority = function() {
			$state.go('memauthority');
		};

	}
]);