
import { Game, Grid} from './script'
import { AiCoordGenerator} from './coordGen'

const newGame = new Game()
newGame.startGame()


const aiCoordGenerator = new AiCoordGenerator()

const containerDiv = document.getElementById('container')
const friendlyWaters = document.getElementById('friendlyWaters')
const enemyWaters = document.getElementById('enemyWaters')

let currentShip = null

function labelGrid(alphaParent, numParent, parentTxt) {

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

        const coords = newGame.player1.board.findCoords(i)    
        const gridSquare = document.createElement('div')

        gridSquare.classList.add('gridSquare', parentTxt)
        gridSquare.id = `${coords}-${parentTxt}`     
        gridSquare.setAttribute('data-coords', coords)        
        gridSquare.style.gridArea =  convertCoordinatesToGrid(coords)  

        parent.appendChild(gridSquare)
    }

    parent.appendChild(alphaDiv)
    parent.appendChild(numDiv)
    labelGrid(alphaDiv, numDiv, parentTxt)
}

function handleSquares() {

    const gridSquares = document.querySelectorAll('.gridSquare')
    const instructionsDiv = document.getElementById('instructions')


    gridSquares.forEach(square => {

        const coords = square.dataset.coords

        square.addEventListener('click', ()  => {

            const isHit = newGame.player2.isHit(coords)             
            markSquare(square.id, isHit)
            if (!newGame.isGameOver()) {                
                handleLogs(coords)
                togglePlayer()
            } else {
            handleEnemyShips()
            instructionsDiv.innerHTML += `GAME OVER! ${newGame.player1.message}! `
            
           }
        })
        square.addEventListener('dragover', (e) => {
            e.preventDefault()
           
        })
        square.addEventListener('drop', (e) => {
            e.preventDefault()

            if (!newGame.player1.board.isValid(coords)) {
                return
            }
           
            const currentShipIndex = getIndexFromName(currentShip)
            newGame.player1.setManualLocation(currentShipIndex, coords)     
            renderAllShips()              
            setupGame() 

        })
    })
}
const handleLogs = (coords) => {

    const captnLog = document.getElementById('captnLog')
    const enemyLog = document.getElementById('enemyLog')

    const isPlayer1 = newGame.currentPlayer == newGame.player1
    const isHitTxt = isPlayer1 ? `${newGame.player1.message}! ` : `${newGame.player2.message}! `
    
    if (isPlayer1) {
        captnLog.innerHTML += `Player 1 fires at ${coords} ${isHitTxt} <br>`
    } else {
        enemyLog.innerHTML += `Player 2 fires at ${coords} ${isHitTxt} <br>`
    }
        
    containerDiv.appendChild(captnLog)
    containerDiv.appendChild(enemyLog)

}
const handleEnemyShips = () => {

    const enemyShips = document.querySelectorAll('.enemyShip')

    if (!newGame.isGameOver()) {
        enemyShips.forEach((ship) => {
            ship.classList.add('hide')
        })
    } else {
        enemyShips.forEach((ship) => {
            ship.classList.remove('hide')
        })
    }
}

const togglePlayer = () => {
    
    newGame.togglePlayer()

    const isPlayer1  = newGame.currentPlayer.name == newGame.player1.name    
    if (!isPlayer1) {
        player2Turn()        
    }

    return
}
const player2Turn = () => {

    const instructionsDiv = document.getElementById('instructions')    
    const captnLog = document.createElement('p')

    const coords = aiCoordGenerator.getRandomUniqueNumber()        
    const formatedCoords = coords < 10 ? `0${coords}` : coords.toString()

    const isHit = newGame.player1.isHit(formatedCoords) 
    markSquare(`${formatedCoords}-revealed`, isHit)
    
    if (!newGame.isGameOver()) {                
        handleLogs(formatedCoords)
        togglePlayer()
   } else {
    handleEnemyShips()
    instructionsDiv.innerHTML += `GAME OVER! ${newGame.player1.message}! `
   }
   instructionsDiv.appendChild(captnLog)
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

        const shipData = isPlayer1 ? newGame.player1.ships[i].ship : newGame.player2.ships[i].ship

        const shipCoord = shipData.shipLocation
        const isHorizontal = shipData.isHorizontal
      
        const shipImage = document.createElement('img')
        shipImage.id = isPlayer1 ? shipImages[i].id : `enemy-${shipImages[i].id}`
        shipImage.src = shipImages[i].src
        shipImages.alt = shipImages[i].alt
        shipImage.style.width = (shipData.length * 45) + 'px'
        
        if (isHorizontal) {
            shipImage.classList.remove('rotate')
        } else {
            shipImage.classList.add('rotate')           
        }

        const gridAreaValue = convertToGrid(shipCoord, shipData)
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
    handleEnemyShips()
}

function setupGame() {

    const instructionsDiv = document.getElementById('instructions')
    instructionsDiv.textContent = `Place ships then click 'Start Game' `

    const unplacedShips = document.querySelectorAll('.ship-icon')
    
    if (unplacedShips.length < 1) {

        //remove instructions
        instructionsDiv.innerHTML = ''

        const startBtn = document.createElement('button')
        startBtn.textContent = `Start Game`
        instructionsDiv.appendChild(startBtn)

        startBtn.addEventListener('click', () => {            
            
            currentShip = null            
            addShipsToOccupied()
            player2Turn()
            startBtn.remove()
        })
    }
}

const addShipsToOccupied = () => {

    const occupied = newGame.player1.occupiedCoordinates
    occupied.length = 0
    const ships = newGame.player1.ships

    for ( let i = 0; i < ships.length; i++ ) {
        occupied.push(ships[i].ship.shipLocation)
   }
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
 })

