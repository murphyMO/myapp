/*
 * 企业发布管理的控制器
 */
app.controller('CompanyPublishController',
	['$scope', '$window', '$resource','$stateParams','$state','CompanyServiceService', 'CommunityService','$localStorage','$rootScope', '$timeout','chatFactory','$ionicSlideBoxDelegate',
	function ($scope, $window, $resource,$stateParams,$state,CompanyServiceService,CommunityService,$localStorage, $rootScope, $timeout,chatFactory,$ionicSlideBoxDelegate) {

		//$scope.replay_show = false;
		//$scope.appNav = true; //底部导航为true显示
		$scope.re = {};

		$scope.demandList = [];//需求列表
		$scope.demandImgItems = [];
		$scope.demandCurrentPage = 1; //第1页开始
		$scope.currentPage = 1; //第1页开始
		$scope.itemsPerPage = 5; //每页10条
		$scope.com_id = $stateParams.com_id;


		var timeout = null; //搜索延迟
		var accesstoken = $localStorage.get("accesstoken");

		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		//console.log($scope.commonPath);
		$scope.photo_path = $scope.commonPath.route_path + $scope.commonPath.photo_path;
		var currentUser = $rootScope.getCurrentUser();
		//是否该公司管理员
		$scope.isManager = currentUser;


		//搜索需求
		$scope.demandSearch = {
			"keyword" : ""
		}

		$scope.$watch("demandSearch",function(newVal,oldVal){
			if (newVal != oldVal) {
				if (timeout) {
					$timeout.cancel(timeout);
				}
				timeout = $timeout(function(){
					$scope.demandIsEmptyData = false;
					$scope.demandIsOverLoad = false;
					$scope.demandCurrentPage = 1;
					$scope.demandList=[];
					$scope.getDemandList();
				},500)
			}
		},true)


		//需求下拉刷新
		$scope.demandDoRefresh = function(){
			$scope.demandIsEmptyData = false;
			$scope.demandIsOverLoad = false;
			$scope.demandList = [];
			$scope.demandCurrentPage = 1;
			$scope.getDemandList();
			$scope.$broadcast('scroll.refreshComplete');
		}


		//获取数据
		// 需求列表
		$scope.getDemandList = function(){
			var data = {
				"accesstoken" : accesstoken,
				"currentPage" : $scope.demandCurrentPage,
				"itemsPerPage" : $scope.itemsPerPage,
				"keyword" : $scope.demandSearch.keyword,
				"com" : 1,
			}
			CompanyServiceService.getDemandList(data,function(response){
				console.log(response)
				//没有数据
				if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
					$scope.demandIsEmptyData = true;
					$scope.demandIsOverLoad = true;
					return;
				}
				if(response.statuscode == CODE_SUCCESS){
					for (var i = 0, len = response.data.length; i < len; i++) {
						response.data[i].demandImgItems = [];
            for (var j = 0; j < response.data[i].com_needs_thumb.length; j++) {
              response.data[i].demandImgItems.push({"src": $scope.commonPath.route_path + $scope.commonPath.needs_path + response.data[i].com_needs_thumb[j]});
              response.data[i].com_needs_thumb[j] = $scope.commonPath.route_path + $scope.commonPath.needs_path + response.data[i].com_needs_thumb[j];
            }
						$scope.demandList.push(response.data[i]);
					}
				}
				//判断总数，防止无线滚动加载
				$scope.demandItemTotal = response.page_info;
				if ($scope.demandCurrentPage * $scope.itemsPerPage > $scope.demandItemTotal) {
					$scope.demandIsEmptyData = true;
				} else {
					$scope.demandCurrentPage++;
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
			})
		};


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
		//返回
		$scope.goBack = function(){
			//localStorage test=565646;
			$state.go("tab.mine");

		}


		//投给我的
		$scope.toForMe = function(item) {
			$state.go("app.companypubforme",
				{article_type_id: item.article_type_id,article_target_id:item.article_target_id});
		};


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




	}]);

//投给我的
app.controller('CompanyPubFormeController',
	['$scope', '$window','$state','$stateParams', '$resource','CompanyServiceService', '$rootScope', '$timeout',
		function ($scope, $window,$state, $stateParams,$resource,CompanyServiceService, $rootScope, $timeout) {

			$scope.accesstoken = $rootScope.getAccessToken();
			$scope.article_target_id = $stateParams.article_target_id;
			//$scope.article_target_id = [];
			$scope.article_type_id = $stateParams.article_type_id;
			//$scope.article_type_id = [];

			$scope.pageClass = 'slideLeft';
			$rootScope.appTitle = '投给我的';

			$scope.getCompanyServiceList = function(){
				var data = {
					"accesstoken" : $scope.accesstoken,
					"article_target_id" : $scope.article_target_id,
					"article_type_id" : $scope.article_type_id
				}
				CompanyServiceService.getCompanyServiceList(data,function(res){
					//console.log($scope.article_type_id);
					//console.log(res);
					$scope.items = res.data;
				})
			};
			$scope.getCompanyServiceList();

			//页面返回按钮
			$scope.back = function(){
				$state.go('companypublish');
			}

		}]);

