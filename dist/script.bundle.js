/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/script.js":
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
/***/ ((module) => {

class Game {
    constructor() {
        this.player1 = new Player('player1')
        this.player2 = new Player('player2')        
        this.currentPlayer = this.player1
        this.otherPlayer = this.player2
        this.p1Board = new Grid()        
        this.p2Board = new Grid()
        this.gameOver = false
    }
    startGame() {

        // start new game
        this.setAIShips()
    
    } 
    togglePlayer() {
        [this.currentPlayer, this.otherPlayer] = [this.otherPlayer, this.currentPlayer]
        return this.currentPlayer
    }
    placeShips(isPlayer1, shipIndex, coordiantes) {
        const player = isPlayer1 ? this.player1 : this.player2
        const ship = player.ships[shipIndex].ship
        const location = ship.shipLocation
        const isHorizontal = ship.isHorizontal

        for (let i = 0; i < ship.length; i++) {

            location[i] = isHorizontal ? coordiantes + i : coordiantes + (i * 10)
    
        }
        return location
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
        console.log(`isShort: ${isShort}`)
    if (isShort) {
        ai.occupiedCoordinates.length = 0
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
    isOccupied(isPlayer1, location) {
        
        const ships = isPlayer1 ? this.player1.ships : this.player2.ships
        const occupied = isPlayer1 ? this.player1.occupiedCoordinates : this.player2.occupiedCoordinates
        for ( const ship of ships ) {
            console.log(`ship: ${ship.ship.name}, location: ${ship.ship.shipLocation}`)
            for (const coordinate of ship.ship.shipLocation) {
                console.log(`coordinate: ${coordinate}, occupied: ${occupied}`)
                const isOccupied = occupied.some(occupiedLocation => {
                    return occupiedLocation.some(occupiedCoordinate => location.includes(occupiedCoordinate))
                })
                
                if (!isOccupied) {
                    console.log(`occupied before: ${occupied}`)
                    occupied.push(location)
                    console.log(`occupied after: ${occupied}`)
                }
        
                console.log(`isOccupied: ${isOccupied} occupied: ${occupied}`)
                
                return isOccupied
            }
        }

        return false    
    }
    isDuplicate(player, location) {

        const isOccupied = player.occupiedCoordinates.some(occupiedLocation => {
            return occupiedLocation.some(occupiedCoordinate => location.includes(occupiedCoordinate))
        })
        
        if (!isOccupied) {
            console.log(`occupied before: ${player.occupiedCoordinates}`)
            player.occupiedCoordinates.push(location)
            console.log(`occupied after: ${player.occupiedCoordinates}`)
        }

        console.log(`isOccupied: ${isOccupied} occupied: ${player.occupiedCoordinates}`)
        
        return isOccupied
    }

    checkValidity(location) {
       
        for ( const coord of location ) {
            if ( !this.p1Board.isValid(coord)) {
                console.log(`Invalid: ${coord}`)
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

    // isHit(coords) {

    //     const occupied = this.otherPlayer.occupiedCoordinates
    //     const includesCoords = occupied.includes(coords)
    
    //     return includesCoords  
    // }
    isHit(coords) {
        const occupied = this.otherPlayer.occupiedCoordinates
        console.log(`${this.otherPlayer.name}`)
        
        for (let i = 0; i < occupied.length; i++) {
            for (let j = 0; j < occupied[i].length; j++) {
                
                if (coords === occupied[i][j]) {
                    if (!occupied[i][j].isHit) {
                        console.log(`coords: ${coords}, occupied: ${occupied[i][j]}`)
                console.log(`coords: ${coords == occupied[i][j]}`)
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
        if (row >= 0 && row <= 9 && col >= 0 && col <= 9 && col + 1 <= 9 ) {
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
        console.log()
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
        this.choosenCoordinates.push(coords)
        return coords
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

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/script.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=script.bundle.js.map