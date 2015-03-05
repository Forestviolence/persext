
var started = false;
//var extWindow;
if(!started){
	started = true;
	chrome.windows.getCurrent(function(wind) {
		

		var maxWidth = window.screen.availWidth;
		var maxHeight = window.screen.availHeight;
		var updateInfo = {//change to the other 2 after a while.
		    left: window.screen.availWidth/2,//200,
		    top: 0,
		    width: window.screen.availWidth/2,//maxWidth - 200,
		    height: maxHeight
		};
		chrome.windows.update(wind.id, updateInfo);
	});
	window.open("extWindow.html", "", "width=200, height=" + window.screen.availHeight);
	
}


