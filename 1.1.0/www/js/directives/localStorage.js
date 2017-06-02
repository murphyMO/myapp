/**
 * localStorage 存储类
 */
angular.module('$localStorage',[])
.factory('$localStorage', ['$window', function($window) {
	return {
		set: function(key, value) {
			$window.localStorage.setItem(key,value);
		},
		get: function(key, defaultValue) {
			return $window.localStorage.getItem(key) || defaultValue;
		},
		setObject: function(key, value) {
			$window.localStorage.setItem(key,JSON.stringify(value));
		},
		getObject: function(key) {
			return JSON.parse($window.localStorage.getItem(key) || '{}');
		},
		removeItem: function(key) {
			$window.localStorage.removeItem(key);
		},
		removeAll: function() {
			$window.localStorage.clear();
		}
	}
}]);