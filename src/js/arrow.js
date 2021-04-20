import { el, mount } from "redom";
import _ from 'lodash';

class Arrow {
    constructor() {

    }

    draw() {
        this.container = el("span.down-arrow", {innerHTML: "<i class='fas fa-angle-down'></i>"});
        this.container.onclick = () => {
            window.scrollTo({top: window.innerHeight, behavior: "smooth"})
        }
        mount(document.body, this.container);
    }

    remove() {
        if (!this.container) return;
        this.container.remove();
        this.container = null;
    }
}

export default Arrow;