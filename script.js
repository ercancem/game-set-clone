// import { createDomElements } from './js/dom.js';
// import { renderCircle, renderSquare, renderDiamond } from './js/render.js';

class Game {
    // A CARD is a an array of 4 integers where each integer
    // can take the value of 0, 1, or 2. E.g. [1, 0, 2, 0]
    // The four numbers represent these properties:
    // [color, filling, number, shape]
    // (The order is alphabetical for ease of memory.)

    // A TILE is an HTML div that represents a CARD visually.

    // A SET is a selection of 3 cards that form a set with
    // respect to the rules of the game.

    // Build an array of 81 cards.
    #deck = this.#buildDeck();

    constructor() {
        // The UNIT is supposed to be the essential unit to build the
        // mobile page. The integer is supposed to represent the number
        // of pixels.Right now, it is not functional.
        this.UNIT = 12;

        // For now, the plan is to have 12 tiles on the screen.
        // This is mainly due to the limitations of the mobile screen;
        // More tiles means more crowded screen, and perhaps smaller
        // tiles, which means inferior visuals.
        // The number of tiles is relevant because mathematically,
        // the minimum number of tiles that secure a set is 20.
        // Thus, it is possible to have 12 tiles on board but have no set.
        // That is a big problem. It means when the board is created
        // we need to check if there is a set; if not, we need to
        // bring in the cards that form a set. I leave that problem
        // for later.
        this.NUMBER_OF_TILES = 12;

        this.COLORS = ["color-one", "color-two", "color-three"];
        this.shuffledDeck = this.#shuffleDeck(this.#deck);

        this.cardsOnBoard = [];
        this.board = this.#createBoard();
        this.selectedTilesCount = 0;
    }


    rebuildCardsOnBoard() {
        this.cardsOnBoard = [];
        let tiles = Array.from(document.getElementsByClassName("tile"));
        tiles.forEach(tile => {
            this.cardsOnBoard
                .push(
                    tile.dataset.card
                        .split("")
                        .map(char => parseInt(char))
                )
        });
    }

    // TODO: Study and see how the following works.
    // https://stackoverflow.com/a/67473632/1085805
    // toBase(2, 13) // [1, 1, 0, 1]
    // toBase(3, 5) // [0, 0, 1, 2]
    #toBase(base, num) {
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

    #buildDeck() {
        const deck = [];
        for (let i = 0; i < 81; i++) {
            deck.push(this.#toBase(3, i));
        }
        return deck;
    }

    // https://stackoverflow.com/q/2450954/1085805
    #shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = deck[i];
            deck[i] = deck[j];
            deck[j] = temp;
        }
        return deck;
    }

    createTile(boardIndex, card) {
        // Recall that card[2] represents the NUMBER of shapes;
        // thus we loop that many times to create that many shapes.
        for (let i = 0; i <= card[2]; i++) {
            const tile = document.getElementById("tile-no-" + boardIndex);
            tile.classList.add(this.COLORS[card[0]]);
            // The following data attribute is helpful when
            // constructing the set-array-list on board
            tile.dataset.card = card.join("");
            let shape = document.createElement("div");
            shape.classList.add("svg-element")
            if (card[3] === 0) {
                renderCircle(shape, 12, this.COLORS[card[0]], card[1]);
                tile.append(shape);
                continue
            }
            if (card[3] === 1) {
                renderSquare(shape, 12, this.COLORS[card[0]], card[1]);
                tile.append(shape);
                continue
            }
            else {
                renderDiamond(shape, 12, this.COLORS[card[0]], card[1]);
                tile.append(shape);
            }
        }
    }

    #createBoard() {
        for (let i = 0; i < this.NUMBER_OF_TILES; i++) {
            let card = this.shuffledDeck.pop();
            this.createTile(i, card);
            this.cardsOnBoard.push(card);
        }
        console.table(this.cardsOnBoard);
    }

    // https://stackoverflow.com/q/43241174/1085805
    // https://stackoverflow.com/a/74115113/1085805
    // TODO: Right now, I don't understand how the following works.
    combinations(arr, k, prefix = []) {
        if (k == 0) return [prefix];
        return arr.flatMap((v, i) =>
            this.combinations(arr.slice(i + 1), k - 1, [...prefix, v])
        );
    }

    zip = (arr, ...arrs) => {
        return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
    }

    isSet(arr) {
        // Zip the three tiles.
        // testArray = [[1, 0, 0, 1], [2, 1, 2, 0], [0, 2, 1, 1]]
        // zipped = [[1,2,0], [0,1,2], [0,2,1], [1,0,1]]
        // In zipped array, each array represents the values of
        // three set tiles for each property; one for color,
        // one for pattern, one for number, and for shape.
        // According to the rules, a set forms, if each array in the
        // zipped either contains three same elements, or three distinct
        // elements.
        return this.zip(arr[0], arr[1], arr[2])
            // Convert each element, which is an Array
            // to a Set, thus eliminate duplicates.
            .map(array => new Set(array))
            // Now; if the set size is 1, then all the elements
            // have the same values for that property; if the size
            // is three, then all the elements have distinct values
            // for that property. Thus, if have no array with size 2,
            // we have a Set.
            .map(set => set.size)
            .every(size => size != 2);
    }

    getSet() {
        // TODO: It is possible that the 12 tiles do not contain a set
        // Thus we need to do domething for those cases
        // If nothing else, so that getSet() does not crash!
        const combs = this.combinations(this.cardsOnBoard, 3);
        // console.log(comb);
        const validSets = combs.filter(comb => this.isSet(comb));
        // console.table(validSets)
        const rand = Math.floor(Math.random() * validSets.length);
        const tilesOnBoardAsStrings = this.cardsOnBoard.map(array => array.join(""));
        const indexArray = []

        validSets[rand].forEach(arr => {
            for (let i = 0; i < tilesOnBoardAsStrings.length; i++) {
                if (arr.join("") === tilesOnBoardAsStrings[i]) {
                    indexArray.push(i)
                }
            }
        });
        return indexArray
    }

    incSelectedTileCount() {
        this.selectedTilesCount++;
    }

    decSelectedTileCount() {
        this.selectedTilesCount--;
    }

    resetSelectedTilesCount() {
        this.selectedTilesCount = 0;
    }

    isSelectedTileCountLimit() {
        return this.selectedTilesCount === 3;
    }

}

createDomElements();
activateTiles();
activateSetButton();
// createBoard();
const game = new Game();
console.table(game.getSet());

// const UNIT = 12;
// const COLORS = ["color-one", "color-two", "color-three"]
// let this.cardsOnBoard = new Array()
// let tilesRemaining = new Array()
// let tilesRemoved = new Array()
// let selectedTilesCount = 0;
// let sta = new Array()
// console.log(selectedTiles);


// TODO: Study and see how the following works.
// https://stackoverflow.com/a/67473632/1085805
// toBase(2, 13) // [1, 1, 0, 1]
// toBase(3, 5) // [0, 0, 1, 2]
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

// TODO: I don't understand how the following works
// https://gist.github.com/renaudtertrais/25fc5a2e64fe5d0e86894094c6989e10
const zip = (arr, ...arrs) => {
    return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
}

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
}

// https://stackoverflow.com/a/14853974/1085805
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;
    // if the argument is the same array, we can be sure the contents are same as well
    if (array === this)
        return true;
    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
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

function buildSetArray() {

}

const setArray = new Array();
for (let i = 0; i < 81; i++) {
    setArray.push(toBase(3, i))
}

shuffleArray(setArray);

// function createTile(tileId, card) {
//     for (let i = 0; i <= card[2]; i++) {
//         const tile = document.getElementById("tile-no-" + tileId);
//         tile.classList.add(COLORS[card[0]]);
//         // The following data attribute is helpful when
//         // constructing the set-array-list on board
//         tile.dataset.setArray = card.join("");
//         let shape = document.createElement("div");
//         shape.classList.add("svg-element")
//         if (card[3] === 0) {
//             renderCircle(shape, 12, COLORS[card[0]], card[1]);
//             tile.append(shape);
//             continue
//         }
//         if (card[3] === 1) {
//             renderSquare(shape, 12, COLORS[card[0]], card[1]);
//             tile.append(shape);
//             continue
//         }
//         else {
//             renderDiamond(shape, 12, COLORS[card[0]], card[1]);
//             tile.append(shape);
//         }
//     }
// }

// function createBoard() {
//     for (let i = 0; i < game.NUMBER_OF_TILES; i++) {
//         let newTile = setArray.pop();
//         tilesOnBoard.push(newTile);
//         createTile(i, newTile);
//     }
//     console.table(tilesOnBoard);
//     game.updateCardsOnBoard();
// }

function activateTiles() {
    const tiles = Array.from(document.getElementsByClassName("tile-container"));
    tiles.forEach(t => {
        t.addEventListener(
            "click",
            (event) => {
                if (event.target.dataset.state === "selected") {
                    event.target.dataset.state = "idle"
                    game.decSelectedTileCount();
                } else {
                    if (game.isSelectedTileCountLimit()) {
                        processToast("Select 3 tiles only. You can deselect a previously selected tile.")
                        return;
                    }
                    event.target.dataset.state = "selected"
                    game.incSelectedTileCount();
                }
            }
        )
    }
    )
}

function activateSetButton() {
    const button = document.getElementById("set-button");
    button.addEventListener(
        "click",
        (event) => {
            handleSubmit();
        }
    )
}

function handleSubmit() {
    if (game.selectedTilesCount < 3) {
        processToast("Select 3 tiles.");
        return;
    }
    const selectedTiles = Array.from(document.querySelectorAll(`[data-state="selected"]`));
    console.log(selectedTiles);
    // Extract the set from each tile;
    // push the set to setArray, and the index
    // of the tile to the indexArray.
    const cards = new Array();
    const indexArray = new Array();
    selectedTiles.forEach(tile => {
        let indexNo = parseInt(tile.dataset.index);
        indexArray.push(indexNo);
        cards.push(game.cardsOnBoard[indexNo]);
    });
    if (game.isSet(cards)) {
        removeTiles(selectedTiles);
        incrementScore();
        setTimeout(() => {
            buildNewTiles(selectedTiles, indexArray);
        }, 1500);
    } else {
        processToast("Not a valid set.")
    }
}

function removeTiles(selectedTiles) {
    selectedTiles.forEach(tile => {
        tile.classList.add("fade-out");
        game.resetSelectedTilesCount();
        setTimeout(() => {
            removeAllChildNodes(tile);
            tile.className = '';
            tile.classList.add("tile");
        }, 1500);
    });
}

4
// https://stackoverflow.com/q/3955229/1085805
// See the above link for a discussion.
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// function resetSelectedTilesCount() {
//     selectedTilesCount = 0;
// }

function buildNewTiles(selectedTiles, indexArray) {
    selectedTiles.forEach(tile => {
        tile.classList.add("fade-in");
        if (game.shuffledDeck.length > 2) {
            let newTile = game.shuffledDeck.pop();
            let index = indexArray.pop();
            // game.cardsOnBoard[indexArray] = newTile;
            game.createTile(index, newTile);
            tile.dataset.state = "idle";
            tile.classList.remove("fade-in");
        }
    });
    game.rebuildCardsOnBoard();
    console.table(game.cardsOnBoard);
    // console.table(game.getSet());
}


function processToast(message) {
    var toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.visibility = "visible";
    setTimeout(() => {
        toast.style.visibility = "hidden";
    }, 1500);
}





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
        // is three, then all the elements have distinct values
        // for that property. Thus, if have no array with size 2,
        // we have a Set.
        .map(set => set.size)
        .every(size => size != 2);
}

// console.log(checkSet(testArray));

// https://stackoverflow.com/q/43241174/1085805
// https://stackoverflow.com/a/74115113/1085805
// TODO: Right now, I don't understand how the following works.
function combinations(arr, k, prefix = []) {
    if (k == 0) return [prefix];
    return arr.flatMap((v, i) =>
        combinations(arr.slice(i + 1), k - 1, [...prefix, v])
    );
}


// function getSet() {
//     // TODO: It is possible that the 12 tiles do not contain a set
//     // Thus we need to do domething for those cases
//     // If nothing else, so that getSet() does not crash!

//     const h = combinations(tilesOnBoard, 3);
//     const arrayOfSets = h.filter(subArray => checkSet(subArray));
//     const r = Math.floor(Math.random() * arrayOfSets.length);
//     const tilesOnBoardAsStrings = tilesOnBoard.map(array => array.join(""));
//     const indexArray = []

//     arrayOfSets[r].forEach(arr => {
//         for (let i = 0; i < tilesOnBoardAsStrings.length; i++) {
//             if (arr.join("") === tilesOnBoardAsStrings[i]) {
//                 indexArray.push(i)
//             }
//         }
//     });
//     return indexArray
// }

function incrementScore() {
    const score = document.getElementById("score").textContent
    document.getElementById("score").textContent = parseInt(score) + 3;
}


// console.table(getSet());








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
        circle2.classList.add(color);
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
        rect2.classList.add(color);
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
        path2.classList.add(color);
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



function createDomElements() {
    // createModal();
    createMainContainer();
    // createHeader();
    createTop();
    createToast();
    createBoard();
    createTiles();
    createFooter();
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

function createTop() {
    const topSection = document.createElement("div");
    topSection.setAttribute("id", "top-section");
    document.getElementById("main-container").append(topSection);

    const scoreboard = document.createElement("div");
    scoreboard.setAttribute("id", "scoreboard");
    scoreboard.classList.add("top-section");
    topSection.append(scoreboard);

    const scoreLabel = document.createElement("div");
    scoreLabel.setAttribute("id", "score-label");
    scoreLabel.classList.add("scoreboard");
    scoreLabel.textContent = "Score:";
    scoreboard.append(scoreLabel);

    const score = document.createElement("div");
    score.setAttribute("id", "score");
    score.classList.add("score");
    score.textContent = "0";
    scoreboard.append(score);

}

function createToast() {
    const mainContainer = document.getElementById("main-container");
    const toast = document.createElement("div");
    toast.setAttribute("id", "toast");
    toast.textContent = ("I am a toast!")
    mainContainer.append(toast);
}


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
            tileContainer.dataset.state = "idle";
            tileContainer.classList.add("tile-container");

            tileRow.append(tileContainer);
            let tile = document.createElement("div");
            tile.setAttribute("id", "tile-no-" + tileCounter);
            tile.classList.add("tile");
            tile.dataset.index = tileCounter;
            tileCounter++;
            tileContainer.append(tile);
        }
    }
}

function createFooter() {
    const footer = document.createElement("div");
    footer.setAttribute("id", "footer");
    document.getElementById("main-container").append(footer);

    const button = document.createElement("button");
    button.setAttribute("id", "set-button");
    button.type = "button";
    button.classList.add("footer")
    button.textContent = "Submit SET";
    footer.append(button);

    // const scoreboard = document.createElement("div");
    // scoreboard.setAttribute("id", "scoreboard");
    // scoreboard.classList.add("footer");
    // footer.append(scoreboard);

    // const scoreLabel = document.createElement("div");
    // scoreLabel.setAttribute("id", "score-label");
    // scoreLabel.classList.add("scoreboard");
    // scoreLabel.textContent = "Score:";
    // scoreboard.append(scoreLabel);

    // const score =  document.createElement("div");
    // score.setAttribute("id", "score");
    // score.classList.add("score");
    // score.textContent = "0";
    // scoreboard.append(score);
}