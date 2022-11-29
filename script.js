let main = document.querySelector('main')
let network = document.querySelector(".network");
let networkLinks = [];
let json;

// GET DATA FROM JSON
fetch('data.json')
	.then((response) => response.json())
	.then((json) => {
			// Build network links
			let temp = "";
			for (i=0; i<json.length; i++) {
				let label = json[i]["spores (keywords)"];
				let connections = json[i]["connections (spore, spore, spore)"];
				let moveDelay = Math.random()*2000 + 1000;
				temp += `<button class="network-button-wait" style="z-index:${Math.random()*100};transition:filter ${Math.random()*2000}ms, transform .5s, top ${moveDelay}ms, left ${moveDelay}ms, font-variation-settings 1s, box-shadow .2s, font-weight 1s;" data-id="${label}" data-connections="${connections}" onclick="loadPage(${label})" onmouseover="networkHighlight(this)">${label}</button>`;
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
		});

// INTRO
let intro = document.querySelector(".intro");
let navLinks = document.querySelector(".nav-links");

function homepageStart(e) {
	e.style.display = "none";
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
	resizeCanvas(windowWidth, windowHeight);

	// Reset positions of network links
	for (i=0; i<networkLinks.length; i++) {
		let posX = Math.round(Math.random()*(main.clientWidth*.9-networkLinks[i].offsetWidth)+main.clientWidth*.05);

		let posY = Math.round(Math.random()*(main.clientHeight*.85-networkLinks[i].offsetHeight)+main.clientHeight*.1);

		networkLinks[i].style.left =  `${posX}px`;
		networkLinks[i].style.top = `${posY}px`;
	}
}  

// HOVER EFFECT FOR NETWORK LINKS
let audio = new Audio();
function networkHighlight(e) {
	audio.pause();
	audio = new Audio(`assets/recordings/${e.dataset.id}.mp3`);
	audio.play();

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

function loadPage(label) {
	location.href = `#${label.dataset.id}`;
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
		elmnt.style.transition = `filter ${Math.random()*2000}ms, transform .5s, font-variation-settings 1s, box-shadow .2s, font-weight 1s`;
		for (i=0; i<networkLinks.length; i++) {
			if (networkLinks[i] != e) {
			}
		}
	}
  
	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		console.log(elmnt.offsetTop - pos2);
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
	}
}
  