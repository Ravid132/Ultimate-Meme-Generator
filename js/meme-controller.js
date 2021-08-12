'use strict'

var gElCanvas = document.querySelector('canvas');
var gCtx = canvas.getContext('2d')
var gCurrMeme;

function onInit() {
    renderGallery();
    getSavedMemes();
    renderSavedGallery();
}

function renderGallery() {
    var images = getImages();
    var elGallery = document.querySelector('.images-gallery');
    var strHTML = images.map((img) => {
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
    if (lines) {
        lines.map((line) => {
            gCtx.lineWidth = '1';
            gCtx.font = line.size + 'px ' + line.font;
            gCtx.textAlign = line.textAlign;
            gCtx.fillText(line.txt, line.posX, line.posY);
            // gCtx.stroke(line.txt, line.posX, line.posY);
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
    displayContent('editor');

    createNewMeme(id);
    renderCanvas();
}

function displayContent(content) {

    var elEditor = document.querySelector('.editor-container');
    var elNavGallery = document.querySelector('#gallery');
    var elNavMyMemes = document.querySelector('#myMemes');
    var elGallery = document.querySelector('.gallery-container');
    var elMyMemes = document.querySelector('.my-gallery');

    switch (content) {
        case 'editor':
            elNavGallery.classList.remove('active');
            elNavMyMemes.classList.remove('active');
            elGallery.style.display = 'none';
            elEditor.style.display = 'flex';
            elMyMemes.style.display = 'none';
            break;
        case 'gallery':
            elNavGallery.classList.add('active');
            elNavMyMemes.classList.remove('active');
            elGallery.style.display = 'block';
            elEditor.style.display = 'none';
            elMyMemes.style.display = 'none';

            break;
        case 'myMemes':
            elNavMyMemes.classList.add('active');
            elNavGallery.classList.remove('active');
            elGallery.style.display = 'none';
            elEditor.style.display = 'none';
            elMyMemes.style.display = 'grid';
            break;
        default:
            break;
    }
}

function onLoadGallery() {
    displayContent('gallery');
}

function onLoadMyMemes() {
    displayContent('myMemes');
    renderSavedGallery();
}


function onSaveMeme() {
    if (!gCurrMeme) return;
    // saveMemeToStorage(gCurrMeme);
    renderCanvas();
    console.log(gElCanvas);
    saveMemeToStorage(gElCanvas);
}

function renderSavedGallery() {
    var memes = loadMemesFromStorage();
    var elMyGallery = document.querySelector('.my-gallery');
    if (!memes || !memes.length) return elMyGallery.innerHTML = `<h1>You dont have any memes</h1>`;
    var strHTML = memes.map((meme, idx) => {
        return `
        <div>
        <img class="meme" src="${meme.url}" />
        <button onclick="onDeleteMeme('${idx}')">Delete</button>
        </div>
        `
    });


    elMyGallery.innerHTML = strHTML.join('');
}

function onDeleteMeme(id) {
    deleteMemeFromStorage(id);
    renderSavedGallery();
}