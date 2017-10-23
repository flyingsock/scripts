const universe = document.getElementById("universe");
const context = universe.getContext("2d");

const fieldSize = 300;
const cellSize = 2;

context.fillStyle = "#FFFFFF";
context.fillRect(0, 0, fieldSize, fieldSize);

var field;
var intervalID;

function init() {
    field = new Array(fieldSize);
    for (let i = 0; i < field.length; i++) {
        field[i] = new Array(fieldSize);
    }
}

function initialGen() {
    for (i = 0; i < field.length; i++) {
        for (j = 0; j < field.length; j++) {
            field[i][j] = Math.floor(0.1 + Math.random());
        }
    }

    draw();
}

function checkMooreSurrounding(x, y) {
    let coordPairs = [];
    let width = field.length;
    let height = field[0].length;

    coordPairs.push({ xCoord: x - 1 <= 0 ? width - 1 : x - 1, yCoord: y });
    coordPairs.push({ xCoord: x + 1 >= width ? 0 : x + 1, yCoord: y });
    coordPairs.push({ xCoord: x, yCoord: y - 1 <= 0 ? height - 1 : y - 1 });
    coordPairs.push({ xCoord: x, yCoord: y + 1 >= height ? 0 : y + 1 });

    coordPairs.push({ xCoord: x - 1 <= 0 ? width - 1 : x - 1, yCoord: y - 1 <= 0 ? height - 1 : y - 1 });
    coordPairs.push({ xCoord: x + 1 >= width ? 0 : x + 1, yCoord: y + 1 >= height ? 0 : y + 1 });
    coordPairs.push({ xCoord: x + 1 >= width ? 0 : x + 1, yCoord: y - 1 <= 0 ? height - 1 : y - 1 });
    coordPairs.push({ xCoord: x - 1 <= 0 ? width - 1 : x - 1, yCoord: y + 1 >= height ? 0 : y + 1 });

    let alivesCount = 0;
    for (let i = 0; i < coordPairs.length; i++) {
        let x = coordPairs[i].xCoord;
        let y = coordPairs[i].yCoord;


        alivesCount += field[x][y];
    }

    return alivesCount;
}

function nextGen() {
    let newState = new Array(fieldSize);
    for (let i = 0; i < field.length; i++) {
        newState[i] = new Array(fieldSize);
    }
    for (i = 0; i < field.length; i++) {
        for (j = 0; j < field.length; j++) {
            let alivesCount = checkMooreSurrounding(i, j, field);

            if (field[i][j] === 0 && alivesCount === 3) {
                newState[i][j] = 1;
            } else if (field[i][j] === 1 && (alivesCount > 3 || alivesCount < 2)) {
                newState[i][j] = 0;
            } else {
                newState[i][j] = field[i][j];
            }

        }
    }

    if (statesSame(field, newState) || allAreDead(newState)) {
        alert("The Life is Over");
        clearInterval(intervalID);
    } else {
        field = newState;
        draw();
    }
}

function draw() {
    context.clearRect(0, 0, fieldSize, fieldSize);
    for (i = 0; i < field.length; i++) {
        for (j = 0; j < field.length; j++) {
            if (field[i][j] == 0) {
                context.fillStyle = '#FFFFFF';
            } else {
                context.fillStyle = '#29B6F6';
                context.fillRect(cellSize * i, cellSize * j, cellSize, cellSize);
            }
        }
    }
}

function statesSame(currentState, nextState) {
    for (i = 0; i < field.length; i++) {
        for (j = 0; j < field.length; j++) {
            if (currentState[i][j] != nextState[i][j]) {
                return false;
            }
        }
        return true;
    }
}

function allAreDead(currentState) {
    for (i = 0; i < field.length; i++) {
        for (j = 0; j < field.length; j++) {
            if (currentState[i][j] != 0) {
                return false;
            }
        }
        return true;
    }
}

window.setTimeout(init, 750);
window.setTimeout(initialGen, 750);
intervalID = window.setInterval(nextGen, 750);