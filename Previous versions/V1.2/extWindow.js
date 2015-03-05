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
			//Selected tab id
			tab.id,
			//Params inside a object data
			{callFunction: "toggleSidebar"}, 
			//Optional callback function
			function(response) {
				console.log(response);
			}
		);/*
		if(!contextAdded){
			chrome.contextMenus.create({"title": "Test item", "onclick": function(e) {
				CallSomething(e);
			}});
			
			contextAdded = true;
		}*/
	});
});
console.log( 'Background.html done.' );


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		    console.log(sender.tab ?
		                "from a content script:" + sender.tab.url :
		                "from the extension");
		    if(request.method == "getLocalStorage"){
		    	sendResponse({data: localStorage[request.key]});
		    }
		    if(request.method == "getLocalStorageLinks"){
		    	sendResponse({data: localStorage[request.key]});
		    }
		    if(request.method == "storeLocalStorage"){
		    	localStorage[request.key] = request.value;
		    	sendResponse({message: "Stored"});
		    	
		    	
		    	
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


function doSomething(){
	console.log("checking");
}