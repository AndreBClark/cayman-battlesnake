import { Battlesnake, Board, Coord,  GameState, InfoResponse, MoveResponse, ScoreGrid, Move, Moves, Game } from "./types"

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
    // let you = gameState.you
    // let board = gameState.board
    console.log(gameState)
    // let possibleMoves: Moves = {
    //     up: gameState.you.head.y < gameState.board.height - 1,
    //     down: gameState.you.head.y > 0,
    //     left: gameState.you.head.x > 0,
    //     right: gameState.you.head.x < gameState.board.width - 1,
    // };
    // gameState.you.isHungry = gameState.you.health < 50
    // const scoreGrid: ScoreGrid = createScoreGrid(gameState.board, gameState.you)
    const response: MoveResponse = {
        move: 'down'
        // move: getMove(gameState.you.head, gameState.board, scoreGrid, possibleMoves)
    }
    console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`)
    return response
}

// function getMove(myHead: Coord, board: Board, Grid: ScoreGrid, moves: Moves): Move {
//     // get all adjacent cells
//     const adjacentCoords: Coord[] = getAdjacentCells([myHead], board)
    
//     return 'down'
// }

function createScoreGrid(board: Board, you: Battlesnake): ScoreGrid {
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
function scoreSelf(scoreGrid: ScoreGrid, board: Board, you: Battlesnake): void {
    for (let i = 0; i < you.length; i++) {
        scoreGrid[you.body[i].x][you.body[i].y] -= 20
    }
    scoreGrid[you.body[1].x][you.body[1].y] -= 30;
    scoreGrid[you.head.x][you.head.y] -= 79;

    getAdjacentCells(you.body, board).forEach(
        cell => scoreGrid[cell.x][cell.y] -= 5
    )
}
function scoreFood(Grid: ScoreGrid, board: Board, food: Coord[], you: Battlesnake): void {
    // food increases cell score
    for (let i = 0; i < food.length; i++) {
        Grid[food[i].x][food[i].y] += you.isHungry ? 10 : -6
    }
    // cells adjacent to food get a bonus
    getAdjacentCells(food, board).forEach(
        cell => Grid[cell.x][cell.y] += you.isHungry ? 5 : 2
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
        Grid[coord.x][coord.y] -= 12
    })
    getAdjacentCells(snakeCoords, board).forEach(
        cell => Grid[cell.x][cell.y] -= 8
    )
}

function getAdjacentCells(cells: Coord[], area: Board): Coord[] {
    // if cells is not an array, make it an array
    const adjacentCells: Coord[] = []
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
