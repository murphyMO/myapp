/**
 * 部门服务
 */
app.factory('HomeService', ['$resource', '$window', function($resource, $window) {
    return $resource('', {}, {
        getHomewDatas: {
            method:'GET',
            url:  $window.platformServer + 'home-datas'
        }
    })
}]);