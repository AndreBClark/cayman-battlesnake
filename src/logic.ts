import { InfoResponse, GameState, MoveResponse, Coord, ScoreGrid, Board, Moves, Move, Battlesnake, You, MovesArray } from "./types"

export function info(): InfoResponse {
    console.log("INFO")
    const response: InfoResponse = {
        apiversion: "1",
        author: "AndreBClark",
        color: "#7EB33D",
        head: "caffeine",
        tail: "default"
    }
    return response
}

export function start(gameState: GameState): void {
    console.log(`${gameState.game.id} START`)
}

export function end(gameState: GameState): void {
    console.log(`${gameState.game.id} END\n`)
}

export function move(gameState: GameState): MoveResponse {
    gameState.you.neck = gameState.you.body[1]
    gameState.you.isHungry = gameState.you.health < 50
    const myHead = gameState.you.head
    let possibleMoves: Moves = {
        up: myHead.y < gameState.board.height - 1,
        down: myHead.y > 0,
        left: myHead.x > 0,
        right: myHead.x < gameState.board.width - 1,
    };
    const scoreGrid: ScoreGrid = createScoreGrid(gameState.board, gameState.you)
    const response: MoveResponse = {
        move: getMove(gameState.you, gameState.board, scoreGrid, possibleMoves)
    }

    console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`)
    return response
}

function getMove(you: You, board: Board, Grid: ScoreGrid, moves: Moves): Move {
    // convert moves Object to array
    // get all adjacent cells
    const adjacentCoords: Coord[] = getAdjacentCells(you.head, board)
    // retrieve the score of each adjacent cell
    const adjacentScores: number[] = adjacentCoords.map(
        (coord: Coord) => Grid[coord.x][coord.y]
    );
    let movesKeys: Move[] = Object.keys(moves)
    let movesArray: MovesArray = Object.values(moves);
    // if adjacent score is negative, moves array element is false

    for (let i = 0; i < movesArray.length; i++) {
        if (adjacentScores[i] <= 0) movesArray[i] = false
    }
    console.log('movesArray:')
    console.table(movesArray)
    
    console.log('movesKeys:')
    console.table(movesKeys)

    console.log('adjacentScores:')
    console.table(adjacentScores)
    // if move is false remove the element from the move array
        for (let i = 0; i < movesArray.length; i++) {
        if (!movesArray[i]) {
            movesKeys.splice(i, 1)
            movesArray.splice(i, 1)
            adjacentScores.splice(i, 1)
        }
    }
    console.log('movesArray:')
    console.table(movesArray)
    
    console.log('movesKeys:')
    console.table(movesKeys)

    console.log('adjacentScores:')
    console.table(adjacentScores)

    // if there is only one move left, return that move
    if (movesArray.length === 1) return movesKeys[0]
    // if there is more than one move left, return the move with the highest score
    else return movesKeys[adjacentScores.indexOf(Math.max(...adjacentScores))]
}
    // find the highest score
    const highestScore: number = Math.max(...adjacentScores);
    // find the index of the highest score
    const highestScoreIndex: number = adjacentScores.indexOf(highestScore);
    // return the move with the highest score
    return movesKeys[highestScoreIndex];
}

function createScoreGrid(board: Board, you: You): ScoreGrid {
    // assign score to each Coord coordinate on board
    const scoreGrid: ScoreGrid = []
    for (let i = 0; i < board.width; i++) {
        scoreGrid[i] = []
        for (let j = 0; j < board.height; j++) {
            scoreGrid[i][j] = 10
        }
    }
    scoreSelf(scoreGrid, board, you)
    scoreFood(scoreGrid, board, board.food, you)
    scoreSnakes(scoreGrid, board.snakes, board, you)
    console.table(scoreGrid)
    return scoreGrid
}
function scoreSelf(scoreGrid: ScoreGrid, board: Board, you: You): void {
    const myBody = you.body
    for (let i = 0; i < you.length; i++) {
        scoreGrid[myBody[i].x][myBody[i].y] -= 20
    }
    scoreGrid[you.neck.x][you.neck.y] -= 30;
    scoreGrid[you.head.x][you.head.y] -= 79;

    // getAdjacentCells(you.body, board).forEach(
    //     cell => scoreGrid[cell.x][cell.y] -= 5
    // )
    getAdjacentCells(you.body[you.body.length - 1], board)
        .forEach(cell => scoreGrid[cell.x][cell.y] -= 5)
}
function scoreFood(Grid: ScoreGrid, board: Board, food: Coord[], you: You): void {
    // food increases cell score
    for (let i = 0; i < food.length; i++) {
        Grid[food[i].x][food[i].y] += you.isHungry ? 10 : -1
    }
    // cells adjacent to food get a bonus
    getAdjacentCells(food, board).forEach(
        cell => Grid[cell.x][cell.y] += you.isHungry ? 5 : 0
    )
}
function scoreSnakes(Grid: ScoreGrid, snakes: Battlesnake[], board: Board, you: Battlesnake): void {
    // get coordinates of all snake positions
    const snakeCoords = []
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes[i].body.length; j++) {
            if (snakes[i].id !== you.id) {
                snakeCoords.push(snakes[i].body[j])
            }
        }
    }
    snakeCoords.forEach(coord => {
        Grid[coord.x][coord.y] -= 11
    })
    getAdjacentCells(snakeCoords, board).forEach(
        cell => Grid[cell.x][cell.y] -= 5
    )
}

function getAdjacentCells(cells: Coord[] | Coord, board: Board): Coord[] {
    // if cells is not an array, make it an array
    if (!Array.isArray(cells)) cells = [cells]
    const adjacentCells: Coord[] = []
    cells.forEach(cell => {
        if (cell.y > 0) adjacentCells
            .push({ x: cell.x, y: cell.y - 1 })
        if (cell.y < board.height - 1) adjacentCells
            .push({ x: cell.x, y: cell.y + 1 })
        if (cell.x > 0) adjacentCells
            .push({ x: cell.x - 1, y: cell.y })
        if (cell.x < board.width - 1) adjacentCells
            .push({ x: cell.x + 1, y: cell.y })
    })
    return adjacentCells
}