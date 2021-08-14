'use strict'

let gElCanvas = document.querySelector('canvas');
let gCtx = canvas.getContext('2d')
let gCurrMeme;
let gPos;
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
    let elCanvasContainer = document.querySelector('.canvas-container');
    gElCanvas.style.height = '100%';
    gElCanvas.style.width = '100%';
    gElCanvas.height = elCanvasContainer.offsetHeight;
    gElCanvas.width = elCanvasContainer.offsetWidth;
}

function onMouseDown(ev) {
    let pos = getPos(ev);
    let line = getSelectedLine();
    let width = gCtx.measureText(line.txt).width;
    if (!isLine(pos, width)) return;
    setDrag(true);
    document.body.style.cursor = 'grabbing';
    gPos = pos;
}

function onMouseMove(ev) {
    let line = getSelectedLine();
    if (!line) return;
    if (!line.isDrag) return;
    let pos = getPos(ev);
    let dx = pos.x - gPos.x;
    let dy = pos.y - gPos.y;
    moveTextLine(dx, dy);
    gPos = pos;
    renderCanvas();
}

function onMouseUp() {
    setDrag(false);
    document.body.style.cursor = 'auto';
}

function renderGallery() {
    let images = getImages();
    let elGallery = document.querySelector('.images-gallery');
    let strHTML = images.map((img) => {
        return `
            <img class="meme" src="${img.url}" id="${img.id}" onclick="onSelectImage('${img.id}')" />
            `
    });
    elGallery.innerHTML = strHTML.join('');
}

function renderCanvas() {
    if (!gCtx) return;
    gCurrMeme = getMeme();
    let img = document.getElementById(gCurrMeme.selectedImgId);


    //RenderText
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height); //Add onload?
    drawTextOnCanvas();
}

function drawTextOnCanvas() {
    let lines = gCurrMeme.lines;
    let selectedLine = getSelectedLine();

    // let txt = document.querySelector('[name=meme-txt]').value;
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
    let line = getSelectedLine();
    let width = gCtx.measureText(line.txt).width;
    let height = line.size * 1.2;

    let xPos = line.posX;

    let yPos = line.posY - (height);
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
    document.querySelector('[name=meme-txt]').value = '';
    addLine(txt, gElCanvas.width / 15);
    renderCanvas();
    document.querySelector('[name=meme-txt]').focus();
}

function onDeleteLine() {
    deleteLine();
    renderCanvas();
    document.querySelector('[name=meme-txt]').focus();
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

    let elEditor = document.querySelector('.editor-container');
    let elNavGallery = document.querySelector('#gallery');
    let elNavMyMemes = document.querySelector('#myMemes');
    let elGallery = document.querySelector('.gallery-container');
    let elMyMemes = document.querySelector('.my-gallery');

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
    let memes = loadMemesFromStorage();
    let elMyGallery = document.querySelector('.my-gallery');
    if (!memes || !memes.length) return elMyGallery.innerHTML = `<h1 trans-data="no-memes-message">You dont have any memes</h1>`;
    let strHTML = memes.map((meme, idx) => {
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
    let keywords = getKeywords();
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