class Game {
    constructor() {
        this.player1 = new Player('player1')
        this.player2 = new Player('player2')        
        this.currentPlayer = this.player1
        this.otherPlayer = this.player2
        this.p1Board = new Grid()
        this.gameOver = false
    }
    startGame() {

        // start new game
        // this.setAIShips()
        this.player1.autoPlaceShips()
        this.player2.autoPlaceShips()
    
    } 
    togglePlayer() {
        [this.currentPlayer, this.otherPlayer] = [this.otherPlayer, this.currentPlayer]
        return this.currentPlayer
    }    
    setLocation(player, shipIndex, coordinate) {

        const ship = player.ships[shipIndex].ship
        const location = ship.shipLocation    
        const length = ship.length   
        const midIndex = Math.ceil(length / 2) - 1

       for (let i = 0; i < length; i++) {        
        if (ship.isHorizontal) {
            location[i] = (coordinate - midIndex) + i
            
        } else { //vertical
            location[i] = (coordinate - (midIndex * 10)) + (i * 10)
        }        
       }
        console.log(`location: ${location}`)
        return location
    }
    
    getRandomCoord() {

        return Math.floor(Math.random() * 99)
    }
    aiShotLogic() {

        const newCoord  = new aiCoordGenerator()
        console.log(`UsedNumbers: ${newCoord.usedNumbers}`)
        let randomNum = newCoord.getRandomUniqueNumber()

       
        return randomNum
       
    }
    setAIShips() {
        const ai = this.player2
        const aiShips = ai.ships
        ai.occupiedCoordinates.length = 0
        
        for ( let i = 0; i < aiShips.length; i++ ) {
            const randomBoolean = Math.random() < 0.5
            aiShips[i].ship.isHorizontal = randomBoolean

            let location = null
            let isOccupied = false
            let isValid = false
            let inRange = false

            while ( !isValid || !inRange || isOccupied ) {
                const randomCoord = this.getRandomCoord()
                
                location = this.setAILocation(i, randomCoord)

                this.removeRejected(false, location)
        
                isOccupied = this.isDuplicate(ai, location)           
                isValid = this.checkValidity(location)
                inRange = this.isInRange(false)

            }

            console.log(`${aiShips[i].ship.name} at ${location}`)
        }

        let isShort = this.checkOccupiedLength(false)           
        if (isShort) {
            this.setAIShips()
        }

        console.log(`occupied: ${ai.occupiedCoordinates.length}`)
    }
    removeRejected(isPlayer1, location) {
        
        const player = isPlayer1 ? this.player1 : this.player2
        const lastIndex = player.occupiedCoordinates.reduceRight((acc, occupiedLocation, currentIndex) => {
            if (!acc && occupiedLocation.some(occupiedCoordinate => location.includes(occupiedCoordinate))) {
                return currentIndex
            }
            return acc
        }, null)
        if (lastIndex !== null) {
            player.occupiedCoordinates.splice(lastIndex, 1)
        }
    }
    checkOccupiedLength(isPlayer1) {
       const occupiedLength =  isPlayer1 ? this.player1.occupiedCoordinates.length : this.player2.occupiedCoordinates.length
       console.log(`occupiedLength: ${occupiedLength}`) 
       if (occupiedLength === 5) {
            return false
        } 
        return true
    }
    setAILocation(shipIndex, coordiantes) {
        const ship = this.player2.ships[shipIndex].ship
        const location = ship.shipLocation
        const isHorizontal = ship.isHorizontal

        for (let i = 0; i < ship.length; i++) {

            location[i] = isHorizontal ? coordiantes + i : coordiantes + (i * 10)

        }
     
        return location
    }
    isDuplicate(player, location) {

        const isOccupied = player.occupiedCoordinates.some(occupiedLocation => {
            return occupiedLocation.some(occupiedCoordinate => location.includes(occupiedCoordinate))
        })
        
        if (!isOccupied) {
            player.occupiedCoordinates.push(location)
        }
        
        return isOccupied
    }
    checkValidity(location) {
       
        for ( const coord of location ) {
            if ( !this.p1Board.isValid(coord)) {
                return false
            }
        }

        return true
    }
    isInRange(isPlayer1) {
      
        const ships = isPlayer1 ? this.player1.ships : this.player2.ships
       
        for ( const ship of ships ) {            
            for ( const coord of ship.ship.shipLocation ) {    
                if ( coord < 0 || coord > 99 ) {
                    return false
                }               
            }
        }
       
        return true
    }
    isGameOver() {
        
        //if otherplayer .ships[i].isSunk game is over
        for (let i = 0; i < this.otherPlayer.ships.length; i++) {
            if (this.otherPlayer.ships[i].isSunk === true) {
            this.gameOver = true
            }
        }
        
        return this.gameOver
    }
}
class aiCoordGenerator {
    constructor() {
        this.usedNumbers = new Set()
    }
    reset() {
        this.usedNumbers.clear()
    }
    getRandomUniqueNumber() {
        const min = 0
        const max = 99
        let randomNum 

        do {
            randomNum = Math.floor(Math.random() * (max - min + 1)) + min
        } while (this.usedNumbers.has(randomNum))

        this.usedNumbers.add(randomNum)

        return randomNum
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
        this.board = new Grid()
        
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
    setLocation(shipIndex, coordinates) {
        console.log(`shipIndex: ${shipIndex}`)
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
        //checks coordinatesare occupied removes coordinates from occupied array        
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
    fire(coords) {
        this.choosenCoordinates.push(coords)
        return coords
    } 
    isHit(coords) {
        
        for (const ship of this.ships) {
            const isOccupied = ship.ship.shipLocation.some(location => {
                return coords == location
            })
            if (isOccupied) {
                return true
            }
        }
        return false
    }
}
    



module.exports = {
    Grid,
    Player,
    Ship,
    Game,
    aiCoordGenerator,
}