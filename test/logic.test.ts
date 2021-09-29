import { info, move } from '../src/logic'
import { Battlesnake, Coord, GameState, MoveResponse, You } from '../src/types';
const testCount = 1;
function createGameState(me: You): GameState {
    return {
        game: {
            id: "",
            ruleset: { name: "", version: "" },
            timeout: 0
        },
        turn: 0,
        board: {
            height: 4,
            width: 4,
            food: [],
            snakes: [me],
            hazards: []
        },
        you: me
    }
}

function createBattlesnake(id: string, body: Coord[]): Battlesnake & You {
    return {
        id: id,
        name: id,
        health: 100,
        body: body,
        latency: "",
        head: body[0],
        length: body.length,
        shout: "",
        squad: "",
        neck: body[1],
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
            { x: 0, y: 3 },
            { x: 0, y: 2 },
            { x: 0, y: 1 }
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
            { x: 3, y: 3 },
            { x: 3, y: 1 },
            { x: 3, y: 2 }
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
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 3, y: 0 }
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
            { x: 3, y: 3 },
            { x: 1, y: 3 },
            { x: 2, y: 3 }
        ])
        const gameState = createGameState(me)
    
        
        for (let i = 0; i < testCount; i++) {
            const moveResponse: MoveResponse = move(gameState)
            // In this state, we should NEVER move down.
            const allowedMoves = ["down", "left"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    it('bottom left corner', () => {
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
    it('Top right corner', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 3, y: 3 },
            { x: 3, y: 2 },
            { x: 3, y: 1 }
        ])
        const gameState = createGameState(me)

        
        for (let i = 0; i < testCount; i++) {
            const moveResponse: MoveResponse = move(gameState)
            // In this state, we should NEVER move up or right.
            const allowedMoves = ["left"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    it('Top left corner', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 0, y: 3 },
            { x: 0, y: 2 },
            { x: 0, y: 1 }
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
            { x: 3, y: 0 },
            { x: 3, y: 1 },
            { x: 3, y: 2 }
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
            { x: 3, y: 1 },
            { x: 2, y: 1 },
            { x: 1, y: 1 }
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
            { x: 0, y: 1 },
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: 1 }

        ])
        const gameState = createGameState(me)
        for (let i = 0; i < testCount; i++) {
            const moveResponse: MoveResponse = move(gameState)
            // In this state, we should NEVER move up.
            const allowedMoves = ["up"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
})
describe('Prevent Cannibalism', () => {
    test('should never move into a snake', () => {
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
            const moveResponse = move(gameState)
            // In this state, we should NEVER move up.
            const allowedMoves = ["right"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
})

describe('Food', () => {
    test('eats when Hungry', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 2, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 0 }
        ])
        me.health = 49
        const gameState = createGameState(me)
        gameState.board.food.push({ x: 3, y: 0 })
    
        // Act
        const moveResponse = move(gameState)
    
        // Assert
        expect(moveResponse.move).toBe("right")
    })
    test('avoid eating when not Hungry', () => {
        const me = createBattlesnake("me", [
            { x: 2, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 0 }
        ])
        me.health = 100
        const gameState = createGameState(me)
        gameState.board.food.push({ x: 3, y: 0 })
        
        const moveResponse = move(gameState)

        expect(moveResponse.move).toBe("up")
    })
    test('prefer food over death even when not hungry', () => {
        const me = createBattlesnake("me", [
            { x: 3, y: 0 },
            { x: 2, y: 0 },
            { x: 1, y: 0 }
        ])
        me.health = 100
        const gameState = createGameState(me)
        gameState.board.food.push({ x: 3, y: 1 })
        
        const moveResponse = move(gameState)

        expect(moveResponse.move).toBe("up")
    })
})
