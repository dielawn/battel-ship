import { Game, Grid} from './script'

const newGame = new Game()
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

    const gridSquares = document.querySelectorAll('.gridSquare')

    gridSquares.forEach(square => {
        const squareData = square.dataset.coords
        const colNumber =squareData[1]
        const rowNum = squareData[0]
      
        const coords = rowNum + colNumber
            
        square.addEventListener('click', ()  => {
           console.log(squareData)
           selectedSquare = squareData
           
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
    console.log(`rowNum: ${rowNum}, colNum: ${colNum}`)

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
    console.log(`rowNum: ${rowNum}, colNum: ${colNum}`)

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
    const prevEnemyShip = document.querySelectorAll('.enemyShip')
    for (const el of prevEnemyShip) {
        el.remove()
    }

    const enemyShip = newGame.player2.ships
    for ( let i = 0; i < shipImages.length; i++) {

        let shipsCoord = enemyShip[i].ship.shipLocation   
        let gridAreaValue = null

        console.log(`enemy ships: ${enemyShip[i].ship.name}`)
        let shipIsHorizontal = enemyShip[i].ship.isHorizontal
        const shipImage = document.createElement('img')
        shipImage.classList.add('enemyShip')
        shipImage.id = `enemy-${shipImages[i].id}`
        shipImage.src = shipImages[i].src
        shipImages.alt = `enemy-${shipImages[i].alt}`
        shipImage.style.width = (enemyShip[i].ship.length * 45) + 'px'

        if (shipIsHorizontal) {
            shipImage.classList.remove('rotate')           
            gridAreaValue = convertHorizontalToGrid(shipsCoord)

        } else {
            shipImage.classList.add('rotate')           
            gridAreaValue = convertVerticalToGrid(shipsCoord)

        }    
        console.log('ship horizonal', shipIsHorizontal, 'grid area', gridAreaValue)
        
        shipImage.style.gridArea = gridAreaValue
        enemyWaters.appendChild(shipImage)
    }

    // unplaced ships initialize to dryDock div
    const p1Ships = newGame.player1.ships
    const dryDock = document.createElement('div')
    dryDock.className = 'dry-dock'
    containerDiv.appendChild(dryDock)
    //loop ship images rendering into different parent based on coordinates
    for (let i = 0; i < shipImages.length; i++) {
        
        const shipsCoords = p1Ships[i].ship.shipLocation
        console.log(shipsCoords)
        let shipIsHorizontal = p1Ships[i].ship.isHorizontal
        console.log(p1Ships[i].ship.name,'ship horizonal', shipIsHorizontal)
        const shipImage = document.createElement('img')
        shipImage.id = shipImages[i].id
        shipImage.src = shipImages[i].src
        shipImages.alt = shipImages[i].alt
        shipImage.style.width = (p1Ships[i].ship.length * 45) + 'px'
    
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
        friendlyWaters.appendChild(shipImage)
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
            instructionsDiv.textContent = messages.currentPlayerTurn

        })
    }
    
       
    
}

const messages = {

    currentPlayerTurn: `${newGame.currentPlayer.name}'s Turn`,


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


document.addEventListener("DOMContentLoaded", function () {
    
    renderGrid(enemyWaters, 'hidden')
    renderGrid(friendlyWaters, 'revealed')
    handleSquares()
    setupGame()
    renderGridShip()
    addShipListeners()
   

    console.log(`current player ${newGame.currentPlayer.name}`)
    newGame.togglePlayer()
    console.log(`current player ${newGame.currentPlayer.name}`)
    newGame.togglePlayer()
    console.log(`current player ${newGame.currentPlayer.name}`)


 })

