/**
 * 我的手机端
 */
app.factory('MineService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
        //个人信息
        user: {
            method: 'GET',
            url: $window.platformServer + "users/current-user",
            params: {
            }
        },
        like: {
            method: 'GET',
            url: $window.platformServer + "users/current-user-likes",
            params: {
            }
        },
		topic: {
            method: 'GET',
            url: $window.platformServer + "users/current-user-topics",
            params: {
            }
        },
        // 关注
        focus: {
            method: 'GET',
            url: $window.platformServer + "users/current-user-focus",
            params: {
            }
        },
        // 粉丝
        follow: {
            method: 'GET',
            url: $window.platformServer + "users/current-user-follow",
            params: {
            }
        },
         // 编辑
        eidtUser: {
            method: 'POST',
            url: $window.platformServer + "users/current-user-edit",
            params: {
            }
        },


    })
}]);
