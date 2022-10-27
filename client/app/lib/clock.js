import { Clock as ThreeClock } from '/external/three/build/three.module.js';


const clockPrototype = Object.create(new ThreeClock(false));

function Clock(frames, fps=1) {
  if(Number.isNaN(frames)) {
    throw new TypeError('frames parameter must be a number')
  }

  this.totalElapsedTime = 0;

  this.getFrame = () => {
    this.totalElapsedTime += this.getDelta();

    return Math.floor(this.totalElapsedTime / fps) % frames;
  };

  this.getProgress = () => {
    this.totalElapsedTime += this.getDelta();

    return (this.totalElapsedTime / fps) % frames;

  }
}

Clock.prototype = clockPrototype;


export default Clock;