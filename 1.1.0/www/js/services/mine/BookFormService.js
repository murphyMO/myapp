/**
 * 我的手机端
 */
app.factory('BookFormService', ['$resource', '$window', function($resource, $window) {
    return $resource('', {}, {
        bookForm:{
            method:'POST',
            url:$window.platformServer + "register-cooperation-datas?accesstoken=:accesstoken",
            params : {
                accesstoken: "@accesstoken"
            }
        }
    })
}]);
