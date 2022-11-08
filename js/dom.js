
export function createDomElements() {
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

    const score =  document.createElement("div");
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