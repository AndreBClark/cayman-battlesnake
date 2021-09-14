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
                scoreGrid[i][j] = 1
            }
        }
        // prevent out of bounds coordinates
        // score food positive
        for (let i = 0; i < gameState.board.food.length; i++) {
            scoreGrid[gameState.board.food[i].x][gameState.board.food[i].y] = 50
        }
        
        // score snakes other than me negative
        for (let i = 0; i < gameState.board.snakes.length; i++) {
            if (gameState.board.snakes[i].id !== gameState.you.id) {
                for (let j = 0; j < gameState.board.snakes[i].body.length; j++) {
                    scoreGrid[gameState.board.snakes[i].body[j].x][gameState.board.snakes[i].body[j].y] = -50
                }
            }
        }
        for (let i = 0; i < gameState.you.body.length; i++) {
            scoreGrid[myBody[i].x][myBody[i].y] = -100
        }

        scoreGrid[myNeck.x][myNeck.y] = -999;

        return scoreGrid
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
        // disable moves
        // prevent out of bounds coordinates from causing errors


        if (score.up < 0) possibleMoves.up = false
        if (score.down < 0) possibleMoves.down = false
        if (score.left < 0) possibleMoves.left = false
        if (score.right < 0) possibleMoves.right = false

        return scoreGrid
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

    // avoidNeck();
    boundaryCheck();
    scoreNextMove(gameState);
    // console.table(SCOREGRID)
    const safeMoves = Object.keys(possibleMoves).filter(key => possibleMoves[key])
    console.table(possibleMoves)
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
