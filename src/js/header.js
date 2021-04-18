import anime from "animejs";
import headerHTML from "../html/header.html";
import { el, mount } from "redom";
import GlslCanvas from "glslCanvas";

class Header {
  constructor(parent) {
    this.container = null;
    this.headerContent = null;
    this.parent = parent;
    this.particleColors = [
      "#bc7df1",
      "#8332fc",
      "#08fcea",
      "#b9f7ff",
      "#fc52a5"
    ];
  }


  draw() {
    if (this.container) this.container.remove();

    this.container = el(".header", {
      innerHTML: '<canvas id="canvas"></canvas>',
    });
    let height = window.innerHeight;

    this.container.style.height = `${height}px`;

    mount(this.parent, this.container);

    this.drawCanvas();
  }

  drawTextAnimation() {
    if (this.headerContent) this.headerContent.remove();

    this.headerContent = el(".header-content", { innerHTML: headerHTML });
    mount(this.parent, this.headerContent);

    // Wrap every letter in a span
    var textWrapper = this.headerContent.querySelector(".ml11 .letters");
    textWrapper.innerHTML = textWrapper.textContent.replace(
      /([^\x00-\x80]|\w)/g,
      "<span class='letter'>$&</span>"
    );

    anime
      .timeline({ loop: false })
      .add({
        targets: ".ml11 .line",
        scaleY: [0, 1],
        opacity: [0.5, 1],
        easing: "easeOutExpo",
        duration: 700,
      })
      .add({
        targets: ".ml11 .line",
        translateX: [
          0,
          document.querySelector(".ml11 .letters").getBoundingClientRect()
            .width + 20,
        ],
        easing: "easeOutExpo",
        duration: 700,
        delay: 100,
      })
      .add(
        {
          targets: ".ml11 .letter",
          opacity: [0, 1],
          easing: "easeOutExpo",
          duration: 600,
          offset: "-=775",
          delay: (el, i) => 34 * (i + 1),
        },
        700
      )
      .add({
        targets: ".line",
        opacity: 0,
        duration: 500,
        easing: "easeOutExpo",
        delay: 200,
      });
  }

  drawCanvas() {
    const canvas = this.container.querySelector("canvas");

    // set the size of the drawingBuffer
    var devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;


    const sandbox = new GlslCanvas(canvas);
    // // Created by inigo quilez - iq/2013
    // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

    var string_frag_code = `
      // https://www.shadertoy.com/view/fdXXWH
      
      #ifdef GL_ES
      precision mediump float;
      #endif
      uniform vec2 u_resolution;
      uniform float u_time;

      //Anti-Aliasing (SSAA). Use 1.0 on slower computers
      #define AA 1.

      //Smooth minimum (based off IQ's work)
      float smin(float d1, float d2)
      {
          const float e = -5.2;
          return log(exp(d1*e)+exp(d2*e))/e;
      }
      //Ripple and drop distance function
      float dist(vec3 p)
      {
          float l = pow(dot(p.xz,p.xz),.9);
          float ripple = p.y+.7+.4*sin(l*3.-u_time+.5)/(1.+l);
          
          float h1 = -sin(u_time/1.5);
          float h2 = cos(u_time/1.5+.1);
          float drop = length(p+vec3(0.,1.,0)*h1*2.)-.4;
          drop = smin(drop,length(p+vec3(0.,1.,0)*h2*2.)-.2);
          return smin(ripple,drop);
      }
      //Typical SDF normal function
      vec3 normal(vec3 p)
      {
          vec2 e = vec2(1,-1)*.01;
          
          return normalize(dist(p-e.yxx)*e.yxx+dist(p-e.xyx)*e.xyx+
          dist(p-e.xxy)*e.xxy+dist(p-e.y)*e.y);
      }
      //Basic raymarcher
      vec4 march(vec3 p, vec3 d)
      {
          vec4 m = vec4(p,0);
          for(int i = 0; i<30; i++)
          {
              float s = dist(m.xyz);
              m += vec4(d,1)*s;
              
              if (s<.01 || m.w>20.) break;
          }
          return m;
      }

      void main()
      {
          vec2 res = u_resolution.xy;
          vec3 col = vec3(0.);
          vec3 bac = vec3(1.);
          vec3 pos = vec3(.01*cos(u_time),.1*sin(u_time),-3);
          
          float x = 0.;
          float y = 0.;

          vec3 ray = normalize(vec3(gl_FragCoord.xy-res/2.,res/3.));
          vec4 mar = march(pos,ray);
          vec3 wat = 0.5*bac+sin(u_time/2.)*.4*ray;
          float fade = pow(min(mar.w/10.,1.),.7);
          col += mix(wat,bac,fade);

          gl_FragColor = vec4(col*col,1);
      }

    `;
    sandbox.load(string_frag_code);
  }

}

export default Header;
