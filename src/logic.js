function info() {
    console.log("INFO")
    const response = {
        apiversion: "1",
        author: "",
        color: "#7EB33D",
        head: "caffeine",
        tail: ""
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
        for (let i = 0; i < gameState.board.width; i++) {
            scoreGrid[i] = []
            for (let j = 0; j < gameState.board.height; j++) {
                scoreGrid[i][j] = 10
            }
        }
        // prevent out of bounds coordinates
        
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
        scoreGrid[myNeck.x][myNeck.y] = -200;
        // food increases cell score
        for (let i = 0; i < gameState.board.food.length; i++) {
            scoreGrid[gameState.board.food[i].x][gameState.board.food[i].y] += isHungry ? 10 : -9 
        }
        // cells adjacent to food get a bonus
        for (let i = 0; i < gameState.board.food.length; i++) {
            if (gameState.board.food[i].x > 0) {
                scoreGrid[gameState.board.food[i].x - 1][gameState.board.food[i].y] += isHungry && 5
            }
            if (gameState.board.food[i].x < gameState.board.width - 1) {
                scoreGrid[gameState.board.food[i].x + 1][gameState.board.food[i].y] += isHungry && 5
            }
            if (gameState.board.food[i].y > 0) {
                scoreGrid[gameState.board.food[i].x][gameState.board.food[i].y - 1] += isHungry && 5
            }
            if (gameState.board.food[i].y < gameState.board.height - 1) {
                scoreGrid[gameState.board.food[i].x][gameState.board.food[i].y + 1] += isHungry && 5
            }
        }

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

module.exports = {
    info: info,
    start: start,
    move: move,
    end: end
}
