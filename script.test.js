
const { Grid,  } = require('./script')

describe('10 x 10 grid, where every square has coordinates and a grid index', () => {
    const testGrid = new Grid()
    test('checks for a grid length of 100', () => {
        testGrid.createBoard()
        expect(testGrid.board.length).toBe(100)
    })
    
    test('returns a grid index from x y coordinates', () => {
        expect(testGrid.findIndex('a', '1')).toBe(testGrid.board[0])
        expect(testGrid.findIndex('j', '10')).toBe(testGrid.board[99])
    })
    test('check if board coordinates are truthy', () => {
        expect(testGrid.isValid('a', '1')).toBeTruthy()
        expect(testGrid.isValid('a', '11')).toBeFalsy()
    })

})
