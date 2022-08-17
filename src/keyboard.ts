export class Keyboard {
  state: boolean[] = new Array(16);
  button: any[] = Array.from({ length: 16 }).map((element, index) => {
    let button = document.createElement('button');
    button.innerText = index.toString(16);
    button.addEventListener('mousedown', () => {
      this.state[index] = true;
    });
    button.addEventListener('mouseup', () => {
      this.state[index] = false;
    });

    return button;
  });
  constructor() {
    let keyboard: any = document.getElementById('keyboard');
    this.button.map((element) => {
      keyboard.appendChild(element);
    });
  }
}
