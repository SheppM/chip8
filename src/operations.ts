export class Operations {
  chip8: any;

  constructor(chip8: any) {
    this.chip8 = chip8;
  }
  CLS() {
    this.chip8.monitor.clear();
  }

  RET() {
    /* Return from a subroutine.
       The interpreter sets the program counter to the address at the top
       of the stack, then subtracts 1 from the stack pointer. */
    this.chip8.pc = Number(this.chip8.stack.pop());
  }

  JP_ADDR(nnn: number) {
    /* Jump to location nnn. 
       The interpreter sets the program counter to nnn. */
    this.chip8.pc = nnn;
  }

  CALL_ADDR(nnn: number) {
    /* Call subroutine at nnn.
       The interpreter increments the stack pointer,
       then puts the current PC on the top of the stack. 
       The PC is then set to nnn. */
    this.chip8.stack.push(this.chip8.pc);
    this.chip8.pc = nnn;
  }

  SE_VX_BYTE(x: number, kk: number) {
    /* Skip next instruction if Vx = kk. 
       The interpreter compares register Vx to kk, and if they are equal,
       increments the program counter by 2. */
    if (this.chip8.registers[x] == kk) this.chip8.pc += 2;
  }

  SNE_VX_BYTE(x: number, kk: number) {
    /* Skip next instruction if Vx != kk. 
       The interpreter compares register Vx to kk, and if they are not equal,
       increments the program counter by 2. */
    if (this.chip8.registers[x] != kk) this.chip8.pc += 2;
  }

  SE_VX_VY(x: number, y: number) {
    /* Skip next instruction if Vx = Vy.
       The interpreter compares register Vx to register Vy, 
       and if they are equal, increments the program counter by 2. */
    if (this.chip8.registers[x] == this.chip8.registers[y]) this.chip8.pc += 2;
  }

  LD_VX_BYTE(x: number, kk: number) {
    /* Set Vx = kk. 
       The interpreter puts the value kk into register Vx. */
    this.chip8.registers[x] = kk;
  }

  ADD_VX_BYTE(x: number, kk: number) {
    /* Set Vx = Vx + kk. 
       Adds the value kk to the value of register Vx, 
       then stores the result in Vx */
    this.chip8.registers[x] += kk;
  }

  LD_VX_VY(x: number, y: number) {
    /* Set Vx = Vy. 
       Stores the value of register Vy in register Vx. */
    this.chip8.registers[x] = this.chip8.registers[y];
  }

  OR_VX_VY(x: number, y: number) {
    /* Set Vx = Vx OR Vy. 
       Performs a bitwise OR on the values of Vx and Vy,
       then stores the result in Vx. A bitwise OR compares the corresponding 
       bits from two values, and if either bit is 1, then the same bit in the
       result is also 1. Otherwise, it is 0. */
    this.chip8.registers[x] |= this.chip8.registers[y];
  }

  AND_VX_VY(x: number, y: number) {
    /* Set Vx = Vx AND Vy.
       Performs a bitwise AND on the values of Vx and Vy,
       then stores the result in Vx.
       A bitwise AND compares the corresponding bits from two values,
       and if both bits are 1, then the same bit
       in the result is also 1. Otherwise, it is 0. */
    this.chip8.registers[x] &= this.chip8.registers[y];
  }

  XOR_VX_VY(x: number, y: number) {
    /* Set Vx = Vx XOR Vy. 
       Performs a bitwise exclusive OR on the values of Vx and Vy,
       then stores the resultin Vx. 
       An exclusive OR compares the corresponding bits from two values,
       and if the bits are not both the same,
       then the corresponding bit in the result is set to 1.
       Otherwise, it is 0. */
    this.chip8.registers[x] ^= this.chip8.registers[y];
  }

  ADD_VX_VY(x: number, y: number) {
    /* Set Vx = Vx + Vy, set VF = carry.
       The values of Vx and Vy are added together. If the result is greater
       than 8 bits (i.e. > 255,) VF is set to 1, otherwise 0.
       Only the lowest 8 bits of the result are kept, and stored in Vx. */
    const result = this.chip8.registers[x] + this.chip8.registers[y];
    this.chip8.registers[0xf] = result > 0xff ? 1 : 0;
    this.chip8.registers[x] = result & 0xff;
  }

  SUB_VX_VY(x: number, y: number) {
    /* Set Vx = Vx - Vy, set VF = NOT borrow.
       If Vx > Vy, then VF is set to 1, otherwise 0.
       Then Vy is subtracted from Vx, and the results stored in Vx. */
    this.chip8.registers[0xf] = this.chip8.registers[x] > this.chip8.registers[y] ? 1 : 0;
    this.chip8.registers[x] -= this.chip8.registers[y];
  }

  SHR_VX_VY(x: number, y: number) {
    /* Set Vx = Vx SHR 1.
       If the least-significant bit of Vx is 1,
       then VF is set to 1, otherwise 0. Then Vx is divided by 2. */
    this.chip8.registers[0xf] = this.chip8.registers[x] & 1;
    this.chip8.registers[x] >>= 1;
  }

  SUBN_VX_VY(x: number, y: number) {
    /* Set Vx = Vy - Vx, set VF = NOT borrow.
      If Vy > Vx, then VF is set to 1, otherwise 0.
      Then Vx is subtracted from Vy, and the results stored in Vx. */
    this.chip8.registers[0xf] = this.chip8.registers[y] > this.chip8.registers[x] ? 1 : 0;
    this.chip8.registers[x] = this.chip8.registers[y] - this.chip8.registers[x];
  }

  SHL_VX_VY(x: number, y: number) {
    /* Set Vx = Vx SHL 1. 
       If the most-significant bit of Vx is 1, 
       then VF is set to 1, otherwise to 0. Then Vx is multiplied by 2. */
    this.chip8.registers[0xf] = this.chip8.registers[x] & 0x8;
    this.chip8.registers[x] <<= 1;
  }

  SNE_VX_VY(x: number, y: number) {
    /* Skip next instruction if Vx != Vy. 
       The values of Vx and Vy are compared, and if they are not equal, the
       program counter is increased by 2. */
    if (this.chip8.registers[x] != this.chip8.registers[y]) this.chip8.pc += 2;
  }

  LD_I_ADDR(nnn: number) {
    /* Set I = nnn. The value of register I is set to nnn. */
    this.chip8.I = nnn;
  }

  JP_V0_ADDR(nnn: number) {
    /* Jump to location nnn + V0. 
       The program counter is set to nnn plus the value of V0. */
    this.chip8.pc = nnn + this.chip8.registers[0];
  }

  RND_VX_BYTE(x: number, kk: number) {
    /* Set Vx = random byte AND kk.
       The interpreter generates a random number from 0 to 255, which is then
       ANDed with the value kk. The results are stored in Vx.
       See instruction 8xy2 for more information on AND. */
    const rand = Math.floor(Math.random() * 0x100);
    this.chip8.registers[x] = rand & kk;
  }

  DRW_VX_VY_NIBBLE(x: number, y: number, nibble: number) {
    /* Display n-byte sprite starting at memory location I at (Vx, Vy),
       set VF = collision. 
       The interpreter reads n bytes from memory, starting at the address
       stored in I. These bytes are then displayed as sprites on screen
       at coordinates (Vx, Vy). Sprites are XOR’d onto the existing screen.
       If this.chip8 causes any pixels to be erased, VF is set to 1, otherwise it is 
       set to 0. If the sprite is positioned so part of it is outside 
       the coordinates of the display,
       it wraps around to the opposite side of the screen. */

    this.chip8.I = 0;
    this.chip8.registers[0xf] = 0;
    for (let i = 0; i < nibble; i++) {
      let pixel = this.chip8.memory[this.chip8.I + i];
      for (let j = 0; j < 8; j++) {
        if ((pixel & 0x80) > 0 && this.chip8.monitor.setPixel(x + j, y + i)) this.chip8.registers[0xf] = 1;
        pixel <<= 1;
      }
    }
    this.chip8.monitor.draw();
  }

  SKP_VX(x: number) {
    /* Skip next instruction if key with the value of Vx is pressed.
       Checks the keyboard, and if the key corresponding to the value of Vx is
       currently in the down position, PC is increased by 2. */
    if (this.chip8.keyboard.state[x] == true) this.chip8.pc += 2;
  }

  SKNP_VX(x: number) {
    if (this.chip8.keyboard.state[x] == false) this.chip8.pc += 2;
  }

  LD_VX_DT(x: number) {
    /* Set Vx = delay timer value. The value of DT is placed into Vx. */
    this.chip8.registers[x] = this.chip8.delay;
  }

  LD_VX_K(x: number) {}

  LD_DT_VX(x: number) {
    /* Set delay timer = Vx. Delay Timer is set equal to the value of Vx */
    this.chip8.delay = this.chip8.registers[x];
  }

  LD_ST_VX(x: number) {
    /* Set sound timer = Vx. Sound Timer is set equal to the value of Vx. */
    this.chip8.sound = this.chip8.registers[x];
  }

  ADD_I_VX(x: number) {
    /* Set I = I + Vx. The values of I and Vx are added,
       and the results are stored in I. */
    this.chip8.I += this.chip8.registers[x];
  }

  LD_F_VX(x: number) {
    /* Set I = location of sprite for digit Vx.
       The value of I is set to the location for the hexadecimal sprite
       corresponding to the value of Vx. See section 2.4,
       Display, for more information on the Chip-8 hexadecimal
       font. To obtain this.chip8 value,
       multiply VX by 5 (all font data stored in first 80 bytes of memory). */
    this.chip8.I = this.chip8.registers[x * 5];
  }

  LD_B_VX(x: number) {
    /* Store BCD representation of Vx in memory locations I, I+1, and I+2.
       The interpreter takes the decimal value of Vx,
       and places the hundreds digit in memory at location in I,
       the tens digit at location I+1, and the ones digit at location I+2. */
    let value: number = this.chip8.registers[x];
    this.chip8.memory[this.chip8.I] = Math.floor(value / 100) % 10;
    this.chip8.memory[this.chip8.I + 1] = Math.floor(value / 10) % 10;
    this.chip8.memory[this.chip8.I + 2] = Math.floor(value / 1) % 10;
  }

  LD_I_VX(x: number) {
    /* Stores V0 to VX in memory starting at address I.
       I is then set to I + x + 1. */
    for (let i = 0; i <= x; i++) {
      this.chip8.memory[this.chip8.I + i] = this.chip8.registers[i];
    }
    this.chip8.I += x + 1;
  }

  LD_VX_I(x: number) {
    /* Fills V0 to VX with values from memory starting at address I.
       I is then set to I + x + 1 */

    for (let i = 0; i <= x; i++) {
      this.chip8.registers[i] = this.chip8.memory[this.chip8.I + i];
    }
    this.chip8.I += x + 1;
  }
}
