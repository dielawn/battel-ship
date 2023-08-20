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
        this.currentPlayer = null
        this.otherPlayer = null
        this.revealedBoard = new Grid()        
        this.hiddenBoard = new Grid()
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
        this.yAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
        this.xAxis = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        this.grid = this.createGrid()
        this.indexTree = this.gridIndexTree()
        this.coordTree = this.gridCoordinatesTree()
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
    gridIndexTree() {
        const linkedGrid = []
        const numRows = 10
        const numCols = 10
        for (let i = 0; i < 100; i++) {
            const row = Math.floor(i / numCols)
            const col = i % numCols
            this.grid[i].left = col > 0 ? i - 1 : null
            this.grid[i].up = row > 0 ? i - numCols : null
            this.grid[i].right = col < numCols - 1 ? i + 1 : null
            this.grid[i].down = row < numRows - 1 ? i + numCols : null
            linkedGrid.push({                    
                    left: this.grid[i].left,
                    up: this.grid[i].up,
                    right: this.grid[i].right,
                    down: this.grid[i].down
                })
        }
        return linkedGrid
    }
    gridCoordinatesTree() {
        const coordsTree = []
        
        for (const index in this.indexTree) {

            const node = this.indexTree[index]
            const leftIndex = node.left
            const upIndex = node.up
            const rightIndex = node.right
            const downIndex = node.down

            const coords = {
                left: leftIndex !== null ? this.findCoords(leftIndex) : null,
                up: upIndex !== null ? this.findCoords(upIndex) : null,
                right: rightIndex !== null ? this.findCoords(rightIndex) : null,
                down: downIndex !== null ? this.findCoords(downIndex) : null
            }

            coordsTree.push(coords)
            
        }
        return coordsTree       
    }
    findCoords(index) {
        const grid = this.grid
       if (index >= 0 && index < grid.length) {        
        return grid[index][0]
       }
       return 'Invalid index'
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
        this.isHorizontal = true
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
    switchOrientation() {
        if (this.isHorizontal) {
            this.isHorizontal = false
            return 'verticle'
        }
        this.isHorizontal = true
        return 'horizontal'
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
            { name: 'Carrier', length: 5, shipLocation: [0,0,0,0,0], },     //ship 0
            { name: 'Battleship', length: 4, shipLocation: [0,0,0,0], },    //ship 1
            { name: 'Destroyer', length: 3, shipLocation: [0,0,0], },       //ship 2
            { name: 'Submarine', length: 3, shipLocation: [0,0,0], },       //ship 3
            { name: 'Patrol', length: 2, shipLocation: [0,0], }             //ship 4
        ]
        const playerShips = []
        for(const ship of ships) {
            playerShips.push(new Ship(ship))
        }
        return playerShips
    }
    setShipLocation(shipsIndex, coordinatesArray) {
        console.log(shipsIndex, coordinatesArray)
       console.log(this.ships[shipsIndex].ship.shipLocation)
      
       const ship = this.ships[shipsIndex].ship
       console.log(ship.length)
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