var dragDiv = document.getElementsByClassName("draggable-div");
var line = document.getElementById("line");
var inputSection = document.querySelectorAll("[data-for]");

var btnRun = document.getElementById('btn-run');
var btnReset = document.getElementById('btn-reset');

var simX = document.getElementById("input-deg-x");
var simY = document.getElementById("input-deg-y");

var initElements = [];

var elCount = 0;

(function () {
  for (let i = 0; i < dragDiv.length; i++) {
    let curObj = {
      dragDiv: dragDiv[i],
      inputX: document.querySelector(`[data-for="${dragDiv[i].id}"]`).children[0],
      inputY: document.querySelector(`[data-for="${dragDiv[i].id}"]`).children[1]
    }
    initElements.push(curObj);

    lineChecker(dragDiv[i]);
    inputGetter(inputSection[i], dragDiv[i]);

    elCount = i;
  }

  for (let i = 0; i < initElements.length; i++) {
    setValue(initElements[i].inputX, initElements[i].inputY, initElements[i].dragDiv);
    dragElement(initElements[i].dragDiv);
  }
})();

btnRun.onclick = function () {
  var curX = parseInt(dragDiv[elCount].style.left.split('px')[0]);
  var curY = parseInt(dragDiv[elCount].style.top.split('px')[0]);

  var id = setInterval(simMovement, 5);
  function simMovement() {
    if (curX == simX.value && curY == simY.value) {
      clearInterval(id);
    } 
    
    if(curX < simX.value) {
      dragDiv[elCount].style.left = parseInt(curX++) + "px";
      lineChecker(dragDiv[elCount]);
    }
    else if(curX > simX.value) {
      dragDiv[elCount].style.left = parseInt(curX--) + "px";
      lineChecker(dragDiv[elCount]);
    }

    if(curY < simY.value) {
      dragDiv[elCount].style.top = parseInt(curY++) + "px";
      lineChecker(dragDiv[elCount]);
    }
    else if(curY > simY.value) {
      dragDiv[elCount].style.top = parseInt(curY--) + "px";
      lineChecker(dragDiv[elCount]);
    }
  }
}

btnReset.onclick = function () {
  location.reload();
}

// document.getElementById('btn-add-item').onclick = function () {
//   let color = document.getElementById('input-item').value;
//   let divHtml = `<div class="draggable-div" id="div+${elCount}" style="background: ${color};
//   top: 100px; left: 100px;"></div>`;
//   let lineHtml = `<line data-from="div+${elCount - 1}" data-to="div+${elCount}" style="stroke:darkorange;stroke-width:2" />`;

//   let line = document.getElementById('line');
//   line.insertAdjacentHTML('beforeBegin', divHtml);
//   line.innerHTML += lineHtml;

//   dragElement(document.getElementById(`div+${elCount}`));
// }

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";

    lineChecker(elmnt);

    for (let i = 0; i < inputSection.length; i++) {
      inputGetter(inputSection[i], elmnt);
    }
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function setValue(elmntX, elmntY, target) {
  elmntX.onkeyup = function () { movePos() };
  elmntY.onkeyup = function () { movePos() };

  function movePos() {
    target.style.left = (parseInt(elmntX.value)) + 'px';
    target.style.top = (parseInt(elmntY.value)) + 'px';

    lineChecker(target);
  }
}

function inputGetter(inputSection, elmnt) {
  if (inputSection.getAttribute("data-for") == elmnt.id) {
    inputSection.children[0].value = elmnt.offsetLeft;
    inputSection.children[1].value = elmnt.offsetTop;
  }
}

function moveLine(line, lineIndex) {
  let selectLine = line.children[lineIndex];
  let divFrom = document.getElementById(selectLine.getAttribute("data-from"));
  let divTo = document.getElementById(selectLine.getAttribute("data-to"));

  let centerLX1 = divFrom.offsetLeft + divFrom.offsetWidth / 2;
  let centerLY1 = divFrom.offsetTop + divFrom.offsetHeight / 2;
  let centerLX2 = divTo.offsetLeft + divTo.offsetWidth / 2;
  let centerLY2 = divTo.offsetTop + divTo.offsetHeight / 2;

  insertCoordinate(line.children[lineIndex],
    { x1: centerLX1, y1: centerLY1, x2: centerLX2, y2: centerLY2 });
}

function insertCoordinate(lineItem, arr) {
  for (let i = 0; i < Object.keys(arr).length; i++) {
    lineItem.setAttribute(Object.keys(arr)[i], Object.values(arr)[i]);
  }
}

function lineChecker(elmnt) {
  let elId = elmnt.getAttribute("id");

  for (let i = 0; i < line.childElementCount; i++) {
    if (line.children[i].getAttribute("data-from") == elId) {
      moveLine(line, i);
    }
    else if (line.children[i].getAttribute("data-to") == elId) {
      moveLine(line, i);
    }
  }
}
