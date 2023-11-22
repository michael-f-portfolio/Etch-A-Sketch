function createDrawingPad(xAxis, yAxis) {
    let container = document.querySelector("#container");
    removeAllChildNodes(container);
    for(let i = 1; i <= xAxis; i++) {
        let columnContainer = document.createElement("div");
        columnContainer.className = "column"
        columnContainer.id = `column${i}`;
        for (let j = 1; j <= yAxis; j++) {
            let box = document.createElement("div");
            box.id = `column${i}:row${j}`;
            box.className = "box box-shade-0";
            
            addBoxEvents(box);
            columnContainer.appendChild(box);
        }
        container.appendChild(columnContainer);
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

function addBoxEvents(box) {
    box.addEventListener("mouseenter", function(e) {
        console.log(e.target);
        let box = e.target;
        box.className = incrementBackgroundColor(box.classList);
        
    });
}

function createNewDrawingPad() {
    let xAxis = document.querySelector("#x-axis").value;
    let yAxis = document.querySelector("#y-axis").value;
    createDrawingPad(xAxis, yAxis)
}

// via: https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// do stuff
let setGridSizeButton = document.querySelector("#setGridSizeButton");
setGridSizeButton.addEventListener("click", createNewDrawingPad);


createDrawingPad(16, 16);