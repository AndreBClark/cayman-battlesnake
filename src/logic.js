function info() {
    console.log("INFO")
    const response = {
        apiversion: "1",
        author: "",
        color: "#888888",
        head: "default",
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
    function avoidNeck() {
        if (myNeck.x < myHead.x) possibleMoves.left = false
        else if (myNeck.x > myHead.x) possibleMoves.right = false
        else if (myNeck.y < myHead.y) possibleMoves.down = false
        else if (myNeck.y > myHead.y) possibleMoves.up = false
    }
    // TODO: Step 1 - Don't hit walls.
    // Use information in gameState to prevent your Battlesnake from moving beyond the boundaries of the board.
    const board = {
        x: gameState.board.width - 1,
        y: gameState.board.height - 1
    }

    function createScoreGrid(gameState) {
        const scoreGrid = []
        for (let i = 0; i < gameState.board.width; i++) {
            scoreGrid[i] = []
            for (let j = 0; j < gameState.board.height; j++) {
                scoreGrid[i][j] = 0
            }
        }
        // score out of bounds negative
        for (let i = 0; i < gameState.board.width; i++) {
            scoreGrid[i][0] = -1
            scoreGrid[i][gameState.board.height - 1] = -1
        }
        for (let i = 0; i < gameState.board.height; i++) {
            scoreGrid[0][i] = -1
            scoreGrid[gameState.board.width - 1][i] = -1
        }
        // score food positive
        for (let i = 0; i < gameState.board.food.length; i++) {
            scoreGrid[gameState.board.food[i].x][gameState.board.food[i].y] = 1
        }
        // score snakes negative
        for (let i = 0; i < gameState.board.snakes.length; i++) {
            const snake = gameState.board.snakes[i]
            for (let j = 0; j < snake.body.length; j++) {
                scoreGrid[snake.body[j].x][snake.body[j].y] = -1
            }
        }
        return scoreGrid
    }
    function scoreNextMove() {
        const scoreGrid = createScoreGrid(gameState)
        // get adjacent cells
        const adjacentCells = []
        if (myHead.x > 0) adjacentCells.push({ x: myHead.x - 1, y: myHead.y })
        if (myHead.x < board.x) adjacentCells.push({ x: myHead.x + 1, y: myHead.y })
        if (myHead.y > 0) adjacentCells.push({ x: myHead.x, y: myHead.y - 1 })
        if (myHead.y < board.y) adjacentCells.push({ x: myHead.x, y: myHead.y + 1 })
        // get adjacent cell score
        const adjacentCellScores = []
        for (let i = 0; i < adjacentCells.length; i++) {
            adjacentCellScores.push(scoreGrid[adjacentCells[i].x][adjacentCells[i].y])
        }
        // get max score
        const maxScore = Math.max(...adjacentCellScores)
        // get max score index
        const maxScoreIndex = adjacentCellScores.indexOf(maxScore)
        // get max score cell
        const maxScoreCell = adjacentCells[maxScoreIndex]
        // block other moves
        if (maxScoreCell.x < myHead.x) possibleMoves.left = false
        else if (maxScoreCell.x > myHead.x) possibleMoves.right = false
        else if (maxScoreCell.y < myHead.y) possibleMoves.down = false
        else if (maxScoreCell.y > myHead.y) possibleMoves.up = false
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
    function avoidSelfCollision() {
        myBody.forEach(segment => {
            if (myHead.x === segment.x - 1 && myHead.y === segment.y) {
            possibleMoves.right = false
            }
            if (myHead.x === segment.x + 1 && myHead.y === segment.y) {
            possibleMoves.left = false
            }
            if (myHead.y === segment.y - 1 && myHead.x === segment.x) {
            possibleMoves.up = false
            }
            if (myHead.y === segment.y + 1 && myHead.x === segment.x) {
            possibleMoves.down = false
            }
        })
    }

    function avoidOtherSnakes() {
        const snakes = gameState.board.snakes
        snakes.forEach(snake => {
            snake.body.forEach(segment => {
            if (myHead.x === segment.x - 1 && myHead.y === segment.y) {
                possibleMoves.right = false
            }
            if (myHead.x === segment.x + 1 && myHead.y === segment.y) {
                possibleMoves.left = false
            }
            if (myHead.y === segment.y - 1 && myHead.x === segment.x) {
                possibleMoves.up = false
            }
            if (myHead.y === segment.y + 1 && myHead.x === segment.x) {
                possibleMoves.down = false
            }
            })
        })
    }

    // TODO: Step 2 - Don't hit yourself.
    // Use information in gameState to prevent your Battlesnake from colliding with itself.
    // const mybody = gameState.you.body

    // TODO: Step 3 - Don't collide with others.
    // Use information in gameState to prevent your Battlesnake from colliding with others.

    // TODO: Step 4 - Find food.
    // Use information in gameState to seek out and find food.

    // Finally, choose a move from the available safe moves.
    // TODO: Step 5 - Select a move to make based on strategy, rather than random.
    avoidNeck();
    boundaryCheck();
    avoidSelfCollision();
    avoidOtherSnakes();
    scoreNextMove();
    const safeMoves = Object.keys(possibleMoves).filter(key => possibleMoves[key])
    const response = {
        move: safeMoves[Math.floor(Math.random() * safeMoves.length)],
    }

    console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`)
    return response
}

module.exports = {
    info: info,
    start: start,
    move: move,
    end: end
}
