import {Grid} from './grid'
import {Ship} from './ship'

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
    Player,
}