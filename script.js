// import { createDomElements } from './js/dom.js';
// import { renderCircle, renderSquare, renderDiamond } from './js/render.js';
const pause = _ => new Promise(resolve => setTimeout(resolve, _));

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

// a = ["a", "b", "c"], b = ["b", "c"]
// a = a.deleteItems(b) --> ["a"]
Array.prototype.deleteItems = function (delArray) {
    return this.filter(item => !delArray.includes(item))
}


/* -------------------------------------------------------------------------- */
/*                              Utility Functions                             */
/* -------------------------------------------------------------------------- */
function qs(selector, parent = document) {
    return parent.querySelector(selector)
}

function qsa(selector, parent = document) {
    return [...parent.querySelectorAll(selector)]
}

function gebcn(className) {
    return Array.from(document.getElementsByClassName(className));
}
/* -------------------------------------------------------------------------- */

// stringToArray("2622") --> [2, 6, 2, 2]
function stringToArray(str) {
    return str.split("").map(char => parseInt(char))
}

// TODO: Study and see how the following works.
// https://stackoverflow.com/a/67473632/1085805
// toBase(2, 13) --> [1, 1, 0, 1]
// toBase(3, 5) --> [0, 0, 1, 2]
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

// Nice combination generator.
// Make sure you understand how it works.
// https://gist.github.com/xuab/c96bd47769ec459b60db8da4e796a0ff
function* kSubsets(l, k) {
    if (k < 1) return yield []
    for (let i of Array(l.length - k + 1).keys())
        for (let set of kSubsets(l.slice(i + 1), k - 1))
            yield [l[i], ...set]
}

// https://stackoverflow.com/q/43241174/1085805
// https://stackoverflow.com/a/74115113/1085805
// TODO: Right now, I don't understand how the following works.
function combination(arr, k, prefix = []) {
    if (k == 0) return [prefix];
    return arr.flatMap((v, i) =>
        this.combination(arr.slice(i + 1), k - 1, [...prefix, v])
    );
}

const zip = (arr, ...arrs) => {
    return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
}


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
        // this.cardsOnBoard = [];

        // The following array function as an intermediary list of cards.
        // It holds 21 cards. (It has been mathematically proven that
        // a list of 21 cards must include a set. Thus, there are
        // arrengements where a 20-card list does not contain a set.)
        // The idea is to find a set, combine those 3 cards with 9 other
        // random cards, and then populate the board with those 12 cards.
        this.iCards = this.buildICards();
        // this.board = this.buildInitCardsOnBoard();
        // this.selectedTilesCount = 0;
        // this.selectedCards = [];
        // this.selectedCardsIndices = [];
        this.initilizeBoard();
    }





    #buildDeck() {
        const deck = [];
        for (let i = 0; i < 81; i++) {
            deck.push(toBase(3, i));
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
            tile.dataset.state = "idle";
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

    buildICards() {
        const cards = [];
        for (let i = 0; i < 21; i++) {
            let card = this.shuffledDeck.pop();
            cards.push(card);
        }
        return cards;
    }

    /*
    We need to maintain 12 cards in iCards. (As long as we can, of course.)
    When a valid Set is submitted, we will have 9 cards on board, and with the
    12 cards in iCards, we can: (1) check whether the remaining tiles include
    a set; if so, we just end 3 more cards to the board; else (2) we can check
    which 3 cards addition will ensure a set. The problem we need to find
    a neat solution is that we may need 1, 2, or 3 specific cards from iCards.
    I think the *kSubesets function generator will handle that.
    */
    rebuildICards() {
        const shuffledDeck = this.shuffledDeck.length > 0;
        const iCards = this.iCards.length < 12;
        if (shuffledDeck && iCards) {
            for (let i = 0; i < 3; i++) {
                let card = this.shuffledDeck.pop();
                this.iCards.push(card);
            }
        }
    }

    initilizeBoard() {
        let set = [];
        let initCards = [];
        const combGenerator = kSubsets(this.iCards, 3);
        while (true) {
            let comb = combGenerator.next().value;
            if (this.isSet(comb)) {
                initCards.push(...comb)
                set = comb
                break;
            }
        }

        // https://stackoverflow.com/a/20690490/1085805
        // Make the following an Array.prototype method
        this.iCards = this.iCards.filter(item => !set.includes(item))

        // The true part is to make sure that iCards in not empty
        let counter = 1
        while (true && initCards.length < 12) {
            let card = this.iCards.pop();
            initCards.push(card);
            counter++;
        }

        // Right now, the first three cards in cardsOnBoard
        // form a set, thus we need to shuffle it before
        // populating the board.
        this.#shuffleDeck(initCards);
        // console.table("Cards on board shuffled:");
        // console.table(initCards);

        // Now we populate the board.
        for (let i = 0; i < initCards.length; i++) {
            this.createTile(i, initCards[i]);
        }

        this.rebuildICards();
        // console.log("iCards after init:")
        // console.table(this.iCards);
        // console.log("cards on board:")
        // console.table(initCards);
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

    getSet() {
        const cards = cardsOnBoard()
        const combs = combination(cards, 3);
        const validSets = combs.filter(comb => this.isSet(comb));
        // console.table(validSets);
        const rand = Math.floor(Math.random() * validSets.length);
        const cardsAsString = cards.map(array => array.join(""));
        let indexArray = []

        validSets[rand].forEach(arr => {
            for (let i = 0; i < cardsAsString.length; i++) {
                if (arr.join("") === cardsAsString[i]) {
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

    incrementScore() {
        const score = document.getElementById("score").textContent
        document.getElementById("score").textContent = parseInt(score) + 3;
    }

}

createDomElements();
activateTiles();
activateSetButton();
// createBoard();
const game = new Game();
console.log("Set: " + game.getSet());

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

// // TODO: I don't understand how the following works
// // https://gist.github.com/renaudtertrais/25fc5a2e64fe5d0e86894094c6989e10
// const zip = (arr, ...arrs) => {
//     return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
// }





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

// function activateTiles() {
//     const tiles = Array.from(document.getElementsByClassName("tile-container"));
//     tiles.forEach(t => {
//         t.addEventListener(
//             "click",
//             (event) => {
//                 if (event.target.dataset.state === "selected") {
//                     event.target.dataset.state = "idle"
//                     game.decSelectedTileCount();
//                 } else {
//                     if (game.isSelectedTileCountLimit()) {
//                         processToast("Select 3 tiles only. You can deselect a previously selected tile.")
//                         return;
//                     }
//                     event.target.dataset.state = "selected"
//                     game.incSelectedTileCount();
//                 }
//             }
//         )
//     }
//     )
// }

function cardsOnBoard() {
    cards = []
    tiles = gebcn("tile");
    tiles.forEach(tile => {
        cards.push(stringToArray(tile.dataset.card));
    });
    return cards;
}





function activateTiles() {
    // const tiles = gebcn("tile");
    gebcn("tile").forEach(tile => {
        tile.addEventListener(
            "click",
            (event) => {
                if (event.target.dataset.state === "selected") {
                    event.target.dataset.state = "idle"
                    return;
                }
                if (qsa('[data-state="selected"]').length === 3) {
                    processToast("Select 3 cards only.")
                    return;
                } else {
                    event.target.dataset.state = "selected"
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

    const selectedTiles = qsa('[data-state="selected"]');

    /* -------- Has the user selected the required number of cards? --------- */
    if (selectedTiles.length < 3) {
        processToast("Select 3 cards.");
        return;
    }
    /* ---------------------------------------------------------------------- */

    /* -------- Yes. Process selectedTiles for further computations. -------- */
    let selectedCards = [];
    let cardIndices = [];
    selectedTiles.forEach(tile => {
        cardIndices.push(parseInt(tile.dataset.index));
        selectedCards.push(stringToArray(tile.dataset.card));
    });
    /* ---------------------------------------------------------------------- */

    /* ---------------- Does the selection form a valid Set? ---------------- */
    if (!game.isSet(selectedCards)) {
        processToast("Not a valid Set.")
        return;
    }
    /* ---------------------------------------------------------------------- */

    /* ------ We have a valid Set. First order of business: incScore() ------ */
    game.incrementScore();
    /* ---------------------------------------------------------------------- */

    /* -------------- Rebuild iCards; check whether it is empty ------------- */
    game.rebuildICards();
    // console.log("iCards after rebuild:");
    // console.table(game.iCards);
    iCards = game.iCards.length != 0;
    /* ---------------------------------------------------------------------- */


    /* ------------------------ We have a valid Set. ------------------------ */
    /*
    From here on, we move with respect to whether there are more cards to come
    and whether the remaining tiles on board include a Set.
    (1) If iCards empty:
        (a) and no Set in remaining tiles --> GameOver().
        (b) but we have a Set --> keep playing without rebuilding the board.

    (2) If iCards !empty:
        (a) if we've a Set in the remaining tiles, just get 3 cards from iCards
        (b) if not, check whether there is a Set at all. (Recall that if iCards
            has 9 cards, then we are ensured a Set, else it is possible that
            there is no Set.) If no Set --> GameOver()
        (c) if there is a Set, get those 3 cards.
            Side Note: It is BARELY possible that no two-card combination in
            iCards make a Set, thus the 3 new cards form a Set. In such a case
            perhaps it is better to shuffle the board; but I think that is a
            bad idea for several reasons. Short of the long: just not worth it.

    Let us know whether iCards is empty or not; and check whether the
    remaining tiles have a Set and store those two Boolean values.
    */
    /* ----------------------------------------------------------------------- */


    /* -------------- Check if there is a Set in remaning tiles ------------- */
    let = setFoundInRemainingTiles = false;
    let remainingTiles = qsa('[data-state="idle"]');
    let remainingCards = [];
    remainingTiles.forEach(tile => {
        remainingCards.push(stringToArray(tile.dataset.card));
    });
    let rcCombGenerator = kSubsets(remainingCards, 3);

    for (let comb of rcCombGenerator) {
        if (game.isSet(comb)) {
            setFoundInRemainingTiles = true;
            // console.log("comb: " + comb);
            break;
        }
    }
    console.log("Set found in remaning tiles: " + setFoundInRemainingTiles);
    /* ---------------------------------------------------------------------- */


    /* ----------- If no more cards and no more Set --> GameOver() ---------- */
    // TODO: we need to remove the last 3 tiles from last Set
    if (!iCards && !setFoundInRemainingTiles) {
        gameOver();
        return;
    }
    /* ---------------------------------------------------------------------- */


    /* --------------------- iCards empty BUT Set found --------------------- */
    if (!iCards && setFoundInRemainingTiles) {
        selectedTiles.forEach(tile => {
            tile.classList.add("fade-out");
            setTimeout(() => {
                removeAllChildNodes(tile);
                // tile.className = '';
                // tile.classList.add("tile");
                // let newCard = game.iCards.pop();
                // game.createTile(parseInt(tile.dataset.index), newCard)
                // tile.classList.add("fade-in");
                // setTimeout(() => { tile.classList.remove("fade-in") }, 1500);
            }, 1500);
        });
        setTimeout(() => { console.log("Set1: " + game.getSet()) }, 1500);
        return;
    }

    /* ------------------- iCards not empty AND Set found ------------------- */
    if (setFoundInRemainingTiles) {
        selectedTiles.forEach(tile => {
            tile.classList.add("fade-out");
            setTimeout(() => {
                removeAllChildNodes(tile);
                tile.className = '';
                tile.classList.add("tile");
                let newCard = game.iCards.pop();
                game.createTile(parseInt(tile.dataset.index), newCard)
                tile.classList.add("fade-in");
                setTimeout(() => { tile.classList.remove("fade-in") }, 1500);
            }, 1500);
        });
        setTimeout(() => { console.log("Set2: " + game.getSet()) }, 1500);
        return;
    }

    /* ----------------- No Set, then try combs from iCards ----------------- */
    let setFound = false;
    let suitableComb = []
    let iCardsCombGenerator = kSubsets(game.iCards, 3);
    outerLoop:
    for (let iComb of iCardsCombGenerator) {
        let tempArray = [...remainingCards].concat(iComb);
        let combGenerator = kSubsets(tempArray, 3);
        for (let comb of combGenerator) {
            if (game.isSet(comb)) {
                suitableComb = [...iComb]
                break outerLoop;
            }
        }
    }
    /* --------------------- If no more Set, gameOver() --------------------- */
    // if (!setFound) {
    //     gameOver();
    // }
    /* ---------------------------------------------------------------------- */

    /* ---------------------- We must have Set from iCards ---------------------- */
    // console.log("suitable comb: " + suitableComb);
    game.iCards = game.iCards.deleteItems(suitableComb);
    // console.log("selected tiles" + selectedTiles);
    selectedTiles.forEach(tile => {
        tile.classList.add("fade-out");
        setTimeout(() => {
            removeAllChildNodes(tile);
            tile.className = '';
            tile.classList.add("tile");
            let newCard = suitableComb.pop();
            game.createTile(parseInt(tile.dataset.index), newCard)
            // console.log("dataset.index" + tile.dataset.index);
            // console.log("newCard: " + newCard);
            tile.classList.add("fade-in");
            setTimeout(() => { tile.classList.remove("fade-in") }, 1500);
        }, 1500);
    });
    setTimeout(() => { console.log("Set3: " + game.getSet()) }, 1500);
}




// async function removeTiles(tile) {

//     await pause(1500);
//     removeAllChildNodes(tile);
//     tile.className = '';
//     tile.classList.add("tile");
//     let newCard = game.iCards.pop();
//     console.log(newCard);
//     console.log(parseInt(tile.dataset.index));
//     game.createTile(parseInt(tile.dataset.index), newCard)
//     tile.classList.add("fade-in");

//     await pause(3000);
//     tile.classList.remove("fade-in")

// }





function removeFadeIn() {
    tiles = gebcn("fade-in")
    tiles.forEach(tile => {
        tile.classList.remove("fade-in");
    });
}






function removeTiles(selectedTiles) {
    selectedTiles.forEach(tile => {
        tile.classList.add("fade-out");
        // game.resetSelectedTilesCount();
        setTimeout(() => {
            removeAllChildNodes(tile);
            // Remove the classes and assign "tile" class again;
            // else the tile will have multiple color classes.
            tile.className = '';
            tile.classList.add("tile");
        }, 1500);
    });
}

// https://stackoverflow.com/q/3955229/1085805
// See the above link for a discussion.
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


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

function gameOver() {
    console.log("GAME OVER!!")
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
            // const tileContainer = document.createElement("div");
            // tileContainer.dataset.state = "idle";
            // tileContainer.classList.add("tile-container");

            // tileRow.append(tileContainer);
            let tile = document.createElement("div");
            tile.setAttribute("id", "tile-no-" + tileCounter);
            tile.classList.add("tile");
            tile.dataset.state = "idle";
            tile.dataset.index = tileCounter;
            tileCounter++;
            tileRow.append(tile);
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