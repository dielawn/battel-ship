import { Game, Grid} from './script'
const containerDiv = document.getElementById('container')
const revealedGrid = document.getElementById('revealedGrid')
const hiddenGrid = document.getElementById('hiddenGrid')

function labelGrid(alphaParent, numParent, parentTxt) {

    const newGrid = new Grid
    const alphaCoords = newGrid.yAxis
    const numCoords = newGrid.xAxis

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

renderGrid(hiddenGrid, 'hidden')
renderGrid(revealedGrid, 'revealed')


//add event listener to each square
function getSquares() {

    const gridSquares = document.querySelectorAll('.gridSquare')
    gridSquares.forEach(square => {
        square.addEventListener('click', ()  => {
            const id = square.id;
            const number = id.match(/\d+/)[0];
            const coords = getCoords(number)
            console.log(number)
            console.log(coords)
        })
    })
}
getSquares()

function getCoords(index) {
    const newGrid = new Grid()
    const coords = newGrid.findCoords(index)
    return coords
}

//moveable ships




document.addEventListener("DOMContentLoaded", function () {

    const carrierIcon = document.getElementById('carrierIcon')
    const battleshipIcon = document.getElementById('battleshipIcon')
    const destroyerIcon = document.getElementById('destroyerIcon')
    const submarineIcon = document.getElementById('submarineIcon')
    const patrolIcon = document.getElementById('patrolIcon')
    
    function dragElement(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.onmousedown = dragMouseDown
    
    function dragMouseDown(e) {
    e = e || window.event
    e.preventDefault()
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    document.onmousemove = elementDrag
    }
    
    function elementDrag(e) {
    e = e || window.event
    e.preventDefault()
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY
    element.style.top = (element.offsetTop - pos2) + 'px'
    element.style.left = (element.offsetLeft - pos1) + 'px'
    }
    
    function closeDragElement() {
    document.onmouseup = null
    document.onmousemove = null
    }
    
    }
    
   
    dragElement(carrierIcon)
    dragElement(battleshipIcon)
    dragElement(destroyerIcon)
    dragElement(submarineIcon)
    dragElement(patrolIcon)
    
    const shipIcons = document.querySelectorAll('.ship-icon');

    shipIcons.forEach(shipIcon => {
        const rotateButton = shipIcon.nextElementSibling
        rotateButton.addEventListener('click', () => {            
            shipIcon.classList.toggle('rotate')
        })
    })
})



function startGame() {
    return new Game()
}
const newGame = startGame()
console.log(newGame.player1)