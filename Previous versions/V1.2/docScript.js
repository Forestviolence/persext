var logoutVersions = ["logg ut", "logout", "log off", "logg av", "log out", "sign out", "sign off"];


//Handle requests from extWindow.html
function handleRequest(request, 
	sender, sendResponse
	) {
	if (request.callFunction == "toggleSidebar")
		toggleSidebar();
	if (request.callFunction == "addThisButton"){
		AddThisButton(request.object);
	}
}
chrome.extension.onRequest.addListener(handleRequest);


var clickedOnce = false;
var oldBGColor = null;
var elementInQuestion = null;
var addedButtonsNR = 0;
var addedButtonsList = [];
var addedLinks = [];

var Style = function(element){
	if(element.nodeName == "A"){
		element.setAttribute('style', "background: #ddd; border-style: outset; border-width: 5px; font-variant: normal; border-color: #f1f1f1; color: #111111; font-family: \"Arial\"; padding: 5px 5px; margin: 10px 5px;");
		element.addEventListener('mouseover', onMouseOverButton); 
		element.addEventListener('mouseout', onMouseOutButton);
	}
	else if(element.nodeName == "H1"){
		element.setAttribute('style', "color: black; text-align: center; font-size: 20px; font-family: \"Arial\"; font-weight: normal; padding: 10px 10px; margin: 15px 10px;");
	}
	else if(element.nodeName == "BUTTON"){
		element.setAttribute('style', "background: #ddd; border-style: outset; border-width: 5px; border-color: #f1f1f1; color: #111111; font-family: \"Arial\"; padding: 5px 5px; margin: 10px 5px;");
		element.addEventListener('mouseover', onMouseOverButton); 
		element.addEventListener('mouseout', onMouseOutButton);
	}
	
}



var rightclicked_item = null;
if (document.body) {
  document.body.addEventListener("contextmenu", function(e) {
    rightclicked_item = e.srcElement;
  });
  document.body.addEventListener("click", function() {
    rightclicked_item = null;
  });
}


var sidebarOpen = false;
var sidebarHidden = false;
function toggleSidebar() {
	if(sidebarOpen && !sidebarHidden) {
		var el = document.getElementById('extSidebar');
		el.style.visibility="hidden";
		//el.parentNode.removeChild(el);
		//document.removeEventListener('keypress', KeyDownPress);
		sidebarHidden = true;
	}
	else if (!sidebarOpen) {
		console.log("Building");
		
		
		
		var sidebar = document.createElement('div');
		sidebar.id = "extSidebar";
		sidebar.style.cssText = "\
			position:fixed;\
			top:0px;\
			left:0px;\
			width:20%;\
			height:100%;\
			background:white;\
			box-shadow:inset 0 0 1em black;\
			z-index:99999999999999;\
		";
		
		
		
		var header = document.createElement('h1');
		header.innerHTML = "Header";
		Style(header);
		sidebar.appendChild(header);
		
		var logoutbutton = document.createElement('button');
		logoutbutton.id = "extSidebarLogoutButton";
		logoutbutton.innerHTML = "Log out from " + document.domain;
		Style(logoutbutton);
		sidebar.appendChild(logoutbutton);
		
		document.body.appendChild(sidebar);
		
		sidebarOpen = true;
		
		logoutbutton.addEventListener('click', LogoutStart);
		document.addEventListener('keypress', KeyDownPress);
		
		var eabtn = document.createElement('button');
		eabtn.id = " extSidebarAddButton";
		eabtn.innerHTML = "Click to add button";
		Style(eabtn);
		sidebar.appendChild(eabtn);
		
		var cont = document.createElement('div');
		cont.id ="extSidebarCustomButtonContainer";
		Style(cont);
		sidebar.appendChild(cont);
		
		var remv = document.createElement('button');
		remv.id = "extSidebarRemoveElement";
		remv.innerHTML = "Click to remove a element";
		Style(remv);
		
		eabtn.addEventListener('click', AddThisButtonStart);
		//document.getElementById("extSidebarRemoveElement").addEventListener('click', RemoveNextClickedElement);
		
		
		LoadLinks();
		
	
	}
	else if (sidebarHidden && sidebarOpen){
		
		document.getElementById('extSidebar').style.visibility="visible";
		
		
		sidebarHidden = false;
		
	}
}

var StoreButtons = function(){
	//var container = document.getElementById("extSidebarCustomButtonContainer");
	// this is just to test if storage works
	
	var thingsToStore = ["item nr 0", "item nr 1", "item nr 2"];
	
	var keyy = "TestingStorageFunction";
	
	var storeThis = JSON.stringify(thingsToStore);
	
	chrome.runtime.sendMessage({method: "storeLocalStorage", key: keyy, value: storeThis}, function(response){
		console.log(response.message)
	});
	
	/*
	chrome.storage.sync.set({key: storeThis}, function() {
		
		message('something saved');
	});
	
	/*
	if(addedButtonsList.length > 0){
		console.log("was here");
		var buttons = JSON.stringify(addedButtonsList);
		var key = "buttons" + document.URL;
	
		chrome.storage.sync.set({key: buttons}, function() {
			console.log("stored successfully");
			// Notify that we saved.
			message('something saved');
		});
	}*/
	
	
}
var LoadButtons = function(){
	
	var keyy = "TestingStorageFunction";
	
	chrome.runtime.sendMessage({method: "getLocalStorage", key: keyy}, function(response){
		console.log(response.data);
	})
	
	/*
	var key = "buttons" + document.URL;
	var buttons = chrome.storage.get(function(items){
		console.log(items);
		
	});*/
}

var AddThisButtonStart = function(e){
	e.srcElement.innerHTML = "Click on the button to add";
	document.addEventListener('click', AddThisButtonEnd);
	document.addEventListener('mouseover', onMouseOverAddButton); 
	document.addEventListener('mouseout', onMouseOutAddButton);
	clickedOnce = false;
	
};
var onMouseOverButton = function(e){
	
	e.toElement.style.borderStyle = "inset";
}
var onMouseOutButton = function(e){
	e.fromElement.style.borderStyle = "outset";
}

var onMouseOverAddButton = function(e){
	
	oldBGColor = e.toElement.style.backgroundColor;
	e.toElement.style.backgroundColor = "#FDFF47";
}
var onMouseOutAddButton = function(e){
	e.fromElement.style.backgroundColor = oldBGColor;
}
var onMouseOverCustomButton = function(e){
	
	
	oldBGColor = addedButtonsList[parseInt(e.srcElement.id.replace("addedButton", ""))].style.backgroundColor;
	addedButtonsList[parseInt(e.srcElement.id.replace("addedButton", ""))].style.backgroundColor = "#FDFF47";
}
var onMouseOutCustomButton = function(e){
	addedButtonsList[parseInt(e.srcElement.id.replace("addedButton", ""))].style.backgroundColor = oldBGColor;
}
// see below
var RemoveNextClickedElement = function(e){
	document.addEventListener('click', RemoveElement); 
	document.addEventListener('mouseover', onMouseOverAddButton); 
	document.addEventListener('mouseout', onMouseOutAddButton);
	clickedOnce = false;
}
// fucks up somehow, working on fix
var RemoveElement = function(e){
	if(clickedOnce){
		document.removeEventListener('click', AddThisButtonEnd);
		e.preventDefault();
		console.log(e);
		document.removeEventListener('mouseover', onMouseOverAddButton); 
		document.removeEventListener('mouseout', onMouseOutAddButton);
		
		if(e.toElement.id.indexOf("addedButton") > -1){
			console.log("was here");
			
			addedButtonsList.splice(parseInt(e.toElement.id.replace("addedButton", "")), 1);
			for(i = 0;i<addedButtonsList.length;i++){
				document.getElementById("addedButton" + i).addEventListener('click', AddedButtonClickEventSimulate);
				document.getElementById("addedButton" + i).addEventListener('mouseover', onMouseOverCustomButton); 
				document.getElementById("addedButton" + i).addEventListener('mouseout', onMouseOutCustomButton);
				
			}
		}
		

		e.toElement.remove();
		
		
		
		clickedOnce = false;
	}
	else {
		clickedOnce = true;
	}
}

var AddThisButtonEnd = function(e){
	if(clickedOnce){
		
		
		//if(e.toElement.hasAttribute("onClick")
		elementInQuestion = e.toElement;
		e.preventDefault();
		document.removeEventListener('click', AddThisButtonEnd);
		document.removeEventListener('mouseover', onMouseOverAddButton); 
		document.removeEventListener('mouseout', onMouseOutAddButton);
		e.toElement.style.backgroundColor = oldBGColor;
		
		SaveLink(e.toElement);
		var buttonText = e.toElement.innerHTML.replace(/<(?:.|\n)*?>/gm, '').substring(0,21);
		if(e.toElement.innerText){
			buttonText = e.toElement.innerText.substring(0,21);
		}
		//console.log(e.toElement.evaluate);

		
		/*var testID = buttonText;
		while(addedButtonsList[testID]){
			testID += "1";		
		}*/
		//addedButtonsList[testID] = e.toElement;
		addedButtonsList.push(e.toElement);
		
		var container = document.getElementById("extSidebarCustomButtonContainer");
		/*
		while(container.hasChildNodes()){
		    container.removeChild(container.lastChild);
		}*/
		
		container.innerHTML += "<button" +
		" id=\"addedButton" + addedButtonsNR + "\">" + buttonText + "</button>";
		//document.getElementById("addedButton" + addedButtonsNR).addEventListener('click', AddedButtonClickEventSimulate);
		//document.getElementById("addedButton" + addedButtonsNR).addEventListener('mouseover', onMouseOverCustomButton); 
		//document.getElementById("addedButton" + addedButtonsNR).addEventListener('mouseout', onMouseOutCustomButton);
		
		for(i = 0;i<addedButtonsList.length;i++){
			/*
			buttonText = addedButtonsList[i].innerHTML.replace(/<(?:.|\n)*?>/gm, '').substring(0,21);
			if(e.toElement.innerText){
				buttonText = addedButtonsList[i].innerText.substring(0,21);
			}
			container.innerHTML += "<button" +
				" id=\"addedButton" + i + "\">" + buttonText + "</button>";
			
			var currentButton = document.getElementById("addedButton" + i);
			console.log("adding for: addedbutton" + i);
			console.log(currentButton);
			*/
			document.getElementById("addedButton" + i).addEventListener('click', AddedButtonClickEventSimulate);
			document.getElementById("addedButton" + i).addEventListener('mouseover', onMouseOverCustomButton); 
			document.getElementById("addedButton" + i).addEventListener('mouseout', onMouseOutCustomButton);
			
		}
		document.getElementById("extSidebarAddButton").addEventListener('click', AddThisButtonStart);
		//document.getElementById("extSidebarRemoveElement").addEventListener('click', RemoveNextClickedElement);
		document.getElementById("extSidebarAddButton").innerHTML = "Click to add button";
		addedButtonsNR++;
		clickedOnce = false;
		//StoreButtons();
		
		//LoadButtons();
	}
	else {
		clickedOnce = true;
	}
};


var AddedButtonClickEventSimulate = function(e){
	dispatchMouseEvent(addedButtonsList[parseInt(e.srcElement.id.substring(11))], 'click', true, true);
	
};
var AddThisButton = function(e){
	if(!e.editable){
		console.log("success");
	}
	console.log(rightclicked_item);
	console.log(e);
};

var KeyDownPress = function() {
	console.log("keyPressed");
	// add hotkeys for stuff here
};

// does not work :/ attempted fix in progress
var RemoveHTML = function(text){
	var htmlTagRegEx = /<(?:.|\n)*?>/gm;
	var htmlTag;
	var tags = [];
	var tagLocations = [];
	while(htmlTag = text.match(htmlTagRegEx)){
	    tagLocations[tagLocations.length] = text.search(htmlTagRegEx);
	    tags[tags.length] = htmlTag;
	    text = text.replace(htmlTag, '');
	}
	return text;
}

var AddCustomButtons = function(e){
	var buttonContainer = document.getElementById("extSidebarCustomButtonContainer");
	
}

var SaveLink = function(link){
	if(link.nodeName == "A"){
		console.log("this is a link");
		console.log(link.href);
		// put into storage
		addedLinks.push(link.href);
		Store("storeLocalStorage", document.domain, JSON.stringify(addedLinks));
		
		
	}
};
// sends an array and a key to be stored in localstorage
var Store = function(method, key, value){
	
	
	chrome.runtime.sendMessage({method: method, key: key, value: value}, function(response){
		console.log(response.message)
	});
};
var Load = function(key){
	
	
	chrome.runtime.sendMessage({method: "getLocalStorage", key: key}, function(response){
		console.log(response.data);
		// this is delayed, need handler
		
		
		
	});
	
	
};
var LoadLinks = function(){
	
	
	chrome.runtime.sendMessage({method: "getLocalStorageLinks", key: document.domain}, function(response){
		console.log(response.data);
		LoadedLinksHandler(response.data);
		
		
		
	});
	
	
};

var LoadedLinksHandler = function(data){
	
	
	addedLinks = JSON.parse(data);
	var buttonContainer = document.getElementById("extSidebarCustomButtonContainer"); 
	for(i = 0; i < addedLinks.length; i++ ){
		// add a button with the href you have
		button = document.createElement('a');
		button.innerHTML = "TEMP TITLE";
		//button.setAttribute('style',"background: #ddd; color: black; border: 2px outset #555");
		button.setAttribute('href', addedLinks[i]);
		
		Style(button);
		buttonContainer.appendChild(button);
		
		
		// find the title and use it for the button.
		
		
	}
};

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var LogoutStart = function(){
	console.log(document.domain);
	if(document.domain == "fronter.com"){
		window.location = "https://fronter.com/uit/index.phtml?logout=1";
	}
	if(document.domain == "www.youtube.com"){
		window.location = "/logout";
	}
	if(document.domain == "plus.google.com"){
		LogoutDivs();
	}
	if(document.domain == "drive.google.com" || document.domain == "mail.google.com" 
		|| document.domain == "www.google.com" || "www.reddit.com"){
		LogoutLinks();
	}
	if(document.domain == "facebook.com"){
		LogoutInputs();
	}
	else {
		// just look for something that can be the logoutbutton. This might fail and do nothing or click on a random link.
		LogoutLinks();
		LogoutInputs();
		LogoutDivs();
	}
};
// Logoutbutton is believed to be a div with role = button
var LogoutDivs = function(){
	var allDivs = document.getElementsByTagName("div");
	for(i=0;i<allDivs.length;i++){
		if(allDivs[i].hasAttribute("role")){
			if(allDivs[i].getAttribute("role") == "button"){
				for(o=0;o<logoutVersions.length;o++){
					if(allDivs[i].innerHTML.trim().toLowerCase() == logoutVersions[o]){
						console.log(allDivs[i]);
						dispatchMouseEvent(allDivs[i], 'click', true, true);
						break;
					}
				}
			}
		}
	}
};
// Logoutbutton is believed to be a inputfield 
var LogoutInputs = function(){
	var allInputs = document.getElementsByTagName("input");
	for(i=0;allInputs.length;i++){
		for(o=0;o<logoutVersions.length;o++){
			if(allInputs[i].value.trim().toLowerCase() == logoutVersions[o]){
				console.log(allInputs[i]);
				dispatchMouseEvent(allInputs[i], 'click', true, true);
				break;
			}
		}
	}
};
// logout button is belived to be a hyperlink
var LogoutLinks = function(){
	for(i=0;i<document.links.length;i++){
		for(o=0;o<logoutVersions.length;o++){
			if(document.links[i].innerHTML.trim().toLowerCase() == logoutVersions[o]){
				console.log(document.links[i]);
				dispatchMouseEvent(document.links[i], 'click', true, true);
				break;
			}
		}
	}
};

//this function is used to simulate mouseevents on a provided element.
var dispatchMouseEvent = function(target, var_args) {
	  var e = document.createEvent("MouseEvents");
	  e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
	  target.dispatchEvent(e);
};