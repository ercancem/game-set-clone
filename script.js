const COLORS = ["color-one", "color-two", "color-three"]
const FILLINGS = ["nofill", "pattern", "solid"]
const NUMBERS = ["one", "two", "three"]
const SHAPES = ["shape-one", "shape-two", "shape-three"]

const UNIT = 12;

let tilesOnBoard = new Array()
let tilesRemaining = new Array()
let tilesUsed = new Array()


function renderCircle(node, radius = UNIT, color, fill) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const circle1 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    const circle2 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    const circle3 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');

    svg.setAttribute('width', `${radius * 2}px`);
    svg.setAttribute('height', `${radius * 2}px`);
    svg.setAttribute('viewBox', '0 0 60 60')
    svg.classList.add('post-icon');

    circle1.setAttribute('cx', 30);
    circle1.setAttribute('cy', 30);
    circle1.setAttribute('r', 30);
    circle1.setAttribute('stroke', 'none');
    circle1.classList.add(color);
    svg.appendChild(circle1);

    if (fill > 0) {
        circle2.setAttribute('cx', 30);
        circle2.setAttribute('cy', 30);
        circle2.setAttribute('r', 20);
        circle2.classList.add("white");
        circle2.setAttribute('stroke', 'none');
        svg.appendChild(circle2);
    }

    if (fill === 2) {
        circle3.setAttribute('cx', 30);
        circle3.setAttribute('cy', 30);
        circle3.setAttribute('r', 10);
        circle3.classList.add(color);
        circle3.setAttribute('stroke', 'none');
        svg.appendChild(circle3);
    }

    node.append(svg);
}

function renderSquare(node, side = UNIT, color, fill) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const rect1 = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    const rect2 = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    const rect3 = document.createElementNS("http://www.w3.org/2000/svg", 'rect');

    svg.setAttribute('width', `${side * 2}px`);
    svg.setAttribute('height', `${side * 2}px`);
    svg.setAttribute('viewBox', '0 0 60 60')
    svg.classList.add('post-icon');

    rect1.setAttribute('x', 0);
    rect1.setAttribute('y', 0);
    rect1.setAttribute('width', 60);
    rect1.setAttribute('height', 60);
    rect1.classList.add(color);
    rect1.setAttribute('stroke', 'none');
    svg.appendChild(rect1);

    if (fill > 0) {
        rect2.setAttribute('x', 10);
        rect2.setAttribute('y', 10);
        rect2.setAttribute('width', 40);
        rect2.setAttribute('height', 40);
        rect2.classList.add("white");
        rect2.setAttribute('stroke', 'none');
        svg.appendChild(rect2);
    }

    if (fill === 2) {
        rect3.setAttribute('x', 20);
        rect3.setAttribute('y', 20);
        rect3.setAttribute('width', 20);
        rect3.setAttribute('height', 20);
        rect3.classList.add(color);
        rect3.setAttribute('stroke', 'none');
        svg.appendChild(rect3);
    }

    node.append(svg);
}

function renderDiamond(node, side = UNIT, color, fill) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    const path2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    const path3 = document.createElementNS("http://www.w3.org/2000/svg", 'path');

    svg.setAttribute('width', `${side * 2}px`);
    svg.setAttribute('height', `${side * 2}px`);
    svg.setAttribute('viewBox', '0 0 60 60')
    svg.classList.add('post-icon');

    path1.setAttribute('d', 'M0 30 30 0l30 30-30 30Z');
    path1.classList.add(color);
    path1.setAttribute('stroke', 'none');
    svg.appendChild(path1);

    if (fill > 0) {
        path2.setAttribute('d', 'm10 30 20-20 20 20-20 20Z');
        path2.classList.add("white");
        path2.setAttribute('stroke', 'none');
        svg.appendChild(path2);
    }

    if (fill === 2) {
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

function tileDecorator(tileId, tileArray) {
    for (let i = 0; i <= tileArray[2]; i++) {
        const tilePos = document.getElementById("tile-no-" + tileId);
        let shape = document.createElement("div");
        if (tileArray[3] === 0) {
            renderCircle(shape, 12, COLORS[tileArray[0]], tileArray[1]);
            tilePos.append(shape);
            continue
        }

        if (tileArray[3] === 1) {
            renderSquare(shape, 12, COLORS[tileArray[0]], tileArray[1]);
            tilePos.append(shape);
            continue
        }
        else {
            renderDiamond(shape, 12, COLORS[tileArray[0]], tileArray[1]);
            tilePos.append(shape);
        }
    }

}

function tileBuilder() {
    for (let i = 0; i < 12; i++) {
        let newTile = tileSet.pop();
        tilesOnBoard.push(newTile);
        tileDecorator(i, newTile);
    }
    // console.log(tilesOnBoard);
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

const zip = (arr, ...arrs) => {
    return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
  }





// toBase(2, 13) // [1, 1, 0, 1]
// toBase(3, 5) // [0, 0, 1, 2]



// console.log(tileSet[5]);




//The following builds all the necessary HTML elements.

createDomElements();
tileBuilder();

const testArray = [[1, 0, 0, 1], [2, 1, 2, 0], [0, 2, 1, 1]]


/**
 * Generate all combinations of an array.
 * @param {Array} arr - Array of three set tiles
 * @return {Array} Array of combination arrays.
 */
function checkSet(arr) {
    // Zip the three tiles.
    // testArray = [[1, 0, 0, 1], [2, 1, 2, 0], [0, 2, 1, 1]]
    // zipped = [[1,2,0], [0,1,2], [0,2,1], [1,0,1]]
    // In zipped array, each array represents the values of
    // three set tiles for each property; one for color,
    // one for pattern, one for number, and for shape.
    // According to the rules, a set forms, if each array in the
    // zipped either contains three same elements, or three distinct
    // elements.
    return zip(arr[0], arr[1], arr[2])
                // Convert each element, which is an Array
                // to a Set, thus eliminate duplicates.
                .map(array => new Set(array))
                // Now; if the set size is 1, then all the elements
                // have the same values for that property; if the size
                //  is three, then all the elements have distinct values
                // for that property. Thus, if have no array with size 2,
                // we have a Set.
                .map(set => set.size)
                .every(size => size != 2);
}


// const g = some(number => number == 0);
// console.log(g);

console.log(checkSet(testArray));

// https://stackoverflow.com/q/43241174/1085805
// https://stackoverflow.com/a/74115113/1085805
function combinations(arr, k, prefix=[]) {
    if (k == 0) return [prefix];
    return arr.flatMap((v, i) =>
        combinations(arr.slice(i+1), k-1, [...prefix, v])
    );
}

const h = combinations(tilesOnBoard, 3);

console.log(h.filter((subArray, index) => checkSet(subArray)));

// console.log(h);








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
    const headerS = document.createElement('span');
    headerS.innerHTML = "s";
    const headerE = document.createElement('span');
    headerE.innerHTML = "e";
    const headerT = document.createElement('span');
    headerT.innerHTML = "t";
    // const headerText = document.createTextNode("Set");
    // header.appendChild(headerText);
    header.append(headerS);
    header.append(headerE);
    header.append(headerT);
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
    let tileCounter = 0;
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
        const tileRow = document.createElement("div");
        // tileRow.setAttribute("id", "row-" + rowIndex);
        tileRow.setAttribute("id", "row-" + rowIndex);
        tileRow.classList.add("row-container");
        board.append(tileRow);
        for (let clmIndex = 0; clmIndex < 4; clmIndex++) {
            const tileContainer = document.createElement("div");
            tileContainer.classList.add("tile-container");
            tileRow.append(tileContainer);
            let rowElement = document.createElement("div");
            rowElement.setAttribute("id", "tile-no-" + tileCounter);
            tileCounter++;
            rowElement.classList.add("tile");
            tileContainer.append(rowElement);
        }
    }
}
