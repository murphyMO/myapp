/**
 * 留言控制器
 */
app.controller('ContactCommentListCtrl', 
	['$scope', '$rootScope', '$localStorage', '$state','ContactService', '$CommonFactory','$ionicHistory',
	function($scope, $rootScope, $localStorage, $state, ContactService, $CommonFactory,$ionicHistory) {
	var accesstoken = $rootScope.getAccessToken();
	var commonPath = $localStorage.getObject(KEY_COMMON_PATH);
	$scope.path = commonPath.route_path + commonPath.photo_path;
	$scope.itemsPerPage = 999; //每页999条
	$scope.currentPage = 1; 
	$scope.itemTotal = 0;
	$scope.isEmptyData = false;
	$scope.commentList = [];
	//留言列表
	$scope.getMessageDatas = function(){
		var data = {
			accesstoken : accesstoken,
			currentPage : $scope.currentPage,
			itemsPerPage : $scope.itemsPerPage
		};
		ContactService.messageDatas(data, function(response){
			//没有数据
			if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
				$scope.isEmptyData = true;
				return;
			}
			//有数据
			var tmpData = response.data;
			for (var i = 0, len = tmpData.length; i < len; i++) {
				$scope.commentList.push(tmpData[i]);
			}
			//判断总数，防止无线滚动加载
			$scope.itemTotal = response.page_info;
			if ($scope.currentPage * $scope.itemsPerPage > $scope.itemTotal) {
				$scope.isEmptyData = true;
			} else {
				$scope.currentPage++;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}
		});
	};

	$scope.getMessageDatas();

	//留言页面跳转到响应的产品/需求页面
	$scope.toItem = function(thisItem){
		console.log(thisItem);
		
		switch (thisItem.type_id) {
			//1 文章 2 需求 3 活动 4 服务 
			case "1":
				$state.go('dynamicitem',{'id':thisItem.target_id,'from':'contactcommentlist'});
				break;
			case "2":
				$state.go('demanditem',{'id':thisItem.target_id,'from':'contactcommentlist'});
				break;
			case "3":
				$state.go('activityitem',{'id':thisItem.target_id,'from':'contactcommentlist'});
				break;
			case "4":
				$state.go('businessProduct',{'com_service_id':thisItem.target_id,'from':'contactcommentlist'});
				break;
		};
		//update item status
		$scope.updateCommentItemStatus(thisItem);
	};

	//页面返回事件
	$scope.myBack = function() {
		$ionicHistory.goBack();
	};
	//页面刷新事件
	$scope.doRefresh = function() {
		$scope.commentList = [];
		$scope.currentPage = 1;
		$scope.getMessageDatas();
		$scope.$broadcast('scroll.refreshComplete');
	}
	//接收路由传来的数据
	/*if($state.params && $state.params.data.length){
		$scope.leavewords = $state.params.data;
	} else {
		getMessageDatas();
		// $.toast("数据错误", "forbidden");
		// $timeout(
		// 	function() {
		// 		//window.history.back();
		// 	},1500);
	}*/

	/*$scope.toItem =function(word){
		//type_id 1 是留言，2是点赞
		if (word.target_id) {
			var data = {
				item_id : word.target_id,
				from : $state.current.name,
				message_id : word.message_id,
				type_id : 1
			};
			$state.go('app.dynamicitem',{data: data});
		}
	}

	$scope.back = function(){
		$state.go("app.contactlist");
	}

	var onBackKeyDown = function () {
		//匹配当前页面
		if ( $state.current.name == 'app.leaveword') {
			//按返回键之后需要去的页面
			$scope.back();
		} else {
			//window.history.back();
		}
	}
	document.addEventListener("backbutton", onBackKeyDown, false );*/
	$scope.updateCommentItemStatus = function(thisItem) {
		var data = {
			accesstoken : accesstoken,
			target_type : thisItem.target_type,
			target_id : thisItem.message_id
		};
		ContactService.updateCommentItemStatus(data);
	};

}]);