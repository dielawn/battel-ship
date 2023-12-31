
class Game {

    constructor() {
        this.player1 = new Player('player1')
        this.player2 = new Player('player2')        
        this.currentPlayer = this.player2
        this.otherPlayer = this.player1       
        this.gameOver = true
    }
    startGame() {      

        this.gameOver = false
        this.player1.autoPlaceShips()
        this.player2.autoPlaceShips()        
    } 
    togglePlayer() {

        [this.currentPlayer, this.otherPlayer] = [this.otherPlayer, this.currentPlayer]
        return this.currentPlayer
    }          
    isGameOver() {

        if (this.player1.isGameOver()) {
            this.player1.message = `Player 2 has won the game`
            this.gameOver = true

            return true
        }
        if (this.player2.isGameOver()) {
            this.player1.message = `Player 1 has won the game`
            this.gameOver = true

            return true
        } 

        return false 
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
        const row = Math.floor(coordinate / 10)
        const col = coordinate % 10
        if (row >= 0 && row <= 9 && col >= 0 && col <= 9 && col + 1 <= 9 ) {
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
        let text = `Hit! `
        if (this.hitPoints <= 0) {
            text += `You sunk my ${this.ship.name}! `
        this.isSunk = true
      }
      return text
    }    
}

class Player {

    constructor(name, ) {
        this.name = name        
        this.occupiedCoordinates = []     
        this.ships = this.createShips()
        this.board = new Grid()
        this.message = null
        
    }
    createShips() {

        const ships = [
            { name: 'Carrier', length: 5, shipLocation: [0,0,0,0,0], isHorizontal: true },     //ship 0
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
    switchOrientation(shipIndex) {

        const ship = this.ships[shipIndex].ship        
        ship.isHorizontal = !ship.isHorizontal
    }
    setManualLocation(shipIndex, coordinate) {

        const ship = this.ships[shipIndex].ship
        const location = ship.shipLocation
        const length = ship.length
        const midIndex = Math.ceil(length / 2) - 1

        for (let i = 0; i < length; i++) {
            let isHorizontal = ship.isHorizontal
            location[i] = isHorizontal ? (coordinate - midIndex) + i : (coordinate - (midIndex * 10)) + (i * 10) 
        }

        return location
    }
    setLocation(shipIndex, coordinates) {

        const ship = this.ships[shipIndex].ship
        const location = ship.shipLocation
        const isHorizontal = ship.isHorizontal

        for ( let i = 0; i < ship.length; i++ ) {
            location[i] = isHorizontal ? coordinates + i : coordinates + (i * 10)      
         }

         return location
    }
    autoPlaceShips() {

        this.occupiedCoordinates.length = 0

        for (let i = 0; i < this.ships.length; i++) {

            const randomBoolean = Math.random() < 0.5
            this.ships[i].ship.isHorizontal = randomBoolean

            let location = null
            let isOccupied = false
            let isValid = false
            let inRange = false

            while ( !isValid || !inRange || isOccupied ) {

                const randomCoord = Math.floor(Math.random() * 99)
                location = this.setLocation(i, randomCoord)

                this.removeRejected(location)

                isOccupied = this.isOccupied(location)
                isValid = this.checkValidity(location)
                inRange = this.isInRange()
            }
        }

        let isShort = this.checkOccupiedLength()

        if (isShort) {
            this.autoPlaceShips()
        }
    }    
    isHit(coords) {
        
        for (const ship of this.ships) {
            
            const isOccupied = ship.ship.shipLocation.some(location => {
                return coords == location
            })
            if (isOccupied) {
                this.message = ship.hit()
                
                return true
            }
        }
        this.message = `Miss`
        return false
    }
    isGameOver() {       
        for (const ship of this.ships) {
            if (!ship.isSunk) {
                return false
            } 
        }
        return true
    }
    //validating auto placed ships
    isInRange() {
        const ships = this.ships
        for (const ship of ships) {
            for (const coord of ship.ship.shipLocation) {
                if (coord < 0 || coord > 99) {
                    return false
                }
            }
        }
        return true
    }
    checkValidity(location) {
        for (const coord of location) {
            if ( !this.board.isValid(coord)) {
                return false
            }
        }
        return true
    }
    isOccupied(location) {
        const isOccupied = this.occupiedCoordinates.some(occupiedLocation => {
            return occupiedLocation.some(occupiedCoordinate => location.includes(occupiedCoordinate))
        })

        if ( !isOccupied ) {
            this.occupiedCoordinates.push(location)
        }

        return isOccupied
    }
    removeRejected(location) {
        //checks if coordinates are occupied removes coordinates from occupied array        
        const lastIndex = this.occupiedCoordinates.reduceRight((acc, occupiedLocation, currentIndex) => {
            if ( !acc && occupiedLocation.some(occupiedCoordinate => location.includes(occupiedCoordinate))) {
                return currentIndex
            }
            return acc
        }, null)
        if ( lastIndex !== null ) {
            this.occupiedCoordinates.splice(lastIndex, 1)
        }
    }
    checkOccupiedLength(){
        return this.occupiedCoordinates.length !== 5
    }
}
    



module.exports = {
    Grid,
    Player,
    Ship,
    Game,
}