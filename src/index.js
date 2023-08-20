import { Game, Grid} from './script'

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



