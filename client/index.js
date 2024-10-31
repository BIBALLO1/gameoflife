var c = document.getElementById("Canvas");
var pauseButton = document.getElementById("pauseButton");
var ctx = c.getContext("2d");

const RESOLUTION = 200;
var current = new Array(RESOLUTION);
var next = new Array(RESOLUTION);
var simPaused = false;

function setup() {
	for (let i = 0; i < RESOLUTION; ++i) {
		current[i] = new Array(RESOLUTION);
		next[i] = new Array(RESOLUTION);
		for (let j = 0; j < RESOLUTION; ++j) {
			current[i][j] = Math.random() < 0.2;
			next[i][j] = false;
		}
	}
	setPaused(false);
}

function update(dt) {
	for (let i = 0; i < RESOLUTION; ++i) {
		for (let j = 0; j < RESOLUTION; ++j) {
			let neighbors = 0;
			for (let ii = -1; ii <=1; ++ii) {
				for (let ij = -1; ij <=1; ++ij) {
					if (ii == 0 && ij == 0) {
						continue;
					}
					if (current[(i + ii + RESOLUTION) % RESOLUTION][(j + ij + RESOLUTION) % RESOLUTION]) {
						neighbors++;
					}
				}
			}
			if (!current[i][j] && neighbors == 3) {
				next[i][j] = true;
			} else if (current[i][j] && (neighbors != 2 && neighbors != 3)) {
				next[i][j] = false;
			} else {
				next[i][j] = current[i][j];
			}
		}
	}

	let tmp = current;
	current = next;
	next = tmp;
}

function render() {
	// ctx.clearRect(0, 0, c.width, c.height);
	ctx.fillStyle = "black"
	ctx.fillRect(0, 0, c.width, c.height);
	for (let i = 0; i < RESOLUTION; ++i) {
		for (let j = 0; j < RESOLUTION; ++j) {
			if (current[i][j]) {
				ctx.fillStyle = "white";
				ctx.fillRect((i / RESOLUTION) * c.width, (j / RESOLUTION) * c.height, 1 / RESOLUTION * c.width, 1 / RESOLUTION * c.height);
			}
		}
	}
}

function togglePaused() {
	setPaused(!simPaused)
}

function setPaused(newPaused) {
	simPaused = newPaused;
	if (simPaused)
		pauseButton.innerHTML = "Resume"
	else
		pauseButton.innerHTML = "Pause"
}

setup();
let previousTime = 0.0;
let accTimeStep = 0.0;
const fixedTimeStep = 1 / 30.0;
const loop = time => {
	const dt = time - previousTime;
	previousTime = time;

	if (simPaused) {
		window.requestAnimationFrame(loop);
		return;
	}

	accTimeStep += dt;
	if (accTimeStep >= fixedTimeStep * 1000.0) {
		accTimeStep = accTimeStep % fixedTimeStep;

		update(accTimeStep * 0.001);
		render();
	}

	window.requestAnimationFrame(loop);
};
window.requestAnimationFrame(time => {
	previousTime = time;
	window.requestAnimationFrame(loop);
});
