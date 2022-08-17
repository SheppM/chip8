export class Monitor {
  column: number = 64;
  row: number = 32;

  //display buffer
  buffer: number[] = Array.from({ length: this.column * this.row }).map(() => 0);
  // We want the canvas to present a bit larger than 64x32
  // multiplying by a scale will help us here.
  scale: number = 10;
  canvas: any;
  context: any;

  constructor() {
    this.canvas = document.getElementById('canvas');
    this.canvas.width = this.column * this.scale;
    this.canvas.height = this.row * this.scale;
    this.context = this.canvas.getContext('2d');
  }
  setPixel(x: number, y: number) {
    // xoring the pixel on the display buffer will erase
    // it when it's on and turn it on when it's off.
    // In the case of a sprite, to erase the sprite
    // you just draw the sprite again.

    // Originally was a 2d array, but I decided to follow
    // the design choice of others in making it a 1d array.
    this.buffer[x + y * this.column] ^= 1;
  }

  draw() {
    let count = 0;
    // Let's cycle through the display buffer and draw all pixels on the buffer that are on.
    this.buffer.map((pixel) => {
      // Calculate (x,y) position on the display buffer.
      let x = count % this.column;
      let y = Math.floor(count / this.column);

      // Draw current pixel in cycle.
      if (pixel == 1) {
        this.context.fillStyle = 'white';
        this.context.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
      }
      count++;
    });
  }

  clear() {
    // Clear the graphics with a black screen the size of the canvas.
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // We will also refill the Array with all zeros turning everything off.
    this.buffer = Array.from({ length: this.column * this.row }).map(() => 0);
  }
}
