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
            box.className = "box box-shade-0";
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

function incrementBackgroundColor(classList) {
    let boxClassList = classList;
    if (boxClassList.contains("box-shade-0")) {
         boxClassList.replace("box-shade-0", "box-shade-10");
    } else if (boxClassList.contains("box-shade-10")) {
         boxClassList.replace("box-shade-10", "box-shade-20");
    } else if (boxClassList.contains("box-shade-20")) {
         boxClassList.replace("box-shade-20", "box-shade-30");
    } else if (boxClassList.contains("box-shade-30")) {
         boxClassList.replace("box-shade-30", "box-shade-40");
    } else if (boxClassList.contains("box-shade-40")) {
         boxClassList.replace("box-shade-40", "box-shade-50");
    } else if (boxClassList.contains("box-shade-50")) {
         boxClassList.replace("box-shade-50", "box-shade-60");
    } else if (boxClassList.contains("box-shade-60")) {
         boxClassList.replace("box-shade-60", "box-shade-70");
    } else if (boxClassList.contains("box-shade-70")) {
         boxClassList.replace("box-shade-70", "box-shade-80");
    } else if (boxClassList.contains("box-shade-80")) {
         boxClassList.replace("box-shade-80", "box-shade-90");
    } else if (boxClassList.contains("box-shade-90")) {
         boxClassList.replace("box-shade-90", "box-shade-100");
    } else if (boxClassList.contains("box-shade-100")) {
         // do nothing 
    }
    return boxClassList;
 }

function toggleGridLines() {
    let gridContainerArray = [...document.querySelector("#container").children];
    if(!showGrid) {
        gridContainerArray.forEach(column => {
            let columnArray = [...column.children];
            columnArray.forEach(box => {
                box.style.borderTop = "1px solid black";
                box.style.borderLeft = "1px solid black";
            });
            column.style.borderBottom = "1px solid black"
            // If column is the last (furthest to the right) add a border on its right
            if (column.id === `column${gridSize}`) {
                column.style.borderRight = "1px solid black";
            }
        });
        showGrid = true;
    } else {
        gridContainerArray.forEach(column => {
            let columnArray = [...column.children];
            columnArray.forEach(box => {
                box.style.borderTop = "";
                box.style.borderLeft = "";
            });
            column.style.borderBottom = ""
            if (column.id === `column${gridSize}`) {
                column.style.borderRight = "";
            }
        });
        showGrid = false;
    }
}

function draw(classList) {
    if(isColorMode) {

    }
    if (isRainbowMode) {

    }
    if (isShaderMode) {
        return incrementBackgroundColor(classList);
    }
    if (isEraserMode) {

    }
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
        box.className = draw(e.target.classList);
    });
    box.addEventListener("mouseenter", function(e) {
        if(onMouseDown) {
            box.className = draw(e.target.classList);
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
createDrawingPad(16, 16);