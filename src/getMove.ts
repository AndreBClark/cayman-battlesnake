import { GameState, Coord, ScoreGrid, Board, Moves, Move, Battlesnake, You, MovesArray } from "./types"
function getMove(gameState: GameState): Move {
  gameState.you.neck = gameState.you.body[1]
  gameState.you.isHungry = gameState.you.health < 50
  const myHead = gameState.you.head
  const Grid: ScoreGrid = createScoreGrid(gameState.board, gameState.you)
  let moves: Moves = {
      up: myHead.y < gameState.board.height - 1,
      down: myHead.y > 0,
      left: myHead.x > 0,
      right: myHead.x < gameState.board.width - 1,
  };
  const moveKeys: Move[] = Object.keys(moves);
  const movesBools: MovesArray = Object.values(moves)
  
  const adjacentScores = getAdjacentCells(gameState.you.head, gameState.board)
      .map(cell => Grid[cell.x][cell.y])
  // foreach negative adjacent score set possiblemoves to false
  adjacentScores.forEach((score, index) => movesBools[index] = score > -1)
  console.table(adjacentScores)    
  return moveKeys[moveKeys.length - 1]
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

export default getMove