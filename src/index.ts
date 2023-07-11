#! /usr/bin/env node

import Parser, { instructionTypes } from "./Parser";
import SymbolTable from "./SymbolTable";
import Translator from "./Translator";

class Assembler {
  private parser: Parser;
  private translator: Translator;
  private symbolTable: SymbolTable;

  constructor() {
    this.parser = new Parser(process.argv[2]);
    this.translator = new Translator();
    this.symbolTable = new SymbolTable();

    this.saveLabelAddresses();
    this.assemble();
  }

  private saveLabelAddresses(): void {
    while(this.parser.hasNextInstruction()) {
      let instruction = this.parser.nextInstruction;

      if (instruction.type === instructionTypes.LABEL) {
        this.symbolTable.save(instruction.name, this.parser.lineCounter + 1)
      }

      this.parser.advance();
    }
    
    this.parser.reset();
  }

  private assemble():void {
    while(this.parser.hasNextInstruction()) {
      let instruction = this.parser.nextInstruction;
      let binary = '';

      if (instruction.type === instructionTypes.LABEL) {
        this.parser.advance();
        continue;
      }
     
      if (instruction.type === instructionTypes.A_INSTRUCTION) {
        instruction.value = String(this.symbolTable.get(instruction.value));
      }

      binary = this.translator.convertInstruction(instruction);
      
      this.parser.writeOnOutputFile(binary);
      this.parser.advance();
    }
  }
}

new Assembler();
