const { isValid } = require("date-fns")

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
    setLocation(player, shipIndex, coordinate) {

        let ship = player.ships[shipIndex].ship
        let location = ship.shipLocation    
        const  length = ship.length   
        let midIndex = Math.ceil(length / 2) - 1

       for (let i = 0; i < length; i++) {        
        if (ship.isHorizontal) {
            location[i] = (coordinate - midIndex) + i
        } else { //vertical
            location[i] = (coordinate - (midIndex * 10)) + (i * 10)
        }
       }

      return location
    }
    
    linkCells(value) {
        const isLastCol = value % 10 === 9
        const isFirstCol = value % 10 === 0
        const isTopRow = value >= 0
        const isBottomRow = value <= 99
        return {
            cell: value,
            prevHorizontal: isFirstCol ? null : value - 1,
            nextHorizontal: isLastCol ? null : value + 1,
            prevVertical: isTopRow ? value - 10 : null,
            nextVertical: isBottomRow ? value + 10 : null
        }
    }
    checkValidity(array) {
        const validityData = {
            invalid: [],
            valid: []
        }
    
        for (let i = 0; i < array.length; i++) {
            if (!this.p1Board.isValid(array[i])) {
                validityData.invalid.push(array[i])
            } else {
                validityData.valid.push(array[i])
            }
        }

        return validityData
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
        this.yAxis = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        this.xAxis = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        this.grid = this.createGrid()
    }
    createGrid() {
        const grid = []

        for (let i = 0; i < this.yAxis.length; i++) {
            for (let j = 0; j < this.xAxis.length; j++) {
                grid.push(`${this.yAxis[i]}${this.xAxis[j]}`)
            }
        }
        
        return grid
    }
    isValid(coordinate) {
        if (coordinate >= 0 && coordinate <= 99) {
            return true
        }
        return false
    }
    findCoords(index) {
        if (index >= 0 && index < this.grid.length) {
            return this.grid[index]
        } else {
            return 'Invalid index'
        }

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
        this.choosenCoordinates.push(coords)    
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