import * as fs from 'fs';
import * as path from 'path';
import { computationMap, destinationMap, jumpMap } from './Translator';

export enum instructionTypes {
  A_INSTRUCTION = 'A',
  C_INSTRUCTION = 'C',
  LABEL = 'LABEL'
};

export type Instruction =
  | {
    type: instructionTypes.A_INSTRUCTION;
    value: string;
  }
  | {
    type: instructionTypes.C_INSTRUCTION;
    destination: keyof typeof destinationMap;
    computation: keyof typeof computationMap;
    jump: keyof typeof jumpMap;
  }
  | {
    type: instructionTypes.LABEL;
    name: string;
  };

export default class Parser {
  private file: string = "";
  private instructions: Instruction[] = [];
  private counter: number = 0;
  private outputFile!: fs.WriteStream;

  public lineCounter: number = 0;
  public nextInstruction!: Instruction;

  constructor(filename: string) {
    this.getFileFromDisk(filename);
    this.createOutputFile(filename);
    this.convertFileToInstructions();
    this.updateNextInstruction();
  }

  public writeOnOutputFile(instruction: string) {
    this.outputFile.write(`${instruction}\n`);
  }

  public hasNextInstruction(): boolean {
    return this.counter < this.instructions.length;
  }

  public advance(): void {
    this.counter++;
    this.updateNextInstruction();

    if (this.nextInstruction && this.nextInstruction.type !== instructionTypes.LABEL) {
      this.lineCounter++;
    }
  }
  
  public reset(): void {
    this.counter = 0;
    this.updateNextInstruction();
  }

  private getFileFromDisk(filename: string): void {
    this.file = fs.readFileSync(path.join(__dirname, filename), {
      encoding: "utf-8",
      flag: "r"
    });
  }

  private convertFileToInstructions(): void {
    this.instructions = this.file
      .split("\n")
      .map(line => {
        if (line.startsWith("//") || line.startsWith("\r") || !line) return;

        let instruction = line;
        instruction = instruction.replace('\r', '');
        instruction = instruction.split('//')[0].trim();

        return this.createInstruction(instruction);
      }).filter(line => line) as Instruction[];
  }

  private createInstruction(instruction: string): Instruction {
    if (instruction.startsWith('@')) {
      return {
        type: instructionTypes.A_INSTRUCTION,
        value: instruction.replace('@', '')
      }
    }

    if (instruction.startsWith('(')) {
      return {
        type: instructionTypes.LABEL,
        name: instruction.replace('(', '').replace(')', '')
      }
    }

    const destination = instruction.includes('=') ? instruction.split('=')[0] : '';
    const jump = instruction.includes(';') ? instruction.split(';')[1] : '';

    let computation = instruction;
    computation = destination ? computation.split('=')[1] : computation;
    computation = jump ? computation.split(';')[0] : computation;

    return {
      type: instructionTypes.C_INSTRUCTION,
      destination: destination as keyof typeof destinationMap,
      computation: computation as keyof typeof computationMap,
      jump: jump as keyof typeof jumpMap
    }
  }

  private updateNextInstruction(): void {
    this.nextInstruction = this.instructions[this.counter];
  }

  private createOutputFile(filename: string) {
    this.outputFile = fs.createWriteStream(
      path.join(__dirname, filename.replace('.asm', '.hack')),
      { flags: 'w' }
    );    
  }
}
