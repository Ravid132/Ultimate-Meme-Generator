'use strict'


function isLine(pos, width) {
    let line = getSelectedLine();

    if (pos.x < line.posX) return;
    if (pos.y < line.posY - line.size - 15 ||
        pos.y > line.posY + 15) return;
    const distance = Math.sqrt(((line.posX - pos.x) ** 2) + ((line.posY - pos.y) ** 2))
    return distance <= width;
}

function getPos(ev) {
    let pos = { x: ev.offsetX, y: ev.offsetY };
    if (gTouchev.includes(ev.type)) {
        ev.preventDefault();
        ev = ev.changedTouches[0];
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos;
}

function moveTextLine(dx, dy) {
    let line = getSelectedLine();
    line.posX += dx;
    line.posY += dy;
}

function setDrag(drag) {
    let line = getSelectedLine();
    line.isDrag = drag;
}