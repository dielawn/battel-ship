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
        this.setAIShips()
        this.setPlayer()
    } 
    playRound(hitCoords) {

        //prompt for coords
        const directHit = this.currentPlayer.fire(hitCoords)
        console.log(`direct hit: ${directHit}`)
        
        this.setPlayer()
        console.log(`current player: ${this.currentPlayer}`)
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
    isDuplicate(player, location) {

        const isOccupied = player.occupiedCoordinates.some(occupiedLocation => {
            return occupiedLocation.some(occupiedCoordinate => location.includes(occupiedCoordinate))
        })
        if (!isOccupied) {
            player.occupiedCoordinates.push(location)
            console.log(`occupied: ${player.occupiedCoordinates}`)
           return  false
        } else {
            console.log(`duplicate found`)
            return true
        }
    }
    isOccupied(coordiantes) {
        
        console.log(`coordinates: ${coordiantes}`)
        const p1Occupodo = this.player1.occupiedCoordinates
        for (let i = 0; i < p1Occupodo.length; i++ ) {
            console.log(`isOccupodoP1: ${p1Occupodo[i]}`)
        }
        console.log(`isOccupodoP1: ${p1Occupodo}`)
        
        const p2Occupodo = this.player2.occupiedCoordinates
        for (let i = 0; i < p2Occupodo.length; i++ ) {
            console.log(`isOccupodoP2: ${p2Occupodo[i]}, coords: ${coordiantes}, equal? ${(p2Occupodo[i] == coordiantes)} `)
        }
        console.log(`isOccupodoP2: ${p2Occupodo}`)
        return p2Occupodo
    }
    getRandomCoord() {

        return Math.floor(Math.random() * 99)
    }
    setAIShips() {

        const ai = this.player2
        const aiShips = ai.ships

        //empty the array 
        this.player2.occupiedCoordinates.length = 0

        let location = null
               
        for (let i = 0; i < aiShips.length; i++) {

            // randomize isHorizontal   
            const randomBoolean = Math.random() < 0.5
            aiShips[i].ship.isHorizontal = randomBoolean

            // random coordinates
            const randomCoord = this.getRandomCoord()
            const randomCoord2 = this.getRandomCoord()
            
            location = this.setLocation(this.player2, i, randomCoord)
            
            //check for invalid coordiantes
            const isDuplicateFound = this.isDuplicate(this.player2, location)
            for (let j = 0; j < location.length; j++) {
               
               console.log(`isDuplicateFound: ${isDuplicateFound}, ${location[j]}`)
               console.log(`isValid: ${this.p1Board.isValid(location[j])}, ${location[j]}`)
               //if coordinates are invalid or already occupied try again
                if (this.p1Board.isValid(location[j]) === false || isDuplicateFound ) {
                    location = this.setLocation(this.player2, i, randomCoord2)
                    console.log(`retry: ${location[j]}`)
                    console.log(`isDuplicateFound: ${isDuplicateFound}, ${location[j]}`)
                    console.log(`isValid: ${this.p1Board.isValid(location[j])}, ${location[j]}`)
                    
                }
            }
        }
        console.log(`occupied: ${ai.occupiedCoordinates}`)
        console.log(`location: ${location}`)     
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
    isHit(coords) {

        const occupied = this.otherPlayer.occupiedCoordinates

        for (let i = 0; i < occupied.length; i++) {
            for (let j = 0; j < occupied[i].length; j++) {
                if (coords === occupied[i][j].location) {
                    if (!occupied[i][j].isHit) {
                        this.otherPlayer.ships[i].hit()
                        occupied[i][j].isHit = true
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
        const row = Math.floor(coordinate / 10)
        const col = coordinate % 10
        console.log(`row: ${row}, col: ${col}`)
        if (row >= 0 && row < 10 && col >= 0 && col < 10 ) {
            console.log(`valid: ${coordinate}`)
            return true
        }
        console.log(`invalid: ${coordinate}`)
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
    fire(coords) {
        for (let i = 0; i < this.choosenCoordinates.length; i++) {
            if( coords === this.choosenCoordinates[i]) 
            return 'coordinates already been fired at'
        } 
        this.choosenCoordinates.push(coords)    
        return newGame.isHit(coords)
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