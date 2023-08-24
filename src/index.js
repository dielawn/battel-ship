import { Game, Grid} from './script'

function createtGame() {
    return new Game()
}
const newGame = createtGame()
newGame.startGame()

const containerDiv = document.getElementById('container')
const revealedGrid = document.getElementById('revealedGrid')
const hiddenGrid = document.getElementById('hiddenGrid')

let currentShip = null

function labelGrid(alphaParent, numParent, parentTxt) {

    const playerGrid = newGame.p1Board
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
        const coords = newGame.p1Board.findCoords(i)
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




//add event listener to each square
const shipDropLoc = []
const resetDropLoc = () => shipDropLoc.length = 0

function handleSquares() {

    const gridSquares = document.querySelectorAll('.gridSquare')

    gridSquares.forEach(square => {
        const id = square.id;
        const number = id.match(/\d+/)[0];
        const rowLetter = id[0]
      
        // console.log(number)
        const startCoords = rowLetter + number
        // console.log(startCoords)
        const coords = startCoords
        
        square.addEventListener('click', ()  => {
            resetDropLoc()
            // console.log(id)
            // console.log(number)
            // console.log(startCoords)
        })
        square.addEventListener('dragover', (e) => {
            e.preventDefault()
           
        })
        square.addEventListener('drop', (e) => {
            e.preventDefault()
            console.log(coords)
           if (!newGame.p1Board.isValid(coords))return
            //get ship
            console.log(currentShip)
            const currentShipIndex = getIndexFromName(currentShip)
            const shipObject = newGame.player1.ships[currentShipIndex].ship
            console.log(shipObject)
            placeHorizontalShip(shipObject, coords)
            
           
            renderGridShip()
   
        })
    })
}



const convertCoordinatesToGrid = (coordinate) => {
    const rowLetter = coordinate[0][0]
    const columnNum = parseInt(coordinate[0].substring(1))

    const rowStart = rowLetter.charCodeAt(0) - 'a'.charCodeAt(0) + 1
    const rowEnd = rowStart + coordinate.length
    const columnStart = columnNum
    const columnEnd = columnStart + 1

    return `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`
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
    if (newGame.p1Board.isValid(prevCoords)) {
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
console.log(`${ship.name}: ${ship.shipLocation}`) 
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

        if (newGame.p1Board.isValid(prevCoords)) {
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
    
    const coords = newGame.p1Board.findCoords(index)
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
    const currentPlayerShips = newGame.currentPlayer.ships
    const prevShips = document.querySelectorAll('.ship-icon')
    for (const el of prevShips) {
        el.remove()
    }
    const dryDock = document.createElement('div')
    dryDock.className = 'dry-dock'
    containerDiv.appendChild(dryDock)
    for (let i = 0; i < shipImages.length; i++) {
        const shipsCoords = currentPlayerShips[i].ship.shipLocation
        console.log(shipsCoords)
        const shipImage = document.createElement('img')
        shipImage.id = shipImages[i].id
        shipImage.src = shipImages[i].src
        shipImages.alt = shipImages[i].alt

        if (shipsCoords[0] === 0) {
            console.log('No coordinates set for ship')  
            shipImage.className = 'ship-icon'
            dryDock.appendChild(shipImage)
            addShipListeners()
            continue
        }
        const gridAreaValue = convertCoordinatesToGrid(shipsCoords)
        shipImage.className = 'gridShip'        
        shipImage.style.width = (currentPlayerShips[i].ship.length * 45) + 'px'
        shipImage.style.gridArea = gridAreaValue
        revealedGrid.appendChild(shipImage)
    }

}
function addShipListeners() {

    const dryShipImg = document.querySelectorAll('.ship-icon')

    for (const ship of dryShipImg) {
        ship.addEventListener('mousedown', () => {
            const capitalizedName = capFirstLetter(ship.id)
            console.log(capitalizedName)
            currentShip = capitalizedName
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

renderGridShip()
console.log(addShipListeners())
 })



