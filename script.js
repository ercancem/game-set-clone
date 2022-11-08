import { createDomElements } from './js/dom.js';
import { renderCircle, renderSquare, renderDiamond } from './js/render.js';

const COLORS = ["color-one", "color-two", "color-three"]

// The four numbers in the tile array represent these properties:
// [color, pattern, number, shape]

// const FILLINGS = ["nofill", "pattern", "solid"]
// const NUMBERS = ["one", "two", "three"]
// const SHAPES = ["shape-one", "shape-two", "shape-three"]

const UNIT = 12;

let tilesOnBoard = new Array()
let tilesRemaining = new Array()
let tilesRemoved = new Array()
let selectedTiles = 0;
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

const tileSet = new Array();
for (let i = 0; i < 81; i++) {
    tileSet.push(toBase(3, i))
}

shuffleArray(tileSet);

function tileBuilder(tileId, tileArray) {
    console.log("inside tile builder");
    console.log("tileID: " + tileId);
    console.log("tileArray: " + tileArray);
    for (let i = 0; i <= tileArray[2]; i++) {
        const tile = document.getElementById("tile-no-" + tileId);
        // tilePos.parentElement.classList.add(COLORS[tileArray[0]]);
        tile.classList.add(COLORS[tileArray[0]]);
        // tile.dataset.positionIndex = tileArray[2];
        let shape = document.createElement("div");
        shape.classList.add("svg-element")
        if (tileArray[3] === 0) {
            renderCircle(shape, 12, COLORS[tileArray[0]], tileArray[1]);
            tile.append(shape);
            continue
        }
        if (tileArray[3] === 1) {
            renderSquare(shape, 12, COLORS[tileArray[0]], tileArray[1]);
            tile.append(shape);
            continue
        }
        else {
            renderDiamond(shape, 12, COLORS[tileArray[0]], tileArray[1]);
            tile.append(shape);
        }
    }

}

function boardBuilder() {
    for (let i = 0; i < 12; i++) {
        let newTile = tileSet.pop();
        tilesOnBoard.push(newTile);
        tileBuilder(i, newTile);
    }
    console.log(tilesOnBoard);
}

function activateTiles() {
    const tiles = Array.from(document.getElementsByClassName("tile-container"));
    // console.log(tiles);
    tiles.forEach(t => {
        t.addEventListener(
            "click",
            (event) => {
                if (event.target.dataset.state === "selected") {
                    event.target.dataset.state = "idle"
                    selectedTiles--;
                    console.log(selectedTiles);
                } else {
                    if (selectedTiles === 3) {
                        processToast("You can select 3 tiles only.")
                        return;
                    }
                    event.target.dataset.state = "selected"
                    selectedTiles++;
                    console.log(selectedTiles);
                }
            }
        )
    }
    )
}

// TODO: activateSetButton function does too much. Refactor.
function activateSetButton() {
    const button = document.getElementById("set-button");
    button.addEventListener(
        "click",
        (event) => {
            const selectedTiles = Array.from(document.querySelectorAll(`[data-state="selected"]`));
            const selectedTilesArray = new Array();
            const indexArray = new Array();
            selectedTiles.forEach(tile => {
                let indexNo = parseInt(tile.dataset.index);
                selectedTilesArray.push(tilesOnBoard[indexNo]);
                indexArray.push(indexNo);
            });
            console.log(selectedTiles);
            console.log(selectedTilesArray);
            handleSubmit(selectedTilesArray, indexArray);
        }
    )

}

function handleSubmit(selectedTilesArray, indexArray) {
    if (checkSet(selectedTilesArray)) {
        selectedTilesArray.forEach(tile => {
            tilesRemoved.push([tile]);
        });
        removeTiles();
        setTimeout(() => {
            buildNewTiles(indexArray);
        }, 1500);
        // buildNewTiles(indexArray);
    } else {
        processToast("Not a valid set.")
        setToastTimer();
    }
}

function removeTiles() {
    const selectedTiles = Array.from(document.querySelectorAll(`[data-state="selected"]`));
    selectedTiles.forEach(tile => {
        tile.classList.add("fade-out");
        tile.dataset.state = "empty";
    });
}


// https://stackoverflow.com/q/3955229/1085805
// See the above link for a discussion.
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function buildNewTiles(indexArray) {
    const selectedTiles = Array.from(document.querySelectorAll(`[data-state="empty"]`));
    selectedTiles.forEach(tile => {
        tile.classList.remove("fade-out");
        removeAllChildNodes(tile);
        tile.classList.add("fade-in");
        let newTile = tileSet.pop();
        console.log("new tile: " + newTile);
        let index = indexArray.pop();
        console.log("new index: " + index);
        tileBuilder(index, newTile);

        tile.dataset.state = "idle";
    });
}


function processToast(message) {
    var toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.visibility = "visible";
    setTimeout(() => {
        toast.style.visibility = "hidden";
    }, 1500);
}


createDomElements();
activateTiles();
activateSetButton();
boardBuilder();


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
        // is three, then all the elements have distinct values
        // for that property. Thus, if have no array with size 2,
        // we have a Set.
        .map(set => set.size)
        .every(size => size != 2);
}

console.log(checkSet(testArray));

// https://stackoverflow.com/q/43241174/1085805
// https://stackoverflow.com/a/74115113/1085805
// TODO: Right now, I don't understand how the following works.
function combinations(arr, k, prefix = []) {
    if (k == 0) return [prefix];
    return arr.flatMap((v, i) =>
        combinations(arr.slice(i + 1), k - 1, [...prefix, v])
    );
}


function getSet() {
    // TODO: It is possible that the 12 tiles do not contain a set
    // Thus we need to do domething for those cases
    // If nothing else, so that getSet() does not crash!

    const h = combinations(tilesOnBoard, 3);
    const arrayOfSets = h.filter(subArray => checkSet(subArray));
    const r = Math.floor(Math.random() * arrayOfSets.length);
    const tilesOnBoardAsStrings = tilesOnBoard.map(array => array.join(""));
    const indexArray = []

    arrayOfSets[r].forEach(arr => {
        for (let i = 0; i < tilesOnBoardAsStrings.length; i++) {
            if (arr.join("") === tilesOnBoardAsStrings[i]) {
                indexArray.push(i)
            }
        }
    });
    return indexArray
}


console.log(getSet());








