/**
 * 公共请求服务
 */
 app.factory('CommonService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		//登陆
		login : {
			method : 'POST',
			url : $window.platformServer + "users/login",
			params : {
				// uname: '@uname',
				// verify_code: '@verify_code'
			}
		},
		//登出
		logout : {
			method : 'POST',
			url : $window.platformServer + "users/logout",
			params : {
			}
		},
		
		//获取公用路径
		commonDatas : {
			method : 'GET',
			url : $window.platformServer + "common-datas",
		},
		// 注册
		register: {
			method:'POST',
			url : $window.platformServer + "users/register",
			params : {
				
			}
		},
		// 获取验证码
		smsCode: {
			method:'GET',
			url : $window.platformServer + "tokens/get-verify-code?mobile=:mobile",
			params : {
				mobile:'@mobile'
			}
		},
		//校验手机号
		checkPhone: {
			method : 'GET',
			url : $window.platformServer + "tokens/check",
			params : {
				uname: '@uname'
			}
		},
		// 校验验证码
		smsCodeCheck: {
			method:'GET',
			url : $window.platformServer + "tokens/check-verify-code?uname=:uname"
		},
		// 找回密码
		forgotPwd :  {
			method : 'POST',
			url  :  $window.platformServer + "tokens/forget-pwd",
			params  :  {
				uname : '@uname',
				pwd : '@pwd',
				verify_code : '@verify_code'
			}
		},
		// 修改密码
		updetePwd :  {
			method : 'POST',
			url  :  $window.platformServer + "user-datas/setting",
			params  :  {
				accesstoken : '@accesstoken'
			}
		},
		//选择公司生成token
		getTokenByUserTokenAndComId : {
			method : 'GET',
			url : $window.platformServer + "tokens/get-token-by-user-token-and-com-id?accesstoken=:accesstoken&comid=:comid",
			params : {
				accesstoken: "@accesstoken",
				comid: "@comid"
			}
		},
		//获取我的公司列表
		companyMine : {
			method : 'GET',
			url : $window.platformServer + "company-datas/mine-com-list?accesstoken=:accesstoken"
		},
		//获取国省市的信息
		areaList : {
			method : 'GET',
			url : $window.platformServer + "commons/area-list?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		}
	})
}]);