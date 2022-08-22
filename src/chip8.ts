import { font, rom } from './consts';
import { Operations } from './operations';
export class Chip8 {
  memory = new Uint8Array(4096);
  registers = new Uint8Array(16);
  stack: number[] = [];
  opts: any;
  pc: number = 0x200;
  I: number = 0;
  delay: number = 0;
  sound: number = 0;
  keyboard: any;
  monitor: any;

  constructor(keyboard: any, monitor: any) {
    // Loading font into memory
    this.opts = new Operations(this);

    for (let i = 0; i < font.length; i++) {
      this.memory[i] = font[i];
    }

    for (let i = 0; i < rom.length; i++) {
      this.memory[0x200 + i] = rom[i];
    }

    this.keyboard = keyboard;
    this.monitor = monitor;
    if (this.monitor != null) this.monitor.clear();
  }

  cycle() {
    const opcode: number = (this.memory[this.pc] << 8) | this.memory[this.pc + 1];
    this.pc += 2;
    this.executeInstruction(opcode);
  }

  executeInstruction(opcode: number) {
    const x: number = (opcode & 0xf00) >> 8;
    const y: number = (opcode & 0x00f0) >> 4;
    const kk: number = opcode & 0x00ff;
    const nnn: number = opcode & 0x0fff;
    const n: number = opcode & 0xf;
    console.log(opcode.toString(16));
    switch (opcode & 0xf000) {
      case 0x0000:
        switch (opcode) {
          case 0x00e0:
            this.opts.CLS();
            break;
          case 0x00ee:
            this.opts.RET();
            break;
        }
        break;
      case 0x1000:
        this.opts.JP_ADDR(nnn);
        break;
      case 0x2000:
        this.opts.CALL_ADDR(nnn);
        break;
      case 0x3000:
        this.opts.SE_VX_BYTE(x, kk);
        break;
      case 0x4000:
        this.opts.SNE_VX_BYTE(x, kk);
        break;
      case 0x5000:
        this.opts.SE_VX_VY(x, y);
        break;
      case 0x6000:
        this.opts.LD_VX_BYTE(x, kk);
        break;
      case 0x7000:
        this.opts.ADD_VX_BYTE(x, kk);
        break;
      case 0x8000:
        switch (opcode & 0xf) {
          case 0x0:
            this.opts.LD_VX_VY(x, y);
            break;
          case 0x1:
            this.opts.OR_VX_VY(x, y);
            break;
          case 0x2:
            this.opts.AND_VX_VY(x, y);
            break;
          case 0x3:
            this.opts.XOR_VX_VY(x, y);
            break;
          case 0x4:
            this.opts.ADD_VX_VY(x, y);
            break;
          case 0x5:
            this.opts.SUB_VX_VY(x, y);
            break;
          case 0x6:
            this.opts.SHR_VX_VY(x, y);
            break;
          case 0x7:
            this.opts.SUBN_VX_VY(x, y);
            break;
          case 0xe:
            this.opts.SHL_VX_VY(x, y);
            break;
        }
        break;
      case 0x9000:
        this.opts.SNE_VX_VY(x, y);
        break;
      case 0xa000:
        this.opts.LD_I_ADDR(nnn);
        break;
      case 0xb000:
        this.opts.JP_V0_ADDR(nnn);
        break;
      case 0xc000:
        this.opts.RND_VX_BYTE(x, kk);
        break;
      case 0xd000:
        this.opts.DRW_VX_VY_NIBBLE(x, y, n);
        break;
      case 0xe000:
        switch (opcode & 0xff) {
          case 0x9e:
            this.opts.SKP_VX(x);
            break;
          case 0xa1:
            this.opts.SKNP_VX(x);
            break;
        }
        break;
      case 0xf000:
        switch (opcode & 0xff) {
          case 0x07:
            this.opts.LD_VX_DT(x);
            break;
          case 0x0a:
            this.opts.LD_VX_K(x);
            break;
          case 0x15:
            this.opts.LD_DT_VX(x);
            break;
          case 0x18:
            this.opts.LD_ST_VX(x);
            break;
          case 0x1e:
            this.opts.ADD_I_VX(x);
            break;
          case 0x29:
            this.opts.LD_F_VX(x);
            break;
          case 0x33:
            this.opts.LD_B_VX(x);
            break;
          case 0x55:
            this.opts.LD_I_VX(x);
            break;
          case 0x65:
            this.opts.LD_VX_I(x);
            break;
        }
        break;
    }
  }
}
