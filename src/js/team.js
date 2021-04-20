import { el, mount } from "redom";

import Member from "./team/member";
import Arrow from "./arrow";
import _ from "lodash";

class Team {
  constructor(navbar) {
    this.navbar = navbar;
    this.teamPhoto = null;
    document.addEventListener(
      "scroll",
      _.debounce(this.updateNav.bind(this), 20, {
        leading: true,
        trailing: true,
      })
    );
  }
  draw() {
    this.remove();
    this.container = el(".team");
    mount(document.body, this.container);

    for (let name of _.shuffle(["cristina", "lucas", "yue", "josh", "brayden", "chris", "abdullah"])) {
      this[name] = new Member(this.container, name);
      this[name].draw();
    }
    this.arrow = new Arrow();
    this.arrow.draw();
    // this.updateNav();
  }
  remove() {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
    if(this.arrow) this.arrow.remove();
  }
  updateNav() {
    if (!this.container) return;
    // let overlapping = isOverlapping(this.navbar.container, this.video.container);
    // if (overlapping)
    //   this.navbar.container.classList.remove("opaque");
    // if (!overlapping)
    //     this.navbar.container.classList.add("opaque");
  }
}
export default Team;
