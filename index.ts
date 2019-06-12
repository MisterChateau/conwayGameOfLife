import Konva from 'konva';

import './style.css';

const GRID_SIZE = 50;
const COLOR_DEAD = "#0284A8";
const COLOR_ALIVE = "#A9E8DC";

const stageEl = document.getElementById("app");

const blockSize = stageEl.offsetWidth / GRID_SIZE;

const layer = new Konva.Layer();
const stage = new Konva.Stage({
	container: "app",
	width: stageEl.offsetWidth,
	height: 600
}).add(layer);

const grid = new Map();
let running = false;

start();

function start() {
	fillGrid();
	createGun();
	layer.draw();
	animate();
	function animate() {
		requestAnimationFrame(animate);
		render();
	}
}

function render() {
	if (!running) {
		return;
	}

	const nextGridState = new Map();
	grid.forEach((cell: Konva.Rect, key: string) => {
		const [x, y] = key.split(",");
		nextGridState.set(
			key,
			shouldLive(Number(x), Number(y), cell.getAttr("alive"))
		);
	});

	nextGridState.forEach((state: boolean, key: string) => {
		state ? giveLife(grid.get(key)) : takeLife(grid.get(key));
	});

	layer.draw();
}

function shouldLive(x: number, y: number, isAlive: boolean) {
	const aliveNeighboors = getAliveNeighboors(x, y);
	if (isAlive) {
		return aliveNeighboors === 2 || aliveNeighboors === 3;
	} else {
		return aliveNeighboors === 3;
	}
}

function getAliveNeighboors(xPos, yPos): number {
	let aliveCount = 0;

	for (let x = xPos - 1; x <= xPos + 1; x++) {
		for (let y = yPos - 1; y <= yPos + 1; y++) {
			!(isSelf(x, y) || isOut(x, y)) && isAlive(x, y) && aliveCount++;
		}
	}

	return aliveCount;

	function isSelf(x, y) {
		return x === xPos && y === yPos;
	}

	function isOut(x, y) {
		return !grid.get(`${x},${y}`);
	}

	function isAlive(x, y) {
		return grid.get(`${x},${y}`).getAttr("alive");
	}
}

function makeRectangle(xPos: number, yPos: number): Konva.Rect {
	const width = blockSize;
	const height = blockSize;
	const fill = COLOR_DEAD;
	const x = xPos * blockSize;
	const y = yPos * blockSize;
	const cell = new Konva.Rect({ x, y, width, height, fill });

	cell.setAttr("alive", false);

	cell.on("click", () => toggleCell(cell));
	cell.on("touchstart", () => toggleCell(cell));

	layer.add(cell);

	return cell;
}

function toggleCell(cell: Konva.Rect) {
	const state = !cell.getAttr("alive");
	cell.setAttr("alive", state);
	cell.fill(state ? COLOR_ALIVE : COLOR_DEAD);
	layer.draw();
}

function giveLife(cell: Konva.Rect) {
	if (cell.getAttr("alive")) {
		return;
	}
	cell.setAttr("alive", true);
	cell.fill(COLOR_ALIVE);
}

function takeLife(cell: Konva.Rect) {
	if (!cell.getAttr("alive")) {
		return;
	}
	cell.setAttr("alive", false);
	cell.fill(COLOR_DEAD);
}

function fillGrid() {
	for (let x = 0; x < GRID_SIZE; x++) {
		for (let y = 0; y < GRID_SIZE; y++) {
			grid.set(`${x},${y}`, makeRectangle(x, y));
		}
	}
}

function reset() {
	grid.forEach(cell => takeLife(cell));
	layer.draw();
}

function togglePlay() {
	running = !running;
	play.style.backgroundColor = running ? COLOR_DEAD : "#02BEC4";
	play.style.color = running ? "#02BEC4" : COLOR_DEAD;
	play.innerHTML = running
		? String.fromCodePoint(9724)
		: String.fromCodePoint(9654);
}

document.addEventListener("keydown", (event: KeyboardEvent) => {
	if (event.key === "Enter") running = !running;
});

const play: HTMLElement = document.querySelector(".button--play");
play.addEventListener("click", () => {
	togglePlay();
});

const clear: HTMLElement = document.querySelector(".button--clear");
clear.addEventListener("click", () => {
	reset();
	running && togglePlay();
});

function createGun() {
	[
		"5,1",
		"5,2",
		"6,1",
		"6,2",
		"5,11",
		"6,11",
		"7,11",
		"4,12",
		"3,13",
		"3,14",
		"8,12",
		"9,13",
		"9,14",
		"6,15",
		"4,16",
		"5,17",
		"6,17",
		"7,17",
		"6,18",
		"8,16",
		"3,21",
		"4,21",
		"5,21",
		"3,22",
		"4,22",
		"5,22",
		"2,23",
		"6,23",
		"1,25",
		"2,25",
		"6,25",
		"7,25",
		"3,35",
		"4,35",
		"3,36",
		"4,36"
	].forEach(coordonate => giveLife(grid.get(coordonate)));
}
