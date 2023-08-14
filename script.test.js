
const { Grid, Player, Ship, Game,} = require('./script')

describe('10 x 10 grid, where every square has coordinates and a grid index', () => {
    const testGrid = new Grid()
    test('checks for a grid length of 100', () => {
        testGrid.createGrid()
        expect(testGrid.grid.length).toBe(100)
    })
    
    test('returns a grid index from x y coordinates', () => {
        expect(testGrid.findIndex('a1')).toBe(testGrid.grid[0])
        expect(testGrid.findIndex('j10')).toBe(testGrid.grid[99])
    })
    test('check if board coordinates are truthy', () => {
        expect(testGrid.isValid('a1')).toBeTruthy()
        expect(testGrid.isValid('a11')).toBeFalsy()
    })

})

describe('Player class has a name, 2 grids, and a fleet of ships', () => {
    const testPlayer = new Player('testPlayer')
    test(`test player name: ${testPlayer.name}`, () => {
        expect(testPlayer.name).toBe('testPlayer')
    })
    test('player revealed board occupied coordinates', () => {
        expect(testPlayer.setShipLocation(0, ['a1', 'a2', 'a3', 'a4', 'a5'])).toBe(testPlayer.occupiedCoordinates[0])
    })
    // test('player hidden board choosen coordinates')
}) 

// describe('Ship class keeps track of hits, sets isSunk', () => {
//     const testShips =new Ship()
//     test('decrease hit count', () => {
//         expect()
//     })
// })