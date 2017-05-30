window.onload = function(){
	document.getElementById('search-val').addEventListener('keypress', search, false);
}

var search = function(event){
	if(event.keyCode == 13){
		chrome.history.search({text: ''}, sendUrls);
	}
} 

var sendUrls = function(historyItem){
	var urls = [];
	for(var i = 0; i < historyItem.length; i++){
		urls.push(element.url); 
	}
	sendUrls(urls);
}

var sendUrls = function(urls){ 

	var data = {
		query: document.getElementById('search-val').value,
		urls: urls
	} 
	data = JSON.stringify(data);

	console.log('data');
	console.log(data);

	var myRequest = new Request('http://fathomless-tundra-65369.herokuapp.com/', {method: 'POST', body: data});

	fetch(myRequest)
	    .then(function(response) {
	        if(response.status == 200){
	        	document.getElementById('output').innerHTML = response.url;
	        	return response;
	        } 
	        else throw new Error('Something went wrong on api server!');
	    })
	    .then(function(response) {
	        console.debug(response);
	    })
	    .catch(function(error) {
	        console.error(error);
		})
}
