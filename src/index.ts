import { Keyboard } from './keyboard';
import { Monitor } from './monitor';
import { Chip8 } from './chip8';

let monitor = new Monitor();
let keyboard = new Keyboard();
let chip8 = new Chip8(keyboard, monitor);

const loop = () => {
  chip8.cycle();
  setTimeout(function () {
    requestAnimationFrame(loop);
  }, 1000);
};

loop();
