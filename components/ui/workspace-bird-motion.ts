/** One shared clock: 7.6s arrival, 0.6s settling, 9s rest, then lift-off/exit.
 * Paths and the foot anchor use the approved 1109 × 684 image coordinates.
 * Keyframes are calculated once; the browser animates transforms/opacity.
 */
const DURATION = 28;
type Point = readonly [number, number];
type Stop = readonly [seconds: number, value: string | number];

function track(property: string, stops: Stop[], easing = "ease-in-out"): Keyframe[] {
  return stops.map(([seconds, value]) => ({ offset: seconds / DURATION, [property]: value, easing }));
}

function curve(start: number, end: number, points: readonly [Point, Point, Point, Point]): Keyframe[] {
  // Sample the cubic, including its changing speed, without a per-frame JS loop.
  const steps = Math.ceil((end - start) * 24);
  return Array.from({ length: steps + 1 }, (_, index) => {
    const t = index / steps;
    const u = 1 - t;
    const at = (axis: 0 | 1) => u ** 3 * points[0][axis] + 3 * u ** 2 * t * points[1][axis] + 3 * u * t ** 2 * points[2][axis] + t ** 3 * points[3][axis];
    return { offset: (start + (end - start) * t) / DURATION, transform: `translate(${at(0).toFixed(3)}px, ${at(1).toFixed(3)}px)` };
  });
}

function wingbeats(): { near: Stop[]; far: Stop[]; tip: Stop[]; bob: Stop[] } {
  const near: Stop[] = [], far: Stop[] = [], tip: Stop[] = [], bob: Stop[] = [];
  const beat = (time: number, down: boolean, strength = 1) => {
    near.push([time, `rotate(${(down ? -105 : 12) * strength}deg) scaleY(${down ? .68 : 1})`]);
    far.push([time, `rotate(${(down ? -87 : 26) * strength}deg) scaleY(${down ? .58 : .92})`]);
    tip.push([time, `rotate(${(down ? 17 : -11) * strength}deg) scaleX(${down ? .9 : 1})`]);
    bob.push([time, `translateY(${(down ? -.65 : .65) * strength}px)`]);
  };
  // 3.1 beats/sec, decelerating to 1.4 beats/sec on the final approach.
  let time = 0, down = false;
  while (time < 7.25) {
    const approach = Math.max(0, (time - 5.5) / 1.75);
    beat(time, down, 1 - approach * .38);
    time += .16 + approach * .2;
    down = !down;
  }
  near.push([7.6, "rotate(-92deg) scaleY(.35)"], [17.2, "rotate(-92deg) scaleY(.35)"]);
  far.push([7.6, "rotate(-85deg) scaleY(.3)"], [17.2, "rotate(-85deg) scaleY(.3)"]);
  tip.push([7.6, "rotate(15deg) scaleX(.75)"], [17.2, "rotate(15deg) scaleX(.75)"]);
  bob.push([7.6, "translateY(0px)"], [17.2, "translateY(0px)"]);
  time = 17.35;
  down = false;
  while (time < 21.5) {
    beat(time, down);
    time += .23 - Math.min(1, (time - 17.35) / .85) * .09;
    down = !down;
  }
  // The reset happens off-canvas, behind the layer's clipping boundary.
  beat(28, false);
  return { near, far, tip, bob };
}

export function animateWorkspaceBird(layer: SVGSVGElement): Animation[] {
  const animations: Animation[] = [];
  const add = (selector: string, name: string, frames: Keyframe[]) => {
    layer.querySelectorAll(selector).forEach((element) => {
      const animation = element.animate(frames, { duration: DURATION * 1000, iterations: Infinity, fill: "both" });
      animation.id = `workspace-bird-${name}`;
      animation.pause();
      animation.currentTime = 0;
      animations.push(animation);
    });
  };

  const journey = [
    ...curve(0, 3.1, [[-74, 310], [35, 292], [120, 188], [260, 196]]),
    ...curve(3.1, 5.8, [[260, 196], [382, 203], [425, 213], [525, 212]]).slice(1),
    ...curve(5.8, 7.6, [[525, 212], [591.67, 211.33], [640, 258], [640, 258]]).slice(1),
    { offset: 17.65 / DURATION, transform: "translate(640px, 258px)" },
    ...curve(17.65, 19.3, [[640, 258], [640, 258], [675, 202], [810, 175]]).slice(1),
    ...curve(19.3, 21.5, [[810, 175], [990, 139], [1060, 153], [1180, 130]]).slice(1),
    { offset: 27.99 / DURATION, transform: "translate(1180px, 130px)" },
    { offset: 1, transform: "translate(-74px, 310px)" },
  ];
  add(".workspace-bird", "journey", journey);
  add(".workspace-bird", "visibility", track("opacity", [[0, 0], [.35, 0], [.8, 1], [20.7, 1], [21.5, 0], [28, 0]]));
  add(".workspace-bird-pose", "attitude", track("transform", [
    [0, "rotate(-12deg)"], [2.6, "rotate(-5deg)"], [4.5, "rotate(3deg)"],
    [5.8, "rotate(7deg)"], [6.8, "rotate(-8deg)"], [7.45, "rotate(-5deg)"],
    [7.6, "rotate(0deg) scaleY(.96)"], [8.2, "rotate(0deg) scaleY(1)"],
    [17.2, "rotate(0deg)"], [17.52, "rotate(9deg) scaleY(.96)"],
    [17.9, "rotate(-13deg)"], [19.3, "rotate(-8deg)"], [21.5, "rotate(-5deg)"], [28, "rotate(-12deg)"],
  ]));
  const beats = wingbeats();
  add(".workspace-bird-wing--near", "near-wing", track("transform", beats.near));
  add(".workspace-bird-wing--far", "far-wing", track("transform", beats.far));
  add(".workspace-bird-wingtip", "feather-flex", track("transform", beats.tip));
  add(".workspace-bird-bob", "flight-lift", track("transform", beats.bob));
  add(".workspace-bird-wing", "unfold", track("opacity", [[0, 1], [7.05, 1], [7.6, 0], [17.2, 0], [17.45, 1], [28, 1]]));
  add(".workspace-bird-folded-wing", "fold", track("opacity", [[0, 0], [7.05, 0], [7.6, 1], [17.2, 1], [17.5, 0], [28, 0]]));
  add(".workspace-bird-feet", "feet", track("transform", [
    [0, "translate(-3px, -9px) rotate(-16deg)"], [6.35, "translate(-3px, -9px) rotate(-16deg)"],
    [7.25, "translate(0px, 0px) rotate(0deg)"], [17.7, "translate(0px, 0px) rotate(0deg)"],
    [18.25, "translate(-3px, -9px) rotate(-16deg)"], [28, "translate(-3px, -9px) rotate(-16deg)"],
  ]));
  add(".workspace-bird-shadow", "contact", track("opacity", [[0, 0], [7, 0], [7.6, .16], [17.65, .16], [18, 0], [28, 0]]));
  add(".workspace-bird-body", "breath", track("transform", [
    [0, "scale(1)"], [8.2, "scale(1)"], [9.7, "scale(1.012, 1.018)"], [11.2, "scale(1)"],
    [12.7, "scale(1.012, 1.018)"], [14.2, "scale(1)"], [15.7, "scale(1.012, 1.018)"], [17.2, "scale(1)"], [28, "scale(1)"],
  ]));
  add(".workspace-bird-head", "curiosity", track("transform", [
    [0, "rotate(0deg)"], [9.3, "rotate(0deg)"], [9.8, "rotate(-7deg)"], [10.6, "rotate(-7deg)"],
    [11.1, "rotate(0deg)"], [14, "rotate(0deg)"], [14.5, "rotate(4deg)"], [15.1, "rotate(0deg)"], [28, "rotate(0deg)"],
  ]));
  add(".workspace-bird-eye", "blink", track("transform", [
    [0, "scaleY(1)"], [10.8, "scaleY(1)"], [10.88, "scaleY(.12)"], [10.99, "scaleY(1)"],
    [15.5, "scaleY(1)"], [15.58, "scaleY(.12)"], [15.69, "scaleY(1)"], [28, "scaleY(1)"],
  ]));
  add(".workspace-bird-tail", "tail", track("transform", [
    [0, "rotate(-3deg)"], [7.4, "rotate(4deg)"], [8.2, "rotate(0deg)"],
    [12.3, "rotate(0deg)"], [12.65, "rotate(-5deg)"], [13.1, "rotate(0deg)"],
    [17.2, "rotate(0deg)"], [17.8, "rotate(5deg)"], [21.5, "rotate(-3deg)"], [28, "rotate(-3deg)"],
  ]));
  return animations;
}
