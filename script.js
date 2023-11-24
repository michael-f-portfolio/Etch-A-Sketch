const DEFAULT_CANVAS_COLOR = "#ffffff";
const DEFAULT_GRID_SIZE = 16;
const DEFAULT_CANVAS_SIZE = 512;
const MIN_GRID_SIZE = 0;
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
        xAxis.value = "";
        yAxis.value = "";
        document.querySelector("#warning-message").innerHTML = "Invalid Grid Size"
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
    let newSize = prompt("New height and width of canvas (max 1024):");
    if (newSize > 0 && newSize <= 1024) {
        canvasLength = newSize;
        createNewGrid(gridSize, gridSize);
    } else {
      console.error("Invalid Input: Expected a number > 0 and <= 1024");
    }
}

function shader(boxStyles) {
    if (boxStyles.backgroundColor === "rgb(255, 255, 255)") {
        boxStyles.backgroundColor = "rgb(230, 230, 230)";
    } else if (boxStyles.backgroundColor === "rgb(230, 230, 230)") {
        boxStyles.backgroundColor = "rgb(204, 204, 204)";
    } else if (boxStyles.backgroundColor === "rgb(204, 204, 204)") {
        boxStyles.backgroundColor = "rgb(179, 179, 179)";
    } else if (boxStyles.backgroundColor === "rgb(179, 179, 179)") {
        boxStyles.backgroundColor = "rgb(153, 153, 153)";
    } else if (boxStyles.backgroundColor === "rgb(153, 153, 153)") {
        boxStyles.backgroundColor = "rgb(128, 128, 128)";
    } else if (boxStyles.backgroundColor === "rgb(128, 128, 128)") {
        boxStyles.backgroundColor = "rgb(102, 102, 102)";
    } else if (boxStyles.backgroundColor === "rgb(102, 102, 102)") {
        boxStyles.backgroundColor = "rgb(77, 77, 77)";
    } else if (boxStyles.backgroundColor === "rgb(77, 77, 77)") {
        boxStyles.backgroundColor = "rgb(51, 51, 51)";
    } else if (boxStyles.backgroundColor === "rgb(51, 51, 51)") {
        boxStyles.backgroundColor = "rgb(26, 26, 26)";
    } else if (boxStyles.backgroundColor === "rgb(26, 26, 26)") {
        boxStyles.backgroundColor = "rgb(0, 0, 0)";
    } 

    return boxStyles;
}

function rainbow(boxStyles) {
    let red = randomIntFromInterval(0, 255);
    let green = randomIntFromInterval(0, 255);
    let blue = randomIntFromInterval(0, 255);
    boxStyles.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    return boxStyles;
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

function draw(boxStyles) {
    let color = boxStyles;
    if (isShaderMode) {
        color = shader(boxStyles);
    }
    if (isRainbowMode) {
        color = rainbow(boxStyles);
    }
    if(isColorMode) {

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
    if (xAxis <= MIN_GRID_SIZE || yAxis <= MIN_GRID_SIZE) 
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
        box.style.backgroundColor = draw(box.style);
    });
    box.addEventListener("mouseenter", function(e) {
        if(onMouseDown) {
            box.style.backgroundColor = draw(box.style);
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
// maybe:
// don't allow redraw of box with rainbow if it's already been drawn with rainbow
