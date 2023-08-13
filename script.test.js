
const {testFunction, Grid} = require('./script')

test('checking return for "this works" string', () => expect(testFunction()).toBe('this works')) 

test('checks for a 10x10 grid', () => {
    const gameBoard = new Grid()
    gameBoard.createBoard()
    expect(gameBoard.board.length).toBe(100)
})