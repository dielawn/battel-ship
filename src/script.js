
class Game {
    constructor() {
        this.player1 = new Player('player1')
        this.player2 = new Player('player2')        
        this.currentPlayer = null
        this.otherPlayer = null
        this.p1Board = new Grid()        
        this.p2Board = new Grid()
        this.gameOver = false
    }
    startGame() {
        // start new game
        this.setPlayer()
        //if ships locations are not set, set them
        // for (let i = 0; i < 5; i ++) {
        //     this.currentPlayer.setShipLocation(i, promptPlayer())
        //     this.otherPlayer.setShipLocation(i, promptPlayer())
        // }
        // if (!this.gameOver) {
        //    this.playRound()            
        // }
    } 
    // promptPlayer() {
    
    // }
    playRound() {

        //prompt for coords
        this.currentPlayer.fire(hitCoords)
        this.isHit(hitCoords)
        this.setPlayer()
    }
    setPlayer() {
        //select starting player and change player turn at end of previous turn

        if (this.currentPlayer === null) {
            this.currentPlayer = this.player1 
            this.otherPlayer = this.player2        
            return this.player1
        } else if (this.currentPlayer === this.player2) {
            this.currentPlayer = this.player1
            this.otherPlayer = this.player2
            return this.player1
        }
        this.currentPlayer = this.player2
        this.otherPlayer = this.player1
        return this.player2
    }
    setShipLocation(player, shipIndex, coordinate) {
        
        let ship = player.ships[shipIndex].ship
        let location = ship.shipLocation
    
        const  length = ship.length   
        const midIndex = Math.ceil(length / 2) - 1

        // ex. if length = 5 & coordinate = '45' location = [0, 0, '45', 0, 0]
        location[midIndex] = coordinate
        console.log(coordinate)

    for (let i = 0; i < midIndex; i++) {
        
        let rowNum = parseInt(coordinate[0]) % 10
        let colNum = (parseInt(coordinate.slice(1)) + 1) % 10

        let prevCoord = null
        let nextCoord = null

    if (ship.isHorizontal) {
        console.log('ship is horizontal')
        prevCoord = coordinate.slice(0, 1) + (parseInt(coordinate.slice(1)) - 1)
        nextCoord = coordinate.slice(0, 1) + (parseInt(coordinate.slice(1)) + 1)
        console.log(prevCoord, nextCoord)
        if ( this.p1Board.isValid(prevCoord) && this.p1Board.isValid(nextCoord)) {
            console.log('coords are valid')
        //first interation location = [0, '44', '45', '46', 0]
        //second interation location = ['43', '43', '45', '46', '47']
            location[midIndex - i] = prevCoord
            location[midIndex + i] = nextCoord
        } else { //if coordinates are not valid adjust column and try again
            console.log('coords NOT valid')
            let adjustedPosition = `${rowNum}${this.adjustColumn(colNum)}`
            console.log(adjustedPosition)
            this.setShipLocation(player, shipIndex, adjustedPosition)
        }
    
       console.log( ship.shipLocation[midIndex - i],  ship.shipLocation[midIndex + i])       
      
       console.log('horizonal', 'row number', rowNum, 'column number', colNum, 'ship location', ship.shipLocation[i])
    } else { //vertical
        prevCoord = coordinate.slice(0, 1) + (parseInt(coordinate.slice(1)) - (i * 10))
        nextCoord = coordinate.slice(0, 1) + (parseInt(coordinate.slice(1)) + (i * 10))
        if (this.p1Board.isValid(prevCoord) && this.p1Board.isValid(nextCoord)) {
        //first interation location = [0, '35', '45', '55', 0]
        //second interation location = ['25', '35', '45', '55', '65']
            location[midIndex - (i * 10)] = prevCoord
            location[midIndex + (i * 10)] = nextCoord
        } else { //if coordinates are not valid adjust row and try again
            let adjustedPosition = `${this.adjustRow(rowNum)}${colNum}`
            this.setShipLocation(player, shipIndex, adjustedPosition)
        }
            
        console.log('vertical', 'row numberr', rowNum, 'column number', colNum, 'ship location', ship.shipLocation[i])
        }

    }
        console.log(`${ship.name}: ${location}`) 
        player.occupiedCoordinates.push([ship.name, location])
        return location
    }
    adjustColumn = (colNum) => {
        while (colNum > 0 && colNum < 10) {
            if (colNum > 4) {
                colNum = colNum - 1
            } else {
                colNum = colNum + 1
            }
            return colNum
        }
        
    }
    adjustRow = (rowNum) => {
        while (rowNum > 0 && rowNum < 10) {
            if (rowNum > 4) {
                rowNum = rowNum-- 
            } else {
                rowNum = rowNum++
            }
            return rowNum
        }
        
    }
        
    isHit(coords) {
        let coordinates = this.otherPlayer.occupiedCoordinates
        for (let i = 0; i < coordinates.length; i++) {
            for (let j = 0; j < coordinates[i].length; j++) {
                if (coords === coordinates[i][j].location) {
                    if (!coordinates[i][j].isHit) {
                        this.otherPlayer.ships[i].hit()
                        coordinates[i][j].isHit = true
                        return true
                    }
                }
            }
        }
        return false
    }
    isGameOver() {
        //if otherplayer .ships[i].isSunk game is over
        for (let i = 0; i < this.otherPlayer.ships.length; i++) {
            if (this.otherPlayer.ships[i].isSunk === true) {
              return  this.gameOver = true

            }
        }
      return  this.gameOver = false
    }
}



class Grid {
    constructor() {
        this.yAxis = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        this.xAxis =[ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        this.grid = this.createGrid()
    }
    createGrid() {
        const grid = []

        for (let i = 0; i < this.yAxis.length; i++) {
            for (let j = 0; j < this.xAxis.length; j++) {
                grid.push([this.yAxis[i] + this.xAxis[j]])
            }
        }
        
        return grid
    }
    findIndex(xy) {
        const grid = this.grid
        for (let i = 0; i < grid.length; i++) {
            // console.log(grid[i], [xy])
            if (grid[i][0] === xy ) {
             return grid[i]
            }
        }
        return 'Target not found'
    }
    findCoords(index) {
        const grid = this.grid
        if (index >= 0 && index < this.grid.length) {
            return this.grid[index][0]
        } else {
            return 'Invalid index'
        }

    }
    isValid(xy) {
        return this.grid.some(element => element[0] === xy )
    }
    
} 

class Ship {
    constructor(shipType) {
        this.ship = shipType
        this.hitPoints = this.ship.length       
        this.isSunk = false
    }
    hit() {
        if(this.isSunk === true) {
            return
        }
        this.hitPoints -= 1
        if (this.hitPoints <= 0) {
        this.isSunk = true
        console.log(`You sunk my ${this.ship.name}!`)
      }
      return this.hitPoints
    }    
   
   
}

class Player {
    constructor(name, ) {
        this.name = name        
        this.occupiedCoordinates = []
        this.choosenCoordinates = []        
        this.ships = this.createShips()
        
    }
    createShips() {
        const ships = [
            { name: 'Carrier', length: 5, shipLocation: [0,0,0,0,0], isHorizontal: true},     //ship 0
            { name: 'Battleship', length: 4, shipLocation: [0,0,0,0], isHorizontal: true },    //ship 1
            { name: 'Destroyer', length: 3, shipLocation: [0,0,0], isHorizontal: true },       //ship 2
            { name: 'Submarine', length: 3, shipLocation: [0,0,0], isHorizontal: true },       //ship 3
            { name: 'Patrol', length: 2, shipLocation: [0,0], isHorizontal: true }             //ship 4
        ]
        const playerShips = []
        for(const ship of ships) {
            playerShips.push(new Ship(ship))
        }
        return playerShips
    }
    
    fire(coords) {
        for (let i = 0; i < this.choosenCoordinates.length; i++) {
            if( coords === this.choosenCoordinates[i]) 
            return 'coordinates already been fired at'
        } 
        const selected = []
        selected.push(coords)
        this.choosenCoordinates.push(selected)    
        return 'shot fired'
        } 
    switchOrientation(shipIndex) {
        const ship = this.ships[shipIndex].ship
        
        ship.isHorizontal = !ship.isHorizontal
        console.log(ship.name, ship.isHorizontal)
        
    }
    }
    



module.exports = {
    Grid,
    Player,
    Ship,
    Game,
}