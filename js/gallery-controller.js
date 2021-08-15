'use strict'

function onInitGallery() {
    renderGallery();
    renderKeywords();
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

function onLoadGallery() {
    displayContent('gallery');
}

function onFilter(keyword) {
    filterByKeyword(keyword);
    renderGallery();
}

function renderKeywords() {
    let keywords = getKeywords();
    keywords = Object.keys(keywords);
    let strHTML = keywords.map(word => {
        return `<li class="keyword" onclick="onFilter('${word}')">${word}</li> `
    });

    document.querySelector('.keywords-list').innerHTML = strHTML.join('');
}

function onSearch() {
    let str = document.querySelector('[name=search]').value;
    search(str.toLowerCase());
    renderGallery();
}