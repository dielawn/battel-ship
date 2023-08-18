/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/script.js":
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
/***/ ((module) => {

eval("\nclass Game {\n    constructor() {\n        this.player1 = new Player('player1')\n        this.player2 = new Player('player2')\n        this.currentPlayer = null\n        this.otherPlayer = null\n        this.gameOver = false\n    }\n   startGame() {\n        // start new game\n        this.setPlayer()\n        //if ships locations are not set, set them\n        // for (let i = 0; i < 5; i ++) {\n        //     this.currentPlayer.setShipLocation(i, promptPlayer())\n        //     this.otherPlayer.setShipLocation(i, promptPlayer())\n        // }\n        if (!this.gameOver) {\n           this.playRound()            \n        }\n    } \n    // promptPlayer() {\n\n    // }\n    playRound() {\n\n        //prompt for coords\n        this.currentPlayer.fire(hitCoords)\n        this.otherPlayer.isHit(hitCoords)\n        this.setPlayer()\n    }\n    setPlayer() {\n        //select starting player and change player turn at end of previous turn\n\n        if (this.currentPlayer === null) {\n            this.currentPlayer = this.player1 \n            this.otherPlayer = this.player2        \n            return this.player1\n        } else if (this.currentPlayer === this.player2) {\n            this.currentPlayer = this.player1\n            this.otherPlayer = this.player2\n            return this.player1 \n        }\n        this.currentPlayer = this.player2\n        this.otherPlayer = this.player1\n        return this.player2\n    }\n    isHit(coords) {\n        let coordinates = this.otherPlayer.occupiedCoordinates\n        for (let i = 0; i < coordinates.length; i++) {\n            for (let j = 0; j < coordinates[i].length; j++) {\n                if (coords === coordinates[i][j].location) {\n                    if (!coordinates[i][j].isHit) {\n                        this.otherPlayer.ships[i].hit()\n                        coordinates[i][j].isHit = true\n                        return true\n                    }\n                }\n            }\n        }\n        return false\n    }\n    isGameOver() {\n        //if otherplayer .ships[i].isSunk game is over\n        for (let i = 0; i < this.otherPlayer.ships.length; i++) {\n            if (this.otherPlayer.ships[i].isSunk === true) {\n              return  this.gameOver = true\n\n            }\n        }\n      return  this.gameOver = false\n    }\n}\n\n\nclass Grid {\n    constructor() {\n        this.yAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']\n        this.xAxis = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']\n        this.grid = this.createGrid()\n    }\n    createGrid() {\n        const grid = []\n\n        for (let i = 0; i < this.yAxis.length; i++) {\n            for (let j = 0; j < this.xAxis.length; j++) {\n                grid.push([this.yAxis[i] + this.xAxis[j]])\n            }\n        }\n        return grid\n    }\n    findCoords(index) {\n        const grid = this.grid\n       if (index >= 0 && index < grid.length) {        \n        return grid[index][0]\n       }\n       return 'Invalid index'\n    }\n    findIndex(x, y) {\n        const grid = this.grid\n        for (let i = 0; i < grid.length; i++) {\n            if (grid[i][0] === x && grid[i][1] === y) {\n             return grid[i]\n            }\n        }\n        return 'Target not found'\n    }\n    isValid(x, y) {\n        return this.grid.some(element => element[0] === x && element[1] === y)\n    }\n    \n} \n\nclass Ship {\n    constructor(shipType) {\n        this.ship = shipType\n        this.hitPoints = this.ship.length\n        this.isSunk = false\n    }\n    hit() {\n        if(this.isSunk === true) {\n            return\n        }\n        this.hitPoints -= 1\n        if (this.hitPoints <= 0) {\n        this.isSunk = true\n        console.log(`You sunk my ${this.ship.name}!`)\n      }\n      return this.hitPoints\n    }    \n   \n}\n\nclass Player {\n    constructor(name, ) {\n        this.name = name\n        this.revealedBoard = new Grid()        \n        this.hiddenBoard = new Grid()\n        this.occupiedCoordinates = []\n        this.choosenCoordinates = []        \n        this.ships = this.createShips()\n        \n    }\n    createShips() {\n        const ships = [\n            { name: 'Carrier', length: 5, shipLocation: [0,0,0,0,0], isSunk: false, },//ship 0\n            { name: 'Battleship', length: 4, shipLocation: [0,0,0,0], isSunk: false, },  //ship 1\n            { name: 'Destroyer', length: 3, shipLocation: [0,0,0], isSunk: false, },  //ship 2\n            { name: 'Submarine', length: 3, shipLocation: [0,0,0], isSunk: false, },  //ship 3\n            { name: 'Patrol', length: 2, shipLocation: [0,0], isSunk: false, }  //ship 4\n        ]\n        const playerShips = []\n        for(const ship of ships) {\n            playerShips.push(new Ship(ship))\n        }\n        return playerShips\n    }\n    setShipLocation(shipsIndex, coordinatesArray) {\n       \n       const ship = this.ships[shipsIndex].ship\n       const shipsCoords = []\n       for (let i = 0; i < ship.length; i++) {\n        ship.shipLocation[i] = coordinatesArray[i]        \n        shipsCoords.push( {\n                player: this.name,\n                ship: ship.name, \n                location: ship.shipLocation[i], \n                isHit: false\n            })\n       }\n       this.occupiedCoordinates.push(shipsCoords)\n       return shipsCoords\n    }\n    fire(coords) {\n        for (let i = 0; i < this.choosenCoordinates.length; i++) {\n            if( coords === this.choosenCoordinates[i]) \n            return 'coordinates already been fired at'\n        } \n        const selected = []\n        selected.push(coords)\n        this.choosenCoordinates.push(selected)    \n        return 'shot fired'\n        } \n       \n    }\n\n\n\n\nconst newGame = new Game()\nconst carrierCoord = ['a1', 'a2', 'a3', 'a4', 'a5']\nconst battleshipCoord = ['b2', 'b3', 'b4', 'b5']\nconst destroyerCoord = ['c3', 'c4', 'c5']\nconst submarineCoord = ['d3', 'e3', 'f3']\nconst patrolCoord = ['f5', 'h5']\nconst hitCoords = 'a2'\n\nnewGame.player1.setShipLocation(0, carrierCoord)\nnewGame.player1.setShipLocation(1, battleshipCoord)\nnewGame.player1.setShipLocation(2, destroyerCoord)\nnewGame.player1.setShipLocation(3, submarineCoord)\nnewGame.player1.setShipLocation(4, patrolCoord)\n\nnewGame.player2.setShipLocation(0, carrierCoord)\nnewGame.player2.setShipLocation(1, battleshipCoord)\nnewGame.player2.setShipLocation(2, destroyerCoord)\nnewGame.player2.setShipLocation(3, submarineCoord)\nnewGame.player2.setShipLocation(4, patrolCoord)\nmodule.exports = {\n    Grid,\n    Player,\n    Ship,\n    Game,\n}\n\n//# sourceURL=webpack://battle-ship/./src/script.js?");

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