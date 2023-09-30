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
    setAILocation(shipIndex, coordiantes) {
        const ship = this.player2.ships[shipIndex].ship
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
    getRandomCoord() {

        return Math.floor(Math.random() * 99)
    }
    setAIShips() {

        const ai = this.player2
        const aiShips = ai.ships

        //empty the array 
        ai.occupiedCoordinates.length = 0
        let location = null
               
        for (let i = 0; i < aiShips.length; i++) {
            // randomize isHorizontal   
            const randomBoolean = Math.random() < 0.5
            aiShips[i].ship.isHorizontal = randomBoolean

            // random coordinates
            const randomCoord = this.getRandomCoord()
            const randomCoord2 = this.getRandomCoord()
            
            location = this.setAILocation(i, randomCoord)
            
            //check for invalid coordiantes
            const isDuplicateFound = this.isDuplicate(ai, location)
            let validCoords = this.checkValidity()
            while (!validCoords) {
                location = this.setAILocation(i, randomCoord2)
            }

        }
        console.log(`occupied: ${ai.occupiedCoordinates}`)
        console.log(`location: ${location}`)     
        return location
    }
    checkValidity() {
        for (let j = 0; j < location.length; j++) {               
            //if coordinates are invalid or already occupied try again
             if (this.p1Board.isValid(location[j]) === false || isDuplicateFound ) {                 
                 console.log(`retry: ${location[j]}`)
                 console.log(`isDuplicateFound: ${isDuplicateFound}, ${location[j]}`)
                 console.log(`isValid: ${this.p1Board.isValid(location[j])}, ${location[j]}`)
                return false
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

/***/ }),

/***/ "../../../node_modules/us-states/index.js":
/*!************************************************!*\
  !*** ../../../node_modules/us-states/index.js ***!
  \************************************************/
/***/ ((module) => {

module.exports = {
  AA: 'Armed Forces Americas (except Canada)',
  AE: 'Armed Forces Africa',
  AE: 'Armed Forces Canada',
  AE: 'Armed Forces Europe',
  AE: 'Armed Forces Middle East',
  AK: 'Alaska',
  AL: 'Alabama',
  AP: 'Armed Forces Pacific',
  AR: 'Arkansas',
  AS: 'American Samoa',
  AZ: 'Arizona',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DC: 'District of Columbia',
  DE: 'Delaware',
  FL: 'Florida',
  FM: 'Federated States of Micronesia',
  GA: 'Georgia',
  GU: 'Guam',
  HI: 'Hawaii',
  IA: 'Iowa',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  MA: 'Massachusetts',
  MD: 'Maryland',
  ME: 'Maine',
  MH: 'Marshall Islands',
  MI: 'Michigan',
  MN: 'Minnesota',
  MO: 'Missouri',
  MP: 'Northern Mariana Islands',
  MS: 'Mississippi',
  MT: 'Montana',
  NC: 'North Carolina',
  ND: 'North Dakota',
  NE: 'Nebraska',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NV: 'Nevada',
  NY: 'New York',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  PR: 'Puerto Rico',
  PW: 'Palau',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VA: 'Virginia',
  VI: 'Virgin Islands',
  VT: 'Vermont',
  WA: 'Washington',
  WI: 'Wisconsin',
  WV: 'West Virginia',
  WY: 'Wyoming'
};


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
/* harmony import */ var us_states__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! us-states */ "../../../node_modules/us-states/index.js");
/* harmony import */ var us_states__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(us_states__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _script__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./script */ "./src/script.js");
/* harmony import */ var _script__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_script__WEBPACK_IMPORTED_MODULE_1__);



const newGame = new _script__WEBPACK_IMPORTED_MODULE_1__.Game()
newGame.startGame()

const containerDiv = document.getElementById('container')
const friendlyWaters = document.getElementById('friendlyWaters')
const enemyWaters = document.getElementById('enemyWaters')

let currentShip = null
let selectedSquare = null

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
        const gridSquare = document.createElement('div')
        gridSquare.classList.add('gridSquare')
        gridSquare.id = `${coords}-${parentTxt}`     
        gridSquare.setAttribute('data-coords', coords)
        // console.log(`converted: ${convertCoordinatesToGrid(coords)}`)
        gridSquare.style.gridArea =  convertCoordinatesToGrid(coords)  
        parent.appendChild(gridSquare)

    }

    parent.appendChild(alphaDiv)
    parent.appendChild(numDiv)
    labelGrid(alphaDiv, numDiv, parentTxt)
}

function handleSquares() {

    const ships = newGame.player1.ships
    for (let i = 0; i < ships.length; i++) {
        console.log(ships[i].ship)
    }
    

    const gridSquares = document.querySelectorAll('.gridSquare')

    gridSquares.forEach(square => {
        const squareData = square.dataset.coords
        const colNumber =squareData[1]
        const rowNum = squareData[0]
      
        const coords = rowNum + colNumber

        
            
        square.addEventListener('click', ()  => {
            console.log(squareData)
            selectedSquare = squareData
            const isHit = newGame.isHit(coords)
            console.log(`id: ${square.id} isHit: ${isHit}`)
            markSquare(square.id, isHit)
            
        })
        square.addEventListener('dragover', (e) => {
            e.preventDefault()
           
        })
        square.addEventListener('drop', (e) => {
            e.preventDefault()

            if (!newGame.p1Board.isValid(coords))return
           
            const currentShipIndex = getIndexFromName(currentShip)
            const location = newGame.setLocation(newGame.player1, currentShipIndex, coords)
            
            console.log(location)
            renderAllShips()  
            setupGame() 

        })
    })
}
const markSquare = (squareId, isHit) => {

    const selected = document.getElementById(squareId)

    const peg = document.createElement('div')
    peg.style.backgroundColor = isHit ? 'red' : 'blue'
    peg.classList.add('peg')
   

   selected.appendChild(peg)
}
//for ships
const convertToGrid = (coordiante, ship) => {
    console.log(`coordinate length: ${coordiante.length}`)
    const lastIndex = coordiante.length - 1

    const shipLength = ship.length
    const isHorizontal = ship.isHorizontal
    console.log(`shipLength: ${shipLength}, isHorizontal: ${isHorizontal}`)

    const firstCoord = Math.floor(Number(coordiante[0]))
    const lastCoord = Math.floor(coordiante[lastIndex])
    console.log(`firstCoord: ${firstCoord}, lastCoord: ${lastCoord}`)

    
    const firstDigit = isHorizontal ? Math.floor(firstCoord / 10) : Math.floor(lastCoord / 10) 
    const secondDigit = isHorizontal ?  firstCoord % 10 : lastCoord % 10     
    console.log(`firstDigit: ${firstDigit}, secondDigit: ${secondDigit}`)

    const rowStart =firstDigit + 1
    const colStart = secondDigit + 1
    console.log(`rowStart: ${rowStart}, colStart: ${colStart}`)

    const rowEnd = isHorizontal ? rowStart + shipLength - 1 : rowStart
    const colEnd = isHorizontal ? colStart  + shipLength : colStart
    console.log(`rowEnd: ${rowEnd}, colEnd: ${colEnd}`) 

    console.log(`coordinate: ${coordiante}`)
    console.log(`${rowStart} / ${colStart} / ${rowEnd} / ${colEnd}`)
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

    console.log(shipName)
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

        const shipData = isPlayer1 
        ? newGame.player1.ships[i].ship : newGame.player2.ships[i].ship

        const shipCoord = shipData.shipLocation
        const isHorizontal = shipData.isHorizontal
      
        const shipImage = document.createElement('img')
        shipImage.id = isPlayer1 ? shipImages[i].id : `enemy-${shipImages[i].id}`
        shipImage.src = shipImages[i].src
        shipImages.alt = shipImages[i].alt
        shipImage.style.width = (shipData.length * 45) + 'px'

        let gridAreaValue = convertToGrid(shipCoord, shipData)
        console.log(`isHorizontal: ${isHorizontal}`)
        if (isHorizontal) {
            shipImage.classList.remove('rotate')
            // gridAreaValue = convertHorizontalToGrid(shipCoord)
        } else {
            shipImage.classList.add('rotate')           
            // gridAreaValue = convertVerticalToGrid(shipCoord)
        }
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
}

function setupGame() {

    const instructionsDiv = document.getElementById('instructions')
    instructionsDiv.textContent = messages.startingInstruction

    const unplacedShips = document.querySelectorAll('.ship-icon')
    console.log(`length: ${unplacedShips.length}`)
    if (unplacedShips.length < 1) {

        //remove instructions
        instructionsDiv.innerHTML = ''

        const startBtn = document.createElement('button')
        startBtn.textContent = `Start Game`
        instructionsDiv.appendChild(startBtn)

        startBtn.addEventListener('click', () => {
            
            currentShip = null
            instructionsDiv.textContent = messages.currentPlayerTurn

        })
    }

}

const messages = {

    startingInstruction: `Drag & drop ships on grid. Double click to rotate.`,
    currentPlayerTurn: `${newGame.currentPlayer.name}'s Turn`,


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
      
            console.log(`isHorizontal: ${player1.ships[shipIndex].ship.isHorizontal}`)
        })
    
    }
    
}


document.addEventListener("DOMContentLoaded", function () {
    
    renderGrid(enemyWaters, 'hidden')
    renderGrid(friendlyWaters, 'revealed')
    handleSquares()
    setupGame()
    renderAllShips()
    addShipListeners()
  

    // console.log(`current player ${newGame.currentPlayer.name}`)
    // newGame.togglePlayer()
    // console.log(`current player ${newGame.currentPlayer.name}`)
    // newGame.togglePlayer()
    // console.log(`current player ${newGame.currentPlayer.name}`)


 })


})();

/******/ })()
;
//# sourceMappingURL=index.bundle.js.map