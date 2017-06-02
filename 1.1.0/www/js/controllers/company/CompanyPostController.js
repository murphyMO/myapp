/*
 *  企业投递
 */
app.controller('CompanyPostCtrl',
	['$scope', '$window', '$state', '$resource','$localStorage', '$stateParams', '$rootScope', '$timeout', 'CompanyServiceService', 
	function ($scope, $window, $state, $resource, $localStorage, $stateParams, $rootScope, $timeout, CompanyServiceService) {
		$scope.accesstoken = $rootScope.getAccessToken();
		//$scope.path = $rootScope.getCommonPath().photo_path ;
		//$scope.userPath = $rootScope.getCommonPath().photo_path ;
		//$scope.messagePath = $rootScope.getCommonPath().article_photo_path;
		$scope.path = $localStorage.getObject(KEY_COMMON_PATH);
		var current_user = $rootScope.getCurrentUser();
		var com_id = current_user.com_id;
		
		var timeout = null; //搜索延迟
		$scope.currentPage= 1; //第一页
		$scope.itemsPerPage= 5; //每页5条
		$scope.itemTotal = 0;
		$scope.isEmptyData = false; //控制加载更多
		$scope.isOverLoad = false; //控制没有数据的时候显示
		$scope.dataItems = [];
		$scope.re = {};
		var hasMore = true;
		$scope.postSearch = {
			"keyword" : ""
		}

		//获取投递列表
		$scope.getCompanyMailingList = function(){
			if (hasMore) {
				var data = {
					"accesstoken" :  $scope.accesstoken,
					"com_id" : com_id,
					"keyword": $scope.postSearch.keyword,
					'currentPage': $scope.currentPage,
					'itemsPerPage': $scope.itemsPerPage
					}
				CompanyServiceService.getCompanyMailingList(data,function(res){
					// 请求失败或者没有数据
					if (res.statuscode != CODE_SUCCESS || res.data.length == 0) {
						$scope.isEmptyData = true;
						$scope.isOverLoad = true;
						return;
					}
					//有数据
					for (var i = 0, len = res.data.length; i < len; i++) {
						$scope.dataItems.push(res.data[i]);
					}
					//判断总数，防止无线滚动加载
					$scope.itemTotal = res.page_info;
					if ($scope.currentPage * $scope.itemsPerPage > $scope.itemTotal) {
						$scope.isEmptyData = true;
						hasMore = false;
					} else {
						$scope.currentPage++;
						$scope.$broadcast('scroll.infiniteScrollComplete');
						hasMore = true;
					}
				})
			}
		};

		//下拉刷新
		$scope.demandDoRefresh = function(){
			$scope.isEmptyData = false;
			$scope.isOverLoad = false;
			$scope.currentPage = 1; //当前第一页
			console.log(121);
			$scope.dataItems = [];
			hasMore = true;
			$scope.getCompanyMailingList();
			hasMore = false;
			$scope.$broadcast('scroll.refreshComplete');
		}

		//投递详情
		$scope.tomaDe = function(item) {
			$state.go("compostdetail",
				{com_service_id: item.com_service_id});

		};
		//搜索
		$scope.$watch("postSearch",function(newVal,oldVal){
			if (newVal != oldVal) {
				if (timeout) {
					$timeout.cancel(timeout);
				};
				timeout = $timeout(function(){
					$scope.isEmptyData = false;
					$scope.isOverLoad = false;
					$scope.currentPage = 1;
					console.log(111);
					$scope.dataItems=[];
					hasMore = true;
					$scope.getCompanyMailingList();
					hasMore = false;
				},500)
			};

		},true)

		//点赞功能
		$scope.likeYou = function(ser,isLike){
			var data = {
				"accesstoken" : $scope.accesstoken,
				"type_id":1,
				"target_id":ser.article_data_id
			}
			if(isLike == 1){
				data.status = 0
			}
			else if(isLike == 0){
				data.status = 1
			}
			CompanyServiceService.likeYou(data,function(res){
				if(res.statuscode == 1){
					var da = {
						"target_id":ser.article_data_id,
						"accesstoken" : $scope.accesstoken
					}
					CompanyServiceService.getOneService(da,function(r){
						if(r.statuscode == 1){
							ser.service_like_info = r.data[0].service_like_info
							ser.is_like = r.data[0].is_like
						}
					})
				}
			})
		}

		//		回复
		$scope.replayShow = function(type,ser,index){
			$scope.index = index;
			$scope.type=type;
			$scope.appNav = !$scope.appNav;
			$scope.replay_show = !$scope.replay_show;
			$scope.serIttem = ser;

		}
		$scope.sendReplay = function(){
			$scope.replay_show = !$scope.replay_show;
			$scope.appNav = true;

			if($scope.type == 1){
				$scope.parentId = ""
			}
			else if($scope.type == 2){
				$scope.parentId=$scope.serIttem.service_message_info[$scope.index].message_id
			}
			var data = {
				"accesstoken" : $scope.accesstoken,
				"target_id" : $scope.serIttem.article_data_id,
				"type_id" : 1,
				"message_content" : $scope.re.message_content,
				"parent_message_id" : $scope.parentId
			}
			CompanyServiceService.replay(data,function(res){
				if(res.statuscode == 1){
					var da = {
						"target_id":$scope.serIttem.article_data_id,
						"accesstoken" : $scope.accesstoken
					}
					CompanyServiceService.getOneService(da,function(r){
						$scope.serIttem.service_message_info = r.data[0].service_message_info
					})
				}
			})
		}

		//引文详情
		//$scope.materialDetail = function(item) {
		//	$state.go("app.materialDetail", {material_id: item.com_article_material_id});
		//}

	}]);