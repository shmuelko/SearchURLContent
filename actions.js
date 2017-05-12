$(function(){
	$('.save-btn').click(save());
	$('.load-btn').click(load());
});

var save = function() {
	console.log('Hello');
	localStorage.scrollY = window.pageYOffset;
	
};
 
 var load = function() { 
	window.scroll(0, localStorage.scrollY);
	console.log('Boo');
};