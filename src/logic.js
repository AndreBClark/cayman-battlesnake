function info() {
    console.log("INFO")
    const response = {
        apiversion: "1",
        author: "AndreBClark",
        color: "#7EB33D",
        head: "caffeine",
        tail: "default"
    }
    return response
}

function start(gameState) {
    console.log(`${gameState.game.id} START`)
}

function end(gameState) {
    console.log(`${gameState.game.id} END\n`)
}
function move(gameState) {
    const { you, board } = gameState
    let possibleMoves = {
        up: you.head.y < board.height - 1,
        down: you.head.y > 0,
        left: you.head.x > 0,
        right: you.head.x < board.width - 1,
    };
    you.neck = you.body[1]
    you.isHungry = you.health < 50
    const scoreGrid = createScoreGrid(board, you)
    // TODO: Step 1 - Don't hit walls.
    const response = {
        move: chooseMove(you.head, scoreGrid, possibleMoves)
    }

    console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`)
    return response
}

function chooseMove(myHead, scoreGrid, possibleMoves) {
    // get scores from adjacent cells
    const adjacentScores = getAdjacentCells(myHead, scoreGrid)
        .map(cell => scoreGrid[cell.x][cell.y])
    // foreach negative adjacent score set possiblemoves to false
    adjacentScores.forEach((score, index) => {
        Object.values(possibleMoves)[index] = score < 0
    })
    const safeMoves = Object.keys(possibleMoves)
        .filter(key => possibleMoves[key])
    // sort possible moves by adjacentscore
    const sortedMoves = safeMoves
        .sort((a, b) => adjacentScores[safeMoves[a]] - adjacentScores[safeMoves[b]])
    return sortedMoves[sortedMoves.length - 1]
}
function createScoreGrid(board, you) {
    const scoreGrid = []
    // initial score grid
    for (let i = 0; i < board.width; i++) {
        scoreGrid[i] = []
        for (let j = 0; j < board.height; j++) {
            scoreGrid[i][j] = 10
        }
    }
    scoreSelf(scoreGrid, board, you)
    scoreFood(scoreGrid, board, board.food, you.isHungry)
    scoreSnakes(scoreGrid, board.snakes, board)
    return scoreGrid
}
function scoreSelf(scoreGrid, board, you) {
    const myBody = you.body
    for (let i = 0; i < you.length - 1; i++) {
        scoreGrid[myBody[i].x][myBody[i].y] -= 20
    }
    scoreGrid[you.head.x][you.head.y] -= 30;
    scoreGrid[you.neck.x][you.neck.y] -= 79;

    getAdjacentCells(you.body, board).forEach(
        cell => scoreGrid[cell.x][cell.y] -= 5
    )
}
function scoreFood(scoreGrid, board, food, isHungry) {
    // food increases cell score
    for (let i = 0; i < food.length; i++) {
        scoreGrid[food[i].x][food[i].y] += isHungry ? 10 : -6
    }
    // cells adjacent to food get a bonus
    getAdjacentCells(food, board).forEach(
        cell => cell += isHungry ? 5 : 2
    )
}
function scoreSnakes(scoreGrid, snakes, board) {
    // get coordinates of all snake positions
    const snakeCoords = []
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes[i].body.length; j++) {
            snakeCoords.push(snakes[i].body[j])
        }
    }
    snakeCoords.forEach(coord => {
        scoreGrid[coord.x][coord.y] -= 12
    })
    getAdjacentCells(snakeCoords, board).forEach(
        cell => scoreGrid[cell.x][cell.y] -= 8
    )
}


function getAdjacentCells(cells, area) {
    const adjacentCells = []
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].x > 0) {
            adjacentCells.push({
                x: cells[i].x - 1,
                y: cells[i].y
            })
        }
        if (cells[i].x < area.width - 1) {
            adjacentCells.push({
                x: cells[i].x + 1,
                y: cells[i].y
            })
        }
        if (cells[i].y > 0) {
            adjacentCells.push({
                x: cells[i].x,
                y: cells[i].y - 1
            })
        }
        if (cells[i].y < area.height - 1) {
            adjacentCells.push({
                x: cells[i].x,
                y: cells[i].y + 1
            })
        }
    }
    return adjacentCells
}

module.exports = {
    info: info,
    start: start,
    move: move,
    end: end
}
