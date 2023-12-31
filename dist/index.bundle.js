/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/coordGen.js":
/*!*************************!*\
  !*** ./src/coordGen.js ***!
  \*************************/
/***/ ((module) => {

class AiCoordGenerator {

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

module.exports = {
    AiCoordGenerator
}

/***/ }),

/***/ "./src/script.js":
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
/***/ ((module) => {


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
/* harmony import */ var _coordGen__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./coordGen */ "./src/coordGen.js");
/* harmony import */ var _coordGen__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_coordGen__WEBPACK_IMPORTED_MODULE_1__);




const newGame = new _script__WEBPACK_IMPORTED_MODULE_0__.Game()
newGame.startGame()


const aiCoordGenerator = new _coordGen__WEBPACK_IMPORTED_MODULE_1__.AiCoordGenerator()

const containerDiv = document.getElementById('container')
const friendlyWaters = document.getElementById('friendlyWaters')
const enemyWaters = document.getElementById('enemyWaters')

let currentShip = null

function labelGrid(alphaParent, numParent, parentTxt) {

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

        const coords = newGame.player1.board.findCoords(i)    
        const gridSquare = document.createElement('div')

        gridSquare.classList.add('gridSquare', parentTxt)
        gridSquare.id = `${coords}-${parentTxt}`     
        gridSquare.setAttribute('data-coords', coords)        
        gridSquare.style.gridArea =  convertCoordinatesToGrid(coords)  

        parent.appendChild(gridSquare)
    }

    parent.appendChild(alphaDiv)
    parent.appendChild(numDiv)
    labelGrid(alphaDiv, numDiv, parentTxt)
}

function handleSquares() {

    const gridSquares = document.querySelectorAll('.gridSquare')
    const instructionsDiv = document.getElementById('instructions')


    gridSquares.forEach(square => {

        const coords = square.dataset.coords

        square.addEventListener('click', ()  => {

            const isHit = newGame.player2.isHit(coords)             
            markSquare(square.id, isHit)
            if (!newGame.isGameOver()) {                
                handleLogs(coords)
                togglePlayer()
            } else {
            handleEnemyShips()
            instructionsDiv.innerHTML += `GAME OVER! ${newGame.player1.message}! `
            
           }
        })
        square.addEventListener('dragover', (e) => {
            e.preventDefault()
           
        })
        square.addEventListener('drop', (e) => {
            e.preventDefault()

            if (!newGame.player1.board.isValid(coords)) {
                return
            }
           
            const currentShipIndex = getIndexFromName(currentShip)
            newGame.player1.setManualLocation(currentShipIndex, coords)     
            renderAllShips()              
            setupGame() 

        })
    })
}
const handleLogs = (coords) => {

    const captnLog = document.getElementById('captnLog')
    const enemyLog = document.getElementById('enemyLog')

    const isPlayer1 = newGame.currentPlayer == newGame.player1
    const isHitTxt = isPlayer1 ? `${newGame.player1.message}! ` : `${newGame.player2.message}! `
    
    if (isPlayer1) {
        captnLog.innerHTML += `Player 1 fires at ${coords} ${isHitTxt} <br>`
    } else {
        enemyLog.innerHTML += `Player 2 fires at ${coords} ${isHitTxt} <br>`
    }
        
    containerDiv.appendChild(captnLog)
    containerDiv.appendChild(enemyLog)

}
const handleEnemyShips = () => {

    const enemyShips = document.querySelectorAll('.enemyShip')

    if (!newGame.isGameOver()) {
        enemyShips.forEach((ship) => {
            ship.classList.add('hide')
        })
    } else {
        enemyShips.forEach((ship) => {
            ship.classList.remove('hide')
        })
    }
}

const togglePlayer = () => {
    
    newGame.togglePlayer()

    const isPlayer1  = newGame.currentPlayer.name == newGame.player1.name    
    if (!isPlayer1) {
        player2Turn()        
    }

    return
}
const player2Turn = () => {

    const instructionsDiv = document.getElementById('instructions')    
    const captnLog = document.createElement('p')

    const coords = aiCoordGenerator.getRandomUniqueNumber()        
    const formatedCoords = coords < 10 ? `0${coords}` : coords.toString()

    const isHit = newGame.player1.isHit(formatedCoords) 
    markSquare(`${formatedCoords}-revealed`, isHit)
    
    if (!newGame.isGameOver()) {                
        handleLogs(formatedCoords)
        togglePlayer()
   } else {
    handleEnemyShips()
    instructionsDiv.innerHTML += `GAME OVER! ${newGame.player1.message}! `
   }
   instructionsDiv.appendChild(captnLog)
}
const markSquare = (squareId, isHit) => {

    const selected = document.getElementById(squareId)
    const peg = document.createElement('div')

    peg.style.backgroundColor = isHit ? 'red' : 'white'
    peg.classList.add('peg')
   
   selected.appendChild(peg)
}
//for ships
const convertToGrid = (coordiante, ship) => {
    
    const lastIndex = coordiante.length - 1

    const shipLength = ship.length
    const isHorizontal = ship.isHorizontal

    const firstCoord = Math.floor(Number(coordiante[0]))
    const lastCoord = Math.floor(coordiante[lastIndex])
    
    const firstDigit = isHorizontal ? Math.floor(firstCoord / 10) : Math.floor(lastCoord / 10) 
    const secondDigit = isHorizontal ?  firstCoord % 10 : lastCoord % 10     
   
    const rowStart = firstDigit + 1
    const colStart = secondDigit + 1

    const rowEnd = isHorizontal ? rowStart + shipLength - 1 : rowStart
    const colEnd = isHorizontal ? colStart  + shipLength : colStart

    return `${rowStart} / ${colStart} / ${rowEnd} / ${colEnd}`
}
//for grid squares
const convertCoordinatesToGrid = (coordinate) => {

    let rowNum = coordinate[0]
    rowNum++
    let columnNum = coordinate[1]
    columnNum++

    const rowStart = rowNum
    const rowEnd = rowStart + 1
    const columnStart = columnNum
    const columnEnd = columnStart + 1
    // console.log( `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`)
    return `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`
}
const capFirstLetter = (inputString) => {

    const [firstLetter, ...rest] = inputString
    return `${firstLetter.toUpperCase()}${rest.join('')}`
}
function getIndexFromName(shipName) {

    if (shipName === null) return

    let upperCaseName = capFirstLetter(shipName)
    const ships = newGame.player1.ships

    for (let i = 0; i < ships.length; i++) {
       if (ships[i].ship.name === upperCaseName) {
        return i
       }
    }   
}
const renderShips = (isPlayer1) => {

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

    const dryDock = document.createElement('div')
    dryDock.className = 'dry-dock'
    containerDiv.appendChild(dryDock)

    for (let i = 0; i < shipImages.length; i++) {

        const shipData = isPlayer1 ? newGame.player1.ships[i].ship : newGame.player2.ships[i].ship

        const shipCoord = shipData.shipLocation
        const isHorizontal = shipData.isHorizontal
      
        const shipImage = document.createElement('img')
        shipImage.id = isPlayer1 ? shipImages[i].id : `enemy-${shipImages[i].id}`
        shipImage.src = shipImages[i].src
        shipImages.alt = shipImages[i].alt
        shipImage.style.width = (shipData.length * 45) + 'px'
        
        if (isHorizontal) {
            shipImage.classList.remove('rotate')
        } else {
            shipImage.classList.add('rotate')           
        }

        const gridAreaValue = convertToGrid(shipCoord, shipData)
        shipImage.style.gridArea = gridAreaValue
        
        if (isPlayer1) {
            let isNotSet = (shipCoord[1] == 0)
            isNotSet ? shipImage.classList.add('ship-icon') : shipImage.classList.add('gridShip')
            isNotSet ? dryDock.appendChild(shipImage) : friendlyWaters.appendChild(shipImage)       
        } else {
            shipImage.classList.add('enemyShip')
            enemyWaters.appendChild(shipImage)
        }
    }
}
 const removeElements = (elements) => {    
    for (const el of elements) 
        el.remove()
}
const renderAllShips = () => {

    //remove dry dock
    const prevDock = document.querySelectorAll('.dry-dock')
    removeElements(prevDock)

    //remove previous ships
    const prevShips = document.querySelectorAll('.ship-icon')    
    removeElements(prevShips)

    const prevGridShip = document.querySelectorAll('.gridShip')
    removeElements(prevGridShip)

    const prevEnemyShip = document.querySelectorAll('.enemyShip')
    removeElements(prevEnemyShip)

    //player1
    renderShips(true)
    //player2
    renderShips(false)

    addShipListeners()
    handleEnemyShips()
}

function setupGame() {

    const instructionsDiv = document.getElementById('instructions')
    instructionsDiv.textContent = `Place ships then click 'Start Game' `

    const unplacedShips = document.querySelectorAll('.ship-icon')
    
    if (unplacedShips.length < 1) {

        //remove instructions
        instructionsDiv.innerHTML = ''

        const startBtn = document.createElement('button')
        startBtn.textContent = `Start Game`
        instructionsDiv.appendChild(startBtn)

        startBtn.addEventListener('click', () => {            
            
            currentShip = null            
            addShipsToOccupied()
            player2Turn()
            startBtn.remove()
        })
    }
}

const addShipsToOccupied = () => {

    const occupied = newGame.player1.occupiedCoordinates
    occupied.length = 0
    const ships = newGame.player1.ships

    for ( let i = 0; i < ships.length; i++ ) {
        occupied.push(ships[i].ship.shipLocation)
   }
}

function addShipListeners() {

    const dryShipImg = document.querySelectorAll('.ship-icon')

    for (const ship of dryShipImg) {

        const capitalizedName = capFirstLetter(ship.id)
        ship.addEventListener('mousedown', () => {
            currentShip = capitalizedName
        })
        
        ship.addEventListener('dblclick', () => {
    
            const shipIndex = getIndexFromName(capitalizedName)
            const player1 = newGame.player1
            
            player1.switchOrientation(shipIndex)

            let isHorizontal = player1.ships[shipIndex].ship.isHorizontal            
            isHorizontal = !isHorizontal
            renderAllShips()
            
        })
    }
}

document.addEventListener("DOMContentLoaded", function () {
    
    renderGrid(enemyWaters, 'hidden')
    renderGrid(friendlyWaters, 'revealed')
    handleSquares()
    renderAllShips()
    addShipListeners()
    setupGame()
 })


})();

/******/ })()
;
//# sourceMappingURL=index.bundle.js.map