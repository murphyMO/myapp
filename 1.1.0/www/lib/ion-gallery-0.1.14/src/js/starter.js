angular
 .module('starter', ['ionic','ion-gallery']);

angular
 .module('starter').controller('AController',['$scope',function($scope){
 	$scope.items = [
 		{
 		    src:'src/img/1.jpg',
 		    sub: 'This is a <b>subtitle</b>'
 		  },
 		  {
 		    src:'src/img/2.jpg',
 		    sub: '' /* Not showed */
 		  },
 		  {
 		    src:'src/img/3.jpg'
 		  },
 		  {
 		    src:'src/img/4.jpg'
 		  },
 		  {
 		    src:'src/img/5.jpg'
 		  },
 		  {
 		    src:'src/img/6.jpg'
 		  },
 		  {
 		    src:'src/img/7.jpg'
 		  },
 		  {
 		    src:'http://img1d.xgo-img.com.cn/pics/1485/1484499.jpg',
 		    thumb:'src/img/8.jpg'
 		  }

 	];
 	$scope.items1 = [
 		{
 		    src:'src/img/1.jpg',
 		    sub: 'This is a <b>subtitle</b>'
 		  },
 		  {
 		    src:'src/img/2.jpg',
 		    sub: '' /* Not showed */
 		  },
 		  {
 		    src:'src/img/3.jpg'
 		  }

 	];
 }]);