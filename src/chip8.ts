class Chip8 {

    memory: number[] = new Array(4096);
    registers: number[] = new Array(16);
    stack: number[] = new Array(16)
    pc: number = 0x200;
    I: number = 0;
    delay: number = 0;
    sound: number = 0;

    cycle() {

    }

    executeInstruction(opcode: number) {
        
    }

}