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
    let possibleMoves = {
        up: true,
        down: true,
        left: true,
        right: true
    }

    // Step 0: Don't let your Battlesnake move back on its own neck
    const myHead = gameState.you.head
    const myNeck = gameState.you.body[1]
    const myBody = gameState.you.body

    // TODO: Step 1 - Don't hit walls.
    // Use information in gameState to prevent your Battlesnake from moving beyond the boundaries of the board.
    const board = {
        x: gameState.board.width - 1,
        y: gameState.board.height - 1
    }

    const isHungry = gameState.you.health < 50

    function createScoreGrid(gameState) {
        const scoreGrid = []
        // initial score grid
        for (let i = 0; i < gameState.board.width; i++) {
            scoreGrid[i] = []
            for (let j = 0; j < gameState.board.height; j++) {
                scoreGrid[i][j] = 10
            }
        }
        scoreSelf(gameState, scoreGrid)
        scoreFood(gameState, scoreGrid)
        scoreSnakes(gameState, scoreGrid)
        return scoreGrid
    }
    function scoreSnakes(gameState, scoreGrid) {
        // get coordinates of all snake positions
        const snakeCoords = []
        for (let i = 0; i < gameState.board.snakes.length; i++) {
            for (let j = 0; j < gameState.board.snakes[i].body.length; j++) {
                snakeCoords.push(gameState.board.snakes[i].body[j])
            }
        }
        snakeCoords.forEach(coord => {
            scoreGrid[coord.x][coord.y] -= 12
        })
        getAdjacentCells(snakeCoords, gameState.board).forEach(
            cell => scoreGrid[cell.x][cell.y] -= 8
        )
    }
    function scoreSelf(gameState, scoreGrid) {
        for (let i = 0; i < gameState.you.body.length; i++) {
            scoreGrid[myBody[i].x][myBody[i].y] -= 20
        }
        scoreGrid[myHead.x][myHead.y] -= 10;
        scoreGrid[myNeck.x][myNeck.y] -= 10;

        getAdjacentCells(myBody, gameState.board).forEach(
            cell => scoreGrid[cell.x][cell.y] -= 5
        )
    }
    function scoreFood(gameState, scoreGrid) {
        // food increases cell score
        for (let i = 0; i < gameState.board.food.length; i++) {
            scoreGrid[gameState.board.food[i].x][gameState.board.food[i].y] += isHungry ? 10 : -6
        }
        // cells adjacent to food get a bonus
        getAdjacentCells(gameState.board.food, gameState.board).forEach(
            cell => cell += isHungry ? 5 : 2
        )
    }

    function scoreNextMove() {
        const scoreGrid = createScoreGrid(gameState)
        const head = myHead
        // get scores of cells adjacent to head
        scoreGrid[head.x + 1] = scoreGrid[head.x + 1] || []
        scoreGrid[head.y + 1] = scoreGrid[head.y + 1] || []
        scoreGrid[-1] = scoreGrid[-1] || []
        const score = {
            up: scoreGrid[head.x][head.y + 1],
            down: scoreGrid[head.x][head.y - 1],
            left: scoreGrid[head.x - 1][head.y],
            right: scoreGrid[head.x + 1][head.y]
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
        console.table(scoreGrid)

        return bestMove
    }

    function boundaryCheck() {
        const edges = {
            up: myHead.y === board.y,
            down: myHead.y === 0,
            left: myHead.x === 0,
            right: myHead.x === board.x,
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
    }
    boundaryCheck();

    const response = {
        move: scoreNextMove()
    }

    console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`)
    return response
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
