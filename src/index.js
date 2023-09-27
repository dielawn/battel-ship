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
                     convertToGrid(coords, ships[1])
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

    console.log(`ship: ${ship[1].ship.name}`)
    const shipLength = ship.length
    const isHorizontal = ship.isHorizontal
    
    const firstDigit = Number(coordiante[0])  
    const secondDigit = Number(coordiante[1])     
    console.log(`firstDigit: ${firstDigit}, secondDigit: ${secondDigit}`)

    const rowStart = firstDigit + 1
    const colStart = secondDigit + 1
    console.log(`rowStart: ${rowStart}, colStart: ${colStart}`)

    const rowEnd = isHorizontal ? rowStart + shipLength : rowStart + 1
    const colEnd = isHorizontal ? colStart + 1 : colStart + shipLength
    console.log(`rowEnd: ${rowEnd}, colEnd: ${colEnd}`) 


    return `${rowStart} / ${colStart} / ${rowEnd} / ${colEnd}`
}
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

        let gridAreaValue = null
        console.log(`isHorizontal: ${isHorizontal}`)
        if (isHorizontal) {
            shipImage.classList.remove('rotate')
            gridAreaValue = convertHorizontalToGrid(shipCoord)
        } else {
            shipImage.classList.add('rotate')           
            gridAreaValue = convertVerticalToGrid(shipCoord)
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

