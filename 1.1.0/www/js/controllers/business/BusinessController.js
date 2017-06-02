/**
 * 商务控制器
 */
app.controller('BusinessCtrl',
	['$scope', '$rootScope', '$state', 'BusinessService', '$localStorage', '$ionicSlideBoxDelegate', '$window', '$timeout','$ionicScrollDelegate','$ionicPlatform','$CommonFactory', '$ionicModal', '$location','IntelligooService','$ionicPopup','$stateParams','$cordovaToast','$sce',
	function ($scope, $rootScope, $state, BusinessService, $localStorage, $ionicSlideBoxDelegate, $window, $timeout,$ionicScrollDelegate,$ionicPlatform,$CommonFactory, $ionicModal, $location,IntelligooService,$ionicPopup,$stateParams,$cordovaToast,$sce) {
		//默认经纬度
		var latitude = 30.555211;//纬度
		var longitude = 104.07271;//经度
		// $scope.listType = 3;
		$scope.userobj = $rootScope.getCurrentUser();

		/**
		开门start
		**/
		var bluetoothEnableFlag = false;//默认蓝牙未开启
		$scope.openButtonShow = false;//默认显示灰色开门按钮
		$scope.obj = {};
		$scope.obj.bluetoothList = [];//从后台获取的蓝牙列表
		var deviceArray = [];//扫描到的蓝牙列表

		var localTab = $localStorage.get($state.current.name,1);
		$scope.tab = localTab;
		/**
		开门end
		**/

		//实际定位的位置
		if ($rootScope.locationInfo && !$rootScope.isEmptyObject($rootScope.locationInfo)) {
			if ($rootScope.locationInfo.latitude && $rootScope.locationInfo.longitude) {
				latitude = $rootScope.locationInfo.latitude;
				longitude = $rootScope.locationInfo.longitude;
			}
		}

		$scope.$on("$ionicView.afterEnter", function(event, data){
			$scope.accesstoken = $rootScope.getAccessToken();
			$scope.currentStoreId = $rootScope.getCurrentUser().store_id_by_ip;
		});

		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.currentStoreId = $rootScope.getCurrentUser().store_id_by_ip;
		// $scope.targetLontitude = "104.072662";
		// $scope.targetLatitude = "30.555228";

		//首页是从那里点进来的，目前有两个地方，左上角和首页查看所有分岛
		$scope.indexFrom = $localStorage.indexFrom ? $localStorage.indexFrom : 'leftTop';

		//路径对象
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		//轮播地址
		$scope.bannerPath = $scope.commonPath.route_path + $scope.commonPath.banner_photo_path;
		//合作伙伴
		$scope.partnerPath = $scope.commonPath.route_path + $scope.commonPath.partner_logo_path;
		//推荐企业
		$scope.companyPath = $scope.commonPath.route_path + $scope.commonPath.com_logo_path;
		//服务缩略图地址
		$scope.serviceThumbPath = $scope.commonPath.route_path + $scope.commonPath.service_thumb_path;
		//岛单张图片
		$scope.introductionPath = $scope.commonPath.route_path + $scope.commonPath.storeBnnner_path;
		//店长图片
		$scope.peoplePath = $scope.commonPath.route_path + $scope.commonPath.buinour_photo_path;

		$scope.bannerList = [];
		$scope.serviceTypeList = [];
		$scope.recomCompanyList = [];
		$scope.serviceList = [];
		$scope.activityList = [];
		$scope.needList = [];
		$rootScope.showMore = false;
		$rootScope.showMoreTwo = true;
		$scope.partnerList= [];

		//城市选择
		$scope.citySelectClick = function() {
			$localStorage.indexFrom = 'leftTop';
			$state.go("businessCitySelect");
		}

		// 搜索
		$scope.searchClick = function() {
			$state.go("businessSearch");
		}

		/**********图片轮播start**************/
		/**
		 * 获取轮播图数据
		 */
		$scope.getBannerDatas = function(){
			var data = {
				accesstoken: $scope.accesstoken,
				currentPage: 1,
				itemsPerPage: 4,
				city_official_code: $scope.currentCity.city_official_code,
				//store_id: $scope.currentStoreId
			}
			BusinessService.bannerDatas(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					$scope.bannerList = response.data;
				}
			});
		};

		/**
		 * 点击跳转
		 */
		$scope.bannerClick = function(url){
			if (url) {
				if (url.indexOf('/') != -1) {
					$location.path(url)
				} else {
					$state.go(url);
				}

			}
		}

		/**********轮播图end**********/




		$scope.scrollTop = function() {
			$ionicScrollDelegate.scrollTop(1000);
		};

		//跳转服务分类
		$scope.toBusinessFindServiceList = function(name, typeId) {
			if (name == '我的钥匙') {
				$state.go('intelligoo');
				return true;
			}
			var paramsObj = {
				name : name,
				type_id : typeId
			};
			$state.go('businessFindServiceList', paramsObj);
		}



		function handleContent(text) {
			if (text.length > 120) {
				text = text.substr(0, 117) + '...';
			}
			return text;
		}

		//查看所有发布事件
		$scope.viewAllPosts = function() {
			$localStorage.SearchPage = 0;
			$localStorage.SearchListKeyword = "";
			$state.go('businessallposts');
		}

		//加载图片
		$scope.$on("to-repeat-parent", function () {
			$timeout(function(){
					$ionicSlideBoxDelegate.$getByHandle("bannerList").update();
					$ionicSlideBoxDelegate.$getByHandle("bannerList").loop(true);
				}, 500);
		})

		// $scope.showCompany = function(id){
		// 	if($scope.userobj.user_type == 1 || $scope.userobj.user_type == 2) {
		// 		$CommonFactory.showAlert("您的会员等级还不能查看企业信息，请尽快联系小师妹成为人民币玩家吧！");
		// 		return;
		// 	};
		// 	$state.go("commsg",{com_id:id})
		// }
		$scope.showCompany = function(id){
			if($rootScope.isGuest){
				$state.go('login');
			}else{
				$state.go("commsg",{com_id:id})
			}

		}

		//个人信息
		$scope.getMineMessage = function(){
			var data = {
				"accesstoken": $scope.accesstoken,
			};
			BusinessService.getMineInfo(data, function (response) {
				if (response.statuscode == CODE_SUCCESS) {
					$scope.user = response.data;
					var ImgObj1=new Image();
					ImgObj1.src= $scope.commonPath.route_path+$scope.commonPath.photo_path+$scope.user.userInfo.photo;
					if(ImgObj1.fileSize > 0 || (ImgObj1.width > 0 && ImgObj1.height > 0))
					{
						$scope.userImg = {'background-image':'url('+ImgObj1.src+')'};
					}
					switch ($scope.user.userInfo.user_type){
						case "0":
							$scope.user.userInfo.user_type_img="newappIcons-27.png";
							break;
						case "1":
							$scope.user.userInfo.user_type_img="newappIcons-28.png";
							break;
						case "2":
							$scope.user.userInfo.user_type_img="newappIcons-08.png";
							break;
						case "3":
							$scope.user.userInfo.user_type_img="newappIcons-21.png";
							break;
						case "9":
							$scope.user.userInfo.user_type_img="newappIcons-09.png";
							break;
					}

					//当前城市
					$scope.currentCity = {};
					// if(!$scope.currentCity.city_name)
					if($scope.user.userInfo.last_city){
						$scope.cityInfo = $scope.user.userInfo.last_city.split(',');
						$scope.currentCity.city_name = $scope.cityInfo[1];
						$scope.currentCity.city_official_code = $scope.cityInfo[0];
					}
					if (!$scope.currentCity.city_name || $scope.currentCity.city_name == "全国") {
						$scope.currentCity = {
							city_id: -1,
							city_name: "全国"
						}
					}

					//全国时为-1
					// $scope.currentStoreId = $scope.currentCity.city_id;

					$scope.getBannerDatas();

				}
			});
		}
		/**
		 * 初始化页面加载数据
		 */
		$scope.initLoadData = function() {
			$scope.getMineMessage();

		}

		$scope.initLoadData();

		/***********选择岛定位问题start************/
		$scope.getLocationInfo = function(targetLongitude,targetLatitude){
			// 百度地图根据经纬度获取省市区
			var new_point = new BMap.Point($rootScope.locationInfo.longitude,$rootScope.locationInfo.latitude);
			var gc = new BMap.Geocoder();
			gc.getLocation(new_point, function(rs){
				var addComp = rs.addressComponents;
				$rootScope.locationInfo.province = addComp.province;
				$rootScope.locationInfo.city = addComp.city;
				$rootScope.locationInfo.district = addComp.district;
				$rootScope.locationInfo.street = addComp.street;
				$rootScope.locationInfo.streetNumber = addComp.streetNumber;
			});
		}

		$scope.getAllPosition = function(){
			var data = {
				'accesstoken' : $scope.accesstoken,
				'longitude' : $rootScope.locationInfo.longitude,
				'latitude' : $rootScope.locationInfo.latitude,
				// 'longitude' : '104.072686',
				// 'latitude' : '30.555246',
				'sort': 'distance'
			}
			BusinessService.getAllPosition(data,function(response){
				if (response.statuscode == 1) {
					$scope.stores = response.data
					//所有城市
					var keyAllCity = [];
					var keyAllStore = [];
					//放入全国
					var cityObj = {
						city_name: '全国',
						city_official_code: ''
					}
					//放入所有岛
					var storeObj = {
						store_name: '所有岛',
						store_id: '',
						city_id:''
					}
					keyAllCity.push(cityObj);
					keyAllStore.push(storeObj)
					//处理数据
					for(var i = 0;i < $scope.stores.city.length;i++){
						$scope.stores.city[i].checked = false;
						for(var j = 0; j < $scope.stores.city[i].data.length;j++){
							// 如果没有获得经纬度，距离置空
							if ($scope.stores.city[i].data[j].distance) {
								// 距离大于一千米，显示单位km，
								if ($scope.stores.city[i].data[j].distance > 1000) {
									$scope.stores.city[i].data[j].distance = $scope.stores.city[i].data[j].distance/1000;
									$scope.stores.city[i].data[j].distance = $scope.stores.city[i].data[j].distance.toFixed(2) + "km";
								}
								// 小于一千米单位为m
								else{
									$scope.stores.city[i].data[j].distance = parseInt($scope.stores.city[i].data[j].distance) + "m";
								}
							}
							
							//处理所有岛
							var storeObj = {
								store_name: $scope.stores.city[i].data[j].store_name,
								store_id: $scope.stores.city[i].data[j].store_id,
								city_id: $scope.stores.city[i].data[j].city_id
							};
							keyAllStore.push(storeObj);
						}

						//处理所有城市
						var cityObj = {
							city_name: $scope.stores.city[i].city_name,
							city_official_code: $scope.stores.city[i].city_official_code
						};
						keyAllCity.push(cityObj);
					}
					// 存入所有的城市
					$localStorage.setObject(KEY_ALL_CITY, keyAllCity);
					// 存入所有的岛
					$localStorage.setObject(KEY_ALL_STORE, keyAllStore);
				}
			})
		}
		$scope.getAllPosition();

		$scope.$watch("locationInfo",function(newVal,oldVal){
			if (newVal != oldVal) {
				$scope.getLocationInfo()
				$scope.getAllPosition();
			}
		},true)

		/**
		 *城市选择弹出框
		 */
		$ionicModal.fromTemplateUrl('templates/business/business_modal_select_city.html', {
			scope: $scope,
			animation: 'slide-in-right'
		}).then(function(modal) {
			$scope.modal = modal;
		});

		/**
		 * 岛切换
		 */
		$scope.openModal = function(indexFrom) {
			$scope.indexFrom = indexFrom;
			$localStorage.indexFrom = indexFrom;
			$scope.modal.show();
		};

		/**
		 * 查看所有分岛事件
		 */
		$scope.openAllStoreModal = function() {
			$localStorage.indexFrom = 'index';
			$state.go('businessCitySelect');
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
		};

			//选择城市
		$scope.citySelect = function(index, cityName,i) {
			var city = {
				city_official_code: index,
				city_name: cityName
			}
			for(var j = 0;j < $scope.stores.city.length;j++){
				$scope.stores.city[j].checked = false;
			}
			if (cityName == '全国') {
				$scope.allChecked = true;
			}
			else{
				$scope.allChecked = false;
				$scope.stores.city[i].checked = true;
			}
			$localStorage.setObject(KEY_CITY_SELECT, city);
			$rootScope.initXSM(index);
			$scope.modal.hide();

			//设置最近选择城市
			var last_city = city.city_official_code + ',' + city.city_name;

			var data = {
				"accesstoken" : $scope.accesstoken,
				"last_city" : last_city
			}
			BusinessService.setMineInfo(data,function(response){
				if (response.statuscode != 1) {
					$CommonFactory.showAlert("操作失败");
				}

				//更新岛数据
				// $scope.currentStoreId = index;
				// $scope.currentCity.city_official_code = index;
				// $scope.currentCity.city_name = cityName;

				$scope.initLoadData();
			})
		}
		/***********选择岛定位问题end************/

		// 获取公告
		$scope.getNotice = function(){
			var data = {
				"accesstoken" : $scope.accesstoken
			}
			BusinessService.getNotice(data,function(response){
				$scope.notice = response.data;
				for(var i = 0;i < $scope.notice.length;i++){
					if ($scope.notice[i].comments.length > 30) {
						$scope.notice[i].agoComments = $scope.notice[i].comments.substring(0,20)
					}
				}
				$localStorage.setObject("notice",$scope.notice)
			})
		}

		// 获取岛内公告
		$scope.getStoreNotice = function(){
			var data = {
				"accesstoken" : $scope.accesstoken,
				"store_id" : $scope.currentStoreId
			}
			BusinessService.getNotice(data,function(response){
				$scope.storeNotice = response.data;
				$localStorage.setObject("storeNotice",$scope.storeNotice)
			})
		}

			$scope.notice={};
			$scope.clickNotice = function(n){
				$scope.notice.comments = n.comments;
				$scope.notice.cre_time = n.cre_time;
				$scope.openNoticeModal();
			}

			// 首页公告详情弹出框
			$ionicModal.fromTemplateUrl('templates/modal/notice_modal.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				$scope.noticeModal = modal;
			});
			$scope.openNoticeModal = function() {
				$scope.noticeModal.show();
			};
			$scope.closeNoticeModal = function() {
				$scope.noticeModal.hide();
			};


		$scope.openDoorMsg = function(){
			$cordovaToast.show("您当前没有可用的钥匙哦", "long", "center");
		}


		$scope.openDoorModal = function() {
			$scope.bluetoothScan();
			// $cordovaToast.show("滑动可切换钥匙哦", "long", "bottom");
		// 自定义弹窗
		var myPopup = $ionicPopup.show({
		template: "<ion-slide-box show-pager='false'>" +
					"<ion-slide ng-repeat='li in obj.bluetoothList' ng-if='li.meeting_room_dev_id' ng-click='openDoor(li)'>" +
						"<div class='m-t-15'>" +
							"<div class='stylie'>" +
								"<div class='stylie3'>" +
									"<div  class='stylie2 text-center'>" +
									"<div style='z-index:-1;'>" +
									"<h1 class='m-n color-blue m-t-10'><i class='icon-hiicons_key'></i></h1>" +
									"<h5 class='m-n'>{{li.store_name}}</h5>" +
									"<h5 class='m-n' ng-if='li.meeting_room_id && li.meeting_room_dev_id'>{{li.meeting_room_name}}</h5>" +
									"<h5 class='m-n' ng-if='li.door_id && li.meeting_room_dev_id'>{{li.door_name}}</h5>" +
									"<h6 class='m-n gray' ng-if='li.meeting_room_id && li.meeting_room_dev_id'>{{li.meeting_room_sn}}</h6>" +
									"<h6 class='m-n gray' ng-if='li.door_id && li.meeting_room_dev_id'>{{li.door_sn}}</h6>" +
								"</div>" +
									"</div>" +
								"</div>" +
								// "<div class='roundPiot'></div>" +
								// "<div class='roundPiot2'></div>" +
							"</div>" +
							"<h6 class='text-center' ng-if='li.password && li.meeting_room_id && li.meeting_room_dev_id'>开门密码：{{li.password}}</h6>" +
							"<h6 class='text-center' ng-if='li.door_id && li.meeting_room_dev_id && li.rssi == 0'>不在范围内</h6>" +
							"<h6 class='text-center' ng-if='li.door_id && li.meeting_room_dev_id && li.rssi != 0'>点击开门</h6>" +
						"</div>" +
					"</ion-slide>" +
				"</ion-slide-box>",
		title: '附近可用的开门钥匙',
		scope: $scope,
		cssClass: 'custom-popup',
		buttons: [
			{ text: '关闭' }
		]
		});
		myPopup.then(function(res) {
		console.log('Tapped!', res);
		});
		};



		$scope.disableSwipeSlide = function() {
			$ionicSlideBoxDelegate.$getByHandle('slideimgs').enableSlide(false);
		}
		$scope.enableSwipeSlide = function() {
			$ionicSlideBoxDelegate.$getByHandle('slideimgs').enableSlide(true);
		}


		// 首页可编辑区域弹出框
		$ionicModal.fromTemplateUrl('templates/modal/edit_modal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.editModal = modal;
		});
		$scope.openEditModal = function(u) {
			if (u != 3 && u != 9 && u != 0) {
				$CommonFactory.showAlert("该功能只有入驻会员和灵活会员才能自定义，请尽快升级哦")
				return;
			}
			$scope.editModal.show();
		};
		$scope.closeEditModal = function() {
			$scope.editModal.hide();
		};

		$scope.moveItem = function(item, fromIndex, toIndex) {
			$scope.user.userInfo.app_show.used.splice(fromIndex, 1);
			$scope.user.userInfo.app_show.used.splice(toIndex, 0, item);
		};

		$scope.onItemDelete = function(item) {
			$scope.user.userInfo.app_show.used.splice($scope.user.userInfo.app_show.used.indexOf(item), 1);
			$scope.user.userInfo.app_show.unused.push(item);
		};

		$scope.onItemAdd = function(item){
			$scope.user.userInfo.app_show.unused.splice($scope.user.userInfo.app_show.unused.indexOf(item), 1);
			$scope.user.userInfo.app_show.used.push(item);
		}

		$scope.save = function(){
			var data = {
				"accesstoken" : $scope.accesstoken,
				"app_show" : $scope.user.userInfo.app_show
			}
			BusinessService.setMineInfo(data,function(response){
				if (response.statuscode == 1) {
					$scope.closeEditModal();
				}
				else{
					$CommonFactory.showAlert("操作失败")
				}
			})
		}

        //待办事项
		$scope.getTodoDatas = function(){
			var data = {
				accesstoken: $scope.accesstoken,
			}
			BusinessService.todoData(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					$scope.TodoList = response.data;
				}
			});
		};

		//今日活动
		$scope.todayactList = [];
		$scope.dateTime = new Date();
		$scope.getTodayactDatas = function(){
			var data = {
				accesstoken: $scope.accesstoken,
				currentPage:'1',
				itemsPerPage: '3',
				latitude: latitude,
				longitude: longitude,
				store_id: $scope.currentStoreId,
				today: true
			}
			BusinessService.todayactData(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					$scope.todayactList = response.data;
				}
			});
		};

		$scope.goActivity = function(){
			$localStorage.SearchPage = 1;
			$localStorage.SearchListKeyword = "";
			$state.go('businessallposts');
		}


		//会议室预订
		$scope.meetingroomList = [];
		$scope.getMettingroomReserveDatas = function(){
			var data = {
				accesstoken: $scope.accesstoken,
				currentPage:1,
				itemsPerPage:3,
				lat:latitude,
				lon:longitude,
				room_type:1,
				//sortkey:distance
				//sortstatus:ASC,
				//status:0
				storeId:$scope.currentStoreId
			}
			BusinessService.getConferenceList(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					$scope.meetingroomList = response.data;
				}
			});
		};

		$scope.buy = function(i){
			if($rootScope.isGuest){
				// $CommonFactory.showAlert("大侠您好，该功能需登录查看");
				$state.go("login");
			}else{
			$localStorage.setObject("conference_item",i)
			$state.go("conferenceRoomBook");
			}
		}

		//获取推荐企业
		$scope.getCompanyDatas = function(){
			var data = {
				accesstoken: $scope.accesstoken,
				store_id: $scope.currentStoreId,
				currentPage: 1,
				itemsPerPage: 8
			}
			BusinessService.recommengDatas(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					$scope.recomCompanyList = response.data;
				}
			});
		};
		

		//天气
		$scope.getweather = function(){
			var data = {
				//'accesstoken' : $scope.accesstoken,
				// 'location' : '成都|北京|西安',
				// 'output': 'json',
				// 'ak': 'hG4ZFMiAYG7sLONGfSPC0fMNaYCQyGrX',
				'key' : 'jydpgwjkwxi3livd',
				'location': 'ip',
				'language': 'zh-Hans',
				'unit' : 'c',
				'start': '0',
				'days': '1',
			}
			BusinessService.getweather(data,function(response){
				$scope.weather = response.results[0];
				// console.log(response.results[0]);
			})
		}
		$scope.getweather();

		// start全

		//获取未读消息、今日会务
		$scope.getMsgCount = function(){
			var data = {
				accesstoken : $scope.accesstoken
			}
			BusinessService.getTodayOrders(data, function(response){
				if(response.statuscode != CODE_SUCCESS){
					return;
				}

				$scope.newMsgCount = response.data.unread_cnt;
				$scope.getTodayOrders = response.data.now_work;

			});
		}

		$scope.$on('$ionicView.afterEnter',function(){
			$scope.getMineMessage();
			$scope.notice = [];
			$scope,storeNotice = [];
			$scope.getStoreNotice();
			$scope.getNotice();
			$scope.getMsgCount();
			$scope.getTodoDatas();
			$scope.getTodayactDatas();
			$scope.getMettingroomReserveDatas();
			$scope.getCompanyDatas();
		});

		//游客查看全部企业
		$scope.seecom = function(){
			if($rootScope.isGuest){
				$state.go("login");
			}else{
				$state.go("companylist");
			}
		}
		// 游客查看活动
		// $scope.activity = function(i){

		// 		if($rootScope.isGuest){
		// 			$state.go('login');
		// 		}else{
		// 			// $state.go("activityitem({id:item.party_id})");
		// 			$state.go("activityitem",{id:$scope.party_id});
		// 		}
		// 	}
		// 游客查看今日会务
		$scope.mineorderslist = function(){
				if($rootScope.isGuest){
					$state.go('login');
				}else{
					$state.go('mineorderslist');
				}
			}
		// 游客点击头像
		$scope.personalmsg = function(){
				if($rootScope.isGuest){
					$state.go('login');
				}else{
					// $state.go("personalmsg({user_id:user.userInfo.id,com_id:user.userInfo.com_id})");
					// $state.go("personalmsg",{user_id:$scope.user.userInfo.id,com_id:$scope.user.userInfo.com_id});
					$state.go("profile");
				}
			}

			$scope.goApartment = function(){
				// $cordovaToast.show("暂未开放，敬请期待", "long", "center");
				// return;
				$scope.openXiaKeYuModal()
			}

					// 触发一个按钮点击，或一些其他目标
		$ionicModal.fromTemplateUrl('templates/modal/xiakeyu_modal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.xiaKeYuModal = modal;
		});
		$scope.openXiaKeYuModal = function() {
			$scope.xiaKeYuModal.show();
		};
		$scope.closeXiaKeYuModal = function() {
			$scope.xiaKeYuModal.hide();
		};
		var url = "http://59.110.7.58:8080/xiakeyu/app/1.0/www/#/homepage&accesstoken="+$scope.accesstoken;
		$sce: $scope.targetUrl = $sce.trustAsResourceUrl(url)


		//判断滚动条位置
		$scope.scrollTop = 0;
		$scope.getScrollTop = function () {
			$scope.scrollTop = $ionicScrollDelegate.getScrollPosition().top;
			$scope.$apply();//相当于手动刷新，没有加上的话，页面的scrollTop偶尔不同步，待研究
		}


		/**
		开门start
		**/
		$scope.$on("$ionicView.afterEnter", function(event, data){
		$ionicPlatform.ready(function() {
		//保存开门记录
		var saveOpenHistory = function(msg,li){
			var data = {
				'accesstoken' : accesstoken,
				'meeting_room_reserve_id' : li.meeting_room_reserve_id,
				'dev_reply_code' : msg.ret,
				'dev_key' : li.dev_key,
				'status' : msg.ret == '0' ? '0' : '1',
				'opt_type' : '1',//预约开门
				'dev_id' : li.meeting_room_dev_id
			};
			IntelligooService.saveOpenHistory(data);
		}

		//根据对数组排序的排序函
		function rssiSort(a,b) {
			return a.rssi - b.rssi;
		}

		//扫描蓝牙失败的回调函数
		var noBle = function() {
			$cordovaToast.show("蓝牙扫描失败-。-", "short", "center");
		}

		//将扫描到的蓝牙数据push进入数组---有则更新，无则放弃
		var listPush = function(device) {
			var len = $scope.obj.bluetoothList.length;
			var name = device.name + '';
			for (var i = 0; i < len; i++) {
				if ($scope.obj.bluetoothList[i].dev_mac == device.id || (name.indexOf($scope.obj.bluetoothList[i].dev_sn) > -1)) {
					$scope.obj.bluetoothList[i].rssi = device.rssi;
					//console.log(device.rssi);
					$scope.$apply();
				}
			}
			$scope.obj.bluetoothList.sort(rssiSort);
		};


			//扫描附件蓝牙
			$scope.bluetoothScan = function() {
				//$CommonFactory.showLoading();
				if (!bluetoothEnableFlag) {
					//$CommonFactory.hideLoading();
					$scope.bluetoothEnable();
					return false;
				}
				ble.scan([], 10, function(device) {
					listPush(device);
					//console.log(device);
				}, noBle);
				//$CommonFactory.hideLoading();
			}

			//开启蓝牙
			$scope.bluetoothEnable = function() {
				ble.isEnabled(
					function() {
						//蓝牙已开启
						bluetoothEnableFlag = true;
					},
					function() {
						//蓝牙未打开
						if ($rootScope.isIOS) {
							//ios无法直接开启蓝牙，弹出提示
							$cordovaToast.show("请手动打开蓝牙再开门哟~", "long", "center");
						} else {
							//安卓直接请求蓝牙开启
							ble.enable(
								function() {
									bluetoothEnableFlag = true;
								},
								function() {
									bluetoothEnableFlag = false;
									$cordovaToast.show("请打开蓝牙再试试开门哟~", "long", "center");
								}
							);
						}
					}
				);
			}

			var intelligoo = cordova.require('cordova.plugin.intelligoo');

			var doOpen = function(li){
				var data = {
					'devSn': li.dev_sn,
					'devMac': li.dev_mac,
					'devType': li.dev_type,
					'eKey': li.dev_key
				};
				intelligoo.openDoor(function(message){
					var msg = {};
					if (!message.hasOwnProperty('ret')) {
						msg.ret = message;
					} else {
						msg = message;
					}
					saveOpenHistory(msg,li);
					$CommonFactory.hideLoading();
					if (msg.ret == 0) {
						$cordovaToast.show("操作成功", "short", "center");
					} else {
						$cordovaToast.show("操作失败", "short", "center");
					}
				}, function(message){
					var msg = {};
					if (!message.hasOwnProperty('ret')) {
						msg.ret = message;
					} else {
						msg = message;
					}
					saveOpenHistory(msg,li);
					$CommonFactory.hideLoading();
					$cordovaToast.show("操作失败", "short", "center");
				}, data);
			}

			//开门
			$scope.openDoor = function(li) {
				if (li.password) {
					// $CommonFactory.showAlert("您的开门密码为：" + li.password);
					return true;
				}
				//是否开启蓝牙
				if (!bluetoothEnableFlag) {
					$CommonFactory.hideLoading();
					$scope.bluetoothEnable();
					return false;
				}
				//是否在信号范围内
				if (li.rssi == '0') {
					$CommonFactory.showAlert("蓝牙不在范围内，靠近ta再刷新试试");
					return false;
				}
				$CommonFactory.showLoadingWithAlert("处理中...");
				//是会议室预约---检查开门权限
				if (li.meeting_room_reserve_id) {
					var data1 = {
						'accesstoken': accesstoken,
						'id': li.meeting_room_reserve_id
					}
					IntelligooService.openRightsCheck(data1,function(response){
						if (response.statuscode == CODE_SUCCESS) {
							//调蓝牙插件
							doOpen(li);
						} else {
							//错误提示
							$CommonFactory.hideLoading();
							$CommonFactory.showAlert(response.message);
						}
					});
				} else if (li.door_id) {
					//是大门---直接开门
					doOpen(li);
				}
			};


		//将数组的key置为其中的一个属性
		var arrKey = function(arry){
			var temp = arry.length;
			if (temp) {
				for (var i = 0;i < temp; i++) {
					arry[i].rssi = 0;//默认不在蓝牙范围内
					$scope.obj.bluetoothList[i] = arry[i];
				}
			}
			$CommonFactory.hideLoading();
		}

		//从后台获取我的钥匙
		$scope.myKeys = function(){
			var data = {
				'accesstoken' : $scope.accesstoken,
				'lat' : $rootScope.locationInfo.latitude,
				'lon' : $rootScope.locationInfo.longitude
			};
			IntelligooService.myKeys (data,function(response){
				//console.log(response);
				if (response.statuscode == CODE_SUCCESS) {
					for(var i = 0;i < response.data.length;i++){
						if (response.data[i].meeting_room_dev_id) {
							$scope.openButtonShow = true;
							break;
						}
					}
					var list1 = [];
					list1 = response.data;
					arrKey(list1);
				}
			});
		}

		//页面回退按钮
		$scope.myGoBack = function() {
			if ($state.params.from && $state.params.from == 'confirmOrder') {
				$state.go('tab.business');
			} else {
				$ionicHistory.goBack();
			}
		};

		//点选 会议室，大门
		$scope.chooseTab = function(tab) {
			$scope.tab = tab;
			$localStorage.set($state.current.name,tab);
		}

		//刷新页面
		$scope.pageReload = function () {
			$state.reload();
		}

		//离开时 删除localStorage数据
		$scope.$on('$ionicView.beforeLeave', function(){
			$localStorage.removeItem($state.current.name);
		});

		$scope.myKeys();

		// $scope.bluetoothEnable();

		// $CommonFactory.showLoadingWithAlert("处理中...");

		$rootScope.reloadPosition();
		});
})
		/**
		开门end
		**/









	}
]);
