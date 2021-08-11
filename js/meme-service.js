'use strict'

var gKeyWords = {
    'happy': 1,
    'funny': 1,
    'animals': 1,
    'cute': 1,
    'crazy': 1,
}

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [{
        txt: 'I never eat Falafel',
        size: 20,
        align: 'left',
        color: 'red',
        posX: 100,
        posY: 100
    }]
}
var gImgs = [{
        id: 1,
        url: 'meme-images/1.jpg',
        keywords: ['funny', 'happy', 'cute']
    },
    {
        id: 2,
        url: 'meme-images/2.jpg',
        keywords: ['funny', 'happy', 'crazy']
    },
];

function getImages() {
    return gImgs;
}

function getMeme() {
    return gMeme;
}

function getKeywords() {
    return gKeyWords;
}


function createNewMeme(id) {
    gMeme = {
        id: makeId(),
        selectedImgId: id,
        selectedLineIdx: 0,
        lines: [{ ////////////////////////DELETE?
            txt: 'just some text',
            size: 20,
            align: 'center',
            color: 'white',
            posX: 100,
            posY: 100,
        }]
    }
}

// ****************************************************************
function updateSelectedLine(idx = 0) {
    gMeme.selectedLineIdx = idx;
    console.log('curr index', idx);
}

function getSelectedLine() {
    if (!gMeme) return null;
    return gMeme.lines[gMeme.selectedLineIdx];
}

function switchLines() {
    var lineIdx = gMeme.selectedLineIdx + 1;
    if (lineIdx === gMeme.lines.length) lineIdx = 0;
    updateSelectedLine(lineIdx);

}

function addLine() {
    var newLine = {
        txt: 'New Line',
        size: 20,
        align: 'center',
        color: 'white',
        posX: 100,
        posY: 100,
    }
    gMeme.lines.push(newLine);
    updateSelectedLine(gMeme.lines.length - 1);
}

function deleteLine() {
    var currIdx = gMeme.selectedLineIdx;
    var length = gMeme.lines.length
    if (length === 0) return;
    gMeme.lines.splice(currIdx, 1);
    // if (currIdx > 0) updateSelectedLine(length - 1);
    // else updateSelectedLine(0)
    updateSelectedLine(0)
}

function changeCanvasText(txt) {
    var selectedLine = getSelectedLine()
    if (selectedLine) selectedLine.txt = txt;
}

function moveText(val) {
    var selectedLine = getSelectedLine();
    if (selectedLine.posY + val <= selectedLine.size ||
        selectedLine.posY + val >= gElCanvas.height) return;
    if (selectedLine) selectedLine.posY += val;
}

function changeTextSize(val) {
    var selectedLine = getSelectedLine();
    selectedLine.size += val;
}