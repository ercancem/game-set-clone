const COLORS = ["color-one", "color-two", "color-three"]
const FILLINGS = ["nofill", "pattern", "solid"]
const NUMBERS = ["one", "two", "three"]
const SHAPES = ["shape-one", "shape-two", "shape-three"]

let tilesOnBoard = new Array()
let tilesRemaining = new Array()
let tilesUsed = new Array()


function renderCircle(node, radius = 12, color, fill) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const circle1 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    const circle2 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    const circle3 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');

    // svg.setAttribute('viewbox', `0 0 ${radius*2} ${radius*2}`);
    svg.setAttribute('width', `${radius * 2}px`);
    svg.setAttribute('height', `${radius * 2}px`);
    svg.classList.add('post-icon');

    circle1.setAttribute('cx', radius);
    circle1.setAttribute('cy', radius);
    circle1.setAttribute('r', radius);
    // circle1.setAttribute('fill', color);
    circle1.setAttribute('stroke', 'none');
    circle1.classList.add(color);
    svg.appendChild(circle1);

    if (fill === (1 || 2)) {
        circle2.setAttribute('cx', radius);
        circle2.setAttribute('cy', radius);
        circle2.setAttribute('r', radius * 0.5);
        circle2.classList.add("white");
        circle2.setAttribute('stroke', 'none');
        svg.appendChild(circle2);
    }

    if (fill === 2) {
        circle3.setAttribute('cx', radius);
        circle3.setAttribute('cy', radius);
        circle3.setAttribute('r', radius * 0.25);
        circle3.classList.add(color);
        circle3.setAttribute('stroke', 'none');
        svg.appendChild(circle3);
    }

    node.append(svg);
}

function renderSquare(node, side = 12, color, fill) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const rect1 = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    const rect2 = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    const rect3 = document.createElementNS("http://www.w3.org/2000/svg", 'rect');

    // svg.setAttribute('viewbox', `0 0 ${radius*2} ${radius*2}`);
    svg.setAttribute('width', `${side*2}px`);
    svg.setAttribute('height', `${side*2}px`);
    svg.classList.add('post-icon');

    rect1.setAttribute('x', 0);
    rect1.setAttribute('y', 0);
    rect1.setAttribute('width', side*2);
    rect1.setAttribute('height', side*2);
    rect1.classList.add(color);
    rect1.setAttribute('stroke', 'none');
    svg.appendChild(rect1);

    if (fill === (1 || 2)) {
        rect2.setAttribute('x', (side/2));
        rect2.setAttribute('y', (side/2));
        rect2.setAttribute('width', side);
        rect2.setAttribute('height', side);
        rect2.classList.add("white");
        rect2.setAttribute('stroke', 'none');
        svg.appendChild(rect2);
    }

    if (fill === (2)) {
        rect3.setAttribute('x', (side / 4));
        rect3.setAttribute('y', (side / 4));
        rect3.setAttribute('width', side / 2);
        rect3.setAttribute('height', side / 2);
        rect3.classList.add(color);
        rect3.setAttribute('stroke', 'none');
        svg.appendChild(rect3);
    }

    node.append(svg);
}

function renderDiamond(node, side = 12, color, fill) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    const path2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    const path3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');

    svg.setAttribute('width', `${side*2}px`);
    svg.setAttribute('height', `${side*2}px`);
    svg.setAttribute('viewBox', '0 0 60 60')
    svg.classList.add('post-icon');

    path1.setAttribute('d', 'M0 30 30 0l30 30-30 30Z');
    path1.classList.add(color);
    path1.setAttribute('stroke', 'none');
    svg.appendChild(path1);

    if (fill === (1 || 2)) {
        path2.setAttribute('d','m10 30 20-20 20 20-20 20Z');
        path2.classList.add("white");
        path2.setAttribute('stroke', 'none');
        svg.appendChild(path2);
    }

    if (fill === (2)) {
        path3.setAttribute('d', 'm20 30 10-10 10 10-10 10Z');
        path3.classList.add(color);
        path3.setAttribute('stroke', 'none');
        svg.appendChild(path3);
    }

    node.append(svg);
    return
}

// https://stackoverflow.com/q/2450954/1085805
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const tileSet = new Array();
for (let i = 0; i < 81; i++) {
    tileSet.push(toBase(3, i))
}

shuffleArray(tileSet);

function tileBuilder() {
    const newTile = tileSet.pop();
    console.log(newTile);
    tilesOnBoard.push(newTile);
    const tilePos = document.getElementById("row-0-column-0");
    for (let i = 0; i <= newTile[2]; i++) {
        let shape = document.createElement("div");
        if (newTile[3] === 0) {
            renderCircle(shape, 12, COLORS[newTile[0]], newTile[1]);
            tilePos.append(shape);
            continue
        }

        if (newTile[3] === 1) {
            renderSquare(shape, 12, COLORS[newTile[0]], newTile[1]);
            tilePos.append(shape);
            continue
        }
        else {
            renderDiamond(shape, 12, COLORS[newTile[0]], newTile[1]);
            tilePos.append(shape);
        }


    }
}


function toBase(base, num) {
    const largest_power = ~~(Math.log(num) / Math.log(base));
    const result = [0, 0, 0, 0];
    for (let pow = largest_power; pow >= 0; pow--) {
        const digit = ~~(num / base ** pow);
        num -= digit * base ** pow;
        result.shift();
        result.push(digit);
    }
    return result;
}
// toBase(2, 13) // [1, 1, 0, 1]
// toBase(3, 5) // [0, 0, 1, 2]



// console.log(tileSet[5]);




//The following builds all the necessary HTML elements.

createDomElements();
tileBuilder();

function createDomElements() {
    // createModal();
    createMainContainer();
    createHeader();
    createBoard();
    createTiles();
}


function createMainContainer() {
    const mainContainer = document.createElement("div");
    mainContainer.setAttribute("id", "main-container");
    document.body.append(mainContainer);
}

function createHeader() {
    const headerDiv = document.createElement("div");
    headerDiv.setAttribute("id", "header");
    headerDiv.classList.add("header");
    const header = document.createElement("h1");
    const headerText = document.createTextNode("Set");
    header.appendChild(headerText);
    headerDiv.appendChild(header);
    document.getElementById("main-container").append(headerDiv);
}

// function createMessageBoxDiv(divId) {
//   const gameContainer = document.getElementById("game-container");
//   const messageBoxContainer = document.createElement("div");
//   messageBoxContainer.setAttribute("id", divId);
//   messageBoxContainer.classList.add("message-box");
//   messageBoxContainer.textContent = ("I am a toast!")
//   gameContainer.append(messageBoxContainer);
// }

function createBoard() {
    const board = document.createElement("div");
    board.setAttribute("id", "board");
    document.getElementById("main-container").append(board);
}

function createTiles() {
    const board = document.getElementById("board");

    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
        const tileRow = document.createElement("div");
        tileRow.setAttribute("id", "row-" + rowIndex);
        tileRow.classList.add("row-container");
        board.append(tileRow);
        for (let clmIndex = 0; clmIndex < 4; clmIndex++) {
            let rowElement = document.createElement("div");
            rowElement.setAttribute("id", "row-" + rowIndex + "-column-" + clmIndex);
            rowElement.classList.add("tile");
            tileRow.append(rowElement);
        }
    }
}
