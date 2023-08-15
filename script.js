// const containerDiv = document.getElementById('container')
class Game {
    constructor() {
        this.player1 = new Player('Sid')
        this.player2 = new Player('Nancy')
        this.currentPlayer = null
        this.otherPlayer = null
        this.gameOver = false
    }
    setPlayer() {
        //select starting player and change player turn at end of previous turn

        if (this.currentPlayer === null) {
            this.currentPlayer = this.player1 
            this.otherPlayer = this.player2        
            return
        } else if (this.currentPlayer === this.player2) {
            this.currentPlayer = this.player1
            this.otherPlayer = this.player2
            return 
        }
        this.currentPlayer = this.player2
        this.otherPlayer = this.player1
        return
    }
    isOccupied(coords) {
        //if coordinates are in player occupied coordinates array return true
        if (this.currentPlayer.occupiedCoordinates[i] === coords) {
            return true
        }
    }
    handleShotFired(coords) {
        // a hit
        if (this.isOccupied(coords)) {
            for (let i = 0; i < this.currentPlayer.ships.length; i++) {
                for (let j = 0; j < this.currentPlayer.ships[i].shipLocation.length; j++)
                if (this.currentPlayer.ships[i].shipLocation[j] === coords) {
                    this.currentPlayer.ships[i].hit()
                    console.log(this.otherPlayer.ships[i].hitPoints, 'is sunk:', this.currentPlayer.ships[i].isSunk)
                   
                }
            }
            // a miss
            this.otherPlayer.choosenCoordinates.push([coords])
            
        }
    }
    isHit(coords) {
        //if coords are in occupied and choosen ship isHit 
       let coordsLength = this.otherPlayer.occupiedCoordinates.length
       for (let i = 0; i < coordsLength; i++ ) {
        for (let j = 0; j < this.otherPlayer.occupiedCoordinates[i].length; j++) {
            console.log(this.otherPlayer.occupiedCoordinates[i][j])
            if (coords === this.otherPlayer.occupiedCoordinates[i][j]) {
                this.otherPlayer.ships[i].hit()
                return true
            }
        }
        
       }
    }
    recievAttack() {
        // if coordinates isOccupied Ship.hit()
        // else choosenCoordinates.push(coordinates)
    }
    endGame() {
        //if player1 or player2 .ships[i].isSunk === true
        this.gameOver = true
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
        shipsCoords.push({name: ship, location: ship.shipLocation[i]})
       }
       this.occupiedCoordinates.push(shipsCoords)
       return shipsCoords
    }
    fire(coords) {
        const selected = []
        selected.push(coords)
        this.choosenCoordinates.push(selected)
        
    }

}


const newGame = new Game()
const carrierCoord = ['a1', 'a2', 'a3', 'a4', 'a5']
const battleshipCoord = ['b2', 'b3', 'b4', 'b5']
const hitCoords = 'a2'

newGame.player2.setShipLocation(0, carrierCoord)
newGame.player2.setShipLocation(1, battleshipCoord)
module.exports = {
    Grid,
    Player,
    Ship,
    Game,
}