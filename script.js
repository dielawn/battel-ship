// const containerDiv = document.getElementById('container')
class Game {
    constructor() {
        this.player1 = new Player('Sid')
        this.player2 = new Player('Nancy')

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
   
    //recievAttack() {}
} 

class Ship {
    constructor(shipType) {
        this.ship = shipType
        this.hitPoints = this.ship.length
        this.isSunk = false
    }
    hit() {
      this.hitPoints - 1
      if (this.hitPoints <= 0) {
        this.isSunk = true
        return `You sunk my ${this.ship.name}!`
      }
      
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
        this.isTurn = false
        
    }
    createShips() {
        const ships = [
            { name: 'Carrier', length: 5, shipLocation: [0,0,0,0,0] },//ship 0
            { name: 'Battleship', length: 4, shipLocation: [0,0,0,0] },  //ship 1
            { name: 'Destroyer', length: 3, shipLocation: [0,0,0] },  //ship 2
            { name: 'Submarine', length: 3, shipLocation: [0,0,0] },  //ship 3
            { name: 'Patrol', length: 2, shipLocation: [0,0]}  //ship 4
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
        shipsCoords.push(ship.shipLocation[i])
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

newGame.player2.setShipLocation(0, carrierCoord)
newGame.player2.setShipLocation(1, battleshipCoord)
module.exports = {
    Grid,
    Player,
    Ship,
    Game,
}