import { isValid } from 'date-fns'
import { Game, Grid} from './script'
import { fi } from 'date-fns/locale'

function createtGame() {
    return new Game()
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

const placeHorizontalShip = (ship, dropCoord) => {
   
    const  length = ship.length   
    const midIndex = Math.ceil(length / 2) - 1
    ship.shipLocation[midIndex] = dropCoord

    for (let i = 0; i < length; i++) {
    let rowLetter = dropCoord[0]
    let colNum = parseInt(dropCoord[1])  + i
    let prevCoords = rowLetter + colNum
    if (newGame.revealedBoard.isValid(prevCoords)) {
        ship.shipLocation[i] = prevCoords
    } else {
        console.log(`invalid: ${prevCoords}`)
        let adjustedColNum = colNum - length        
        placeHorizontalShip(ship, rowLetter + adjustedColNum)
        console.log(ship.shipLocation) 
        // return `invalid: ${prevCoords}`
    }
}
return 

}

const placeVerticleShip = (ship) => {

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

const testShip1 = newGame.player1.ships[3].ship
const testShip2 = newGame.player1.ships[0].ship
const testShip3 = newGame.player1.ships[4].ship
const testShip4 = newGame.player1.ships[2].ship
const testShip5 = newGame.player1.ships[1].ship

document.addEventListener("DOMContentLoaded", function () {
    
    renderGrid(hiddenGrid, 'hidden')
    renderGrid(revealedGrid, 'revealed')
    handleSquares()

renderShips()
getIndexFromName('Carrier')

placeHorizontalShip(testShip1, 'a7')    
placeHorizontalShip(testShip2, 'a9')
placeHorizontalShip(testShip3, 'a7')
placeHorizontalShip(testShip4, 'a7')
placeHorizontalShip(testShip5, 'a7')
 })



