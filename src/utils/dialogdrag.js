let draging = false;
let dragDom;
let dragpoint;
function handleMouseUp() {
    draging = false;
    dragDom = null;
}
function handleMousemove(ev) {
    if (draging) {
        let _dragdom = dragDom;
        let sty = window.getComputedStyle(_dragdom, null);
        _dragdom.style.marginLeft = `${parseFloat(sty.marginLeft) + ev.clientX - dragpoint.x}px`;
        _dragdom.style.marginTop = `${parseFloat(sty.marginTop) + ev.clientY - dragpoint.y}px`;
        dragpoint = {
            x: ev.clientX,
            y: ev.clientY
        }
    }
}
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('mousemove', handleMousemove);
function bind(el) {
    let dialogHeaderEl = el.querySelector('.el-dialog__header');
    dialogHeaderEl.addEventListener('mousedown', (ev) => {
        let target = ev.target;
        if (target.classList.contains('el-dialog__close')) {
            return;
        }
        draging = true;
        dragDom = el;
        dragpoint = {
            x: ev.clientX,
            y: ev.clientY
        }
    });
}
export default {
    bind
}
