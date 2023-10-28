
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
        gridSquare.classList.add('gridSquare', parentTxt)
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

        const coords = square.dataset.coords

        square.addEventListener('click', ()  => {

            const isPlayer1 = (newGame.currentPlayer.name == newGame.player1.name)
            console.log(`coords: ${typeof(coords)}`)
            //check then mark a hit or miss
            newGame.player1.fire(coords)
            const isHit = newGame.isHit(coords, isPlayer1) 
            markSquare(square.id, isHit)
            togglePlayer()

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
const isRevealed = (squareId) => {
    const status = squareId.slice(-9)
    console.log(`status: ${status}`)
    const isRevealed = status === '-revealed'
   return isRevealed
}
const togglePlayer = () => {

    const instructionsDiv = document.getElementById('instructions')
    
    newGame.togglePlayer()
    
    instructionsDiv.textContent = `${newGame.currentPlayer.name}'s Turn`
    console.log(`currentPlayer: ${newGame.currentPlayer.name}`)

    const isPlayer1  = newGame.currentPlayer.name == newGame.player1.name
    console.log(`isPlayer1: ${isPlayer1}`)

    if (!isPlayer1) {
        let coords = newGame.aiShotLogic()
        const formatedCoords = coords < 10 ? `0${coords}` : coords.toString()
        console.log(`coords: ${(formatedCoords)}`)
        // if formatedCoords is not in chooseCoords continue or get a new coord 
        newGame.player2.fire(formatedCoords)
        const isHit = newGame.isHit(formatedCoords, false) 
        markSquare(`${formatedCoords}-revealed`, isHit)
        togglePlayer()
        
    }

    return
}
const markSquare = (squareId, isHit) => {

    const selected = document.getElementById(squareId)

    const peg = document.createElement('div')
    peg.style.backgroundColor = isHit ? 'red' : 'white'
    peg.classList.add('peg')
   
   selected.appendChild(peg)
}
//for ships
const convertToGrid = (coordiante, ship) => {
    
    const lastIndex = coordiante.length - 1

    const shipLength = ship.length
    const isHorizontal = ship.isHorizontal

    const firstCoord = Math.floor(Number(coordiante[0]))
    const lastCoord = Math.floor(coordiante[lastIndex])
    
    const firstDigit = isHorizontal ? Math.floor(firstCoord / 10) : Math.floor(lastCoord / 10) 
    const secondDigit = isHorizontal ?  firstCoord % 10 : lastCoord % 10     
   
    const rowStart = firstDigit + 1
    const colStart = secondDigit + 1

    const rowEnd = isHorizontal ? rowStart + shipLength - 1 : rowStart
    const colEnd = isHorizontal ? colStart  + shipLength : colStart

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
        
        if (isHorizontal) {
            shipImage.classList.remove('rotate')
        } else {
            shipImage.classList.add('rotate')           
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
    
    const toggleBtn = document.createElement('button')
    toggleBtn.textContent = 'Toggle Hide'
    instructionsDiv.appendChild(toggleBtn)

    toggleBtn.addEventListener('click', () => {
        const enemyShips = document.querySelectorAll('.enemyShip')
        enemyShips.classList.toggle('.hide')
    })

    if (unplacedShips.length < 1) {

        //remove instructions
        instructionsDiv.innerHTML = ''

        const startBtn = document.createElement('button')
        startBtn.textContent = `Start Game`
        instructionsDiv.appendChild(startBtn)

        startBtn.addEventListener('click', () => {
            
            currentShip = null
            console.log(`currentPlayer: ${newGame.currentPlayer.name}`)
            instructionsDiv.textContent = messages.currentPlayerTurn
            addShipsToOccupied()
        })

       


    }

}
const updateMessages = () => {

    const unplacedShips = document.querySelectorAll('.ship-icon')

}
const addShipsToOccupied = () => {
    const occupied = newGame.player1.occupiedCoordinates
    occupied.length = 0
   const ships = newGame.player1.ships
   for ( let i = 0; i < ships.length; i++ ) {
    console.log(`shipsLocation: ${occupied}`)
    occupied.push(ships[i].ship.shipLocation)
   }
   console.log(`p1 occupied: ${occupied}`)
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
    
    renderAllShips()
    addShipListeners()
    setupGame()

    // console.log(`current player ${newGame.currentPlayer.name}`)
    // newGame.togglePlayer()
    // console.log(`current player ${newGame.currentPlayer.name}`)
    // newGame.togglePlayer()
    // console.log(`current player ${newGame.currentPlayer.name}`)


 })

