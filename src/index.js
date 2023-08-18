import { Game, Grid} from './script'
const containerDiv = document.getElementById('container')
const revealedGrid = document.getElementById('revealedGrid')
const hiddenGrid = document.getElementById('hiddenGrid')

function labelGrid(alphaParent, numParent, parentTxt) {

    const newGrid = new Grid
    const alphaCoords = newGrid.xAxis
    const numCoords = newGrid.yAxis

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
            console.log(number)
        })
    })
}
getSquares()


// function startGame() {
//     return new Game()
// }
// const newGame = startGame()
// console.log(newGame.player1)