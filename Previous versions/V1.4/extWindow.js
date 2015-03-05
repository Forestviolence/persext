console.log( 'Background.html starting!' );
//Put page action icon on all tabs
chrome.tabs.onUpdated.addListener(function(tabId) {
	
	chrome.pageAction.show(tabId);
	
	
});

chrome.tabs.getSelected(null, function(tab) {
	chrome.pageAction.show(tab.id);
});
//var contextAdded = false;
	
//Send request to current tab when page action is clicked
chrome.pageAction.onClicked.addListener(function(tab) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(
			tab.id,
			{callFunction: "toggleSidebar"}, 
			function(response) {
				console.log(response);
			}
		);
	});
});
console.log( 'Background.html done.' );


// logs have the key: recentLog
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		    console.log(sender.tab ?
		                "from a content script:" + sender.tab.url :
		                "from the extension");
		    if(request.method == "getLocalStorage"){
//		    	use this to reset log;
//		    	localStorage["recentLog"] = JSON.stringify(["http://www.reddit.com/r/Leagueoflegends"]);
		    	sendResponse({data: localStorage[request.key]});
		    }
		    if(request.method == "getLocalStorageLinks"){
		    	sendResponse({data: localStorage[request.key]});
		    }
		    if(request.method == "getLocalStorageLogs"){
		    	sendResponse({data: localStorage[request.key]});
		    }
		    if(request.method == "storeLocalStorage"){
		    	localStorage[request.key] = request.value;
		    	sendResponse({message: "Stored"});
		    	
		    }
		    if(request.method == "storeLocalStorageMeta"){
		    	var metakey = "meta" + request.key;
		    	if(!localStorage[request.key]){
		    		localStorage[request.key] = JSON.stringify([]);
		    	}
		    	if(!localStorage[metakey]){
		    		localStorage[metakey] = JSON.stringify([]);
		    	}
		    	localStorage[request.key] == request.value;
		    	
		    	localStorage[metakey] == request.meta;
		    	sendResponse({message: "Stored META"});
		    	
		    }
		    
		    if(request.method == "getLocalStorageMeta"){
		    	var metakey = "meta" + request.key;
		    	if(!localStorage[request.key]){
		    		localStorage[request.key] = JSON.stringify([]);
		    	}
		    	if(!localStorage[metakey]){
		    		localStorage[metakey] = JSON.stringify([]);
		    	}
		    	sendResponse({data: localStorage[request.key], meta: localStorage[metakey]});
		    }
		    if(request.method == "addToDomLog"){
		    	if(!localStorage[request.key]){
		    		localStorage[request.key] = JSON.stringify([]);
		    	}
		    	var log = JSON.parse(localStorage[request.key]);
		    	if(log.indexOf(request.value) == -1){
		    		log.push(request.value);
		    		while(log.length > 3){
			    		log.splice(0,1);
			    	}
			    	localStorage[request.key] = JSON.stringify(log);
		    	}
		    	sendResponse({data: localStorage[request.key]});
		    }
		    if(request.method == "addToLog"){
		    	localStorage["recentLog"] = request.value;
		    	sendResponse({data: localStorage["recentLog"]});
		    
		    }
		  });

function CallSomething(e){
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(
				//Selected tab id
				tab.id,
				//Params inside a object data
				{callFunction: "addThisButton", object: e}, 
				//Optional callback function
				function(response) {
					console.log(response);
				}
				
		);
	});
}
