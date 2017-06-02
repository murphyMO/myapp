/**
 * 我的发布控制器
 */
app.controller('MyReleaseCtrl', ['$scope','$window','$state','$stateParams','$localStorage', '$resource', 'getMineReleaseListService','$CommonFactory','$rootScope', '$timeout',
	function ($scope,$window,$state,$stateParams,$localStorage,$resource, getMineReleaseListService,$CommonFactory,$rootScope, $timeout) {
		//$scope.accesstoken = $rootScope.getAccessToken();
		var accesstoken = $localStorage.get("accesstoken");
		//$scope.searchKeyword = ""; //搜索key
		$scope.dataItems = [];
		$scope.items = [];
		var timeout = null; //搜索延迟
		$scope.re = {};
		$scope.currentPage = 1; //第1页开始
		$scope.itemsPerPage = 5; //每页10条
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		$scope.photo_path = $scope.commonPath.route_path + $scope.commonPath.photo_path;
		var hasMore = true;
		$scope.releaseSearch = {
			"keyword" : ""
		}
		//$scope.messagePath = $rootScope.getCommonPath().article_photo_path

		$scope.getMineReleaseList = function(){
			if (hasMore) {
					var data = {
					"accesstoken" : accesstoken,
					"keyword": $scope.releaseSearch.keyword,
					'currentPage': $scope.currentPage,
					'itemsPerPage': $scope.itemsPerPage,
					'mine': 1
				}
				getMineReleaseListService.getMineRelease(data,function(res){
					//console.log(data);
					// if (res.statuscode == CODE_SUCCESS) {
					// 	$scope.items = res.data;
					// }
					//没有数据
					//console.log(data);
					if (res.statuscode != CODE_SUCCESS || res.data.length == 0) {
						$scope.releaseIsEmptyData = true;
						$scope.releaseIsOverLoad = true;
						return;
					}
					if(res.statuscode == CODE_SUCCESS){
						for (var i = 0, len = res.data.length; i < len; i++) {
							var imgPath = "";
							switch (res.data[i].article_type_id) {
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
							res.data[i].releaseImgItems = [];
							if(res.data[i].article_data_photo.length>0){
								for(var j = 0; j<res.data[i].article_data_photo.length; j++){
									res.data[i].releaseImgItems.push({"src": $scope.commonPath.route_path + imgPath + res.data[i].article_data_photo[j]});
									res.data[i].article_data_photo[j] = $scope.commonPath.route_path + imgPath + res.data[i].article_data_photo[j];
								}
							}
							$scope.items.push(res.data[i]);
						}
					}
					//判断总数，防止无限滚动加载
					$scope.releaseItemTotal = res.page_info;
					if ($scope.currentPage * $scope.itemsPerPage > $scope.releaseItemTotal) {
						$scope.releaseIsEmptyData = true;
						hasMore = false;
					}else {
						$scope.currentPage++;
						$scope.$broadcast('scroll.infiniteScrollComplete');
						hasMore = true;
					}
				})
			}
		};
		//$scope.getMineReleaseList();


		document.addEventListener("backbutton", onBackKeyDown, false );
		function onBackKeyDown() {
			//匹配当前页面
			if ( $state.current.name == 'chat') {
				//返回事件
				$("#showPic").modal("hide");
				$scope.back();
			} else {
				//window.history.back();
			}
		}

		$scope.showPic = function(i){
			$("#showPic").modal("show");
			$scope.isrc=$scope.messagePath+ i;
		}


		//搜索
		// $scope.$watch('searchKeyword', function (newVal, oldVal) {
		// 	if (newVal !== oldVal) {
		// 		if (timeout) {
		// 			$timeout.cancel(timeout);
		// 		}
		// 		timeout = $timeout(function() {
		// 			$scope.currentPage = 1; //当前第一页
		// 			$scope.dataItems=[];
		// 			$scope.getMineReleaseList();
		// 		}, 1000);
		// 	}
		// }, true);
		//搜索
		$scope.$watch("releaseSearch",function(newVal,oldVal){
			if (newVal != oldVal) {
				if (timeout) {
					$timeout.cancel(timeout);
				};
				timeout = $timeout(function(){
					$scope.currentPage = 1;
					$scope.releaseIsEmptyData = false;
					$scope.releaseIsOverLoad = false;
					$scope.items=[];
					hasMore = true;
					$scope.getMineReleaseList();
					hasMore = false;
				},500)
			};

		},true)

		//下拉刷新
		$scope.releaseDoRefresh = function(){
			$scope.releaseIsEmptyData = false;
			$scope.releaseIsOverLoad = false;
			//$scope.releaseList = [];
			$scope.items = [];
			$scope.currentPage = 1;
			hasMore = true;
			$scope.getMineReleaseList();
			hasMore = false;
			$scope.$broadcast('scroll.refreshComplete');
		}
		if ($state.params.refresh == 'release') {
			$scope.releaseDoRefresh();
		}

		//点赞功能
		$scope.likeYou = function(type,ser,isLike){
			//console.log(ser)
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
				data.status = 1;
			}
			getMineReleaseListService.likeYou(data,function(res){
				if(res.statuscode == 1){
					if (type==1) {
						getMineReleaseListService.getOneRelease(data,function(r){
						if(r.statuscode == 1){
							ser.service_like_info = r.data[0].service_like_info;
							ser.is_like = r.data[0].is_like;
						}
					})
					}
					else if (type==2) {
						getMineReleaseListService.getOneDemand(data,function(r){
						if(r.statuscode == 1){
							ser.service_like_info = r.data[0].service_like_info;
							ser.is_like = r.data[0].is_like;
						}
					})
					}
					else if (type==3) {
						getMineReleaseListService.getOneActivity(data,function(r){
							console.log(r)
						if(r.statuscode == 1){
							ser.like = r.data.like;
							ser.is_like = r.data.is_like;
						}
					})
					}
				}
			})
		}

		//回复
		$scope.replayShow = function(type,ser,index,_type){
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
				$scope.parentId = "";
			}
			else if($scope.type == 2){
				$scope.parentId=$scope.serIttem.service_message_info[$scope.index].message_id;
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
			getMineReleaseListService.replay(data,function(res){
				$scope.re.message_content = "";//清空输入框
				if(res.statuscode == 1){
					// $CommonFactory.hideLoading();
					if ($scope._type == 1) {
						getMineReleaseListService.getOneRelease(data,function(r){
						$scope.serIttem.service_message_info = r.data[0].service_message_info;
					})
					}
					else if ($scope._type == 2) {
						getMineReleaseListService.getOneDemand(data,function(r){
						if(r.statuscode == 1){
							$scope.serIttem.service_message_info = r.data[0].service_message_info;
						}
					})
					}
					else if ($scope._type == 3) {
						getMineReleaseListService.getOneActivity(data,function(r){
						if(r.statuscode == 1){
							$scope.serIttem.service_message_info = r.data.service_message_info;
						}
					})
					}
				}
			})
		}

		//页面返回按钮
		$scope.back = function(){
			$state.go('tab.mine');
			//window.history.back();
		}




	}]);
