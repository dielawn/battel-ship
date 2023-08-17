import { Game, Grid} from './script'
const containerDiv = document.getElementById('container')
const revealedGrid = document.getElementById('revealedGrid')
const hiddenGrid = document.getElementById('hiddenGrid')

function labelGrid(parentTxt) {

    const newGrid = new Grid
    const alphaCoords = newGrid.xAxis
    const numCoords = newGrid.yAxis
    const alphaIds = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
    const numIds = [ 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]

    for (let i = 0; i < 10; i++ ) {
        const alphaSquare = document.getElementById(`${parentTxt}gridSquare${alphaIds[i]}`)
        const numSquare = document.getElementById(`${parentTxt}gridSquare${numIds[i]}`)
        alphaSquare.innerHTML = alphaCoords[i]
        numSquare.innerHTML = numCoords[i]
    }
}

function renderGrid(parent, parentTxt) {

    for (let i = 0; i < 100; i++) {
       const gridSquare = document.createElement('div')
       gridSquare.classList.add('gridSquare')
       gridSquare.id = `${parentTxt}gridSquare${i}`
      
       parent.appendChild(gridSquare)
    }
    // labelGrid(parentTxt)
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
