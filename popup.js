$(function(){
	$('.save-btn').click(save);
	$('.load-btn').click(load);
	$('.search-btn').click(search);
});

var paint = function() {
	chrome.tabs.executeScript({
		code:'var prev = document.getElementById(\'page-marker\');'+
			'if(prev != null){prev.remove();}'+ 
			
			'var div = document.createElement(\"div\");'+
			'div.style.width = (window.innerWidth * 2/100) +\"px\";'+ 
			'var pointerHeight = ((window.innerHeight / (document.body.scrollHeight / window.innerHeight)) - 9);'+
			'div.style.height = (pointerHeight >= 15.5 ? pointerHeight: 15.5) +\"px\";'+			
			'div.style.background = \"green\";'+	
			
			'div.style.position = \"fixed\";'+
			'div.style.marginLeft = (window.innerWidth - 18.3 )+\"px\";'+   
			'div.style.top = window.pageYOffset / window.innerHeight * pointerHeight + 21 +\"px\";'+
			'div.id = \"page-marker\";'+ 
			'document.body.appendChild(div);'
	});
};

var save = function() {
	
	chrome.tabs.executeScript({
		code:'localStorage.setItem(window.location.href,window.pageYOffset);'
	});
	paint();
	
	
	
};
var search = function(){
	
	var object = {text: ''};
	chrome.history.search(object, sendUrls);	
	// alert('afterSerach');
}

var sendUrls = function(historyItem){
	var urls = [];

	historyItem.forEach(function(element) {
	    console.log(element.url);
	    urls.push(element.url); 
	});
	console.log(urls);
	// historyItem.foreach(function(value){
	// 	console.log(value.url);
	// });
	
	//console.log('return urls');

	//console.log(historyItem); 
	// alert(historyItem);
}

 var load = function() { 
	 chrome.tabs.executeScript({
		code: 'window.scroll(0, localStorage.getItem(window.location.href));'
	});
	
	
};
