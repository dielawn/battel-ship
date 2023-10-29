/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/grid.js":
/*!*********************!*\
  !*** ./src/grid.js ***!
  \*********************/
/***/ (() => {



/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _grid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./grid */ "./src/grid.js");
/* harmony import */ var _grid__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_grid__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ship */ "./src/ship.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_ship__WEBPACK_IMPORTED_MODULE_1__);
/* module decorator */ module = __webpack_require__.hmd(module);



class Player {

    constructor(name, ) {
        this.name = name        
        this.occupiedCoordinates = []     
        this.ships = this.createShips()
        this.board = new _grid__WEBPACK_IMPORTED_MODULE_0__.Grid()
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
            playerShips.push(new _ship__WEBPACK_IMPORTED_MODULE_1__.Ship(ship))
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
    Player,
}

/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ (() => {



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
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.hmd = (module) => {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: () => {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/player.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=player.bundle.js.map