// const containerDiv = document.getElementById('container')

//four grids two for each player 10 x 10. a-j 1-10
class Grid {
    constructor() {
        this.yAxis = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        this.xAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
        this.board = this.createBoard()
    }
    createBoard() {
        const grid = []
        for (let i = 0; i < this.yAxis.length; i++) {
            for (let j = 0; j < this.xAxis.length; j++) {
                grid.push([this.xAxis[j], this.yAxis[i]])
            }
        }
        return grid
    }
    findIndex(x, y) {
        const board = this.board
        for (let i = 0; i < board.length; i++) {
            if (board[i][0] === x && board[i][1] === y) {
             return board[i]
            }
        }
        return 'Target not found'
    }
    isValid(x, y) {
        return this.board.some(element => element[0] === x && element[1] === y)
    }
} 

const testGrid = new Grid()

testGrid.findIndex('a', '1')
//carrier length 5
//battlship 4
//destroyer 3
//submarine 3
//patrol boat 2




module.exports = {
    Grid,
}