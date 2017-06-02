/**
 * 门禁控制器
 */
app.controller('IntelligooController', 
	['$scope', '$rootScope', '$localStorage', '$timeout', '$cordovaToast', '$CommonFactory', '$ionicHistory','$ionicPlatform','IntelligooService','$state','$ionicModal',
	function ($scope, $rootScope, $localStorage, $timeout, $cordovaToast, $CommonFactory, $ionicHistory,$ionicPlatform,IntelligooService,$state,$ionicModal) {
		var userObj = $rootScope.getCurrentUser();
		var accesstoken = $rootScope.getAccessToken();
		var bluetoothEnableFlag = false;//默认蓝牙未开启
		$scope.obj = {};
		$scope.obj.bluetoothList = [];//从后台获取的蓝牙列表
		var deviceArray = [];//扫描到的蓝牙列表

		//初始化tab
		var localTab = $localStorage.get($state.current.name,1);
		$scope.tab = localTab;

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
			var name = device.name ? (device.name + '') : '';
			var len = $scope.obj.bluetoothList.length;
			device.id = device.id ? device.id : name;
			for (var i = 0; i < len; i++) {
				// console.log(device.id.indexOf($scope.obj.bluetoothList[i].dev_mac));
				// console.log((name.indexOf($scope.obj.bluetoothList[i].dev_sn) > -1));
				if ((device.id.indexOf($scope.obj.bluetoothList[i].dev_mac) > -1) || (name.indexOf($scope.obj.bluetoothList[i].dev_sn) > -1)) {
					$scope.obj.bluetoothList[i].rssi = device.rssi;
					$scope.$apply();
				}
			}
			// console.log(device.id);
			// console.log($scope.obj.bluetoothList);
			$scope.obj.bluetoothList.sort(rssiSort);
		};

		$ionicPlatform.ready(function() {
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

			var Zelkova = cordova.require('cordova.plugin.zelkova');
			var intelligoo = cordova.require('cordova.plugin.intelligoo');

			//开门
			$scope.openDoor = function(li) {
				//密码开门
				if (li.meeting_room_zmy_dev_id) {
					$CommonFactory.showLoading();
					var data = {
						accesstoken : accesstoken,
						id : li.meeting_room_zmy_dev_id
					}
					IntelligooService.lockOpenDoor(data,function(response){
						$CommonFactory.hideLoading();
						if (response.statuscode == CODE_SUCCESS) {
							// $scope.toMenu(response.data.password);
							$CommonFactory.showAlert(response.message + ",请点击门锁面板。'滴'声后即可开门");
						} else {
							$CommonFactory.showAlert(response.message + "，请稍后再试");
						}
					});
					return true;
				} else if(li.keyid) {
					// 榉树蓝牙开门
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
					$CommonFactory.showLoading();

					var data = {
						macAddress : li.dev_mac,
						openCmdStr : li.key.substring(48)
					};
					Zelkova.openDoor(data,function(success){
						$CommonFactory.hideLoading();
						if (success.hasOwnProperty('ret') && success.ret == 0) {
							$cordovaToast.show("操作成功", "short", "center");
						} else {
							$cordovaToast.show("操作失败", "short", "center");
						}
					},function(error){
						$CommonFactory.hideLoading();
						if (error.hasOwnProperty('ret') && error.ret == 0) {
							$cordovaToast.show("操作成功", "short", "center");
						} else {
							$cordovaToast.show("操作失败", "short", "center");
						}
					});
					return true;
				}
				//智果蓝牙开门
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
				//调蓝牙插件
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
				}, function(msg){
					saveOpenHistory(msg,li);
					$CommonFactory.hideLoading();
					$cordovaToast.show("操作失败", "short", "center");
				}, data);
			};
		});

		//将数组的key置为其中的一个属性
		var arrKey = function(arry){
			var temp = arry.length;
			if (temp) {
				for (var i = 0;i < temp; i++) {
					arry[i].rssi = 0;//默认不在蓝牙范围内
					$scope.obj.bluetoothList[i] = arry[i];
				}
				$timeout(function(){
					$scope.bluetoothScan();
				},100);
			}
			$CommonFactory.hideLoading();
		}

		//从后台获取我的钥匙
		$scope.myKeys = function(){
			var data = {
				'accesstoken' : accesstoken,
				'lat' : $rootScope.locationInfo.latitude,
				'lon' : $rootScope.locationInfo.longitude
			};
			IntelligooService.myKeys (data,function(response){
				//console.log(response);
				if (response.statuscode == CODE_SUCCESS) {
					var list1 = [];
					list1 = response.data;
					arrKey(list1);
				}
			});
		}

		//页面回退按钮
		$scope.myGoBack = function() {
			window.history.back();
		};

		//离开时 删除localStorage数据
		$scope.$on('$ionicView.beforeLeave', function(){
			$localStorage.removeItem($state.current.name);
		});

		//点选 会议室，大门
		$scope.chooseTab = function(tab) {
			$scope.tab = tab;
			$localStorage.set($state.current.name,tab);
		}

		//刷新页面
		$scope.pageReload = function () {
			$state.reload();
		}

		$scope.myKeys();

		$scope.bluetoothEnable();

		$CommonFactory.showLoadingWithAlert("处理中...");

		//展示模态框
		$scope.toMenu = function (li) {
			$scope.modal.show();
			$scope.passwords = li;
		}

		//关闭模态框
		$rootScope.closeModal = function () {
			$scope.modal.hide();
		}

		//模态框
		$ionicModal.fromTemplateUrl('templates/modal/password_list.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.modal = modal;
		});

	}]);