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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _script__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./script */ "./src/script.js");
/* harmony import */ var _script__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_script__WEBPACK_IMPORTED_MODULE_0__);


function createtGame() {
    return new _script__WEBPACK_IMPORTED_MODULE_0__.Game()
}
const newGame = createtGame()
newGame.startGame()

const containerDiv = document.getElementById('container')
const revealedGrid = document.getElementById('revealedGrid')
const hiddenGrid = document.getElementById('hiddenGrid')

function labelGrid(alphaParent, numParent, parentTxt) {

    const playerGrid = newGame.revealedBoard
    const alphaCoords = playerGrid.yAxis
    const numCoords = playerGrid.xAxis

    for (let i = 0; i < 10; i++ ) {
        const alphaSquare = document.createElement('div')
        alphaSquare.id = `${parentTxt}gridSquare${i}`
        alphaSquare.classList.add('alphaSquare')
        alphaSquare.innerHTML = alphaCoords[i]
        alphaParent.appendChild(alphaSquare)
    }
    for (let i = 0; i < 10; i++ ) {
        const numSquare = document.createElement('div')
        numSquare.id = `${parentTxt}gridSquare${i}`
        numSquare.classList.add('numSquare')
        numSquare.innerHTML = numCoords[i]
        numParent.appendChild(numSquare)
    }

}

function renderGrid(parent, parentTxt) {
    const alphaDiv = document.createElement('div')
    const numDiv = document.createElement('div')
    alphaDiv.classList.add('alphaDiv')
    numDiv.classList.add('numDiv')
   

    for (let i = 0; i < 100; i++) {
       const gridSquare = document.createElement('div')
       gridSquare.classList.add('gridSquare')
       gridSquare.id = `${parentTxt}gridSquare${i}`      
       parent.appendChild(gridSquare)
    }

    parent.appendChild(alphaDiv)
    parent.appendChild(numDiv)
    labelGrid(alphaDiv, numDiv, parentTxt)
}

//add event listener to each square
const shipDropLoc = []

function handleSquares() {

    const gridSquares = document.querySelectorAll('.gridSquare')

    gridSquares.forEach(square => {
        const id = square.id;
        const number = id.match(/\d+/)[0];
        const coords = getCoords(number)
        square.addEventListener('click', ()  => {
            
            console.log(number)
            console.log(coords)
        })
        square.addEventListener('dragover', (e) => {
            e.preventDefault()
        })
        square.addEventListener('drop', (e) => {
            e.preventDefault()
            console.log(coords)
            console.log(newGame.revealedBoard.isValid(coords))
            if (newGame.revealedBoard.isValid(coords)) {
                shipDropLoc.push(coords)
                console.log(shipDropLoc)
                // is ship horizontal or verticle
               
                if (shipDropLoc.length === 2 ) {
                    
                    //locate the rest of the ship from bow
                    console.log(shipDropLoc[1])
                    const coordsTree = newGame.revealedBoard.gridCoordinatesTree()
                    console.log(coordsTree)
                    const shipsCoords = []
                    shipsCoords.push(shipDropLoc[1])

                    //access ship location
                    const shipIndex = getIndexFromName(shipDropLoc[0])
                    newGame.player1.setShipLocation(shipIndex, coords)
                    console.log(newGame.player1.ships)
                }
            }
   
        })
    })
}

const capFirstLetter = (inputString) => {
    const [firstLetter, ...rest] = inputString
    return `${firstLetter.toUpperCase()}${rest.join('')}`
}

function getIndexFromName(shipName) {
    console.log(shipName)
    let upperCaseName = capFirstLetter(shipName)
    const ships = newGame.player1.ships
    console.log(ships.length)
    for (let i = 0; i < ships.length; i++) {
        console.log(ships[i].ship.name, upperCaseName)
       if (ships[i].ship.name === upperCaseName) {
        return i
       }
    }
   
}

function getCoords(index) {
    
    const coords = newGame.hiddenBoard.findCoords(index)
    return coords
}

//moveable ships
const handleDomShips = () => {

    const shipIcons = document.querySelectorAll('.ship-icon')
    let isDragging = false
    let draggedShip = null
    
    // const grid = new Grid()

    shipIcons.forEach(shipIcon => {      
        shipIcon.addEventListener('dblclick', () => {            
            shipIcon.classList.toggle('rotate')
            
           console.log(getIndexFromName(draggedShip.id))
            console.log(draggedShip.id)
        })
        shipIcon.addEventListener('mousedown', (e) => {
            console.log('down')
            isDragging = true
            draggedShip = shipIcon
            shipDropLoc.push(draggedShip.id)
            console.log(shipDropLoc)
        })
        shipIcon.addEventListener('mouseup', (e) => {
            console.log('up')
            console.log(isDragging, draggedShip, shipIcon)
            if (isDragging && draggedShip === shipIcon) {
                isDragging = false
                console.log(draggedShip.id)
                draggedShip = null
            
            }
        })
    })
}  

const placeShips = () => {
    //for each player set each ships location
}

const toggleHideElement = (element) => {
    element.classList.toggle('hide')
}
const hideAllShips = () => {
   const shipContainers = document.querySelectorAll('.ship-container')
   for (const container of shipContainers) {
    container.classList.add('hide')
   }
}

const renderShips = () => {
    const p1Ships = newGame.player1.ships
    const p2Ships = newGame.player2.ships

    const shipImages = [
        {
            id: 'carrier', 
            src: "images/carrier.png",
            alt: "carrier-icon"
        },
        {
            id: 'battleShip', 
            src: "images/battleship.png",
            alt: "battleship-icon"
        },
        {
            id: 'destroyer', 
            src: "images/destroyer.png",
            alt: "destroyer-icon"
        },
        {
            id: 'submarine', 
            src: "images/carrier.png",
            alt: "submarine-icon"
        },
        {
            id: 'patrol', 
            src: "images/submarine.png",
            alt: "patrol-icon"
        }
]

    for (let i = 0; i < shipImages.length; i++) {
        console.log(p1Ships[i].ship.name)
        const shipImage = document.createElement('img')
        shipImage.classList.add('ship-icon')
        shipImage.id = shipImages[i].id
        shipImage.src = shipImages[i].src
        shipImages.alt = shipImages[i].alt
        revealedGrid.appendChild(shipImage)
    }
    
}



document.addEventListener("DOMContentLoaded", function () {
    
    renderGrid(hiddenGrid, 'hidden')
    renderGrid(revealedGrid, 'revealed')
    handleSquares()




console.log(newGame.revealedBoard.coordTree)
renderShips()
   handleDomShips()
    getIndexFromName('Carrier')

    
 })




})();

/******/ })()
;
//# sourceMappingURL=index.bundle.js.map