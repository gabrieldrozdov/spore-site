// NEW POSITION FOR CATALYZE LINK

// KEEP LOGO ON ALL PAGES 

// NEW LABEL AND DEFINITION FORMATTING

// ADDITIONAL HARVEST LINK

// VARIABLE HOVER EFFECTS FOR CONNECTIONS

// HOMEPAGE NARRATION


let main = document.querySelector('main')
let network = document.querySelector(".network");
let networkLinks = [];
let json, jsonStore;
let labels = [];

let subpage = document.querySelector(".subpage");
let subpagePrev = document.querySelector("#subpage-prev span");
let subpageNext = document.querySelector("#subpage-next span");
let currentLabel = "";
let index = 0;

// GET DATA FROM JSON
fetch('data.json')
	.then((response) => response.json())
	.then((json) => {
			jsonStore = json;
			let temp = "";
			for (i=0; i<json.length; i++) {
				// Build list of labels
				labels.push(json[i]["label"]);

				// Build network links
				let label = json[i]["label"];
				let connections = json[i]["connections"];
				let moveDelay = Math.random()*2000 + 1000;
				temp += `<button class="network-button-wait" style="z-index:${Math.random()*100};transition:filter ${Math.random()*2000}ms, transform .5s, top ${moveDelay}ms, left ${moveDelay}ms, font-variation-settings 1s, box-shadow .2s, font-weight 1s;" data-id="${label}" data-connections="${connections}" onclick="loadPage(this)" onmouseover="networkHighlight(this)">${label}</button>`;
			}
			network.innerHTML = temp; // Add links to DOM

			networkLinks = document.querySelectorAll(".network button"); // Target network links DOM elements

			// Set initial positions
			for (i=0; i<networkLinks.length; i++) {
				let posX = Math.round(Math.random()*(main.clientWidth*.9-networkLinks[i].offsetWidth)+main.clientWidth*.05);

				let posY = Math.round(Math.random()*(main.clientHeight*.85-networkLinks[i].offsetHeight)+main.clientHeight*.1);

				networkLinks[i].style.left =  `${posX}px`;
				networkLinks[i].style.top = `${posY}px`;

				dragElement(networkLinks[i]);
			}

			if (window.location.hash != "") {
				generateSubpage();
			}
		});

// INTRO AUDIO BUTTON
let introAudio = new Audio(`assets/info/welcome.mp3`);
let introWelcome = document.querySelector(".intro-welcome");
let introDuration;
function playIntro() {
	introWelcome.classList.toggle("intro-welcome-active");
	if (introAudio.paused != true) {
		clearTimeout(introDuration);
		introAudio.pause();
		introAudio.currentTime = 0;
		return
	}
	introAudio.play();
	introDuration = setTimeout(function() {introWelcome.classList.remove("intro-welcome-active");}, introAudio.duration*1000);
}

// INTRO
let intro = document.querySelector(".intro");
let navLinks = document.querySelector(".nav-links");
function homepageStart(e) {
	introAudio.pause();
	intro.classList.add("intro-hide");
	navLinks.classList.remove("nav-links-hide");
	main.classList.remove("network-hide");
	for (i=0; i<networkLinks.length; i++) {
		networkLinks[i].classList.remove("network-button-wait");
	}
}

// CREATE CANVAS
function setup() {
	createCanvas(windowWidth, windowHeight);
}

// MAIN p5 DRAW FUNCTION
let highlight = "";
function draw() {
	clear();

	// Draw all of the lines
	for (i=0; i<networkLinks.length; i++) {
		// Poistion of starting point
		let rect1 = networkLinks[i].getBoundingClientRect();
		let posX = parseInt(rect1.left) + networkLinks[i].offsetWidth/2;
		let posY = parseInt(rect1.top) + networkLinks[i].offsetHeight/2;

		// Position of all ending points
		if (networkLinks[i].dataset.connections != "") {
			let connections = networkLinks[i].dataset.connections.replace(/\s/g, '').split(","); // Get list of connections

			// Go through connections
			for (j=0; j<connections.length; j++) {
				if (connections[j] != "") { // Make sure not empty string
					let connection = document.querySelector(`[data-id*="${connections[j]}"`); // Target

					if (connection != null) { // Make sure actually exists in DOM
						if (highlight == connections[j] || highlight == networkLinks[i].dataset.id) { // Color for highlighted connections
							stroke("#F6AB18");
							strokeWeight(2);
							networkLinks[i].classList.add("network-button-related");
							connection.classList.add("network-button-related");
						} else { // Color for all other connections
							stroke("#A7A931");
							strokeWeight(1);
						}
						let rect2 = connection.getBoundingClientRect();
						let posX2 = parseInt(rect2.left) + connection.offsetWidth/2;
						let posY2 = parseInt(rect2.top) + connection.offsetHeight/2;
						line(posX, posY, posX2, posY2);
					}
				}
			}
		}
	}
}

// ADJUST ON WINDOW RESIZE
function windowResized() {
	setTimeout(()=>{
		resizeCanvas(windowWidth, windowHeight);
	
		// Reset positions of network links
		for (i=0; i<networkLinks.length; i++) {
			let posX = Math.round(Math.random()*(main.clientWidth*.9-networkLinks[i].offsetWidth)+main.clientWidth*.05);
	
			let posY = Math.round(Math.random()*(main.clientHeight*.85-networkLinks[i].offsetHeight)+main.clientHeight*.1);
	
			networkLinks[i].style.left =  `${posX}px`;
			networkLinks[i].style.top = `${posY}px`;
		}
	},
	1000);
}

// HOVER EFFECT FOR NETWORK LINKS
let audio = new Audio();
function networkHighlight(e) {
	audio.pause();
	audio = new Audio(`assets/recordings/${e.dataset.id}.mp3`);
	audio.play();
	networkProgress();

	e.style.top = parseInt(e.style.top) + (Math.random()*20-10) + "px";
	e.style.left = parseInt(e.style.left) + (Math.random()*20-10) + "px";

	e.classList.add("network-button-highlight");
	highlight = e.dataset.id;

	for (i=0; i<networkLinks.length; i++) {
		if (networkLinks[i] != e) {
			let e2 = networkLinks[i];
			e2.classList.remove("network-button-highlight");
			e2.classList.remove("network-button-related");
		}
	}
}

let currentTime = 0;
let progressBar = document.querySelector(".network-progress");
let progress;
function networkProgress() {
	clearInterval(progress);
	currentTime = 0;
	progressBar.style.opacity = "0";
	progressBar.style.transition = "0s linear";
	progressBar.style.transform = "scaleX(0)";
	setTimeout(() => {
		progressBar.style.opacity = "1";
		progressBar.style.transition = "1.01s linear";
	}, 100);
	progress = setInterval(() => {
		currentTime += 1;
		progressBar.style.transform = `scaleX(${currentTime/audio.duration})`;
		if (currentTime > audio.duration) {
			progressBar.style.opacity = "0";
			clearInterval(progress);
		}
	}, 1000);
}

// DRAG NETWORK LINKS
function dragElement(elmnt) {
	let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	elmnt.onmousedown = dragMouseDown;
	
	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
		elmnt.style.transition = `filter ${Math.random()*2000}ms, transform .5s, font-variation-settings 1s, box-shadow .2s, font-weight 1s, opacity `;
		for (i=0; i<networkLinks.length; i++) {
			if (networkLinks[i] != elmnt) {
				networkLinks[i].style.pointerEvents = "none";
			}
		}
		// this keeps the element clickable
		setTimeout(() => {
			elmnt.style.pointerEvents = "none";
		}, 200);
	}
  
	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
		elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	}
  
	function closeDragElement() {
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
		let moveDelay = Math.random()*2000 + 1000;
		elmnt.style.transition = `filter ${Math.random()*2000}ms, transform .5s, top ${moveDelay}ms, left ${moveDelay}ms, font-variation-settings 1s, box-shadow .2s, font-weight 1s`;
		for (i=0; i<networkLinks.length; i++) {
			if (networkLinks[i] != elmnt) {
				networkLinks[i].style.pointerEvents = "all";
			}
		}
		// gives user a second to move mouse off of the lement
		setTimeout(() => {
			elmnt.style.pointerEvents = "all";
		}, 1000);
	}
}

// LOAD SUBPAGE FOR INDIVIDUAL NETWORK LINK AFTER CLICK
function loadPage(label) {
	location.href = `#${label.dataset.id}`;
	audio.pause();
	clearInterval(progress);
	currentTime = 0;
	progressBar.style.opacity = "0";
	progressBar.style.transition = "0s linear";
	progressBar.style.transform = "scaleX(0)";
	main.style.opacity = "0";
	for (i=0; i<networkLinks.length; i++) {
		networkLinks[i].style.filter = "blur(20px)";
		networkLinks[i].style.pointerEvents = "none";
	}
	setTimeout(() => {
		main.style.display = "0";
	}, 1000);
	generateSubpage();
}

// SUBPAGE SIDEBARS
function pagePrev() {
	index--;
	generateSidebars();
	currentLabel = labels[index];
	location.href = `#${currentLabel}`;
	generateSubpage();
}
function pageNext() {
	index++;
	generateSidebars();
	currentLabel = labels[index];
	location.href = `#${currentLabel}`;
	generateSubpage();
}
function generateSidebars() {
	if (index > labels.length-1) {
		index = 0;
		subpageNext.innerText = labels[index+1];
		subpagePrev.innerText = labels[labels.length-1];
	} else if (index == labels.length-1) {
		subpageNext.innerText = labels[0];
		subpagePrev.innerText = labels[index-1];
	} else if (index < 0) {
		index = labels.length-1;
		subpagePrev.innerText = labels[index-1];
		subpageNext.innerText = labels[0];
	} else if (index == 0) {
		subpagePrev.innerText = labels[labels.length-1];
		subpageNext.innerText = labels[index+1];
	} else {
		subpagePrev.innerText = labels[index-1];
		subpageNext.innerText = labels[index+1];
	}

}

// GENERATE SUBPAGE FOR NETWORK LINK
let subpageDefinition = document.querySelector(".subpage-definition");
let subpageConnections = document.querySelector(".subpage-connections");
let subpageDig = document.querySelector(".subpage-dig");
let subpageDigLink = document.querySelector("#dig-url");
let subpageDigTxt = document.querySelector("#dig-txt");
let subpageDigTag = document.querySelector("#dig-tag");
let subpageFeatured = document.querySelector(".subpage-featured");
let subpagePullout = document.querySelector(".subpage-pullout");
let subpageTranscription = document.querySelector(".subpage-transcription");
let subpageLocation = document.querySelector("#subpage-location");
let subpageDate = document.querySelector("#subpage-date");
let subpageTime = document.querySelector("#subpage-time");
let playButton = document.querySelector(".subpage-audio");
let navLogo = document.querySelector(".nav-logo a")

function generateSubpage() {
	navLogo.style.color = "var(--olive)";
	audio.pause();
	navLinks.classList.remove("nav-links-hide");
	subpage.classList.remove("subpage-hide");
	playButton.classList.remove("subpage-audio-active");
	currentLabel = window.location.hash.replace('#', '');
	index = labels.indexOf(currentLabel);
	generateSidebars();

	// Get all data from JSON for current label
	let def =  jsonStore[index]["def"];
	let connections =  jsonStore[index]["connections"];
	let pullout =  jsonStore[index]["pullout"];
	let digurl =  jsonStore[index]["digurl"];
	let digtxt =  jsonStore[index]["digtxt"];
	let digtag =  jsonStore[index]["digtag"];
	let time =  jsonStore[index]["time"];
	let date =  jsonStore[index]["date"];
	let location =  jsonStore[index]["location"];
	let transcript =  jsonStore[index]["transcript"];
	let locationImg =  jsonStore[index]["image"];

	subpageFeatured.style.backgroundImage = "url('assets/maps/" + locationImg + "')";
	subpagePullout.innerText = pullout;
	if (pullout.length < 40) {
		subpagePullout.style.fontSize = "48px";
	} else if (pullout.length < 80) {
		subpagePullout.style.fontSize = "36px";
	} else {
		subpagePullout.style.fontSize = "24px";
	}
	subpageTranscription.innerHTML = transcript;
	subpageLocation.innerText = location;
	subpageTime.innerText = time;
	subpageDate.innerText = date;

	subpageDefinition.innerText = def;

	let connectionHTML = "";
	let connectionsSplit = connections.replace(/\s/g, '').split(",");
	if (connectionsSplit.length != 0) {
		for (i=0; i<connectionsSplit.length; i++) {
			let connectionIndex = labels.indexOf(connectionsSplit[i]);
			let connectionLabel = jsonStore[connectionIndex]["label"];
			let connectionQuote = jsonStore[connectionIndex]["pullout"];
			let connectionDuration = jsonStore[connectionIndex]["length"];
			connectionHTML +=  `<a href="#${connectionLabel}" onmouseenter="connectionPreview('${connectionLabel}', this)"><h3>${connectionLabel}</h3>
			<h4>${connectionQuote}<span class="connection-progress"></span></h4><p>${connectionDuration}</p></a>`;
		}
		subpageConnections.innerHTML = connectionHTML;
	} else {
		subpageConnections.innerHTML = "";
	}

	if (digtxt == "") {
		subpageDigLink.style.display = "none";
		subpageDigTag.style.display = "none";
	} else {
		subpageDigLink.style.display = "grid";
		subpageDigTag.style.display = "block";
		subpageDigLink.href = digurl;
		subpageDigTxt.innerHTML = digtxt;
		subpageDigTag.innerText = digtag;
	}
	subpageConnections.style.pointerEvents = "none";
	setTimeout(function () {
		subpageConnections.style.pointerEvents = "unset";
	}, 500)
}

// CONNECTION AUDIO SNIPPETS
let connectionProgress;
let playDuration;
let audioSrc = "";
function connectionPreview(connectionLabel, e) {
	audioSrc = "connection";
	playButton.classList.remove("subpage-audio-active");
	clearTimeout(playDuration);
	if (connectionProgress != null) {
		connectionProgress.style.transition = "0s";
		connectionProgress.style.transform = "scaleX(0)";
	}
	audio.pause();
	audio = new Audio(`assets/recordings/${connectionLabel}.mp3`);
	audio.play();
	connectionProgress = e.querySelector(".connection-progress");
	setTimeout(function() {
		connectionProgress.style.transition = `10s linear`;
		connectionProgress.style.transform = "scaleX(1)";
	}, 1);
	playDuration = setTimeout(function() {
		audio.pause();
		connectionProgress.style.transition = "0s";
		connectionProgress.style.transform = "scaleX(0)";
	}, 10000);
}

// MAIN PLAY BUTTON
function playTranscript() {
	if (audio.paused == true) {
		audioSrc = "transcript";
		audio = new Audio(`assets/recordings/${currentLabel}.mp3`);
		audio.play();
		playButton.classList.add("subpage-audio-active");
		clearTimeout(playDuration);
		setTimeout(function() {
			playDuration = setTimeout(function() {
				audio.pause();
				playButton.classList.remove("subpage-audio-active");
			}, audio.duration*1000);
		}, 100);
	} else if (audioSrc == "connection") {
		audioSrc = "transcript";
		audio.pause();
		audio = new Audio(`assets/recordings/${currentLabel}.mp3`);
		audio.play();
		playButton.classList.add("subpage-audio-active");
		connectionProgress.style.transition = "0s";
		connectionProgress.style.transform = "scaleX(0)";
		clearTimeout(playDuration);
		setTimeout(function() {
			playDuration = setTimeout(function() {
				audio.pause();
				playButton.classList.remove("subpage-audio-active");
			}, audio.duration*1000);
		}, 100);
	} else {
		audioSrc = "transcript";
		audio.pause();
		playButton.classList.remove("subpage-audio-active");
	}
}

// DETECT IF URL CHANGED
window.addEventListener('popstate', function () {
    generateSubpage();
});




