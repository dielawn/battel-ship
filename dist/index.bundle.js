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
        return this.grid.some(element => element === xy )
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

let currentShip = null

function labelGrid(alphaParent, numParent, parentTxt) {

    const playerGrid = newGame.p1Board
    const alphaCoords = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
    const numCoords = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

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
        const coords = newGame.p1Board.findCoords(i)
        console.log(coords)
       const gridSquare = document.createElement('div')
       gridSquare.classList.add('gridSquare')
       gridSquare.id = `${coords}-${parentTxt}`     
       gridSquare.setAttribute('data-coords', coords)
         
       gridSquare.style.gridArea =  convertCoordinatesToGrid(coords)  
       parent.appendChild(gridSquare)
    }

    parent.appendChild(alphaDiv)
    parent.appendChild(numDiv)
    labelGrid(alphaDiv, numDiv, parentTxt)
}

//add event listener to each square

function handleSquares() {

    const gridSquares = document.querySelectorAll('.gridSquare')

    gridSquares.forEach(square => {
        const squareData = square.dataset.coords
        const colNumber =squareData[1]
        const rowNum = squareData[0]
      
        const coords = rowNum + colNumber
            
        square.addEventListener('click', ()  => {
           console.log(squareData)
        })
        square.addEventListener('dragover', (e) => {
            e.preventDefault()
           
        })
        square.addEventListener('drop', (e) => {
            e.preventDefault()
           if (!newGame.p1Board.isValid(coords))return
           
            const currentShipIndex = getIndexFromName(currentShip)
            
            console.log(newGame.player1.ships[currentShipIndex].ship.name, newGame.player1.ships[currentShipIndex].ship.isShipHorizontal)
            const shipObject = newGame.player1.ships[currentShipIndex].ship
            placeShip(shipObject, coords) 
            renderGridShip()   
        })
    })
}

const convertCoordinatesToGrid = (coordinate) => {
console.log(coordinate)
    const rowNum = parseInt(coordinate[0]) % 10
    const columnNum = (parseInt(coordinate.slice(1)) + 1) % 10
console.log(rowNum, columnNum)
    const rowStart = rowNum + 1
    const rowEnd = rowStart + 1
    const columnStart = columnNum
    const columnEnd = columnStart + 1
    console.log( `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`)
    return `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`
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

const renderGridShip = () => {
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
    

    //remove duplicates
    const prevShips = document.querySelectorAll('.ship-icon')    
    for (const el of prevShips) {
        el.remove()
    }
    const prevGridShip = document.querySelectorAll('.gridShip')
    for (const el of prevGridShip) {
        el.remove()
    }
    // unplaced ships initialize to dryDock div
    const currentPlayerShips = newGame.currentPlayer.ships
    const dryDock = document.createElement('div')
    dryDock.className = 'dry-dock'
    containerDiv.appendChild(dryDock)
    //loop ship images rendering into different parent based on coordinates
    for (let i = 0; i < shipImages.length; i++) {
        
        const shipsCoords = currentPlayerShips[i].ship.shipLocation
        console.log(shipsCoords)
        let shipIsHorizontal = currentPlayerShips[i].ship.isHorizontal
        console.log(currentPlayerShips[i].ship.name,'ship horizonal', shipIsHorizontal)
        const shipImage = document.createElement('img')
        shipImage.id = shipImages[i].id
        shipImage.src = shipImages[i].src
        shipImages.alt = shipImages[i].alt
        shipImage.style.width = (currentPlayerShips[i].ship.length * 45) + 'px'
        // unplaced ships Coords are initialized as all 0's
        if (shipsCoords[0] === 0) {
            console.log('No coordinates set for ship')  
            shipImage.classList.add('ship-icon')
            dryDock.appendChild(shipImage)
            
            continue
        }
        // convert board coordinates to css grid values to place ships on board
        const gridAreaValue = convertCoordinatesToGrid(shipsCoords)
        shipImage.className = 'gridShip'   
        console.log('ship horizonal', shipIsHorizontal, 'grid area', gridAreaValue)
        if (shipIsHorizontal) {
            shipImage.classList.remove('rotate')
            
        } else {
            shipImage.classList.add('rotate')
            
        }    
        
        shipImage.style.gridArea = gridAreaValue
        revealedGrid.appendChild(shipImage)
    }
    addShipListeners(shipImages)
}
function addShipListeners() {

    const dryShipImg = document.querySelectorAll('.ship-icon')

    for (const ship of dryShipImg) {

        const capitalizedName = capFirstLetter(ship.id)
        ship.addEventListener('mousedown', () => {
            console.log(capitalizedName)
            currentShip = capitalizedName
        })
        
        ship.addEventListener('dblclick', () => {
    
            const shipIndex = getIndexFromName(capitalizedName)
            const selectedShip = newGame.player1
            
            console.log(selectedShip.ships[shipIndex].ship.isHorizontal)
            selectedShip.switchOrientation(shipIndex)
            if (selectedShip.ships[shipIndex].ship.isHorizontal) {
                ship.classList.remove('rotate')
                
            } else {
               
                ship.classList.add('rotate')
            }
            
            console.log(ship.id, selectedShip.ships[shipIndex].ship.isHorizontal)
        })
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
    

getIndexFromName('Carrier')

// placeHorizontalShip(testShip1, 'a1')    
// placeHorizontalShip(testShip2, 'b3')
// placeHorizontalShip(testShip3, 'c5')
// placeHorizontalShip(testShip4, 'j10')
// placeHorizontalShip(testShip5, 'h2')
// placeVerticalShip(testShip1, 'e7')

handleSquares()

newGame.setPlayer()
addShipListeners()
renderGridShip()
addShipListeners()
 })

const placeShip = (ship, dropCoord) => {
console.log(ship)
    const player = newGame.currentPlayer
    let isHorizontal = ship.isHorizontal 
    const  length = ship.length   
    const midIndex = Math.ceil(length / 2) - 1

    ship.shipLocation[midIndex] = dropCoord
    
    for (let i = 0; i < midIndex; i++) {
    
        let rowNum = null
        let colNum = null
        let adjustedPosition = null

    if (isHorizontal) {
        ship.shipLocation[midIndex - i] = dropCoord - i
        ship.shipLocation[midIndex + i] = dropCoord + i
       console.log( ship.shipLocation[midIndex - i],  ship.shipLocation[midIndex + i])       
       
       adjustedPosition = colNum - length 
       console.log('horizonal', 'row letter', rowLetter, 'column number', colNum, 'adjusted position', adjustedPosition)
    } else {
        console.log(ship.shipLocation[i])
        rowLetter = shiftLetter(matches[1],  -i)
        colNum = parseInt(matches[2]) 
        adjustedPosition = shiftLetter(rowLetter, - 1)
        console.log('vertical', 'row letter', rowLetter, 'column number', colNum, 'adjusted position', adjustedPosition)
    }

    let prevCoords = rowLetter + colNum
    
    if (newGame.p1Board.isValid(prevCoords)) {
        ship.shipLocation[i] = prevCoords
        player.occupiedCoordinates.push({
            name: ship.name,
            location: ship.shipLocation[i]
        })
    } else {
        console.log(`invalid: ${prevCoords}`)
        placeShip(ship, rowLetter + adjustedPosition)
        console.log(`${ship.name}: ${ship.shipLocation}`) 
    }
}
console.log(`${ship.name}: ${ship.shipLocation}`) 
return

}

})();

/******/ })()
;
//# sourceMappingURL=index.bundle.js.map