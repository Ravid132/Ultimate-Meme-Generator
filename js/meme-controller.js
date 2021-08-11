'use strict'

var gElCanvas = document.querySelector('canvas');
var gCtx = canvas.getContext('2d')
var gCurrMeme;

function onInit() {
    renderGallery();
}

function renderGallery() {
    var images = getImages();
    var elGallery = document.querySelector('.images-container');
    console.log(elGallery);
    var strHTML = images.map((img) => {
        console.log(img);
        return `
            <img class="meme" src="${img.url}" id="${img.id}" onclick="onSelectImage('${img.id}')" />
            `
    });

    elGallery.innerHTML = strHTML.join('');
}

function renderCanvas() {
    if (!gCtx) return;
    gCurrMeme = getMeme();
    var img = document.getElementById(gCurrMeme.selectedImgId);


    //RenderText
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height); //Add onload?
    drawTextOnCanvas();
}

function drawTextOnCanvas() {
    var lines = gCurrMeme.lines;
    var selectedLine = getSelectedLine();
    //
    // get colors
    var txt = document.querySelector('[name=meme-txt]').value;
    //
    if (selectedLine) {
        // console.log(selectedLine);
        gCtx.font = selectedLine.size + 'px ' + selectedLine.font;
        gCtx.fillText(selectedLine.txt, selectedLine.posX, selectedLine.posY);
        //add colors
    } else {
        //default values
    }
    console.log(lines);
    if (lines) {
        lines.map((line) => {
            gCtx.lineWidth = '1';
            gCtx.font = line.size + 'px ' + line.font;
            gCtx.textAlign = line.textAlign;
            gCtx.fillText(line.txt, line.posX, line.posY);
            // gCtx.Stroke(line.txt, line.posX, line.posY);
        })
    }

}

function onAddLine() {
    addLine();
    renderCanvas();
    //focus on new Line
    document.querySelector('[name=meme-txt]').focus();
}

function onDeleteLine() {
    deleteLine();
    renderCanvas();
    document.querySelector('[name=meme-txt]').focus(); ///
}

function onTextChange(input) {
    changeCanvasText(input);
    renderCanvas()
}

function onChangeTextSize(val) {
    changeTextSize(val);
    // gCtx.font = '50px Impact';
    // gCtx.font = gCurrMeme
    // gCtx.fillText(gCurrMeme.lines[0].txt, 100, 50);
    renderCanvas();
}

function onMoveText(val) {
    moveText(val);
    renderCanvas();
}

function onSwitchLines() {
    switchLines();
    renderCanvas();
}


function onSelectImage(id) {
    createNewMeme(id);
    renderCanvas()
}