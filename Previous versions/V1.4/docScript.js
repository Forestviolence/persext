var logoutVersions = ["logg ut", "logout", "log off", "logg av", "log out", "sign out", "sign off"];



//Handle requests from extWindow.html
function handleRequest(request, 
	sender, sendResponse
	) {
	if (request.callFunction == "toggleSidebar")
		toggleSidebar();
	if(request.callFunction == "Testing"){
		console.log("called Testing");
	}
}
chrome.extension.onRequest.addListener(handleRequest);








var clickedOnce = false;
var removeButton = false;
var oldBGColor = null;
var elementInQuestion = null;
var addedButtonsNR = 0;
var addedButtonsList = [];
var addedButtonsMeta = [];
var addedLinks = [];


window.onload = function(e){
	
	var domain = "log" + document.domain;
	var url = document.URL;
	
	chrome.runtime.sendMessage({method:"addToDomLog", key: domain, value: url}, function(response){
		console.log(response.data);
	});
	

	
	
	chrome.runtime.sendMessage({method: "getLocalStorage", key: "recentLog"}, function(response){
	
		if(!response){
			var logg = [];
			logg.push(document.URL);
			url = JSON.stringify(logg);
			chrome.runtime.sendMessage({method: "addToLog", value: url}, function(response){
			});
		}
		else{
			
			var logg = JSON.parse(response.data); 
			var index = logg.indexOf(document.URL);
			if(index < 0){
				logg.push(document.URL);
			}
	    	else {
		    	logg.splice(index, 1);
		    	logg.push(document.URL);
	    	}
			while(logg.length > 10){
				logg.splice(0, 1);
			}
		    var newlog = JSON.stringify(logg);
		    chrome.runtime.sendMessage({method: "addToLog", value: newlog}, function(response){
			});
		}
	});
};

var Style = function(element){
	if(element.nodeName == "A"){
		element.setAttribute('style', "background: #ddd; border-style: outset; border-width: 5px; font-variant: normal; border-color: #f1f1f1; color: #111111; font-family: \"Arial\"; padding: 5px 5px; margin: 10px 5px;");
		element.addEventListener('mouseover', onMouseOverButton); 
		element.addEventListener('mouseout', onMouseOutButton);
		element.addEventListener('mousedown', onMouseDownButton);
	}
	else if(element.nodeName == "H1"){
		element.setAttribute('style', "color: black; text-align: center; font-size: 20px; font-family: \"Arial\"; font-weight: normal; padding: 10px 10px; margin: 15px 10px;");
	}
	else if(element.nodeName == "BUTTON"){
		element.setAttribute('style', "background: #ddd; border-style: outset; border-width: 5px; border-color: #f1f1f1; color: #111111; font-family: \"Arial\"; padding: 5px 5px; margin: 10px 5px;");
		element.addEventListener('mouseover', onMouseOverButton); 
		element.addEventListener('mouseout', onMouseOutButton);
		element.addEventListener('mousedown', onMouseDownButton);
	}
	else if (element.nodeName == "DIV"){
		element.setAttribute('style', "margin: 10 20px;");
		//custom stuff for divs
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
		eabtn.id = "extSidebarAddButton";
		eabtn.innerHTML = "Click to add button";
		Style(eabtn);
		sidebar.appendChild(eabtn);
		
		var remv = document.createElement('button');
		remv.id = "extSidebarRemoveElement";
		remv.innerHTML = "Click to remove a element";
		Style(remv);
		sidebar.appendChild(remv);
		
		var cont = document.createElement('div');
		cont.id ="extSidebarCustomButtonContainer";
		Style(cont);
		sidebar.appendChild(cont);
		
		var domcontheader = document.createElement('h1');
		domcontheader.innerHTML = "Domain Log";
		Style(domcontheader);
		sidebar.appendChild(domcontheader);
		
		var domcont = document.createElement('div');
		domcont.id="extSidebarDomainLogContainer";
		Style(domcont);
		sidebar.appendChild(domcont);
		
		
		var logcont = document.createElement('div');
		logcont.id="extSidebarLogContainer";
		Style(logcont);
		sidebar.appendChild(logcont);
		
		
		var logheader = document.createElement('h1');
		logheader.innerHTML = "Recent Log";
		Style(logheader);
		logcont.appendChild(logheader);
		
		eabtn.addEventListener('click', AddThisButtonStart);
		remv.addEventListener('click', RemoveNextClickedElement);
		
		
		LoadLinks();
		var requestkey2 = "btn" + document.domain;
		var requestkey = "log" + document.domain;
		
		chrome.runtime.sendMessage({method: "getLocalStorageMeta", key: requestkey2}, function(response){
			console.log(response);
			if(response){
				console.log(response.data);
				if(response.data && response.metadata){
					console.log(response.data);
					console.log(response.metadata);
//					addedButtonsList = JSON.parse(response.data);
//					addedButtonsMeta = JSON.parse(response.metadata);
//					AddButtonsToContainer(addedButtonsList, addedButtonsMeta, document.getElementById("extSidebarCustomButtonContainer"));
//					
					
					
				}
				
			}
		});
		
		
		chrome.runtime.sendMessage({method: "getLocalStorage", key: requestkey}, function(response){
			console.log(response.data);
			var dlog = JSON.parse(response.data);
			var dlogcont = document.getElementById("extSidebarDomainLogContainer");
			AddLinksToContainer(dlog, dlogcont);
		});
		
		chrome.runtime.sendMessage({method: "getLocalStorage", key: "recentLog"}, function(response){
			console.log(response);
			var rlog = JSON.parse(response.data); 
			var logcont = document.getElementById("extSidebarLogContainer");
			AddLinksToContainer(rlog, logcont);
		});
		
		
//		var thisthing = document.evaluate("//html/head/title", document, null, XPathResult.ANY_TYPE, null);
//		var thisthing = document.evaluate('//html/head/title', document.href = "www.9gag.com", null, XPathResult.ANY_TYPE, null);
//		var thisthing = XPathOnURL("http://wwww.9gag.com", "//html/head/title");
//		console.log(thisthing.iterateNext().innerHTML);
	}
	else if (sidebarHidden && sidebarOpen){
		
		document.getElementById('extSidebar').style.visibility="visible";
		sidebarHidden = false;
		
	}
}

var AddButtonsToContainer = function(list, metalist, container){
	
	for(i = 0;i < list.length;i++){
		
		var button = document.createElement('button');
		link.setAttribute('extxpath', list[i]);
		link.innerHTML = metalist[i];
		Style(button);
		button.addEventListener('click', onClickCustomButton);
//		var br = document.createElement('br');
//		var brr = document.createElement('br');
//		var brrr = document.createElement('br');
		container.appendChild(button);
//		container.appendChild(br);
//		container.appendChild(brr);
//		container.appendChild(brrr);
	}
};
var AddLinksToContainer = function(list, container){
	
	
	for(i = list.length;i > -1;i--){
		if(list[i] == document.URL){
			continue;
		}
		var link = document.createElement('a');
		link.href = list[i];
		link.innerHTML = "temp link";
		Style(link);
		var br = document.createElement('br');
		var brr = document.createElement('br');
		var brrr = document.createElement('br');
		container.appendChild(link);
		container.appendChild(br);
		container.appendChild(brr);
		container.appendChild(brrr);
	}
}
var StoreButtons = function(){
	//var container = document.getElementById("extSidebarCustomButtonContainer");
	// this is just to test if storage works
	
	var thingsToStore = ["item nr 0", "item nr 1", "item nr 2"];
	
	var keyy = "TestingStorageFunction";
	
	var storeThis = JSON.stringify(thingsToStore);
	
//	chrome.runtime.sendMessage({method: "storeLocalStorage", key: keyy, value: storeThis}, function(response){
//		console.log(response.message)
//	});
	
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
	//e.srcElement.disabled = true;
	document.addEventListener('click', AddThisButtonEnd);
	document.addEventListener('mouseover', onMouseOverAddButton); 
	document.addEventListener('mouseout', onMouseOutAddButton);
	clickedOnce = false;
	
};
var onMouseOverButton = function(e){
	e.preventDefault();
	e.toElement.style.borderStyle = "inset";
}
var onMouseOutButton = function(e){
	e.preventDefault();
	e.fromElement.style.borderStyle = "outset";
	e.fromElement.style.background = "#ddd";
}
var onMouseDownButton = function(e) {
	e.preventDefault();
	e.toElement.style.background = "#f1f1f1";
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
var onClickCustomButton = function(e){
	console.log(e.toElement.getAttribute('extxpath'));
	var targetButton = document.evaluate(e.toElement.getAttribute('extxpath'), document, null, XPathResult.ANY_TYPE, null).iterateNext();
	dispatchMouseEvent(targetButton, 'click', true, true);
}
// reworking this, old code saved as comments
var RemoveNextClickedElement = function(e){
	//if(removeButton){
		//removeButton = false;
	//}
	removeButton = true;
	var container = document.getElementById("extSidebarCustomButtonContainer");
	var containerButtons = container.childNodes;
	
	var length = container.childElementCount;
	
	
	for(i = 0;i < length;i++){
		containerButtons[i].addEventListener('click', function(e){
			e.preventDefault();
			
			var index = addedLinks.indexOf(e.href);
			addedLinks.splice(index, 1);
			
			StoreLocal(document.domain, JSON.stringify(addedLinks));
			
//			console.log(addedLinks);
			Load(document.domain);
			e.toElement.remove();
		});
		
	}
	
	// add functioning disable code here for reasons
	
	/*
	document.addEventListener('click', RemoveElement); 
	document.addEventListener('mouseover', onMouseOverAddButton); 
	document.addEventListener('mouseout', onMouseOutAddButton);
	clickedOnce = false;*/
};

// fucks up somehow, working on fix
var RemoveElement = function(e){ b
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
// 		this is messy and needs more work
var AddThisButtonEnd = function(e){
	if(clickedOnce){
		
		
		
		
//		if(e.toElement.hasAttribute("onClick")
//		elementInQuestion = e.toElement;
		e.preventDefault();
		
	
		
		document.removeEventListener('click', AddThisButtonEnd);
		document.removeEventListener('mouseover', onMouseOverAddButton); 
		document.removeEventListener('mouseout', onMouseOutAddButton);
		e.toElement.style.backgroundColor = oldBGColor;
		
		if(!SaveLink(e.toElement)){
//			Save a button here. find the xpath
//			WARNING: this might change if the site changes layout
			var XPath = getElementXPath(e.toElement);
			var buttonText = e.toElement.innerHTML.replace(/<(?:.|\n)*?>/gm, '').substring(0,21);
			if(e.toElement.innerText){
				buttonText = e.toElement.innerText.substring(0,21);
			}
			if(buttonText == "" || buttonText == " "){
				buttonText == "TEMP ButtonText";
			}
			console.log(XPath);
			console.log(buttonText);
			
			

			button = document.createElement('button');
			button.innerHTML = buttonText;
			button.setAttribute('extxpath', XPath);
			button.addEventListener('click', onClickCustomButton);
			var buttonContainer = document.getElementById("extSidebarCustomButtonContainer");
			Style(button);
			buttonContainer.appendChild(button);
			addedButtonsList.push(XPath);
			addedButtonsMeta.push(buttonText);
			
//			save button here
			var key = "btn" + document.domain;
			var value = JSON.stringify(addedButtonsList);
			
			
			
			console.log("look here:");
			
			console.log(value);
			console.log(JSON.parse(value));
			
			
//			value = JSON.stringify("something else");
//			var meta = JSON.stringify(addedButtonsMeta);
			StoreLocalMETA(key, value, JSON.stringify(addedButtonsMeta) );
			
			
			
		}
//		var buttonText = e.toElement.innerHTML.replace(/<(?:.|\n)*?>/gm, '').substring(0,21);
//		if(e.toElement.innerText){
//			buttonText = e.toElement.innerText.substring(0,21);
//		}
//
//		addedButtonsList.push(e.toElement);
//		
//		var container = document.getElementById("extSidebarCustomButtonContainer");
//		
//		
//		var btn = document.createElement('button');
////		heh, no, not yet atleast
////		btn.id = "extSidebarAddButton";
//		btn.innerHTML = buttonText;
//		Style(btn);
//		container.appendChild(btn);
//		
//		
//		btn.addEventListener('click', AddedButtonClickEventSimulate);
//		btn.addEventListener('mouseover', onMouseOverCustomButton); 
//		btn.addEventListener('mouseout', onMouseOutCustomButton);
//		
//		
//		this is not how it should work.
//		container.innerHTML += "<button" +
//		" id=\"addedButton" + addedButtonsNR + "\">" + buttonText + "</button>";
//		for(i = 0;i<addedButtonsList.length;i++){
//			
//			
//
//			document.getElementById("addedButton" + i).addEventListener('click', AddedButtonClickEventSimulate);
//			document.getElementById("addedButton" + i).addEventListener('mouseover', onMouseOverCustomButton); 
//			document.getElementById("addedButton" + i).addEventListener('mouseout', onMouseOutCustomButton);
//			
//		}
//		document.getElementById("extSidebarAddButton").addEventListener('click', AddThisButtonStart);
		//document.getElementById("extSidebarRemoveElement").addEventListener('click', RemoveNextClickedElement);
		//document.getElementById("extSidebarAddButton").disabled = false;
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

// migth work. not tested
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
};

var AddCustomButtons = function(e){
	var buttonContainer = document.getElementById("extSidebarCustomButtonContainer");
	
};
var SaveButton = function(element){
	
};
var SaveLink = function(link){
	if(link.nodeName == "A"){
		console.log("this is a link");
		console.log(link.href);
		// put into storage
		addedLinks.push(link.href);
		Store("storeLocalStorage", document.domain, JSON.stringify(addedLinks));
		
		var buttonText = link.innerHTML.replace(/<(?:.|\n)*?>/gm, '').substring(0,21);
		button = document.createElement('a');
		button.innerHTML = buttonText;
		button.setAttribute('href', link.href);
		var buttonContainer = document.getElementById("extSidebarCustomButtonContainer");
		Style(button);
		buttonContainer.appendChild(button);
		
		return true;
	}
};

var StoreLocal = function(key, value){
//	console.log(key);
//	console.log(value);
	Store("storeLocalStorage", key, value);
};
// 
var StoreLocalMETA = function(key, value, metadata){
	console.log(key);
	console.log(value);
	console.log(metadata);
	chrome.runtime.sendMessage({method: "storeLocalStorageMeta", key: key, value: value, meta: metadata}, function(response){
		console.log(response);
		console.log(response.message);
		
		var requestkey2 = "btn" + document.domain;
		chrome.runtime.sendMessage({method: "getLocalStorageMeta", key: requestkey2}, function(response){
			console.log(response);
			if(response){
				console.log(response.data);
				if(response.data && response.metadata){
					console.log(response.data);
					console.log(response.metadata);
	
				}
				
			}
		});
	});
	
};
// sends an array and a key to be stored in localstorage
var Store = function(method, key, value){
	chrome.runtime.sendMessage({method: method, key: key, value: value}, function(response){
		console.log(response.message);		
	});
};
var Load = function(key){
	
	
	chrome.runtime.sendMessage({method: "getLocalStorage", key: key}, function(response){
		console.log(response.data);
		// this is delayed, need handler
		
		
		
	});
	
	
};
// v1: only use for buttons since nothing else actually stores any metadata
var LoadMETA = function(key){
	chrome.runtime.sendMessage({method: "getLocalStorageMeta", key: key}, function(response){
		tempMETAhandler(JSON.parse(response.data), JSON.parse(response.metadata));
	});
};
var tempMETAhandler = function(data, metadata){
	
};
var LoadLinks = function(){
	
	
	chrome.runtime.sendMessage({method: "getLocalStorageLinks", key: document.domain}, function(response){
		//console.log(response.data);
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


// From Firebug https://code.google.com/p/fbug/source/browse/branches/firebug1.6/content/firebug/lib.js?spec=svn12950&r=8828#1332
//*********************************************************************************************************************************************************
//XPath

/**
* Gets an XPath for an element which describes its hierarchical location.
*/
var getElementXPath = function(element)
{
 if (element && element.id)
     return '//*[@id="' + element.id + '"]';
 else
     return getElementTreeXPath(element);
};

var getElementTreeXPath = function(element)
{
 var paths = [];

 // Use nodeName (instead of localName) so namespace prefix is included (if any).
 for (; element && element.nodeType == 1; element = element.parentNode)
 {
     var index = 0;
     for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling)
     {
         // Ignore document type declaration.
         if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
             continue;

         if (sibling.nodeName == element.nodeName)
             ++index;
     }

     var tagName = element.nodeName.toLowerCase();
     var pathIndex = (index ? "[" + (index+1) + "]" : "");
     paths.splice(0, 0, tagName + pathIndex);
 }

 return paths.length ? "/" + paths.join("/") : null;
};

var getElementCSSPath = function(element)
{
 var paths = [];

 for (; element && element.nodeType == 1; element = element.parentNode)
 {
     var selector = this.getElementCSSSelector(element);
     paths.splice(0, 0, selector);
 }

 return paths.length ? paths.join(" ") : null;
};

var cssToXPath = function(rule)
{
 var regElement = /^([#.]?)([a-z0-9\\*_-]*)((\|)([a-z0-9\\*_-]*))?/i;
 var regAttr1 = /^\[([^\]]*)\]/i;
 var regAttr2 = /^\[\s*([^~=\s]+)\s*(~?=)\s*"([^"]+)"\s*\]/i;
 var regPseudo = /^:([a-z_-])+/i;
 var regCombinator = /^(\s*[>+\s])?/i;
 var regComma = /^\s*,/i;

 var index = 1;
 var parts = ["//", "*"];
 var lastRule = null;

 while (rule.length && rule != lastRule)
 {
     lastRule = rule;

     // Trim leading whitespace
     rule = this.trim(rule);
     if (!rule.length)
         break;

     // Match the element identifier
     var m = regElement.exec(rule);
     if (m)
     {
         if (!m[1])
         {
             // XXXjoe Namespace ignored for now
             if (m[5])
                 parts[index] = m[5];
             else
                 parts[index] = m[2];
         }
         else if (m[1] == '#')
             parts.push("[@id='" + m[2] + "']");
         else if (m[1] == '.')
             parts.push("[contains(concat(' ',normalize-space(@class),' '), ' " + m[2] + " ')]");

         rule = rule.substr(m[0].length);
     }

     // Match attribute selectors
     m = regAttr2.exec(rule);
     if (m)
     {
         if (m[2] == "~=")
             parts.push("[contains(@" + m[1] + ", '" + m[3] + "')]");
         else
             parts.push("[@" + m[1] + "='" + m[3] + "']");

         rule = rule.substr(m[0].length);
     }
     else
     {
         m = regAttr1.exec(rule);
         if (m)
         {
             parts.push("[@" + m[1] + "]");
             rule = rule.substr(m[0].length);
         }
     }

     // Skip over pseudo-classes and pseudo-elements, which are of no use to us
     m = regPseudo.exec(rule);
     while (m)
     {
         rule = rule.substr(m[0].length);
         m = regPseudo.exec(rule);
     }

     // Match combinators
     m = regCombinator.exec(rule);
     if (m && m[0].length)
     {
         if (m[0].indexOf(">") != -1)
             parts.push("/");
         else if (m[0].indexOf("+") != -1)
             parts.push("/following-sibling::");
         else
             parts.push("//");

         index = parts.length;
         parts.push("*");
         rule = rule.substr(m[0].length);
     }

     m = regComma.exec(rule);
     if (m)
     {
         parts.push(" | ", "//", "*");
         index = parts.length-1;
         rule = rule.substr(m[0].length);
     }
 }

 var xpath = parts.join("");
 return xpath;
};

this.getElementsBySelector = function(doc, css)
{
 var xpath = this.cssToXPath(css);
 return this.getElementsByXPath(doc, xpath);
};

this.getElementsByXPath = function(doc, xpath)
{
 var nodes = [];

 try {
     var result = doc.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null);
     for (var item = result.iterateNext(); item; item = result.iterateNext())
         nodes.push(item);
 }
 catch (exc)
 {
     // Invalid xpath expressions make their way here sometimes.  If that happens,
     // we still want to return an empty set without an exception.
 }

 return nodes;
};

this.getRuleMatchingElements = function(rule, doc)
{
 var css = rule.selectorText;
 var xpath = this.cssToXPath(css);
 return this.getElementsByXPath(doc, xpath);
};