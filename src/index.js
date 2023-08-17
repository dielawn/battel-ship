import { Game, Grid} from './script'
const containerDiv = document.getElementById('container')
const revealedGrid = document.getElementById('revealedGrid')
const hiddenGrid = document.getElementById('hiddenGrid')

function labelGrid() {

    const newGrid = new Grid
    const alphaCoords = newGrid.xAxis
    const numCoords = newGrid.yAxis
    const alphaIds = [0, 11, 22, 33, 44, 55, 66, 77, 88, 99]
    const numIds = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109]

    for (let i = 0; i < 10; i++ ) {
        const alphaSquare = document.getElementById(`${alphaIds}`)
        const numSquare = document.getElementById(`${numIds}`)
        alphaSquare.innerHTML = alphaCoords[i]
        numSquare.innerHTML = numCoords[i]
    }
}

function renderGrid(parent, parentTxt) {

    for (let i = 0; i < 110; i++) {
       const gridSquare = document.createElement('div')
       gridSquare.classList.add('gridSquare')
       gridSquare.id = `${parentTxt}gridSquare${i}`
      
       parent.appendChild(gridSquare)
    }
    labelGrid()
}

renderGrid(hiddenGrid, 'hidden')
renderGrid(revealedGrid, 'revealed')


