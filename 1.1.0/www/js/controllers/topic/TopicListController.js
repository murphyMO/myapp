/**
 * 社区-话题控制器
 */
app.controller('CommunityTopicCtrl',
	['$scope', 'CommunityService','$rootScope','$state','$localStorage','$CommonFactory','$timeout','$ionicScrollDelegate','$cordovaToast','chatFactory', 'TransferPostDataService','$ionicHistory',
	function ($scope, CommunityService,$rootScope,$state,$localStorage,$CommonFactory,$timeout,$ionicScrollDelegate,$cordovaToast,chatFactory,TransferPostDataService,$ionicHistory) {
		$scope.replay_show = false;
		$scope.appNav = true; //底部导航为true显示
		$scope.re = {};
		$scope.topicList = [];//动态列表
		$scope.topicCurrentPage = 1; //第1页开始
		$scope.itemsPerPage = 5; //每页5条
		var accesstoken = $rootScope.getAccessToken();
		var hasMore =true;
		$scope.topicIsOverLoad = false;
		var timeout = null; //搜索延迟
		// $scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);


		//搜索动态
		$scope.topicSearch = {
			"keyword" : ""
		}
		$scope.$watch("topicSearch",function(newVal,oldVal){
			if (newVal != oldVal) {
				if (timeout) {
					$timeout.cancel(timeout);
				}
				timeout = $timeout(function(){
					$scope.topicIsEmptyData = false;
					$scope.topicIsOverLoad = false;
					$scope.topicCurrentPage = 1;
					$scope.topicList=[];
					hasMore = true;
					$scope.getTopicList();
					hasMore = false;
				},500)
			}
		},true)

		//动态下拉刷新
		$scope.topicDoRefresh = function(){
			hasMore = true;
			$scope.topicIsEmptyData = false;
			$scope.topicIsOverLoad = false;
			$scope.topicList = [];
			$scope.topicCurrentPage = 1;
			$scope.getTopicList();
			hasMore = false;
			$scope.$broadcast('scroll.refreshComplete');
		}


		$scope.getTopicList = function(){
			if (hasMore) {
				var data = {
					"accesstoken" : accesstoken,
					"currentPage" : $scope.topicCurrentPage,
					"itemsPerPage" : $scope.itemsPerPage,
					"keyword" : $scope.topicSearch.keyword,
					"status" : 1
				}

				CommunityService.getTopicsList(data,function(response){
					$scope.$broadcast('scroll.infiniteScrollComplete');
					//没有数据
					if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
						$scope.topicIsEmptyData = true;
						$scope.topicIsOverLoad = true;
						return;
					}
					if(response.statuscode == CODE_SUCCESS){
						$CommonFactory.hideLoading();
						for (var i = 0, len = response.data.length; i < len; i++) {
							$scope.topicList.push(response.data[i]);
						}
					}
					//判断总数，防止无线滚动加载
					$scope.topicItemTotal = response.page_info;
					if ($scope.topicCurrentPage * $scope.itemsPerPage >= $scope.topicItemTotal) {
						$scope.topicIsEmptyData = true;
						hasMore = false;
					}
					else {
						$scope.topicCurrentPage++;
						$scope.topicIsEmptyData = false;
						$scope.topicIsOverLoad = false;
						$scope.$broadcast('scroll.infiniteScrollComplete');
						hasMore = true;
					}
				})
			}
		};
		// $scope.getTopicList();


		// if ($state.params.refresh == 'topiclist') {
		// 	$scope.topicDoRefresh();
		// }

		$scope.scrollTop = function() {
			$ionicScrollDelegate.scrollTop(2000);
		};

		//查看详情 || 选择话题
		$scope.topicDetail = function(obj){
			var article = TransferPostDataService.getArticle() ? TransferPostDataService.getArticle() : {};
			var from = article.topicListFrom; //topic list page from ...
			if (!!from) {
				if (from == 'postdynamic') {
					//添加话题到话题组
					if (!article.selectedTopic) {
						article.selectedTopic = [];
					}
					if (!checkObjInArr(obj, article.selectedTopic)) {
						article.selectedTopic.push(obj);
					}
					article.selectedTopicText = "#" + obj.topic_title + "# ";
					TransferPostDataService.setArticle(article);
					$state.go('postdynamic');
					return;
				}
			}
			if(obj==$scope.topicList[0]){
				$localStorage.topicRanking=1
			}else if(obj==$scope.topicList[1]){
				$localStorage.topicRanking=2
			}else if(obj==$scope.topicList[2]){
				$localStorage.topicRanking=3
			}else{
				$localStorage.topicRanking=0
			}
			//console.log($localStorage.topicRanking);
			$state.go("topicdetail",{topic_id:obj.topic_id})
		}

		// page back event
		$scope.back = function() {
			var article = TransferPostDataService.getArticle() ? TransferPostDataService.getArticle() : {};
			var from = article.topicListFrom; //topic list page from ...
			if (!!from) {
				if (from == 'postdynamic') {
					$state.go('postdynamic');
					return;
				}
			} else {
				//$state.go('tab.communitydynamic');
				$localStorage.page=1;
				if ($ionicHistory.backView()) {
					$ionicHistory.goBack();
				} else {
					$state.go('tab.communitydynamic');
				}
			}
		};

		//元素是否在数组中
		function checkObjInArr(obj, arr) {
			var exists = false;
			var len = arr.length;
			for (var i = 0; i < len; i++) {
				if (arr[i].topic_id == obj.topic_id) {
					exists = true;
					return exists;
				}
			}
			return exists;
		};

	}
]);
