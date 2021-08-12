'use strict'

const MEME_DB = 'MemeDB';
var gSavedMemes = [];
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
    {
        id: 3,
        url: 'meme-images/3.jpg',
        keywords: ['funny', 'happy', 'crazy']
    },
    {
        id: 4,
        url: 'meme-images/4.jpg',
        keywords: ['funny', 'happy', 'crazy']
    },
    {
        id: 5,
        url: 'meme-images/5.jpg',
        keywords: ['funny', 'happy', 'crazy']
    },
    {
        id: 6,
        url: 'meme-images/6.jpg',
        keywords: ['funny', 'happy', 'crazy']
    },
    {
        id: 7,
        url: 'meme-images/7.jpg',
        keywords: ['funny', 'happy', 'crazy']
    },
    {
        id: 8,
        url: 'meme-images/8.jpg',
        keywords: ['funny', 'happy', 'crazy']
    },
    {
        id: 9,
        url: 'meme-images/9.jpg',
        keywords: ['funny', 'happy', 'crazy']
    },
    {
        id: 10,
        url: 'meme-images/10.jpg',
        keywords: ['funny', 'happy', 'crazy']
    },
    {
        id: 11,
        url: 'meme-images/11.jpg',
        keywords: ['funny', 'happy', 'crazy']
    },
    {
        id: 12,
        url: 'meme-images/12.jpg',
        keywords: ['funny', 'happy', 'crazy']
    },
    {
        id: 13,
        url: 'meme-images/13.jpg',
        keywords: ['funny', 'happy', 'crazy']
    },
    {
        id: 14,
        url: 'meme-images/14.jpg',
        keywords: ['funny', 'happy', 'crazy']
    },
    {
        id: 15,
        url: 'meme-images/15.jpg',
        keywords: ['funny', 'happy', 'crazy']
    },
    {
        id: 16,
        url: 'meme-images/16.jpg',
        keywords: ['funny', 'happy', 'crazy']
    },
    {
        id: 17,
        url: 'meme-images/17.jpg',
        keywords: ['funny', 'happy', 'crazy']
    },
    {
        id: 18,
        url: 'meme-images/18.jpg',
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


// SAVE TO STORAGE

function saveMemeToStorage(meme) {
    var memeData = {
        meme: gMeme,
        url: meme.toDataURL()
    }
    gSavedMemes.push(memeData);
    saveToStorage(MEME_DB, gSavedMemes);
}

function loadMemesFromStorage() {
    return loadFromStorage(MEME_DB);
}

function getSavedMemes() {
    gSavedMemes = loadMemesFromStorage();
    if (!gSavedMemes || !gSavedMemes.length) gSavedMemes = [];
}

function deleteMemeFromStorage(id) {
    gSavedMemes.splice(id, 1);
    saveToStorage(MEME_DB, gSavedMemes);
}