const { info, move } = require('../src/logic')

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
        you: myBattlesnake
    }
}

function createBattlesnake(id, bodyCoords) {
    return {
        id: id,
        name: id,
        health: 0,
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

describe('Battlesnake Moves', () => {
    test('should never move into its own neck', () => {
        // Arrange
        const me = createBattlesnake("me", [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }])
        const gameState = createGameState(me)

        // Act 1,000x (this isn't a great way to test, but it's okay for starting out)
        for (let i = 0; i < 1000; i++) {
            const moveResponse = move(gameState)
            // In this state, we should NEVER move left.
            const allowedMoves = ["up", "down", "right"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    test('should never move past the left edge', () => {
        // Arrange
        const me = createBattlesnake("me", [{ x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }])
        const gameState = createGameState(me)
    
        // Act 1,000x (this isn't a great way to test, but it's okay for starting out)
        for (let i = 0; i < 1000; i++) {
            const moveResponse = move(gameState)
            // In this state, we should NEVER move left.
            const allowedMoves = ["down", "right"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    test('should never move past right edge', () => {
        // Arrange
        const me = createBattlesnake("me", [{ x: 6, y: 3 }, { x: 6, y: 4 }, { x: 6, y: 5 }])
        const gameState = createGameState(me)
    
        // Act 1,000x (this isn't a great way to test, but it's okay for starting out)
        for (let i = 0; i < 1000; i++) {
            const moveResponse = move(gameState)
            // In this state, we should NEVER move right.
            const allowedMoves = ["up", "left", "down"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    test('should never move past bottom edge', () => {
        // Arrange
        const me = createBattlesnake("me", [{ x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }])
        const gameState = createGameState(me)
    
        test
        // Act 1,000x (this isn't a great way to test, but it's okay for starting out)
        for (let i = 0; i < 1000; i++) {
            const moveResponse = move(gameState)
            // In this state, we should NEVER move up.
            const allowedMoves = ["right", "up", "left"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    test('should never move past top edge', () => {
        // Arrange
        const me = createBattlesnake("me", [{ x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }])
        const gameState = createGameState(me)
    
        // Act 1,000x (this isn't a great way to test, but it's okay for starting out)
        for (let i = 0; i < 1000; i++) {
            const moveResponse = move(gameState)
            // In this state, we should NEVER move down.
            const allowedMoves = ["right", "down", "left"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
    test('should never move into a snake', () => {
        // Arrange
        const me = createBattlesnake("me", [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }])
        const enemy = createBattlesnake("enemy", [{ x: 2, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 1 }])
        const gameState = createGameState(me)
        gameState.board.snakes.push(enemy)

        // Act 1,000x (this isn't a great way to test, but it's okay for starting out)
        for (let i = 0; i < 1000; i++) {
            const moveResponse = move(gameState)
            // In this state, we should NEVER move up.
            const allowedMoves = ["left", "down", "right"]
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
    
        // Act 1,000x (this isn't a great way to test, but it's okay for starting out)
        for (let i = 0; i < 1000; i++) {
            const moveResponse = move(gameState)
            // In this state, we should NEVER move up.
            const allowedMoves = ["left", "down", "right"]
            expect(allowedMoves).toContain(moveResponse.move)
        }
    })
})
