import { info, move } from '../src/logic';
import { Battlesnake, Coord, GameState, MoveResponse, Move } from '../src/types';
const testCount = 1;
function createGameState(me: Battlesnake): GameState {
    return {
        game: {
            id: "",
            ruleset: { name: "", version: "" },
            timeout: 0
        },
        turn: 0,
        board: {
            height: 7,
            width: 7,
            food: [],
            snakes: [me],
            hazards: []
        },
        you: me,
    }
}
function createBattlesnake(id: string, body: Coord[]): Battlesnake {
    return {
        id: id,
        name: id,
        health: 0,
        body: body,
        latency: "",
        head: body[0],
        length: body.length,
        shout: "",
        squad: ""
    }
}


describe('Battlesnake API Version', () => {
    it('should be api version 1', () => {
        const result = info()
        expect(result.apiversion).toBe("1")
    })
})
describe('Avoid Walls', () => {
    it('left edge', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 0, y: 2 },
            { x: 0, y: 3 },
            { x: 0, y: 4 }
        ])
        const gameState = createGameState(me)
        for (let i = 0; i < testCount; i++) {
            const moveResponse: MoveResponse = move(gameState)
            // In this state, we should NEVER move left.
            const allowedMoves = ["down", "right"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    it('right edge', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 6, y: 3 },
            { x: 6, y: 4 },
            { x: 6, y: 5 }
        ])
        const gameState = createGameState(me)
    
        
        for (let i = 0; i < testCount; i++) {
            const moveResponse: MoveResponse = move(gameState)
            // In this state, we should NEVER move right.
            const allowedMoves = ["left", "down"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    it('bottom edge', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 3, y: 0 },
            { x: 4, y: 0 },
            { x: 5, y: 0 }
        ])
        const gameState = createGameState(me)
        
        for (let i = 0; i < testCount; i++) {
            const moveResponse: MoveResponse = move(gameState)
            const allowedMoves = ["up", "left"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    it('top edge', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 3, y: 6 },
            { x: 4, y: 6 },
            { x: 5, y: 6 }
        ])
        const gameState = createGameState(me)
    
        
        for (let i = 0; i < testCount; i++) {
            const moveResponse: MoveResponse = move(gameState)
            // In this state, we should NEVER move down.
            const allowedMoves = ["down", "left"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    it('left corner', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 }
        ])
        const gameState = createGameState(me)

        
        for (let i = 0; i < testCount; i++) {
            const moveResponse: MoveResponse = move(gameState)
            // In this state, we should NEVER move down or left.
            const allowedMoves = ["right"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    it('right corner', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 6, y: 6 },
            { x: 6, y: 5 },
            { x: 6, y: 4 }
        ])
        const gameState = createGameState(me)

        
        for (let i = 0; i < testCount; i++) {
            const moveResponse: MoveResponse = move(gameState)
            // In this state, we should NEVER move up or right.
            const allowedMoves = ["left"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    it('left corner', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 0, y: 6 },
            { x: 0, y: 5 },
            { x: 0, y: 4 }
        ])
        const gameState = createGameState(me)

        
        for (let i = 0; i < testCount; i++) {
            const moveResponse: MoveResponse = move(gameState)
            // In this state, we should NEVER move up or left.
            const allowedMoves = ["right"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    it('bottom right corner', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 6, y: 0 },
            { x: 6, y: 1 },
            { x: 6, y: 2 }
        ])
        const gameState = createGameState(me)
        
        
        for (let i = 0; i < testCount; i++) {
            const moveResponse: MoveResponse = move(gameState)
            // In this state, we should NEVER move down or right.
            const allowedMoves = ["left"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
})

describe('Prevent Ouroborus', () => {
    it('should avoid own neck', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 6, y: 1 },
            { x: 5, y: 1 },
            { x: 4, y: 1 }
        ])
        const gameState = createGameState(me)
        for (let i = 0; i < testCount; i++) {
            const moveResponse: MoveResponse = move(gameState)
            const allowedMoves = ["up", "down"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    it('should never collide with itself', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 2, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 }
        ])
        const gameState = createGameState(me)
        for (let i = 0; i < testCount; i++) {
            const moveResponse: MoveResponse = move(gameState)
            // In this state, we should NEVER move up.
            const allowedMoves = ["right"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
})
describe('Prevent Cannibalism', () => {
    it('should never move into a snake', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 2, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 0 }
        ])
        const enemy = createBattlesnake("enemy", [
            { x: 2, y: 1 },
            { x: 1, y: 1 },
            { x: 0, y: 1 }
        ])
        const gameState = createGameState(me)
        gameState.board.snakes.push(enemy)

        
        for (let i = 0; i < testCount; i++) {
            const moveResponse: MoveResponse = move(gameState)
            // In this state, we should NEVER move up.
            const allowedMoves = ["left", "down", "right"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
})

describe('Food Behaviors', () => {
    it('should eat food', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 2, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 0 }
        ])
        const gameState = createGameState(me)
        gameState.board.food.push({ x: 3, y: 0 })
    
        // Act
        const moveResponse: MoveResponse = move(gameState)
    
        // Assert
        expect(moveResponse.move).toBe("right")
    })
})

describe('advanced Checks', () => {
    it('should avoid trapping itself', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 2, y: 1 },
            { x: 2, y: 2 },
            { x: 2, y: 3 },
            { x: 2, y: 4 },
            { x: 2, y: 5 },
            { x: 2, y: 6 },
            { x: 1, y: 6 },
            { x: 0, y: 6 },
            { x: 0, y: 5 },
            { x: 0, y: 4 },
            { x: 0, y: 3 },
            { x: 0, y: 2 },
            { x: 0, y: 1 },
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 }
        ])
        const gameState = createGameState(me)
        // Act
        const moveResponse: MoveResponse = move(gameState)

        // Assert
        expect(moveResponse.move).toBe("right")
    })
})
