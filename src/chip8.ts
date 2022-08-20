export class Chip8 {
  memory: number[] = new Array(4096);
  registers: number[] = new Array(16);
  stack: number[] = new Array(16);
  pc: number = 0x200;
  I: number = 0;
  delay: number = 0;
  sound: number = 0;

  cycle() {
    let opcode: number = (this.memory[this.pc] << 8) | this.memory[this.pc + 1];
    return opcode;
  }

  CLS() {
    /* Clear the display. */
  }

  RET() {
    /* Return from a subroutine.
       The interpreter sets the program counter to the address at the top
       of the stack, then subtracts 1 from the stack pointer. */
    this.pc = Number(this.stack.pop());
  }

  JP_ADDR(nnn: number) {
    /* Jump to location nnn. 
       The interpreter sets the program counter to nnn. */
    this.pc = nnn;
  }

  CALL_ADDR(nnn: number) {
    /* Call subroutine at nnn.
       The interpreter increments the stack pointer,
       then puts the current PC on the top of the stack. 
       The PC is then set to nnn. */
    this.stack.push(this.pc);
    this.pc = nnn;
  }

  SE_VX_BYTE(x: number, kk: number) {
    /* Skip next instruction if Vx = kk. 
       The interpreter compares register Vx to kk, and if they are equal,
       increments the program counter by 2. */
    if (this.registers[x] == kk) this.pc += 2;
  }

  SNE_VX_BYTE(x: number, kk: number) {
    /* Skip next instruction if Vx != kk. 
       The interpreter compares register Vx to kk, and if they are not equal,
       increments the program counter by 2. */
    if (this.registers[x] != kk) this.pc += 2;
  }

  SE_VX_VY(x: number, y: number) {
    /* Skip next instruction if Vx = Vy.
       The interpreter compares register Vx to register Vy, 
       and if they are equal, increments the program counter by 2. */
    if (this.registers[x] == this.registers[y]) this.pc += 2;
  }

  LD_VX_BYTE(x: number, kk: number) {
    /* Set Vx = kk. 
       The interpreter puts the value kk into register Vx. */
    this.registers[x] = kk;
  }

  ADD_VX_BYTE(x: number, kk: number) {
    /* Set Vx = Vx + kk. 
       Adds the value kk to the value of register Vx, 
       then stores the result in Vx */
    this.registers[x] += kk;
  }

  LD_VX_VY(x: number, y: number) {
    /* Set Vx = Vy. 
       Stores the value of register Vy in register Vx. */
    this.registers[x] = this.registers[y];
  }

  OR_VX_VY(x: number, y: number) {
    /* Set Vx = Vx OR Vy. 
       Performs a bitwise OR on the values of Vx and Vy,
       then stores the result in Vx. A bitwise OR compares the corresponding 
       bits from two values, and if either bit is 1, then the same bit in the
       result is also 1. Otherwise, it is 0. */
    this.registers[x] |= this.registers[y];
  }

  AND_VX_VY(x: number, y: number) {
    /* Set Vx = Vx AND Vy.
       Performs a bitwise AND on the values of Vx and Vy,
       then stores the result in Vx.
       A bitwise AND compares the corresponding bits from two values,
       and if both bits are 1, then the same bit
       in the result is also 1. Otherwise, it is 0. */
    this.registers[x] &= this.registers[y];
  }

  XOR_VX_VY(x: number, y: number) {
    /* Set Vx = Vx XOR Vy. 
       Performs a bitwise exclusive OR on the values of Vx and Vy,
       then stores the resultin Vx. 
       An exclusive OR compares the corresponding bits from two values,
       and if the bits are not both the same,
       then the corresponding bit in the result is set to 1.
       Otherwise, it is 0. */
    this.registers[x] ^= this.registers[y];
  }

  ADD_VX_VY(x: number, y: number) {
    /* Set Vx = Vx + Vy, set VF = carry.
       The values of Vx and Vy are added together. If the result is greater
       than 8 bits (i.e. > 255,) VF is set to 1, otherwise 0.
       Only the lowest 8 bits of the result are kept, and stored in Vx. */
    const result = this.registers[x] + this.registers[y];
    this.registers[0xf] = result > 0xff ? 1 : 0;
    this.registers[x] = result & 0xff;
  }

  SUB_VX_VY(x: number, y: number) {
    /* Set Vx = Vx - Vy, set VF = NOT borrow.
       If Vx > Vy, then VF is set to 1, otherwise 0.
       Then Vy is subtracted from Vx, and the results stored in Vx. */
    this.registers[0xf] = this.registers[x] > this.registers[y] ? 1 : 0;
    this.registers[x] -= this.registers[y];
  }

  SHR_VX_VY(x: number, y: number) {
    /* Set Vx = Vx SHR 1.
       If the least-significant bit of Vx is 1,
       then VF is set to 1, otherwise 0. Then Vx is divided by 2. */
    this.registers[0xf] = this.registers[x] & 1;
    this.registers[x] >>= 1;
  }

  SUBN_VX_VY(x: number, y: number) {
    /* Set Vx = Vy - Vx, set VF = NOT borrow.
      If Vy > Vx, then VF is set to 1, otherwise 0.
      Then Vx is subtracted from Vy, and the results stored in Vx. */
    this.registers[0xf] = this.registers[y] > this.registers[x] ? 1 : 0;
    this.registers[x] = this.registers[y] - this.registers[x];
  }

  SHL_VX_VY(x: number, y: number) {
    /* Set Vx = Vx SHL 1. 
       If the most-significant bit of Vx is 1, 
       then VF is set to 1, otherwise to 0. Then Vx is multiplied by 2. */
    this.registers[0xf] = this.registers[x] & 0x8;
    this.registers[x] <<= 1;
  }

  SNE_VX_VY(x: number, y: number) {
    /* Skip next instruction if Vx != Vy. 
       The values of Vx and Vy are compared, and if they are not equal, the
       program counter is increased by 2. */
    if (this.registers[x] != this.registers[y]) this.pc += 2;
  }

  LD_I_ADDR(nnn: number) {
    /* Set I = nnn. The value of register I is set to nnn. */
    this.I = nnn;
  }

  JP_V0_ADDR(nnn: number) {
    /* Jump to location nnn + V0. 
       The program counter is set to nnn plus the value of V0. */
    this.pc = nnn + this.registers[0];
  }

  RND_VX_BYTE(x: number, kk: number) {
    /* Set Vx = random byte AND kk.
       The interpreter generates a random number from 0 to 255, which is then
       ANDed with the value kk. The results are stored in Vx.
       See instruction 8xy2 for more information on AND. */
    const rand = Math.floor(Math.random() * 0x100);
    this.registers[x] = rand & kk;
  }

  DRW_VX_VY_NIBBLE(x: number, y: number, nibble: number) {
    /* Display n-byte sprite starting at memory location I at (Vx, Vy),
       set VF = collision. 
       The interpreter reads n bytes from memory, starting at the address
       stored in I. These bytes are then displayed as sprites on screen
       at coordinates (Vx, Vy). Sprites are XOR’d onto the existing screen.
       If this causes any pixels to be erased, VF is set to 1, otherwise it is 
       set to 0. If the sprite is positioned so part of it is outside 
       the coordinates of the display,
       it wraps around to the opposite side of the screen. */
  }

  SKP_VX(x: number) {
    /* Skip next instruction if key with the value of Vx is pressed.
       Checks the keyboard, and if the key corresponding to the value of Vx is
       currently in the down position, PC is increased by 2. */
  }

  SKNP_VX(x: number) {}

  LD_VX_DT(x: number) {
    /* Set Vx = delay timer value. The value of DT is placed into Vx. */
    this.registers[x] = this.delay;
  }

  LD_VX_K(x: number) {}

  LD_DT_VX(x: number) {
    /* Set delay timer = Vx. Delay Timer is set equal to the value of Vx */
    this.delay = this.registers[x];
  }

  LD_ST_VX(x: number) {
    /* Set sound timer = Vx. Sound Timer is set equal to the value of Vx. */
    this.sound = this.registers[x];
  }

  ADD_I_VX(x: number) {
    /* Set I = I + Vx. The values of I and Vx are added,
       and the results are stored in I. */
    this.I += this.registers[x];
  }

  LD_F_VX(x: number) {
    /* Set I = location of sprite for digit Vx.
       The value of I is set to the location for the hexadecimal sprite
       corresponding to the value of Vx. See section 2.4,
       Display, for more information on the Chip-8 hexadecimal
       font. To obtain this value,
       multiply VX by 5 (all font data stored in first 80 bytes of memory). */
    this.I = this.registers[x * 5];
  }

  LD_B_VX(x: number) {
    /* Store BCD representation of Vx in memory locations I, I+1, and I+2.
       The interpreter takes the decimal value of Vx,
       and places the hundreds digit in memory at location in I,
       the tens digit at location I+1, and the ones digit at location I+2. */
    let value: number = this.registers[x];
    this.memory[this.I] = Math.floor(value / 100) % 10;
    this.memory[this.I + 1] = Math.floor(value / 10) % 10;
    this.memory[this.I + 2] = Math.floor(value / 1) % 10;
  }

  LD_I_VX(x: number) {
    /* Stores V0 to VX in memory starting at address I.
       I is then set to I + x + 1. */
    for (let i = 0; i <= x; i++) {
      this.memory[this.I + i] = this.registers[i];
    }
    this.I += x + 1;
  }

  LD_VX_I(x: number) {
    /* Fills V0 to VX with values from memory starting at address I.
       I is then set to I + x + 1 */

    for (let i = 0; i <= x; i++) {
      this.registers[i] = this.memory[this.I + i];
    }
    this.I += x + 1;
  }

  executeInstruction(opcode: number) {}
}
