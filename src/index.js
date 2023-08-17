import { Game, Grid} from './script'
const containerDiv = document.getElementById('container')
const revealedGrid = document.getElementById('revealedGrid')
const hiddenGrid = document.getElementById('hiddenGrid')

function labelGrid(parentTxt) {

    const newGrid = new Grid
    const alphaCoords = newGrid.xAxis
    const numCoords = newGrid.yAxis
    const alphaIds = [0, 11, 22, 33, 44, 55, 66, 77, 88, 99]
    const numIds = [ 111, 112, 113, 114, 115, 116, 117, 118, 119, 120]

    for (let i = 0; i < 10; i++ ) {
        const alphaSquare = document.getElementById(`${parentTxt}gridSquare${alphaIds[i]}`)
        const numSquare = document.getElementById(`${parentTxt}gridSquare${numIds[i]}`)
        alphaSquare.innerHTML = alphaCoords[i]
        numSquare.innerHTML = numCoords[i]
    }
}

function renderGrid(parent, parentTxt) {

    for (let i = 0; i < 121; i++) {
       const gridSquare = document.createElement('div')
       gridSquare.classList.add('gridSquare')
       gridSquare.id = `${parentTxt}gridSquare${i}`
      
       parent.appendChild(gridSquare)
    }
    labelGrid(parentTxt)
}

renderGrid(hiddenGrid, 'hidden')
renderGrid(revealedGrid, 'revealed')


