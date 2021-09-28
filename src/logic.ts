import { InfoResponse, GameState, MoveResponse, Coord, ScoreGrid, Board, Moves, Move, Battlesnake, You } from "./types"

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
    const myNeck = gameState.you.neck
    const myHead = gameState.you.head
    let possibleMoves = {
        up: myHead.y < gameState.board.height - 1,
        down: myHead.y > 0,
        left: myHead.x > 0,
        right: myHead.x < gameState.board.width - 1,
    };
    if (myNeck.x < myHead.x) possibleMoves.left = false
    if (myNeck.x > myHead.x) possibleMoves.right = false
    if (myNeck.y < myHead.y) possibleMoves.down = false
    if (myNeck.y > myHead.y) possibleMoves.up = false

    const scoreGrid: ScoreGrid = createScoreGrid(gameState.board, gameState.you)
    const response: MoveResponse = {
        move: getMove(gameState.you.head, gameState.board, scoreGrid, possibleMoves)
    }

    console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`)
    return response
}

function getMove(myHead: Coord, board: Board, Grid: ScoreGrid, moves: Moves): Move {
    console.log(moves)
    // get all adjacent cells
    const adjacentCoords: Coord[] = getAdjacentCells(myHead, board)
    // retrieve the score of each adjacent cell
    const adjacentScores: number[] = adjacentCoords.map(
        (coord: Coord) => Grid[coord.x][coord.y]
    );
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
    return scoreGrid
}
function scoreSelf(scoreGrid: ScoreGrid, board: Board, you: You): void {
    const myBody = you.body
    for (let i = 0; i < you.length; i++) {
        scoreGrid[myBody[i].x][myBody[i].y] -= 20
    }
    scoreGrid[you.neck.x][you.neck.y] -= 30;
    scoreGrid[you.head.x][you.head.y] -= 79;

    getAdjacentCells(you.body, board).forEach(
        cell => scoreGrid[cell.x][cell.y] -= 5
    )
}
function scoreFood(Grid: ScoreGrid, board: Board, food: Coord[], you: You): void {
    // food increases cell score
    for (let i = 0; i < food.length; i++) {
        Grid[food[i].x][food[i].y] += you.isHungry ? 10 : -6
    }
    // cells adjacent to food get a bonus
    getAdjacentCells(food, board).forEach(
        cell => Grid[cell.x][cell.y] += you.isHungry ? 5 : 2)
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
        Grid[coord.x][coord.y] -= 12
    })
    getAdjacentCells(snakeCoords, board).forEach(
        cell => Grid[cell.x][cell.y] -= 8
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