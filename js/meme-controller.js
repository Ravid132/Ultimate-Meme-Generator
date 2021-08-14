'use strict'

var gElCanvas = document.querySelector('canvas');
var gCtx = canvas.getContext('2d')
var gCurrMeme;
var gPos;
let gReadyToSave;

function onInit() {
    gReadyToSave = false;
    renderGallery();
    renderKeywords();
    getSavedMemes();
    addEventListeners();
}

function addEventListeners() {

    gElCanvas.addEventListener('touchstart', onMouseDown);
    gElCanvas.addEventListener('touchmove', onMouseMove);
    gElCanvas.addEventListener('touchend', onMouseUp);

    gElCanvas.addEventListener('mousedown', onMouseDown);
    gElCanvas.addEventListener('mousemove', onMouseMove);
    gElCanvas.addEventListener('mouseup', onMouseUp);

    window.addEventListener('resize', () => {
        onResizeCanvas();
        gReadyToSave = true;
        renderCanvas();
        gReadyToSave = false;
    })
}

function onResizeCanvas() {
    var elCanvasContainer = document.querySelector('.canvas-container');
    gElCanvas.style.height = '100%';
    gElCanvas.style.width = '100%';
    gElCanvas.height = elCanvasContainer.offsetHeight;
    gElCanvas.width = elCanvasContainer.offsetWidth;
}

function onMouseDown(ev) {
    var pos = getPos(ev);
    var line = getSelectedLine();
    var width = gCtx.measureText(line.txt).width;
    if (!isLine(pos, width)) return;
    setDrag(true);
    document.body.style.cursor = 'grabbing';
    gPos = pos;
}

function onMouseMove(ev) {
    var line = getSelectedLine();
    if (!line) return;
    if (!line.isDrag) return;
    var pos = getPos(ev);
    var dx = pos.x - gPos.x;
    var dy = pos.y - gPos.y;
    moveTextLine(dx, dy);
    gPos = pos;
    renderCanvas();
}

function onMouseUp() {
    setDrag(false);
    document.body.style.cursor = 'auto';
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

    var txt = document.querySelector('[name=meme-txt]').value;
    if (selectedLine) {

        // var line = gCurrMeme.lines[gCurrMeme.selectedLineIdx];
        // // var width = gCtx.measureText(line.txt).width + 15;
        // var width = gCtx.measureText(line.txt).width;
        // // var height = line.size + 20;
        // var height = line.size * 1.2;

        // var xPos = line.posX;
        // // var xPos = line.posX - width;

        // // var yPos = line.posY - (height / 2);
        // var yPos = line.posY - (height);
        // width = width;
        // height = height * 2;
        // if (line.align === 'right' && !line.isDrag) {
        //     xPos = gElCanvas.width - width - 5;
        //     line.posX = xPos;
        // } else if (line.align === 'left' && !line.isDrag) {
        //     xPos = 5;
        //     line.posX = 5;
        // } else if (line.align === 'center' && !line.isDrag) {
        //     xPos = gElCanvas.width / 2 - width / 2;
        //     line.posX = xPos;
        // }


        // gCtx.font = line.size + 'px ' + line.font;

        // gCtx.beginPath();
        // gCtx.rect(xPos, yPos, width, height);
        // gCtx.strokeStyle = '#000';
        // gCtx.setLineDash([3]);
        // gCtx.strokeRect(xPos, yPos, width, height);
        // gCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        // gCtx.fillRect(xPos, yPos, width, height);
        // gCtx.setLineDash([0]);

    } else {
        //default values
    }
    if (lines) {
        lines.forEach(line => {
            gCtx.font = `${line.size}px ${line.font}`;
            gCtx.lineWidth = 1;
            gCtx.strokeStyle = line.color.outline;
            gCtx.fillStyle = line.color.fill;
            gCtx.textAlign = line.textAlign;
            gCtx.fillText(line.txt, line.posX, line.posY);
            gCtx.strokeText(line.txt, line.posX, line.posY);
            if (line === selectedLine) highlightLine();
        })
    }
}

function highlightLine() {
    if (gReadyToSave) return;
    // var line = gCurrMeme.lines[gCurrMeme.selectedLineIdx];
    var line = getSelectedLine();
    // var width = gCtx.measureText(line.txt).width + 15;
    var width = gCtx.measureText(line.txt).width;
    // var height = line.size + 20;
    var height = line.size * 1.2;

    var xPos = line.posX;
    // var xPos = line.posX - width;

    // var yPos = line.posY - (height / 2);
    var yPos = line.posY - (height);
    width = width;
    height = height * 2;
    if (line.align === 'right' && !line.isDrag) {
        xPos = gElCanvas.width - width - 5;
        line.posX = xPos;
    } else if (line.align === 'left' && !line.isDrag) {
        xPos = 5;
        line.posX = 5;
    } else if (line.align === 'center' && !line.isDrag) {
        xPos = gElCanvas.width / 2 - width / 2;
        line.posX = xPos;
    }

    gCtx.font = line.size + 'px ' + line.font;

    gCtx.beginPath();
    gCtx.rect(xPos, yPos, width, height);
    gCtx.strokeStyle = '#000';
    gCtx.setLineDash([3]);
    gCtx.strokeRect(xPos, yPos, width, height);
    gCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    gCtx.fillRect(xPos, yPos, width, height);
    gCtx.setLineDash([0]);

}

function onAddLine(txt = 'Enter text') {
    addLine(txt, gElCanvas.width / 15);
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


function onSelectImage(id, txt = 'Enter Text') {
    displayContent('editor');

    createNewMeme(id, txt, gElCanvas.width / 15);
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
    gReadyToSave = true;
    renderCanvas();
    saveMemeToStorage(gElCanvas);
    gReadyToSave = false;
    displayContent('myMemes');
    renderSavedGallery();

}

function renderSavedGallery() {
    var memes = loadMemesFromStorage();
    var elMyGallery = document.querySelector('.my-gallery');
    if (!memes || !memes.length) return elMyGallery.innerHTML = `<h1 trans-data="no-memes-message">You dont have any memes</h1>`;
    var strHTML = memes.map((meme, idx) => {
        return `
        <div>
        <img class="meme" src="${meme.url}" />
        <button data-trans="delete" onclick="onDeleteMeme('${idx}')">Delete</button>
        </div>
        `
    });


    elMyGallery.innerHTML = strHTML.join('');
}

function onDeleteMeme(id) {
    deleteMemeFromStorage(id);
    renderSavedGallery();
}


function onAlignText(dir) {
    alignText(dir);
    renderCanvas();
}

function onChangeColor(toChange, value) {
    changeColor(toChange, value);
    renderCanvas();
}

function onChangeFont(font) {
    changeFont(font);
    renderCanvas();
}

function onSetLang(lang) {
    setCurrLang(lang);
    renderGallery();
    // renderSavedGallery();
    renderCanvas();
}

function onFilter(keyword) {
    console.log(keyword);
    filterByKeyword(keyword);
    renderGallery();
}

function renderKeywords() {
    var keywords = getKeywords();
    console.log(keywords);
    keywords = Object.keys(keywords);
    let strHTML = keywords.map(word => {
        return `<li class="keyword" onclick="onFilter('${word}')">${word}</li> `
    });

    document.querySelector('.keywords-list').innerHTML = strHTML.join('');
}

function onDownload(elLink) {
    gReadyToSave = true;
    renderCanvas();
    const data = gElCanvas.toDataURL()
    console.log(data);
    elLink.href = data;
    gReadyToSave = false;
}