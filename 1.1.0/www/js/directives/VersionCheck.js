/**
 * 版本更新 方法类
 */
angular.module('VersionCheck',[])
.service('versionFactory', function($localStorage,$rootScope,$CommonFactory,$ionicPopup,$cordovaFileTransfer,$cordovaFileOpener2,$ionicLoading,$cordovaAppVersion,$timeout,$cordovaToast,$cordovaInAppBrowser) {
	var service = {
		//检查更新
		checkUpdate : function(latest,type,isShow) {
			//安卓手机
			if (type == 1) {
				$cordovaAppVersion.getVersionNumber().then(function (version) {
					//如果本地与服务端的APP版本不符合
					if (version < latest.versioncode) {
						var confirmPopup = $ionicPopup.confirm({
							title: '版本升级~' + latest.versioncode,
							cancelText: '取消',
							template: latest.content,
							okText: '升级'
						});
						confirmPopup.then(function (res) {
							if (res) {
								$ionicLoading.show({
									template: "已经下载：0%"
								});
								var url = latest.downloadurl; //可以从服务端获取更新APP的路径
								var targetPath = cordova.file.externalApplicationStorageDirectory + "hicoffice_" + latest.versioncode + ".apk";
								var trustHosts = true;
								var options = {};
								$cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
									// 打开下载下来的APP
									$cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive'
									).then(function () {
											// 成功
										}, function (err) {
											// 错误
										});
									$ionicLoading.hide();
								}, function (err) {
									$ionicLoading.show({template: '下载失败！', noBackdrop: true, duration: 2000});
								}, function (progress) {
									//进度，这里使用文字显示下载百分比
									$timeout(function () {
										var downloadProgress = (progress.loaded / progress.total) * 100;
										$ionicLoading.show({
											template: "已经下载：" + Math.floor(downloadProgress) + "%"
										});
										if (downloadProgress > 99) {
											$ionicLoading.hide();
										}
									})
								});
							} else {
								// 取消更新--退出app
								$rootScope.exit();
							}
						});
					} else {
						if (isShow) {
							$cordovaToast.show("已是最新版本", "long", "center")
								.then(function(success) {
								// success
								}, function (error) {
								// error
							});
						}
					}
				});
			} else {
				//ios手机 TODO
				var options = {
					location: 'no',
					clearcache: 'yes',
					toolbar: 'no'
				};
				$cordovaInAppBrowser.open("https://itunes.apple.com/cn/app/xia-ke-dao-li/id1131508365?mt=8", '_system', options)
				.then(function(event) {
					// success
				})
				.catch(function(event) {
					// error
					$cordovaToast.show(event, "long", "center")
					.then(function(success) {
					// success
					}, function (error) {
					// error
					});
				});
			}
		},
		//是否有新版本
		isNewVersion : function(versioncode){
			$cordovaAppVersion.getVersionNumber().then(function (version) {
				$rootScope.thisVersion = version;
				//如果本地与服务端的APP版本不符合
				if (version < versioncode) {
					$rootScope.isNewVersion = true;
				} else {
					$rootScope.isNewVersion = false;
				}
			});
		},
	};
	return service;

});