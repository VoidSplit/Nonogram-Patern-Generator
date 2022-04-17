let wrapper = document.getElementById('wrapper')
let minmaxSize = [5,12]
let gridSize = 0;
let grid = []
let copyButton = document.getElementsByClassName('icon')[0]
let output = document.getElementById('output-content')
copyButton.addEventListener('click', () => {
    let outputContent = output.textContent;
    if (outputContent.length > 0) {
        navigator.clipboard.writeText(outputContent);
    }
})
document.getElementById('import').addEventListener('click', () => {
    let quest = prompt('Veuillez entrer votre json', "")
    if (quest == null || quest == "") {
        text = "User cancelled the prompt.";
    } else {
        importGrid(quest)
    }
})
document.getElementById('generate').addEventListener('click', () => {
    let quest = prompt(`Veuillez entrer une taille entre ${minmaxSize[0]} et ${minmaxSize[1]}`, "5")
    if (quest == null || quest == "") {
        text = "User cancelled the prompt.";
    } else {
        let result = parseInt(quest) || 0;
        if(result > minmaxSize[1] || result < minmaxSize[0]) return;
        else generateGrid(result);
    }
})
document.getElementById('export').addEventListener('click', () => {
    exportGrid()
})
document.getElementById('clear').addEventListener('click', () => {
    clearGrid()
})
function togglePixel(line, pixel, element, isImported) {
    let pixelElement = grid[line][pixel]
    if(isImported) {
        if(pixelElement == 1) {
            grid[line][pixel] = 1;
            element.setAttribute('class', 'pixel black')
        }
        if(pixelElement == 0) {
            grid[line][pixel] = 0;
            element.setAttribute('class', 'pixel white')
        }
    } else {
        if(pixelElement == 0) {
            grid[line][pixel] = 1;
            element.setAttribute('class', 'pixel black')
        }
        if(pixelElement == 1) {
            grid[line][pixel] = 0;
            element.setAttribute('class', 'pixel white')
        }
    }
    
}
function generateGrid(size) {
    let box = document.createElement('div')
    box.setAttribute('id', 'box')
    for(let line = 0; line < size; line++) {
        let lineElement = document.createElement('div')
        lineElement.setAttribute('class', 'line')
        let lineGrid = []
        for(let pixel = 0; pixel < size; pixel++) {
            lineGrid.push(0)
            let pixelElement = document.createElement('div')
            pixelElement.setAttribute('class', 'pixel')
            pixelElement.addEventListener('click', () => {
                togglePixel(line, pixel, pixelElement)
            })
            lineElement.appendChild(pixelElement)
            
        }
        grid.push(lineGrid)
        box.appendChild(lineElement)
    }
    wrapper.appendChild(box)
}
function importGrid(json) {
    function splitChunks(sourceArray, chunkSize) {
        if(chunkSize <= 0)
          throw "chunkSize must be greater than 0";
        let result = [];
        for (var i = 0; i < sourceArray.length; i += chunkSize) {
          result[i / chunkSize] = sourceArray.slice(i, i + chunkSize);
        }
        return result;
    }
    
    parsed = JSON.parse(json)
    let parsedGrid = splitChunks(parsed.datas, parsed.size)
    grid = parsedGrid
    parsedGrid.forEach((line, i) => {
        let lineElement = document.createElement('div')
        lineElement.setAttribute('class', 'line')
        let lineGrid = []
        line.forEach((pixel, j) => {
            let pixelElement = document.createElement('div')
            pixelElement.setAttribute('class', 'pixel')
            if(pixel == 1) {
                lineGrid.push(1)
                togglePixel(i, j, pixelElement, true)
            }
            if(pixel == 0) {
                lineGrid.push(0)
                togglePixel(i, j, pixelElement, true)
            }
            pixelElement.addEventListener('click', () => {
                togglePixel(i, j, pixelElement)
            })
            lineElement.appendChild(pixelElement)
        })
        grid.push(lineGrid)
        box.appendChild(lineElement)
    })
    wrapper.appendChild(box)
}
function exportGrid() {
    let formatedGrid = [].concat(...grid);
    output.textContent = JSON.stringify({size: gridSize,datas: formatedGrid})
}
function clearGrid() {
    let box = document.getElementById('box')
    box.parentNode.removeChild(box)
    generateGrid(gridSize)
}
generateGrid(gridSize)