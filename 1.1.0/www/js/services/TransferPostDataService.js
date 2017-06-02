app.service('TransferPostDataService',function(){
	var article = null;
	var deliveredProduct = null;
	var topic = null; //话题对象

	var setArticle  = function (passedarticle) {
		article = passedarticle;
	};

	var getArticle = function (){
		return article;
	};

	var setDeliveredProduct  = function (product) {
		deliveredProduct = product;
	};

	var getDeliveredProduct = function (){
		return deliveredProduct;
	};

	var getTopic = function (){
		return topic;
	};

	var setTopic  = function (topicArg) {
		topic = topicArg;
	};


	return {
		setArticle: setArticle,
		getArticle: getArticle,
		setDeliveredProduct : setDeliveredProduct,
		getDeliveredProduct : getDeliveredProduct,
		getTopic : getTopic,
		setTopic : setTopic
	}

});