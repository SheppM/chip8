import { Keyboard } from './keyboard';
import { Monitor } from './monitor';
let monitor = new Monitor();
let keyboard = new Keyboard();

function helloworld(m: Monitor) {
  m.clear();
  let map = new Map<string, object>();

  map['H'] = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 2],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
  ];
  map['E'] = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 0],
    [2, 0],
    [1, 2],
    [2, 2],
    [1, 4],
    [2, 4],
  ];

  map['L'] = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 4],
    [2, 4],
  ];

  map['O'] = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 0],
    [1, 4],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
  ];
  map['W'] = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 3],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
  ];
  map['R'] = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 0],
    [1, 2],
    [2, 0],
    [2, 1],
    [2, 3],
    [2, 4],
  ];

  map['D'] = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 0],
    [1, 4],
    [2, 1],
    [2, 2],
    [2, 3],
  ];

  map['!'] = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 4],
  ];

  let text: string = 'HELLO WORLD!';

  let shift: number = 0;
  for (let i of text.split('')) {
    if (i == ' ') {
      shift += 4;
      continue;
    }
    for (let j of map[i]) {
      m.setPixel(j[0] + 1 + shift, j[1] + 1);
    }
    shift += 4;
  }

  m.draw();
}

helloworld(monitor);
