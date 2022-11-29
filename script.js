let main = document.querySelector('main')
let network = document.querySelector(".network");
let networkLinks = [];
let json;

fetch('data.json')
	.then((response) => response.json())
	.then((json) => {
			console.log(json);
			let temp = "";
			for (i=0; i<json.length; i++) {
				let label = json[i]["spores (keywords)"];
				let connections = json[i]["connections (spore, spore, spore)"];
				let moveDelay = Math.random()*2000 + 1000;
				temp += `<button class="network-button-wait" style="z-index:${Math.random()*100};transition:filter ${Math.random()*2000}ms, transform .5s, top ${moveDelay}ms, left ${moveDelay}ms, font-variation-settings 1s, box-shadow .2s, font-weight 1s;" data-id="${label}" data-connections="${connections}" onclick="loadPage(${label})" onmouseover="networkHighlight(this)">${label}</button>`;
			}
			network.innerHTML = temp;

			networkLinks = document.querySelectorAll(".network button");

			for (i=0; i<networkLinks.length; i++) {

				let posX = Math.round(Math.random()*(main.clientWidth*.9-networkLinks[i].offsetWidth)+main.clientWidth*.05);

				let posY = Math.round(Math.random()*(main.clientHeight*.85-networkLinks[i].offsetHeight)+main.clientHeight*.1);

				networkLinks[i].style.left =  `${posX}px`;
				networkLinks[i].style.top = `${posY}px`;
			}
		});

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

function setup() {
	createCanvas(windowWidth, windowHeight);
}

let highlight = "";

function draw() {
	clear();
	stroke("#A7A931");

	for (i=0; i<networkLinks.length; i++) {
		let rect1 = networkLinks[i].getBoundingClientRect();

		let posX = parseInt(rect1.left) + networkLinks[i].offsetWidth/2;
		let posY = parseInt(rect1.top) + networkLinks[i].offsetHeight/2;

		if (networkLinks[i].dataset.connections != "") {

			let connections = networkLinks[i].dataset.connections.replace(/\s/g, '').split(",");
	
			for (j=0; j<connections.length; j++) {

				if (connections[j] != "") {
					let connection = document.querySelector(`[data-id*="${connections[j]}"`);

					if (connection != null) {
	
						if (highlight == connections[j] || highlight == networkLinks[i].dataset.id) {
							stroke("#F6AB18");
							strokeWeight(2);
							networkLinks[i].classList.add("network-button-related");
							connection.classList.add("network-button-related");
						} else {
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

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);

	for (i=0; i<networkLinks.length; i++) {

		let posX = Math.round(Math.random()*(main.clientWidth*.9-networkLinks[i].offsetWidth)+main.clientWidth*.05);

		let posY = Math.round(Math.random()*(main.clientHeight*.85-networkLinks[i].offsetHeight)+main.clientHeight*.1);

		networkLinks[i].style.left =  `${posX}px`;
		networkLinks[i].style.top = `${posY}px`;
	}
}  

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
			networkLinks[i].classList.remove("network-button-highlight");
			networkLinks[i].classList.remove("network-button-related");
		}
	}
}

function loadPage(label) {
	location.href = `#${label.dataset.id}`;
}