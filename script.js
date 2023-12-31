
class Game {
    constructor() {
        this.player1 = new Player('player1')
        this.player2 = new Player('player2')
        this.currentPlayer = null
        this.otherPlayer = null
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
        if (!this.gameOver) {
           this.playRound()            
        }
    } 
    // promptPlayer() {

    // }
    playRound() {

        //prompt for coords
        this.currentPlayer.fire(hitCoords)
        this.otherPlayer.isHit(hitCoords)
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
        this.yAxis = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        this.xAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
        this.grid = this.createGrid()
    }
    createGrid() {
        const grid = []

        for (let i = 0; i < this.yAxis.length; i++) {
            for (let j = 0; j < this.xAxis.length; j++) {
                grid.push([this.xAxis[j] + this.yAxis[i]])
            }
        }
        return grid
    }
    findIndex(x, y) {
        const grid = this.grid
        for (let i = 0; i < grid.length; i++) {
            if (grid[i][0] === x && grid[i][1] === y) {
             return grid[i]
            }
        }
        return 'Target not found'
    }
    isValid(x, y) {
        return this.grid.some(element => element[0] === x && element[1] === y)
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
        this.revealedBoard = new Grid()        
        this.hiddenBoard = new Grid()
        this.occupiedCoordinates = []
        this.choosenCoordinates = []        
        this.ships = this.createShips()
        
    }
    createShips() {
        const ships = [
            { name: 'Carrier', length: 5, shipLocation: [0,0,0,0,0], isSunk: false, },//ship 0
            { name: 'Battleship', length: 4, shipLocation: [0,0,0,0], isSunk: false, },  //ship 1
            { name: 'Destroyer', length: 3, shipLocation: [0,0,0], isSunk: false, },  //ship 2
            { name: 'Submarine', length: 3, shipLocation: [0,0,0], isSunk: false, },  //ship 3
            { name: 'Patrol', length: 2, shipLocation: [0,0], isSunk: false, }  //ship 4
        ]
        const playerShips = []
        for(const ship of ships) {
            playerShips.push(new Ship(ship))
        }
        return playerShips
    }
    setShipLocation(shipsIndex, coordinatesArray) {
       
       const ship = this.ships[shipsIndex].ship
       const shipsCoords = []
       for (let i = 0; i < ship.length; i++) {
        ship.shipLocation[i] = coordinatesArray[i]        
        shipsCoords.push( {
                player: this.name,
                ship: ship.name, 
                location: ship.shipLocation[i], 
                isHit: false
            })
       }
       this.occupiedCoordinates.push(shipsCoords)
       return shipsCoords
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
       
    }




const newGame = new Game()
const carrierCoord = ['a1', 'a2', 'a3', 'a4', 'a5']
const battleshipCoord = ['b2', 'b3', 'b4', 'b5']
const destroyerCoord = ['c3', 'c4', 'c5']
const submarineCoord = ['d3', 'e3', 'f3']
const patrolCoord = ['f5', 'h5']
const hitCoords = 'a2'

newGame.player1.setShipLocation(0, carrierCoord)
newGame.player1.setShipLocation(1, battleshipCoord)
newGame.player1.setShipLocation(2, destroyerCoord)
newGame.player1.setShipLocation(3, submarineCoord)
newGame.player1.setShipLocation(4, patrolCoord)

newGame.player2.setShipLocation(0, carrierCoord)
newGame.player2.setShipLocation(1, battleshipCoord)
newGame.player2.setShipLocation(2, destroyerCoord)
newGame.player2.setShipLocation(3, submarineCoord)
newGame.player2.setShipLocation(4, patrolCoord)
module.exports = {
    Grid,
    Player,
    Ship,
    Game,
}