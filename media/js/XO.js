var kBoardWidth  = 30;
var kBoardHeight = 30;
var kPieceWidth  = 15;
var kPieceHeight = 15;
var kPixelWidth  = 1 + (kBoardWidth * kPieceWidth);
var kPixelHeight = 1 + (kBoardHeight * kPieceHeight);

var gCanvasElement;
var gMessageElement;
var gDrawingContext;
var gPieces;
var gPiecesNr;
var isCurrentPieceX;

// used to detect when we have 5 in a row, column, diagonal
var gPiecesLines;
var gPiecesColumns;
var gPiecesDiags_LR;
var gPiecesDiags_RL;
var gameOver;
var cellStart;
var cellEnd;

function initGame(canvasElement, messageElement) {
    if (!canvasElement) {
	canvasElement = document.createElement("canvas");
	canvasElement.id = "XO_canvas";
	document.getElementById("text").appendChild(canvasElement);
	//document.body.appendChild(canvasElement);
    }
    if (!messageElement) {
	messageElement = document.createElement("p");
	document.getElementById("text").appendChild(messageElement);
	//document.body.appendChild(messageElement);
    }
    gCanvasElement = canvasElement;
    gCanvasElement.width = kPixelWidth;
    gCanvasElement.height = kPixelHeight;
    gCanvasElement.addEventListener("click", xoOnClick, false);
    gMessageElement = messageElement;
    gDrawingContext = gCanvasElement.getContext("2d");
    gPiecesNr = 0;
    gameOver = false;
    newGame();
}

function newGame() {
    gPieces=[];
    gPiecesNr = 0;
    isCurrentPieceX = true;
    gMessageElement.innerHTML = "next move: " + (isCurrentPieceX?"X":"O");
    drawBoard();
    gPiecesLines = [];
    for (var i = 0; i < kBoardWidth; i++)
    {
	gPiecesLines[i] = new Array();
    }
    gPiecesColumns = [];
    for (var i = 0; i < kBoardHeight; i++)
    {
	gPiecesColumns[i] = new Array();
    }
    gPiecesDiags_LR = [];
    gPiecesDiags_RL = []
    for (var i = 0; i < kBoardWidth + kBoardHeight; i++)
    {
	gPiecesDiags_LR[i] = new Array();
	gPiecesDiags_RL[i] = new Array();
    }
}

function drawBoard() {
    var ctx = gDrawingContext;
    ctx.clearRect(0, 0, kPixelWidth, kPixelHeight);
    ctx.beginPath();
    // vertical lines:
    for (var x = 0; x <= kPixelWidth; x += kPieceWidth) {
	ctx.moveTo(0.5 + x, 0);
	ctx.lineTo(0.5 + x, kPixelHeight);
    }
    // horizontal lines:
    for (var y = 0; y <= kPixelHeight; y += kPieceHeight) {
	ctx.moveTo(0, 0.5 + y);
	ctx.lineTo(kPixelWidth, 0.5 + y);
    }
    // draw the grid:
    ctx.strokeStyle = "#ccc";
    ctx.stroke();
    
    for (var i = 0; i < gPiecesNr; i++) {
	drawPiece(gPieces[i]);
    }
    // need to draw line between cellStart and cellEnd:
    if (gameOver)
    {
	var xs = kPieceWidth * cellStart.column;
	var ys = kPieceHeight * cellStart.row;
	var xe = kPieceWidth * cellEnd.column;
	var ye = kPieceHeight * cellEnd.row;
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.moveTo(xs+kPieceWidth/2, ys+kPieceHeight/2);
	ctx.lineTo(xe+kPieceWidth/2, ye+kPieceHeight/2);
	ctx.stroke();
	ctx.restore();
    }
}

function drawPiece(p) {
    if (p.isX) {
	drawX(p.column, p.row);
    } else {
	drawO(p.column, p.row);
    }
}

function drawX(col, row) {
    var x = (col * kPieceWidth);
    var y = (row * kPieceHeight);
    var ctx = gDrawingContext;
    ctx.beginPath();
    ctx.moveTo(x+3, y+3);
    ctx.lineTo(x+kPieceWidth-3, y+kPieceHeight-3);
    ctx.moveTo(x+3, y+kPieceHeight-3);
    ctx.lineTo(x+kPieceWidth-3, y+3);
    ctx.closePath();	
    ctx.strokeStyle="#00f";
    ctx.stroke();
}

function drawO(col, row) {
    var x = (col * kPieceWidth) + (kPieceWidth/2);
    var y = (row * kPieceHeight) + (kPieceHeight/2);
    var radius = (kPieceWidth/2) - (kPieceWidth/10);
    var ctx = gDrawingContext;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.strokeStyle="#f00";
    ctx.stroke();
}

function Cell(row, column, isX) {
    this.row = row;
    this.column = column;
    this.isX = isX;
}

function xoOnClick(e) {
    if (gameOver)
    {
	return;
    }
    var cell = getCursorPosition(e);
    // check if we clicked on an empty cell...
    for (var i = 0; i < gPiecesNr; i++) {
	if ((gPieces[i].row == cell.row) &&
	    (gPieces[i].column == cell.column)) {
	    // we clicked on an occupied cell: ignore it
	    return;
	}
    }
    clickOnEmptyCell(cell);
    gMessageElement.innerHTML = "next move: " + (isCurrentPieceX?"X":"O") + "<br /> gameOver: " + gameOver + "<br />"
}

function clickOnEmptyCell(cell) {
    cell.isX = isCurrentPieceX;
    isCurrentPieceX = !isCurrentPieceX;
    gPieces[gPiecesNr] = cell;
    gPiecesNr++;
    // add the cell in the corresponding lines, columns, diagonals vectors:
    gPiecesLines[cell.row].push(cell);
    gPiecesColumns[cell.column].push(cell);
    // LeftRight diagonals are numbered starting from top right corner in clockwise direction
    gPiecesDiags_LR[kBoardWidth - (cell.column - cell.row)].push(cell);
    // RightLeft diagonals are numbered starting from top left corner in clockwise direction
    gPiecesDiags_RL[cell.column + cell.row].push(cell);
    
    // let's sort these arrays...
    gPiecesLines[cell.row].sort(function(a, b){return a.column - b.column});
    gPiecesColumns[cell.column].sort(function(a, b){return a.row - b.row});
    gPiecesDiags_LR[kBoardWidth - (cell.column - cell.row)].sort(
	function(a, b){return a.row - b.row });
    gPiecesDiags_RL[cell.column + cell.row].sort(
	function(a, b){return a.row - b.row});

    // try to find 5 consecutive ones...
    // on line:
    findConsec(gPiecesLines[cell.row],
	       function (a, b){return (a.column + 1) == b.column});
    // on column:
    findConsec(gPiecesColumns[cell.column],
	       function (a, b){return (a.row + 1) == b.row});    
    // on LR diagonal:
    findConsec(gPiecesDiags_LR[kBoardWidth - (cell.column - cell.row)],
	       function (a, b){return (a.row + 1) == b.row});    
    // on RL diagonal:
    findConsec(gPiecesDiags_RL[cell.column + cell.row],
	       function (a, b){return (a.row + 1) == b.row});    

    // let's draw them:
    drawBoard();
}

function findConsec(a, f) {
    if (gameOver)
	return;
    nrConsec = 1;
    for (var i = 0; i < a.length - 1; i++)
    {
	if ((a[i].isX == a[i+1].isX) &&
	    f(a[i], a[i+1]))
	{
	    if (nrConsec == 1)
	    {
		cellStart = a[i];
	    }
	    nrConsec = nrConsec + 1;
	    if (nrConsec == 5)
	    {
		cellEnd = a[i+1];
		gameOver = true;
	    }
	} else
	{
	    nrConsec = 1;
	}
    }
}

function getCursorPosition(e) {
    // returns Cell with .row and .column properties
    var x;
    var y;
    if (e.offsetX || e.offsetY)
    {
	x = e.offsetX;
	y = e.offsetY;
    } else if (e.pageX || e.pageY) 
    {
	x = e.pageX;
	y = e.pageY;
	x -= gCanvasElement.offsetLeft;
	y -= gCanvasElement.offsetTop;
//	x -= gCanvasElement.offsetWidth;
//	y -= gCanvasElement.offsetHeight;
    } else 
    {
	x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    // x = e.offsetX;
    // y = e.offsetY;

    x = Math.min(x, kBoardWidth * kPieceWidth);
    y = Math.min(y, kBoardHeight * kPieceHeight);
    var cell = new Cell(Math.floor(y/kPieceWidth), Math.floor(x/kPieceHeight));
    return cell;
}
