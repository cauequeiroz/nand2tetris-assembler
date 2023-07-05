import Parser, { instructionTypes } from "./Parser";

class HackAssembler {
  private parser: Parser;

  constructor() {
    this.parser = new Parser('../programs/max/Max.asm');
    
    while(this.parser.hasNextInstruction()) {
      const line = this.parser.lineCounter;
      const instruction = this.parser.nextInstruction;
      
      console.log(`[${line}]`, instruction);
      this.parser.advance()
    }
  }
}

new HackAssembler();
