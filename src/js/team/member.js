import { el, mount } from "redom";

import memberHTML from "../../html/team/member.html";
import memberData from "./member-data";

import {enableScroll, disableScroll} from "../utils/disableScroll";

// import isMultiline from "../utils/multiline";

class Member {
  constructor(parent, memberName) {
    this.parent = parent;
    this.memberName = memberName;
    this.mouseDown = false;
    this.defaultX = 0.5;
    this.memberData = memberData[memberName];

    document.addEventListener("mousemove", this.mouseMoved.bind(this));
    document.addEventListener("touchmove", this.mouseMoved.bind(this));

    window.addEventListener("resize", this.renderBackground.bind(this, null));
  }
  setupData() {
    this.container
      .querySelector(".member-background-bw")
      .classList.add(`${this.memberName}-background`);
    this.container.querySelector(
      ".member-text h1"
    ).innerHTML = this.memberData.fullname;
    this.container.querySelector(
      ".member-text p"
    ).innerHTML = this.memberData.description;

  }
  draw() {
    this.container = el(`#${this.memberName}.member`, {
      innerHTML: memberHTML,
    });
    mount(this.parent, this.container);
    this.setupData();
    this.colorBackground = this.container.querySelector(
      ".member-background-color"
    );
    this.bwBackground = this.container.querySelector(".member-background-bw");
    this.memberText = this.container.querySelector(".member-text");

    this.renderBackground();
  }

  mouseMoved(e) {
    let x = e.x || _.get(e, "touches[0].pageX");
    if (!this.mouseDown) return;
    disableScroll();
    this.renderBackground(x);
  }

  renderBackground(x) {
    if (!x) {
      let { width } = document.body.getBoundingClientRect();
      x = width * this.defaultX;
    }
    this.bwBackground.style.width = "100%";
    // this.colorBackground.parentElement.style.width = `${x}px`;

    // let off = this.memberText.getBoundingClientRect();
    // if (x > off.x) this.memberText.parentElement.style.width = `${x - off.x}px`;
    // if (x <= off.x)
    //   this.memberText.parentElement.style.width = `${x - off.x}px`;
  }
}

export default Member;
