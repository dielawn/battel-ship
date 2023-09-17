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
        console.log(`converted: ${convertCoordinatesToGrid(coords)}`)
        gridSquare.style.gridArea =  convertCoordinatesToGrid(coords)  
        parent.appendChild(gridSquare)

    }

    parent.appendChild(alphaDiv)
    parent.appendChild(numDiv)
    labelGrid(alphaDiv, numDiv, parentTxt)
}

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
            const location = newGame.setLocation(newGame.player1, currentShipIndex, coords)
            
            console.log(location)
            renderGridShip()  
            setupGame() 

        })
    })
}
//for ships
const convertVerticalToGrid = (coordinate) => {

    const rowNum = parseInt(coordinate[0])
    const colNum = parseInt(coordinate.slice(1))
    console.log(`rowNum: ${rowNum}, colNum: ${typeof(colNum)}`)

    const firstDigit = Math.floor(colNum / 10) + 1
    const secondDigit = colNum % 10 + 1
    console.log(`firstDigit: ${firstDigit}, secondDigit: ${secondDigit}`)

    const rowStart = firstDigit
    const rowEnd = rowStart 
    const colStart = secondDigit
    const colEnd = colStart
    console.log(`${rowStart} / ${colStart} / ${rowEnd} / ${colEnd}`)
    return `${rowStart} / ${colStart} / ${rowEnd} / ${colEnd}`
}
const convertHorizontalToGrid = (coordinate) => {

    const rowNum = parseInt(coordinate[0])
    const colNum = parseInt(coordinate.slice(1))
    console.log(`rowNum: ${rowNum}, colNum: ${typeof(colNum)}`)

    const firstDigit = Math.floor(colNum / 10) + 1
    const secondDigit = colNum % 10
    console.log(`firstDigit: ${firstDigit}, secondDigit: ${secondDigit}`)

    const rowStart = firstDigit
    const rowEnd = rowStart + 1
    const colStart = secondDigit
    const colEnd = colStart + 1
    console.log(`${rowStart} / ${colStart} / ${rowEnd} / ${colEnd}`)
    return `${rowStart} / ${colStart} / ${rowEnd} / ${colEnd}`
}
//for grid squares
const convertCoordinatesToGrid = (coordinate) => {

    let rowNum = parseInt(coordinate[0])
    rowNum++
    let columnNum = (parseInt(coordinate.slice(1)))
    columnNum++

    const rowStart = rowNum
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
    if (shipName === null) return

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
        console.log(`shipsCoords[1]: ${shipsCoords[1]}, ${shipsCoords[1] == 0}`)
        if (shipsCoords[1] == 0) {

            console.log('No coordinates set for ship')  
            shipImage.classList.add('ship-icon')
            dryDock.appendChild(shipImage)       

            continue
        }
        // convert board coordinates to css grid values to place ships on board
        console.log(`shipsCoords: ${shipsCoords}`)
        let gridAreaValue = null    
        shipImage.className = 'gridShip'   
       
        if (shipIsHorizontal) {
            shipImage.classList.remove('rotate')           
            gridAreaValue = convertHorizontalToGrid(shipsCoords)

        } else {
            shipImage.classList.add('rotate')           
            gridAreaValue = convertVerticalToGrid(shipsCoords)

        }    
        console.log('ship horizonal', shipIsHorizontal, 'grid area', gridAreaValue)
        
        shipImage.style.gridArea = gridAreaValue
        revealedGrid.appendChild(shipImage)
    }
    addShipListeners()
  
}
function setupGame() {

    const instructionsDiv = document.getElementById('instructions')
    instructionsDiv.textContent = `Drag & drop ships on grid. Double click to rotate.`

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
        })
    }
    
       
    
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
            const p1 = newGame.player1
            
            console.log(p1.ships[shipIndex].ship.isHorizontal)
            p1.switchOrientation(shipIndex)
            if (p1.ships[shipIndex].ship.isHorizontal) {
                ship.classList.remove('rotate')
                
            } else {
               
                ship.classList.add('rotate')
            }
            
            console.log(ship.id, p1.ships[shipIndex].ship.isHorizontal)
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

// newGame.setPlayer()
// console.log(newGame.setLocation(newGame.player1, 0, 45))
renderGridShip()
addShipListeners()
setupGame()
 })

// const placeShip = (ship, coordinate) => {
// console.log(ship)
    
//     let isHorizontal = ship.isHorizontal 
//     const  length = ship.length   
//     const midIndex = Math.ceil(length / 2) - 1

//     ship.shipLocation[midIndex] = coordinate
    
//     for (let i = 0; i < midIndex; i++) {
    
//         const rowNum = parseInt(coordinate[0]) % 10
//         const colNum = (parseInt(coordinate.slice(1)) + 1) % 10

//     if (isHorizontal) {
//         if (newGame.p1Board.isValid(coordinate - i) 
//         && newGame.p1Board.isValid(coordinate - i)) {
//         ship.shipLocation[midIndex - i] = coordinate - i
//         ship.shipLocation[midIndex + i] = coordinate + i
//         } else {
//             let adjustedPosition = adjustColumn(colNum)
//             placeShip(ship, adjustedPosition)
//         }
    
//        console.log( ship.shipLocation[midIndex - i],  ship.shipLocation[midIndex + i])       
      
//        console.log('horizonal', 'row number', rowNum, 'column number', colNum, 'ship location', ship.shipLocation[i])
//     } else {
//         if (newGame.p1Board.isValid(coordinate - (i * 10)) 
//         && newGame.p1Board.isValid(coordinate + (i * 10))) {
//             ship.shipLocation[midIndex - (i * 10)] = coordinate - (i * 10)
//             ship.shipLocation[midIndex + (i * 10)] = coordinate + (i * 10)
//         } else {
//             let adjustedPosition = adjustRow(rowNum)
//             placeShip(ship, adjustedPosition)
//         }
            
//         console.log('vertical', 'row numberr', rowNum, 'column number', colNum, 'ship location', ship.shipLocation[i])
//     }

// }
// console.log(`${ship.name}: ${ship.shipLocation}`) 
// return

// }

// const adjustColumn = (colNum) => 
//     colNum > 4 ? colNum - 4 : colNum

//   const adjustRow = (rowNum) => 
//     rowNum > 4 ? rowNum - 4 : rowNum