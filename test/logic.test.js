const { info, move } = require('../src/logic')
const testCount = 1;
function createGameState(myBattlesnake) {
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
            snakes: [myBattlesnake],
            hazards: []
        },
        you: myBattlesnake,
    }
}

function createBattlesnake(id, bodyCoords) {
    return {
        id: id,
        name: id,
        health: 100,
        body: bodyCoords,
        latency: "",
        head: bodyCoords[0],
        length: bodyCoords.length,
        shout: "",
        squad: ""
    }
}


describe('Battlesnake API Version', () => {
    test('should be api version 1', () => {
        const result = info()
        expect(result.apiversion).toBe("1")
    })
})
describe('Avoid Walls', () => {
    test('left edge', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 0, y: 2 },
            { x: 0, y: 3 },
            { x: 0, y: 4 }
        ])
        const gameState = createGameState(me)
    
        
        for (let i = 0; i < testCount; i++) {
            const moveResponse = move(gameState)
            // In this state, we should NEVER move left.
            const allowedMoves = ["up", "down", "right"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    test('right edge', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 6, y: 3 },
            { x: 6, y: 4 },
            { x: 6, y: 5 }
        ])
        const gameState = createGameState(me)
    
        
        for (let i = 0; i < testCount; i++) {
            const moveResponse = move(gameState)
            // In this state, we should NEVER move right.
            const allowedMoves = ["up", "left", "down"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    test('bottom edge', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 3, y: 0 },
            { x: 4, y: 0 },
            { x: 5, y: 0 }
        ])
        const gameState = createGameState(me)
        
        for (let i = 0; i < testCount; i++) {
            const moveResponse = move(gameState)
            // In this state, we should NEVER move up.
            const allowedMoves = ["right", "up", "left"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    test('top edge', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 3, y: 6 },
            { x: 4, y: 6 },
            { x: 5, y: 6 }
        ])
        const gameState = createGameState(me)
    
        
        for (let i = 0; i < testCount; i++) {
            const moveResponse = move(gameState)
            // In this state, we should NEVER move down.
            const allowedMoves = ["right", "down", "left"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    test('left corner', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 }
        ])
        const gameState = createGameState(me)

        
        for (let i = 0; i < testCount; i++) {
            const moveResponse = move(gameState)
            // In this state, we should NEVER move down or left.
            const allowedMoves = ["right", "up"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    test('right corner', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 6, y: 6 },
            { x: 6, y: 5 },
            { x: 6, y: 4 }
        ])
        const gameState = createGameState(me)

        
        for (let i = 0; i < testCount; i++) {
            const moveResponse = move(gameState)
            // In this state, we should NEVER move up or right.
            const allowedMoves = ["left", "down"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    test('left corner', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 0, y: 6 },
            { x: 0, y: 5 },
            { x: 0, y: 4 }
        ])
        const gameState = createGameState(me)

        
        for (let i = 0; i < testCount; i++) {
            const moveResponse = move(gameState)
            // In this state, we should NEVER move up or left.
            const allowedMoves = ["right", "down"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    test('bottom right corner', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 6, y: 0 },
            { x: 6, y: 1 },
            { x: 6, y: 2 }
        ])
        const gameState = createGameState(me)
        
        
        for (let i = 0; i < testCount; i++) {
            const moveResponse = move(gameState)
            // In this state, we should NEVER move down or right.
            const allowedMoves = ["left", "up"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
})

describe('Prevent Ouroborus', () => {
    test('should avoid own neck', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 6, y: 1 },
            { x: 5, y: 1 },
            { x: 4, y: 1 }
        ])
        const gameState = createGameState(me)
        for (let i = 0; i < testCount; i++) {
            const moveResponse = move(gameState)
            // In this state, we should NEVER move left.
            const allowedMoves = ["up", "down"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    test('should never collide with itself', () => {
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
            const moveResponse = move(gameState)
            // In this state, we should NEVER move up.
            const allowedMoves = ["right"]
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
            const allowedMoves = ["left", "down", "right"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
})

describe('Food Behaviors', () => {
    test('should eat food', () => {
        // Arrange
        const me = createBattlesnake("me", [
            { x: 2, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 0 }
        ])
        const gameState = createGameState(me)
        gameState.board.food.push({ x: 3, y: 0 })
    
        // Act
        const moveResponse = move(gameState)
    
        // Assert
        expect(moveResponse.move).toBe("right")
    })
})

describe('advanced Checks', () => {
    test('should avoid trapping itself', () => {
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
        const moveResponse = move(gameState)

        // Assert
        expect(moveResponse.move).toBe("right")
    })
})
