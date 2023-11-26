const DEFAULT_CANVAS_COLOR = "#ffffff";
const DEFAULT_CANVAS_SIZE = 512;
const MIN_CANVAS_SIZE = 64;
const MAX_CANVAS_SIZE = 1024;
const DEFAULT_GRID_SIZE = 16;
const MIN_GRID_SIZE = 1;
const MAX_GRID_SIZE = 64;

let gridSize = DEFAULT_GRID_SIZE;
let canvasColor = DEFAULT_CANVAS_COLOR;
let canvasLength = DEFAULT_CANVAS_SIZE;
//// Toggles
// Pen Styles
let isShaderMode = true;
let isRainbowMode = false;
let isColorMode = false;
let isEraserMode = false;
// Other
let showGridLines = false;
let onMouseDown = false;

////// Functions
function createGrid(xAxis, yAxis) {
    let canvas = document.querySelector("#canvas");
    canvas.style.height = `${canvasLength}px`;
    canvas.style.width = `${canvasLength}px`
    removeAllChildNodes(canvas);
    let boxHeight =  canvasLength / xAxis;
    let boxWidth = canvasLength / yAxis;
    for(let i = 1; i <= xAxis; i++) {
        let columnContainer = document.createElement("div");
        columnContainer.className = "column"
        columnContainer.id = `column${i}`;
        columnContainer.ondragstart = () => false;
        for (let j = 1; j <= yAxis; j++) {
            let box = document.createElement("div");
            box.id = `column${i}:row${j}`;
            box.className = "box";
            box.style.height = `${boxHeight}px`;
            box.style.width = `${boxWidth}px`;
            box.style.backgroundColor = DEFAULT_CANVAS_COLOR;
            addBoxEvents(box);
            columnContainer.appendChild(box);
        }
        canvas.appendChild(columnContainer);
    }
    gridSize = xAxis;
}

function createNewGrid() {
    let xAxis = document.querySelector("#x-axis-input");
    let yAxis = document.querySelector("#y-axis-input");

    if (isValidGridSize(xAxis.value, yAxis.value)) {
        document.querySelector("#warning-message").innerHTML = "";
        createGrid(xAxis.value, yAxis.value);
    } else {
        document.querySelector("#warning-message").innerHTML 
            = `Invalid Grid Size - Must be between ${MIN_GRID_SIZE} and ${MAX_GRID_SIZE} (inclusive)
            but was: ${xAxis.value}`;
        xAxis.value = "";
        yAxis.value = "";
        
    }
    if (showGridLines) {
        drawGridLines();
    }
}

function toggleGridLines() {
    showGridLines = !showGridLines;
    if (showGridLines) {
        drawGridLines();
    } else {
        eraseGridLines();
    }
}

function drawGridLines() {
    let gridContainer = document.querySelector("#canvas");
    let gridContainerArray = [...gridContainer.children];
    let columnPosition = 1;
    gridContainerArray.forEach(column => {
        let columnArray = [...column.children];
        columnArray.forEach(box => {
            // draw shadow on left and top
            box.style.boxShadow = "0 1px 0 #000 inset, 1px 0 0 #000 inset";
            // is last box of last column
            if (box.id === `column${gridSize}:row${gridSize}`) {
                // draw shadow on left, top, right and bottom
                box.style.boxShadow = "0 1px 0 #000 inset, 1px 0 0 #000 inset, 0 -1px #000 inset, -1px 0 #000 inset";
            } 
            // is last box of all columns
            else if (box.id === `column${columnPosition}:row${gridSize}`) { 
                // draw shadow on left, top and bottom
                box.style.boxShadow = "0 1px 0 #000 inset, 1px 0 0 #000 inset, 0 -1px #000 inset";
            }  
            // is last column
            else if (box.parentElement.id === `column${gridSize}`) {
                // draw shadow on left, top and right
                box.style.boxShadow = "0 1px 0 #000 inset, 1px 0 0 #000 inset, -1px 0 #000 inset";
            }
        });
        columnPosition++;
    });
}

function eraseGridLines() {
    let gridContainer = document.querySelector("#canvas");
    let gridContainerArray = [...gridContainer.children];
    gridContainerArray.forEach(column => {
        let columnArray = [...column.children];
        columnArray.forEach(box => {
            box.style.boxShadow = "";
        });
    });
}

function setCanvasSize() {
    let newSize = prompt("New height and width of canvas (min: 64, max 1024):");
    if (newSize >= MIN_CANVAS_SIZE && newSize <= MAX_CANVAS_SIZE) {
        canvasLength = newSize;
        createGrid(gridSize, gridSize);
    } else {
      console.error(`Invalid Input: Expected a number >= 64 and <= 1024 but was: ${newSize}`);
    }
}

function shader(box) {
    if (box.style.backgroundColor === "rgb(255, 255, 255)") {
        box.style.backgroundColor = "rgb(230, 230, 230)";
    } else if (box.style.backgroundColor === "rgb(230, 230, 230)") {
        box.style.backgroundColor = "rgb(204, 204, 204)";
    } else if (box.style.backgroundColor === "rgb(204, 204, 204)") {
        box.style.backgroundColor = "rgb(179, 179, 179)";
    } else if (box.style.backgroundColor === "rgb(179, 179, 179)") {
        box.style.backgroundColor = "rgb(153, 153, 153)";
    } else if (box.style.backgroundColor === "rgb(153, 153, 153)") {
        box.style.backgroundColor = "rgb(128, 128, 128)";
    } else if (box.style.backgroundColor === "rgb(128, 128, 128)") {
        box.style.backgroundColor = "rgb(102, 102, 102)";
    } else if (box.style.backgroundColor === "rgb(102, 102, 102)") {
        box.style.backgroundColor = "rgb(77, 77, 77)";
    } else if (box.style.backgroundColor === "rgb(77, 77, 77)") {
        box.style.backgroundColor = "rgb(51, 51, 51)";
    } else if (box.style.backgroundColor === "rgb(51, 51, 51)") {
        box.style.backgroundColor = "rgb(26, 26, 26)";
    } else if (box.style.backgroundColor === "rgb(26, 26, 26)") {
        box.style.backgroundColor = "rgb(0, 0, 0)";
    }

    return box;
}

function rainbow(box) {
    if (!box.classList.contains("marker")) {
        let red = randomIntFromInterval(0, 255);
        let green = randomIntFromInterval(0, 255);
        let blue = randomIntFromInterval(0, 255);
        box.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
        box.classList.add("marker");
    }
    
    return box;
}

function changePenStyle() {
    if(this.id === "shader") {
        isShaderMode = true;
        isRainbowMode = false;
        isColorMode = false;
        isEraserMode = false;
    } else if (this.id === "rainbow") {
        isShaderMode = false;
        isRainbowMode = true;
        isColorMode = false;
        isEraserMode = false;
    } else if (this.id === "color") {
        isShaderMode = false;
        isRainbowMode = false;
        isColorMode = true;
        isEraserMode = false;
    } else if (this.id === "eraser") {
        isShaderMode = false;
        isRainbowMode = false;
        isColorMode = false;
        isEraserMode = true;
    }
}

function draw(box) {
    let color = box;
    if (isShaderMode) {
        color = shader(box);
    }
    if (isRainbowMode) {
        color = rainbow(box);
    }
    if (isColorMode) {
        
    }
    if (isEraserMode) {
        color = canvasColor;
    }
    return color;
}

//// Validation
function isValidGridSize(xAxis, yAxis) {
    // Is a number
    if (isNaN(xAxis) && isNaN(yAxis)) 
        return false;
    // Number must be greater than 0
    if (xAxis < MIN_GRID_SIZE || yAxis < MIN_GRID_SIZE) 
        return false;
    // Number must be less than or equal to 100
    if (xAxis > MAX_GRID_SIZE || yAxis > MAX_GRID_SIZE) 
        return false;

    return true;
}

//// Events
let setGridSizeButton = document.querySelector("#setGridSizeButton");
setGridSizeButton.addEventListener("click", createNewGrid);

let setCanvasSizeButton = document.querySelector("#setCanvasSize");
setCanvasSizeButton.addEventListener("click", setCanvasSize);

let toggleGridLinesButton = document.querySelector("#toggleGridLinesButton");
toggleGridLinesButton.addEventListener("click", toggleGridLines)

let changePenStyleRadioGroup = document.querySelectorAll("input[name='pen-style']");
changePenStyleRadioGroup.forEach(penStyle => {
    penStyle.addEventListener("change", changePenStyle);
});

// Mirror x-axis input onto y-axis
let xAxisInput = document.querySelector("#x-axis-input");
xAxisInput.addEventListener("input", function(e) {
    let xAxisInputValue = e.target.value;
    let yAxisInput = document.querySelector("#y-axis-input");
    yAxisInput.value = xAxisInputValue;
})

function addBoxEvents(box) {
    box.addEventListener("mousedown", function(e) {
        onMouseDown = true;
        box.style.backgroundColor = draw(box);
    });
    box.addEventListener("mouseenter", function(e) {
        if(onMouseDown) {
            box.style.backgroundColor = draw(box);
        }
    });
    box.addEventListener("mouseup", function(e) {
        onMouseDown = false;
    });
}

//// Helper methods
// via: https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
// via: https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// init

function initialize() {
    createGrid(gridSize, gridSize);
}

initialize();

//// todo:
// Allow change of canvas default background
// Color picker pen style
// make page more presentable/stylish
// create general validation function to handle error message presentation
// maybe:
// don't allow redraw of box with rainbow if it's already been drawn with rainbow