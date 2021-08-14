'use strict'

const MEME_DB = 'MemeDB';
const gTouchev = ['touchstart', 'touchmove', 'touchend'];
let gSavedMemes = [];
let gKeyWords = {
    'all': 0,
    'funny': 0,
    'happy': 0,
    'animals': 0,
    'movies': 0,
    'cute': 0,
    'men': 0
}
let gCurrentKeyword = 'all';
let gSearch = '';

let gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [{
        txt: 'I never eat Falafel',
        size: 20,
        // align: 'center',
        align: '',
        color: { fill: 'black', outline: 'white' },
        font: 'Impact',
        posX: 100,
        posY: 100,
        isDrag: false,
    }]
}
let gImgs = [{
        id: 1,
        url: 'meme-images/1.jpg',
        keywords: ['funny', 'happy']
    },
    {
        id: 2,
        url: 'meme-images/2.jpg',
        keywords: ['animals', 'happy', 'cute']
    },
    {
        id: 3,
        url: 'meme-images/3.jpg',
        keywords: ['cute', 'happy', 'animals']
    },
    {
        id: 4,
        url: 'meme-images/4.jpg',
        keywords: ['animals', 'cute']
    },
    {
        id: 5,
        url: 'meme-images/5.jpg',
        keywords: ['cute', 'happy']
    },
    {
        id: 6,
        url: 'meme-images/6.jpg',
        keywords: ['funny', 'happy']
    },
    {
        id: 7,
        url: 'meme-images/7.jpg',
        keywords: ['funny', 'happy', 'cute']
    },
    {
        id: 8,
        url: 'meme-images/8.jpg',
        keywords: ['funny', 'happy', 'movies']
    },
    {
        id: 9,
        url: 'meme-images/9.jpg',
        keywords: ['funny', 'happy', 'cute']
    },
    {
        id: 10,
        url: 'meme-images/10.jpg',
        keywords: ['happy', 'men']
    },
    {
        id: 11,
        url: 'meme-images/11.jpg',
        keywords: ['happy', 'men']
    },
    {
        id: 12,
        url: 'meme-images/12.jpg',
        keywords: ['happy', 'men']
    },
    {
        id: 13,
        url: 'meme-images/13.jpg',
        keywords: ['funny', 'men', 'movies']
    },
    {
        id: 14,
        url: 'meme-images/14.jpg',
        keywords: ['movies', 'men']
    },
    {
        id: 15,
        url: 'meme-images/15.jpg',
        keywords: ['happy', 'movies', 'men']
    },
    {
        id: 16,
        url: 'meme-images/16.jpg',
        keywords: ['happy', 'movies', 'funny', 'men']
    },
    {
        id: 17,
        url: 'meme-images/17.jpg',
        keywords: ['men']
    },
    {
        id: 18,
        url: 'meme-images/18.jpg',
        keywords: ['funny', 'happy', 'movies']
    },
];

function getImages() {
    let images = gImgs;

    if (gCurrentKeyword !== 'all') {
        images = gImgs.filter(image => {
            return image.keywords.includes(gCurrentKeyword)
        })
    }
    if (gSearch !== '') {
        images = gImgs.filter(image => {
            return image.keywords.some(word => {
                return word.startsWith(gSearch);
            })
        })
    }
    return images;
}

function getMeme() {
    return gMeme;
}

function getKeywords() {
    return gKeyWords;
}


function createNewMeme(id, txt, size) {
    gMeme = {
        id: makeId(),
        selectedImgId: id,
        selectedLineIdx: 0,
        lines: [{
            txt,
            size,
            // align: 'center',
            align: '',
            color: { fill: 'black', outline: 'white' },
            font: 'Impact',
            posX: 100,
            posY: 100,
            isDrag: false,
        }]
    }
}

// ****************************************************************
function updateSelectedLine(idx = 0) {
    gMeme.selectedLineIdx = idx;
}

function getSelectedLine() {
    if (!gMeme) return null;
    return gMeme.lines[gMeme.selectedLineIdx];
}

function switchLines() {
    let lineIdx = gMeme.selectedLineIdx + 1;
    if (lineIdx === gMeme.lines.length) lineIdx = 0;
    updateSelectedLine(lineIdx);

}

function addLine(txt, size) {
    let newLine = {
        txt,
        size,
        align: '',
        color: { fill: 'black', outline: 'white' },
        font: 'Impact',
        posX: 100,
        posY: 100,
        isDrag: false,
    }
    gMeme.lines.push(newLine);
    updateSelectedLine(gMeme.lines.length - 1);
}

function deleteLine() {
    let currIdx = gMeme.selectedLineIdx;
    let length = gMeme.lines.length
    if (length === 0) return;
    gMeme.lines.splice(currIdx, 1);
    updateSelectedLine(0)
}

function changeCanvasText(txt) {
    let selectedLine = getSelectedLine()
    if (selectedLine) selectedLine.txt = txt;
}

function moveText(val) {
    let selectedLine = getSelectedLine();
    if (selectedLine.posY + val <= selectedLine.size ||
        selectedLine.posY + val >= gElCanvas.height) return;
    if (selectedLine) selectedLine.posY += val;
}

function changeTextSize(val) {
    let selectedLine = getSelectedLine();
    selectedLine.size += val;
}


// SAVE TO STORAGE

function saveMemeToStorage(meme) {
    let memeData = {
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

function alignText(dir) {
    let line = getSelectedLine();
    if (!line) return;
    gCurrMeme.lines[gMeme.selectedLineIdx].align = dir;

}

function changeColor(toChange, value) {
    let line = getSelectedLine();
    if (toChange === 'fill') line.color.fill = value;
    else line.color.outline = value;
}

function changeFont(font) {
    let line = getSelectedLine();
    line.font = font;
}


function filterByKeyword(keyword) {
    gSearch = '';
    gKeyWords[keyword]++;
    gCurrentKeyword = keyword;
}

function search(str) {
    gSearch = str;
}