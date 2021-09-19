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
    you.neck = you.body[1]
    board.edge = {
        width: gameState.board.width - 1,
        height: gameState.board.height - 1
    }
    const possibleMoves = boundaryCheck(you.head, board);
    const scoreGrid = createScoreGrid(board, you)
    const choice = chooseMove(you.head, scoreGrid, possibleMoves)
    // TODO: Step 1 - Don't hit walls.
    const response = {
        move: choice,
    }

    console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`)
    return response
}
function boundaryCheck(myHead, board) {
    let possibleMoves = {
        up: true,
        down: true,
        left: true,
        right: true
    }
    const edges = {
        up: myHead.y === board.edge.height,
        down: myHead.y === 0,
        left: myHead.x === 0,
        right: myHead.x === board.edge.width,
    }
    let moves = Object.values(possibleMoves);
    Object.values(edges).forEach((edge, index) => {
        if (edge) moves[index] = false;
    })
    possibleMoves = {
        up: moves[0],
        down: moves[1],
        left: moves[2],
        right: moves[3]
    }
    return possibleMoves
}
function chooseMove(myHead, scoreGrid, possibleMoves) {    // get scores of cells adjacent to head
    scoreGrid[myHead.x + 1] = scoreGrid[myHead.x + 1] || []
    scoreGrid[myHead.y + 1] = scoreGrid[myHead.y + 1] || []
    scoreGrid[-1] = scoreGrid[-1] || []
    const score = {
        up: scoreGrid[myHead.x][myHead.y + 1],
        down: scoreGrid[myHead.x][myHead.y - 1],
        left: scoreGrid[myHead.x - 1][myHead.y],
        right: scoreGrid[myHead.x + 1][myHead.y]
    }
    Object.values(score).forEach((value, index) => {
        if (value < 0) Object.values(possibleMoves)[index] = false
    })
    const safeMoves = Object.keys(possibleMoves).filter(
        key => possibleMoves[key]
    )
    const sortedMoves = safeMoves.sort((a, b) => {
        return score[b] - score[a]
    })
    // sort possible moves by score
    const bestMove = (sortedMoves.length === 0) ? sortedMoves[random(sortedMoves.length)] : sortedMoves[0]
    return bestMove
}

    // Use information in gameState to prevent your Battlesnake from moving beyond the boundaries of the board.
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
    scoreFood(scoreGrid, board, board.food, true)
    scoreSnakes(scoreGrid, board.snakes, board)
    return scoreGrid
}
function scoreSelf(scoreGrid, board, you) {
    const myBody = you.body
    for (let i = 0; i < myBody.length; i++) {
        scoreGrid[myBody[i].x][myBody[i].y] -= 20
    }
    scoreGrid[you.head.x][you.head.y] -= 30;
    scoreGrid[you.neck.x][you.neck.y] -= 79;

    getAdjacentCells(you.body, board).forEach(
        cell => scoreGrid[cell.x][cell.y] -= 5
    )
}
function scoreFood(scoreGrid, board, food, isHungry = true) {
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
