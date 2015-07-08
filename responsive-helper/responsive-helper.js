// Responsive Helper plugin to assist with responsive design breakpoints in the previewWindow, with CSS output & overrides
// Variation of the Brackets Response plugin idea at https://github.com/kidwm/brackets-response
// by Matt Pass as an ICEcoder plugin

top.ICEcoder.doResponsive = function() {

	// Set our initial values
	if ("undefined" === typeof breakPoints) {
		// Array to contain breakpoint px values, this current breakpoint and the template for media queries
		breakPoints = [];
		thisBreakPoint = 0;
		mediaQueryTemplate = "@media only screen and (max-width: [[[WIDTH]]]) {";
	}

	// Init the plugin if we have a target window
	if (top.ICEcoder.previewWindow.location) {

		// Init the DOM objects if we haven't yet got a pw var
		if ("undefined" === typeof pw) {

			// Define the preview window target from the ICEcoder window perspective
			pw = top.ICEcoder.previewWindow.document;

			// Define the 12 colors to be used in order for the breakpoints
			colors = [	"#e1c76e",	/* yellow */	
					"#6cb5d9",	/* blue */
					"#bf255c",	/* pink */
					"#f9602c",	/* orange */
					"#b9ca4a",	/* green */
					"#9179bb",	/* purple */
					"#d00",		/* red */
					"#214e7b",	/* bright blue */
					"#cc7",		/* grey-yellow */
					"#099",		/* teal */
					"#6a0d6a",	/* purple-pink */
					"#186718"];	/* dark green */

			// Define a bar at the top of the page to contain breakpoints and add button etc
			respBar = document.createElement('div');
			respBar.style.position = "fixed";
			respBar.style.top = "0";
			respBar.style.left = "0";
			respBar.style.width = "100%";
			respBar.style.height = "20px";
			respBar.style.background = "#141612";
			respBar.style.boxSizing = "border-box";
			respBar.style.zIndex = "1000001";
			respBar.id = "ICEcoderRespBar";

			// Now define an inner bar inside this, as wide as the body
			respInnerBar = document.createElement('div');
			respInnerBar.style.position = "fixed";
			respInnerBar.style.top = "0";
			respInnerBar.style.width = pw.body.getBoundingClientRect().width+"px";
			respInnerBar.style.height = "20px";
			respInnerBar.style.background = "#666";
			respInnerBar.style.boxSizing = "border-box";
			respInnerBar.style.zIndex = "1000002";
			respInnerBar.id = "ICEcoderRespInnerBar";

			// Define a dummy element that will contain our cloned nodes
			respInnerBarDummy = document.createElement('div');
			respInnerBarDummy.style.position = "absolute";
			respInnerBarDummy.style.width = "1px";
			respInnerBarDummy.style.left = "-10000px";
			respInnerBarDummy.id = "respInnerBarDummy";

			// OK now define our add button to allow the adding of breakpoints
			add = document.createElement('div');
			add.style.position = "fixed";
			add.style.display = "inline-block";
			add.style.top = "0";
			add.style.padding = "3px 8px";
			add.style.fontFamily = "arial, verdana, helvetica, sans-serif";
			add.style.fontSize = "12px";
			add.style.background = "#2187e7";
			add.style.color = "#eee";
			add.style.cursor = "pointer";
			add.style.zIndex = "1000003";
			add.id = "ICEcoderRespAdd";
			add.innerHTML = "Add + ";
			add.addEventListener("click", function() {addBreakpoint();}, false);

			// Now a container for our 'focus box'
			focusContBox = document.createElement('div');
			focusContBox.style.position = "absolute";
			focusContBox.style.top = "0";
			focusContBox.style.left = "0";
			focusContBox.style.zIndex = "1000000";
			focusContBox.id = "focusContBox";

			// Plus the focus box within this, contains a massive outline to provide the focus 'scope'
			focusBox = document.createElement('div');
			focusBox.style.position = "relative";
			focusBox.style.display = "inline-block";
			focusBox.style.top = "0";
			focusBox.style.height = "0";
			focusBox.style.width = "0";
			focusBox.style.outline = "rgba(0,0,0,0.5) solid 10000px";
			focusBox.style.transition = "all 0.1s ease-in-out";
			focusBox.style.cursor = "pointer";
			focusBox.style.zIndex = "1000000";
			focusBox.id = "focusBox";
			// Set an event listener to handle what happens when we click on it
			focusBox.addEventListener("click", function() {

				// If we've not got any breakpoints as yet, add one
				if (breakPoints.length === 0) {
					addBreakpoint();
				}

				// Select the last, or open, a /[NEW] tab for this content as needed
				var openFiles = top.ICEcoder.openFiles;
				var foundNewFile = false;
				for (var i=openFiles.length-1; i>=0; i--) {
					if (openFiles[i] == "/[NEW]") {
						top.ICEcoder.switchTab(i+1);
						foundNewFile = true;
						break;
					}
				}
				if(!foundNewFile) {
					top.ICEcoder.newTab();
				}

				// Get CM instance for this tab
				top.ICEcoder.targetcM = top.ICEcoder.getcMInstance();

				// We now need to find our media query chunk to add content into,
				// start by getting all content lines into an array
				var thisContent = top.ICEcoder.targetcM.getValue();
				thisContent = thisContent.split("\n");

				// Clear any selection
				top.ICEcoder.targetcM.setSelection({line: 0, ch: 0},{line: 0, ch: 0});

				// Establish the media query line to use
				var mediaQueryLine = mediaQueryTemplate.replace("[[[WIDTH]]]",breakPoints[thisBreakPoint]+"px");

				// Set init values meaning the start and end of chunk not yet established
				var chunkStartLine = -1;
				var chunkEndLine = top.ICEcoder.targetcM.lineCount()-1;
				var selectorStartLine = -1;
				var selectorEndLine = -1;
				var foundSelector = false;

				// Try and find the start and end of the chunk we need to work within
				for (var i=0; i<thisContent.length; i++) {

					// Found the existing chunk!
					if (thisContent[i] == mediaQueryLine) {
						chunkStartLine = i;
					}
					// If we found our start, we continue to the next media query or end of doc, from 1 line after the start
					if (chunkStartLine > -1 && i > chunkStartLine) {
						if (thisContent[i].indexOf("@media") != -1) {
							chunkEndLine = i-2;
						}
						// Have we found our selector within this media query?
						if (thisContent[i].indexOf("\t" + getCSSPath(top.ICEcoder.respElemSelected) + " {") != -1) {
							foundSelector = true;
							selectorStartLine = i;
						}
						// Finally, if we've found the line containing the end brace for the selector
						if (foundSelector && thisContent[i] == "\t}") {
							selectorEndLine = i+1;
							break;
						}
					}				
				}

				// Set the media query line at the start of the file, with 2 line breaks if it's not the first one added
				cssOutputMQ = top.ICEcoder.targetcM.getValue() == "" ? mediaQueryLine+"\n" : "\n\n"+mediaQueryLine+"\n";

				// Set the CSS rules within the selector (CSS path)
				// The first line here establishes the CSS selector path by classname and node depth
				cssOutputStart = "\t" + getCSSPath(top.ICEcoder.respElemSelected) + " {\n";
				cssOutputRules = "";
				for (var key in diff) {
					cssOutputRules += "\t\t" + key + ": " + diff[key] + ";\n";
				}
				cssOutputEnd = "\t}\n";
				// End of our media query
				cssOutputMQEnd = "}";

				// If we have a media query chunk
				if (chunkStartLine !== -1) {
					// If we don't have a selector in the media query chunk yet, add one in at the end of it
					if (!foundSelector) {
						top.ICEcoder.targetcM.replaceRange(cssOutputStart+cssOutputRules+cssOutputEnd, {line: chunkEndLine, ch: 0}, {line: chunkEndLine, ch: 0});
					// We have our selector, so just select it
					} else {
						top.ICEcoder.targetcM.setSelection({line: selectorStartLine, ch: 0},{line: selectorEndLine, ch: 0});

					}
				// Else insert media query chunk for first time (and our selector chunk)
				} else {
					top.ICEcoder.targetcM.setValue(top.ICEcoder.targetcM.getValue()+cssOutputMQ+cssOutputStart+cssOutputRules+cssOutputEnd+cssOutputMQEnd);
				}
			}, false);

			// Finally, define our CSS output DIV to show DOM elem styles
			outputBox = document.createElement('div');
			outputBox.style.position = "fixed";
			outputBox.style.display = "block";
			outputBox.style.bottom = "0";
			outputBox.style.left = "0";
			outputBox.style.width = "100%";
			outputBox.style.height = "150px";
			outputBox.style.fontFamily = "arial, verdana, helvetica, sans-serif";
			outputBox.style.fontSize = "12px";
			outputBox.style.background = "rgba(255,255,255,0.5)";
			outputBox.style.color = "#000";
			outputBox.style.overflow = "auto";
			outputBox.style.zIndex = "1000000";
			outputBox.id = "outputBox"
		}

		// Add DOM elems to previewWindow
		pw.body.appendChild(respBar);
		pw.body.appendChild(respInnerBar);
		pw.body.appendChild(respInnerBarDummy);
		pw.body.appendChild(add);
		pw.body.appendChild(focusContBox);
		pw.getElementById('focusContBox').appendChild(focusBox);
		pw.body.appendChild(outputBox);

		// Get all DOM elems into an array
		elems = pw.body.getElementsByTagName('*');

		// For each one of those, if it's got a z-index under 1000000, it should be a user set DOM elem
		for (var i=0; i<=elems.length; i++) {
			if (elems[i].style.zIndex < 1000000) {
				// So add a mouseover event to it...
				elems[i].addEventListener("mouseover", function() {
					// ...that sets the left, width and high properties of the focus box to match the bounding rectangle of the DOM elem
					// ...top is a cumulative offset from the document top so we can scroll and it matches y pos of elem underneath
					pw.getElementById('focusBox').style.top = cumulativeOffset(this).top+"px";
					pw.getElementById('focusBox').style.left = this.getBoundingClientRect().left+"px";
					pw.getElementById('focusBox').style.width = this.getBoundingClientRect().width+"px";
					pw.getElementById('focusBox').style.height = this.getBoundingClientRect().height+"px";

					// Set the width (to same value), which forces a DOM render and avoids us getting lots of extra unwanted styles picked up
					this.style.width = getComputedStyle( this ).width;

					// Create a dummy clone of the node...
					var dummy = this.cloneNode(true);
					// ...and insert that into our dummy container that's out of sight
					pw.getElementById('respInnerBarDummy').appendChild(dummy);

					// Now to pick up the styles. First get inline styles set on the elem
					styleText = this.style.cssText.split(";");
					// Get rid of last empty array item if it's empty
					if (styleText[styleText.length-1] == "") {
						styleText.pop();
					}

					// Get styles from the elem and dummy clone of it
					var defaultStyles = getComputedStyle(dummy);
					var elementStyles = getComputedStyle(this);

					// Work out diffs between elem and dummy clone and but into a diff object
					diff = {};
					for (var key in elementStyles) {
						// If the value of matching keys isn't the same, we have a value set as it's different
						if (defaultStyles[key] !== elementStyles[key]) {
							// We'll ignore cssText as we've got inline styles already
							if (key !== "cssText") {
								// Set the CSS syntax key by turning camel case into hyphenated lowercase
								diff[ key.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase() ] = elementStyles[key];
							}
						}
					}

					// Finally, create array of key/value style pairs, also trimming whitespace as we go
					for (var i=0; i<styleText.length; i++) {
						var thisItem = styleText[i].split(":");
						diff[thisItem[0].trim()] = thisItem[1].trim();
					}

					// Leave behind a pointer for this DOM elem
					top.ICEcoder.respElemSelected = this;

					// Also output to the output box in a nice-ish format
					pw.getElementById('outputBox').innerHTML = JSON.stringify(diff).replace(/\"\,/g,'"<br>').replace(/\{/g,'').replace(/\}/g,'');

				}, true);
			}
		}
	}
}

// Function to add breakpoints to the bar
function addBreakpoint() {
	// Work out the window width and height plus the body width from our bar
	var winW = top.ICEcoder.previewWindow.outerWidth;
	var winH = top.ICEcoder.previewWindow.outerHeight;
	var bodyW = parseInt(pw.getElementById('ICEcoderRespInnerBar').style.width,10);
	// Set the width to be the lesser of these
	var newW = winW < bodyW ? winW : bodyW;

	// If we haven't got this width in our array yet, we can add it in
	if (breakPoints.indexOf(newW) == -1) {
		breakPoints.push(newW);
		thisBreakPoint = breakPoints.length-1;
		var thisBP = thisBreakPoint;

		// Now setup a bar for this breakpoint, width as per our newW and with the next background color
		thisRespBar = document.createElement('div');
		thisRespBar.style.position = "absolute";
		thisRespBar.style.display = "inline-block";
		thisRespBar.style.width = newW+"px";
		thisRespBar.style.height = "20px";
		thisRespBar.style.top = "0";
		thisRespBar.style.boxSizing = "border-box";
		thisRespBar.style.padding = "3px 8px";
		thisRespBar.style.background = colors[thisBreakPoint];
		thisRespBar.style.color = "#fff";
		thisRespBar.style.fontFamily = "arial, verdana, helvetica, sans-serif";
		thisRespBar.style.fontSize = "12px";
		thisRespBar.style.textAlign = "right";
		thisRespBar.style.cursor = "pointer";
		thisRespBar.innerHTML = newW+"px";
		thisRespBar.id = "respBar"+thisBreakPoint;
		// Set an event so on click it sets the breakpoint and changes window width to match
		thisRespBar.addEventListener("click", function() {
			setBreakPoint(thisBP);
			changeWinW(newW,winH);
		},false);
		// Append that to our bar container
		pw.getElementById('ICEcoderRespInnerBar').appendChild(thisRespBar);
	// It exists already so trigger a click event to set it, set window size etc
	} else {
		pw.getElementById('respBar'+breakPoints.indexOf(newW)).click();
	}
};

// Get a CSS path for given elem
function getCSSPath(elem) {
	var cssPath = [], item, entry;

	// Get all parent items
	for (item = elem.parentNode; item; item = item.parentNode) {
		entry = item.tagName.toLowerCase();
		if (entry === "html") {
			break;
		}
		if (item.className) {
			entry += "." + item.className.replace(/ /g, '.');
		}
		cssPath.push(entry);
	}

	// Reverse the array to run forwards
	cssPath.reverse();
	
	// Add on this elem to the end of the array
	entry = elem.tagName.toLowerCase();
	if (elem.className) {
		entry += "." + elem.className.replace(/ /g, '.');
	}
	cssPath.push(entry);

	// Return the array as a space delimited string
	return cssPath.join(" ");
};

// Change the window size on demand
function changeWinW(winW,winH) {
	top.ICEcoder.previewWindow.resizeTo(winW,winH);
};

// Set the current breakpoint to one we've clicked on
function setBreakPoint(newBP) {
	thisBreakPoint = newBP;
};

// Work out the offset from the top of the page
var cumulativeOffset = function(element) {
	var top = 0, left = 0;
	do {
		top += element.offsetTop  || 0;
		left += element.offsetLeft || 0;
		element = element.offsetParent;
	} while(element);

	// Return it as an array
	return {
		top: top,
		left: left
	};
};