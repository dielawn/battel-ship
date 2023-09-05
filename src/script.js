
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
    setNewLocation(player, shipIndex, coordinate) {

        if (!this.p1Board.isValid(coordinate)) {
            return 'invalid coordinate'
        }

        const ship = player.ships[shipIndex].ship
        const location = ship.shipLocation
        const length = ship.length
        const midIndex = Math.floor(length / 2)

        location[midIndex] = coordinate

        for (let i = 0; i < length; i++) {
            let prevCoord, nextCoord

            if (ship.isHorizontal) {
                prevCoord = coordinate - i
                nextCoord = coordinate + i
            } else {
                const rowNum = parseInt(coordinate[0])
                const colNum = parseInt(coordinate.slice(1))
                prevCoord = `${rowNum - i}${colNum}`
                nextCoord = `${rowNum + i}${colNum}`
            }

            if (this.p1Board.isValid(prevCoord)) {
                location[midIndex - i] = prevCoord
            } else {
                break // stop if a prevCoord is invalid
            }

            if (this.p1Board.isValid(nextCoord)) {
                location[midIndex + 1] = nextCoord
            } else {
                break
            }
        }

        return location
    }
    setLocation(player, shipIndex, coordinate) {

        if (!this.p1Board.isValid(coordinate)) {
            return 'invalid coordinate'
        }

        const ship = player.ships[shipIndex].ship
        // location array is initilized with a 0 for ships length
        const location = ship.shipLocation
        const  length = ship.length
         //set the middle index of each ship to the coordinate
        let midIndex = Math.ceil(length / 2) - 1

        location[midIndex] = coordinate
        let isMinus = true
        for (let i = 0; i < length + 1; i++) {

            isMinus = this.toggleTrueFalse(isMinus)
            console.log(isMinus, i)
           if (ship.isHorizontal == true) {
            if (isMinus) {
                location[midIndex - i] = coordinate - i
            } else {
                location[midIndex + i] = coordinate + i
            }
           } else { //isVertical
            if (isMinus) {
                location[midIndex - i] = (coordinate[0] - (i * 10)) + coordinate[1]
            } else {
                location[midIndex + i] = (coordinate[0] + (i * 10)) + coordinate[1]
            }
           }         
           // if invalid 
           if (!this.p1Board.isValid(location[i])) {
            //start at the left end of the grid
            if (coordinate.slice(1) < 4) {
                location[0] = coordinate
                location[i] = coordinate[0] + i
            } else { // start at the right end
                const lastIndex = location.length - 1
                location[lastIndex] = coordinate
                location[lastIndex - i] = coordinate[0] + (coordinate[1] - i) 
            } 
           }
        }
        return location
    }
    toggleTrueFalse(current) {
      return !current
    }
    setShipLocation(player, shipIndex, coordinate) {

        let ship = player.ships[shipIndex].ship
        // location array is initilized with 0 for each ships length
        let location = ship.shipLocation
    
        const  length = ship.length   
        let midIndex = Math.ceil(length / 2) - 1
        //set the middle index of each ship to the coordinate
        location[midIndex] = coordinate

        let loopLength = midIndex + 1
        // if ship length is even number add 1 to loop
       
    for (let i = 0; i < loopLength; i++) {
        let rowNum = parseInt(coordinate[0]) % 10
        let colNum = (parseInt(coordinate.slice(1)) + 1) % 10
       
        let prevCoord = null
        let nextCoord = null

    if (ship.isHorizontal === true) {
        prevCoord = coordinate.slice(0, 1) + (parseInt(coordinate.slice(1)) - i)
        nextCoord = coordinate.slice(0, 1) + (parseInt(coordinate.slice(1)) + i)
        if ( this.p1Board.isValid(prevCoord) && this.p1Board.isValid(nextCoord)) {
            location[midIndex - i] = prevCoord
            location[midIndex + i] = nextCoord
        } else { //if coordinates are not valid adjust coordinate to first valid coordinate            
            //if even number
            if (length % 2 === 0) {
                loopLength = 0    
                let locationLength = location.length       
              for (let j = 0; j < locationLength; j++) {
                //start on the left end
                if (coordinate.slice(1) < 4) {
                    location[0] = coordinate
                    location[j] = coordinate[0] + j
                } else { // start at the right end
                    const lastIndex = locationLength - 1
                    location[lastIndex] = coordinate
                    location[lastIndex - j] = coordinate[0] + (coordinate[1] - j) 
                } 
              }
            } 
        }    
    } else { //vertical
        console.log(ship.isHorizontal)
        console.log('ship is vertical')
        prevCoord = (parseInt(coordinate.slice(0, 1)) - i) + (coordinate.slice(1))
        nextCoord = (parseInt(coordinate.slice(0, 1)) + i) + (coordinate.slice(1))
        console.log(this.p1Board.isValid(prevCoord) && this.p1Board.isValid(nextCoord))
        if (this.p1Board.isValid(prevCoord) && this.p1Board.isValid(nextCoord)) {
        //first interation location = [0, '35', '45', '55', 0]
        //second interation location = ['25', '35', '45', '55', '65']
            location[midIndex - i] = prevCoord
            location[midIndex + i] = nextCoord
        } else { //if coordinates are not valid adjust row and try again
            let adjustedPosition = `${this.adjustRowOrColumn(rowNum)}${colNum}`
            this.setShipLocation(player, shipIndex, adjustedPosition)
        }
            
        console.log('vertical', 'row numberr', rowNum, 'column number', colNum, 'ship location', ship.shipLocation[i])
        }

    }
        console.log(`${ship.name}: ${location}`) 
        player.occupiedCoordinates.push([ship.name, location])
        return location
    }
    adjustRowOrColumn = (num) => {
        
            if (num > 4) {
                num = num - 1
            } else {
                num = num + 1
            }
            return num
        
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