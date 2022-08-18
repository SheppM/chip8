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

  executeInstruction(opcode: number) {}
}
