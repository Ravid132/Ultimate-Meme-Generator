'use strict'

let gTrans = {
    memes: {
        en: 'Memes',
        he: 'מימים'
    },
    search: {
        en: 'Search',
        he: 'חיפוש'
    },
    about: {
        en: 'About',
        he: 'אודות'
    },
    'my-memes': {
        en: 'My Memes',
        he: ' המימים שלי'
    },
    gallery: {
        en: 'Gallery',
        he: 'גלריה'
    },
    more: {
        en: 'More',
        he: 'עוד'
    },
    save: {
        en: 'Save',
        he: 'שמור'
    },
    download: {
        en: 'Download',
        he: 'הורד'
    },
    share: {
        en: 'Share',
        he: 'שתף'
    },
    delete: {
        en: 'Delete',
        he: 'מחק'
    },
    'no-memes-message': {
        en: 'You dont have any memes',
        he: 'איך מימים שמורים'
    },
    logo: {
        en: 'Meme Generator',
        he: 'מחולל מימים'
    }
}

let gCurrLang = 'en';

function getCurrLang() {
    return gCurrLang;
}

function setCurrLang(lang) {
    gCurrLang = lang;
    doTrans();
    // renderGallery();
    // renderSavedGallery();
    // renderCanvas();
}

function formatNum(num) {
    return new Intl.NumberFormat(gCurrLang).formant(num);
}

function getTrans(key) {
    var keyTrans = gTrans[key];

    if (!keyTrans) return 'UNKNOWN';
    var txt = keyTrans[gCurrLang];
    if (!txt) txt = keyTrans['en'];

    return txt;
}

function doTrans() {
    var els = document.querySelectorAll('[data-trans]');

    els.forEach(function(el) {
        var txt = getTrans(el.dataset.trans)
        if (el.nodeName === 'INPUT') {
            el.setAttribute('placeholder', txt)
        } else {
            el.innerText = txt;
        }
    })
}