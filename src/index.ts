import Parser from "./Parser";
import Translator from "./Translator";

class HackAssembler {
  private parser: Parser;
  private translator: Translator;

  constructor() {
    this.parser = new Parser('../programs/pong/PongL.asm');
    this.translator = new Translator();

    while (this.parser.hasNextInstruction()) {
      const instruction = this.parser.nextInstruction;
      const binary = this.translator.convertInstruction(instruction);

      this.parser.writeOnOutputFile(binary);
      this.parser.advance()
    }
  }
}

new HackAssembler();
