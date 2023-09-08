
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

        if (this.p1Board.isValid(coordinate)) {
            return 'invalid coordinate';
        }
    
        const ship = player.ships[shipIndex].ship;
        const location = ship.shipLocation;
        const length = ship.length;
    
        for (let i = 0; i < length; i++) {
            if (ship.isHorizontal) {
                location[i] = coordinate + i;
            } else { // isVertical
                const rowNum = parseInt(coordinate[0]);
                const colNum = parseInt(coordinate.slice(1));
                location[i] = `${rowNum + i}${colNum}`;
            }
    
            if (!this.p1Board.isValid(location[i])) {
                return 'invalid location'; // Return error if any coordinate is invalid
            }
        }
    
        return location;
    }
    
   completeArray(array) {
    
    for (let i = 0; i < array.length; i++) {

        if (array[i] > 0) {
            midIndex = array[i]
        }
    }
   }
    setLocation(player, shipIndex, coordinate) {

        let ship = player.ships[shipIndex].ship
        let location = ship.shipLocation    
        const  length = ship.length   
        let midIndex = Math.ceil(length / 2) - 1

       console.log(`isHorizontal: ${ship.isHorizontal}`)

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
 
    setShipLocation(player, shipIndex, coordinate) {

        let ship = player.ships[shipIndex].ship
        // location array is initilized with 0 for each ships length
        let location = ship.shipLocation
    
        const  length = ship.length   
        let midIndex = Math.ceil(length / 2) - 1
        //set the middle index of each ship to the coordinate
        location[midIndex] = coordinate

        let loopLength = midIndex + 1
              
    for (let i = 1; i < length; i++) {
        let rowNum = coordinate[0] % 10
        let colNum = coordinate + 1 % 10
       
        let prevCoord = null
        let nextCoord = null

    if (ship.isHorizontal === true) {
        console.log('coordinate:', coordinate)
        prevCoord = coordinate - i
        nextCoord = coordinate + i
        console.log(`prevCoord ${prevCoord}, nextCoord ${nextCoord}`)
        console.log(this.p1Board.isValid(prevCoord[0], prevCoord[1]))
        console.log( this.p1Board.isValid(nextCoord[0], nextCoord[1]))
        if ( this.p1Board.isValid(prevCoord[0], prevCoord[1]) && this.p1Board.isValid(nextCoord[0], nextCoord[1])) {
            location[midIndex - i] = prevCoord
            location[midIndex + i] = nextCoord
            console.log(length % 2 === 0 )
            console.log( i, loopLength)
            console.log(`location ${location}, prevCoord ${prevCoord}, nextCoord ${nextCoord}`)
        } else { //if coordinates are not valid adjust coordinate to first valid coordinate            
            //if even number
            if (length % 2 === 0) {
                
            } 
        }    
    } else { //vertical
        console.log(ship.isHorizontal)
        console.log('ship is vertical')
        prevCoord = coordinate / 10
        nextCoord = coordinate * 10
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
        this.yAxis = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        this.xAxis = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        this.grid = this.createGrid()
    }
    createGrid() {
        const grid = []

        for (let i = 0; i < this.yAxis.length; i++) {
            for (let j = 0; j < this.xAxis.length; j++) {
                grid.push([this.yAxis[i], this.xAxis[j]])
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
        return this.grid.some(element => element[0] === x && element[1] === y )
    }
  
    findCoords(index) {
        const grid = this.grid
        if (index >= 0 && index < this.grid.length) {
            return this.grid[index][0]
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
            { name: 'Carrier', length: 5, shipLocation: [[0],[0],[0],[0],[0]], isHorizontal: true},     //ship 0
            { name: 'Battleship', length: 4, shipLocation: [[0],[0],[0],[0]], isHorizontal: true },    //ship 1
            { name: 'Destroyer', length: 3, shipLocation: [[0],[0],[0]], isHorizontal: true },       //ship 2
            { name: 'Submarine', length: 3, shipLocation: [[0],[0],[0]], isHorizontal: true },       //ship 3
            { name: 'Patrol', length: 2, shipLocation: [[0],[0]], isHorizontal: true }             //ship 4
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