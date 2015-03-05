
//document.getElementById("mybutton").setAttribute("value","asdfasdf");

document.addEventListener('DOMContentLoaded', function () {
	  main();
	});

function clickHandler(e) {
	  alert("works, insert something here");
}

function main(){
	
	var windowid;
	
	
	chrome.windows.getCurrent(function(wind) {
		console.log(window.screenX);
		windowid = window.screenX;
	});
	//find the logg button for starters
	chrome.windows.onFocusChanged.addListener(extFocusChange(windowId))
//		chrome.tabs.executeScript({
//			code: 'document.body.style.backgroundColor="red"'
//		chrome.windows.get(windowId, function(wind){
		
		/*
			console.log("was here");
			
			
			
			var bttn = wind.tabs[0].document.createElement("BUTTON");
			  
			var tt = wind.tabs[0].document.createTextNode("Logout");
			
			bttn.appendChild(t);
			wind.tabs[0].document.body.appendChild(bttn);		*/
//			});
//	});

	var btn = document.createElement("BUTTON");
	  
	var t = document.createTextNode("Logout");
	  
	btn.appendChild(t);
	  
	document.body.appendChild(btn);
	  
	  
	btn.addEventListener('click', clickHandler);
}

function extFocusChange(windowId){
	console.log("was here");
	
	
	
	var bttn = wind.tabs[0].document.createElement("BUTTON");
	  
	var tt = wind.tabs[0].document.createTextNode("Logout");
	
	bttn.appendChild(t);
	wind.tabs[0].document.body.appendChild(bttn);	
}

