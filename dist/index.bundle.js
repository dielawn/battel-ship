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
    getCellTree(index) {
        const linkedGrid = []
        const numRows = 10
        const numCols = 10

        const row = Math.floor(index / numCols)
        const col = index % numCols
        
        this.grid[index].left = col > 0 ? index - 1 : null
        this.grid[index].up = row > 0 ? index - numCols : null
        this.grid[index].right = col < numCols - 1 ? index + 1 : null
        this.grid[index].down = row < numRows - 1 ? index + numCols : null
        linkedGrid.push({                    
            left: this.grid[index].left,
            up: this.grid[index].up,
            right: this.grid[index].right,
            down: this.grid[index].down
            })
        
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
       
      
       const ship = this.ships[shipsIndex].ship
       
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
        const coords = newGame.revealedBoard.findCoords(i)
       const gridSquare = document.createElement('div')
       gridSquare.classList.add('gridSquare')
       gridSquare.id = `${coords}-${parentTxt}`     
       const matches = gridSquare.id.match(/([a-zA-Z]+)(\d+)-(.+)/)
        const rowLetter = matches[1]
        const columnNum = parseInt(matches[2])

        const rowStart = rowLetter.charCodeAt(0) - 'a'.charCodeAt(0) + 1

        const columnStart = columnNum
        const columnEnd = columnNum + 1

        const rowEnd = rowStart + 1

        const gridElement = gridSquare    
       
        gridElement.style.gridArea = `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}` 
       parent.appendChild(gridSquare)
    }

    parent.appendChild(alphaDiv)
    parent.appendChild(numDiv)
    labelGrid(alphaDiv, numDiv, parentTxt)
}

function assignSquares() {
    const gridSquares = document.querySelectorAll('.gridSquare')
    for (let i = 0; i < 100; i++) {
        const matches = gridSquares[i].id.match(/([a-zA-Z]+)(\d+)-(.+)/)
        const rowLetter = matches[1]
        const columnNum = parseInt(matches[2])

        const rowStart = rowLetter.charCodeAt(0) - 'a'.charCodeAt(0) + 1

        const columnStart = columnNum
        const columnEnd = columnNum + 1

        const rowEnd = rowStart + 1

        const gridElement = gridSquares[i]     
       
        gridElement.style.gridArea = `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`
      
    }
}


//add event listener to each square
const shipDropLoc = []
const resetDropLoc = () => shipDropLoc.length = 0

function handleSquares() {

    const gridSquares = document.querySelectorAll('.gridSquare')

    gridSquares.forEach(square => {
        const id = square.id;
        const number = id.match(/\d+/)[0];
        const startCoords = getCoords(number)
        const coords = startCoords
        
        square.addEventListener('click', ()  => {
            resetDropLoc()
            console.log(id)
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
           
   
        })
    })
}



const renderShipOnGrid = () => {
  const battleship2 = document.createElement('img')
  battleship2.id = 'b2'
  battleship2.src = 'images/battleship.png'
  battleship2.style.gridArea = '1/2/6/2'
  battleship2.style.zIndex = '2'
  revealedGrid.appendChild(battleship2)
}

const placeHorizontalShip = (ship, dropCoord) => {
   
    const player = newGame.currentPlayer
    const  length = ship.length   
    const midIndex = Math.ceil(length / 2) - 1
    ship.shipLocation[midIndex] = dropCoord

    for (let i = 0; i < length; i++) {
        const matches = dropCoord.match(/([a-zA-Z]+)(\d+)/)
    let rowLetter = matches[1]
    let colNum = parseInt(matches[2])  + i
    let prevCoords = rowLetter + colNum
    if (newGame.revealedBoard.isValid(prevCoords)) {
        ship.shipLocation[i] = prevCoords
        player.occupiedCoordinates.push({
            name: ship.name,
            location: ship.shipLocation[i]
        })
    } else {
        console.log(`invalid: ${prevCoords}`)
        let adjustedColNum = colNum - length        
        placeHorizontalShip(ship, rowLetter + adjustedColNum)
        console.log(`${ship.name}: ${ship.shipLocation}`) 
    }
}
return 

}

const placeVerticalShip = (ship, dropCoord) => {
    
    const player = newGame.currentPlayer
    const  length = ship.length   
    const midIndex = Math.ceil(length / 2) - 1
    ship.shipLocation[midIndex] = dropCoord

    for (let i = 0; i < length; i++) {
        const matches = dropCoord.match(/([a-zA-Z]+)(\d+)/)
        console.log(matches[1])
        let rowLetter = shiftLetter(matches[1], + i)
        console.log(rowLetter)
        let colNum = parseInt(matches[2])  
        let prevCoords = rowLetter + colNum
        console.log(`${ship.name}: ${ship.shipLocation}`) 

        if (newGame.revealedBoard.isValid(prevCoords)) {
            ship.shipLocation[i] = prevCoords
            player.occupiedCoordinates.push({
            name: ship.name,
            location: ship.shipLocation[i]
        })
        } else {
            console.log(`invalid: ${prevCoords}`)
            let adjustedRowLetter = shiftLetter(rowLetter, - 1)       
            placeVerticalShip(ship, adjustedRowLetter + colNum)
            console.log(`${ship.name}: ${ship.shipLocation}`) 
        }
        
}
console.log(`${ship.name}: ${ship.shipLocation}`) 

return 
}

function shiftLetter(letter, shift) {
    const charCode = letter.charCodeAt(0)
    const shiftedCharCode = charCode + shift
    if (shiftedCharCode < 'a'.charCodeAt(0)) {
        const wrapedCharCode = 'j'.charCodeAt(0) - ('a'.charCodeAt(0) - shiftedCharCode - 1)
        return String.fromCharCode((wrapedCharCode))
    }
    const shiftedLetter = String.fromCharCode(shiftedCharCode)
    return shiftedLetter
}
const capFirstLetter = (inputString) => {
    const [firstLetter, ...rest] = inputString
    return `${firstLetter.toUpperCase()}${rest.join('')}`
}

function getIndexFromName(shipName) {
    console.log(shipName)
    let upperCaseName = capFirstLetter(shipName)
    const ships = newGame.player1.ships
    for (let i = 0; i < ships.length; i++) {
       if (ships[i].ship.name === upperCaseName) {
        return i
       }
    }
   
}

function getCoords(index) {
    
    const coords = newGame.hiddenBoard.findCoords(index)
    return coords
}


function getSquareIndexFromEvent(e) {
    const target = e.target
    const id = target.id
    const number = id.match(/\d+/)[0]
    return parseInt(number)
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
            id: 'battleship', 
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
            src: "images/submarine.png",
            alt: "submarine-icon"
        },
        {
            id: 'patrol', 
            src: "images/patrol.png",
            alt: "patrol-icon"
        }
]

    for (let i = 0; i < shipImages.length; i++) {
        
        const shipImage = document.createElement('img')
        shipImage.classList.add('ship-icon')
        shipImage.id = shipImages[i].id
        shipImage.src = shipImages[i].src
        shipImages.alt = shipImages[i].alt
        revealedGrid.appendChild(shipImage)
    }
    
}

const testShip1 = newGame.player1.ships[0].ship
const testShip2 = newGame.player1.ships[1].ship
const testShip3 = newGame.player1.ships[2].ship
const testShip4 = newGame.player1.ships[3].ship
const testShip5 = newGame.player1.ships[4].ship

document.addEventListener("DOMContentLoaded", function () {
    
    renderGrid(hiddenGrid, 'hidden')
    renderGrid(revealedGrid, 'revealed')
    

renderShips()
getIndexFromName('Carrier')

// placeHorizontalShip(testShip1, 'a10')    
// placeHorizontalShip(testShip2, 'a10')
// placeHorizontalShip(testShip3, 'a10')
// placeHorizontalShip(testShip4, 'a10')
// placeHorizontalShip(testShip5, 'a10')
placeVerticalShip(testShip1, 'a5')

handleSquares()
// assignSquares()
renderShipOnGrid()
 })




})();

/******/ })()
;
//# sourceMappingURL=index.bundle.js.map