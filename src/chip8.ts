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

  executeInstruction(opcode: number) {}
}
