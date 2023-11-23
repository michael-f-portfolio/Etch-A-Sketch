const DEFAULT_COLOR = "#ffffff";
const DEFAULT_GRID_SIZE = 16;

let onMouseDown = false;
let gridSize = DEFAULT_GRID_SIZE;

//// Toggles
// Pen Styles
let isShaderMode = true;
let isRainbowMode = false;
let isColorMode = false;
let isEraserMode = false;
// Other
let showGrid = false;

////// Functions
function createDrawingPad(xAxis, yAxis) {
    let container = document.querySelector("#container");
    removeAllChildNodes(container);
    for(let i = 1; i <= xAxis; i++) {
        let columnContainer = document.createElement("div");
        columnContainer.className = "column"
        columnContainer.id = `column${i}`;
        columnContainer.ondragstart = () => false;
        for (let j = 1; j <= yAxis; j++) {
            let box = document.createElement("div");
            box.id = `column${i}:row${j}`;
            box.className = "box";
            box.style.backgroundColor = DEFAULT_COLOR;
            addBoxEvents(box);
            columnContainer.appendChild(box);
        }
        container.appendChild(columnContainer);
    }
    gridSize = xAxis;
}

function createNewDrawingPad() {
    let xAxis = document.querySelector("#x-axis-input");
    let yAxis = document.querySelector("#y-axis-input");

    if (isValidGridSize(xAxis.value, yAxis.value)) {
        document.querySelector("#warning-message").innerHTML = "";
        createDrawingPad(xAxis.value, yAxis.value);
    } else {
        xAxis.value = "";
        yAxis.value = "";
        document.querySelector("#warning-message").innerHTML = "Invalid Grid Size"
    }
}

function incrementBackgroundColor(boxStyles) {
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

function toggleGridLines() {
    let gridContainer = document.querySelector("#container");
    let gridContainerArray = [...gridContainer.children];
    let columnPosition = 1;
    if(!showGrid) {
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
        showGrid = true;
    } else {
        gridContainerArray.forEach(column => {
            let columnArray = [...column.children];
            columnArray.forEach(box => {
                box.style.boxShadow = "";
            });
        });
        showGrid = false;
    }
}

function changePenStyle() {
    if(this.id === "shader") {
        console.log(this.id);
        isShaderMode = true;
        isRainbowMode = false;
        isColorMode = false;
        isEraserMode = false;
    } else if (this.id === "rainbow") {
        console.log(this.id);
        isShaderMode = false;
        isRainbowMode = true;
        isColorMode = false;
        isEraserMode = false;
    } else if (this.id === "color") {
        console.log(this.id);
        isShaderMode = false;
        isRainbowMode = false;
        isColorMode = true;
        isEraserMode = false;
    } else if (this.id === "eraser") {
        console.log(this.id);
        isShaderMode = false;
        isRainbowMode = false;
        isColorMode = false;
        isEraserMode = true;
    }
}

function draw(boxStyles) {
    let color = boxStyles;
    if (isShaderMode) {
        color = incrementBackgroundColor(boxStyles);
    }
    if (isRainbowMode) {

    }
    if(isColorMode) {

    }
    if (isEraserMode) {
        color = DEFAULT_COLOR;
    }
    return color;
}

//// Validation
function isValidGridSize(xAxis, yAxis) {
    // Is a number
    if (isNaN(xAxis) && isNaN(yAxis)) return false;
    // Number must be greater than 0
    if (xAxis <= 0 || yAxis <= 0) return false;
    // Number must be less than or equal to 100
    if (xAxis > 100 || yAxis > 100) return false;

    return true;
}

//// Events
let setGridSizeButton = document.querySelector("#setGridSizeButton");
setGridSizeButton.addEventListener("click", createNewDrawingPad);

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

// init

function initialize() {
    createDrawingPad(DEFAULT_GRID_SIZE, DEFAULT_GRID_SIZE);
}

initialize();