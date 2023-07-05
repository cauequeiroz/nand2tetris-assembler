import * as fs from 'fs';
import * as path from 'path';

export enum instructionTypes {
  A_INSTRUCTION = 'A',
  C_INSTRUCTION = 'C',
  LABEL = 'LABEL'
};

type Instruction =
  | {
    type: instructionTypes.A_INSTRUCTION;
    value: string;
  }
  | {
    type: instructionTypes.C_INSTRUCTION;
    destination: string;
    computation: string;
    jump: string;
  }
  | {
    type: instructionTypes.LABEL;
    name: string;
  };

export default class Parser {
  private file: string = "";
  private instructions: Instruction[] = [];
  private counter: number = 0;
  
  public lineCounter: number = 0;
  public nextInstruction!: Instruction;

  constructor(filename: string) {
    this.getFileFromDisk(filename);
    this.convertFileToInstructions();
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
      destination,
      computation,
      jump
    }
  }

  private updateNextInstruction(): void {
    this.nextInstruction = this.instructions[this.counter];
  }

  public advance(): void {
    this.counter++;
    this.updateNextInstruction();

    if (this.nextInstruction && this.nextInstruction.type !== instructionTypes.LABEL) {
      this.lineCounter++;
    }
  }

  public hasNextInstruction(): boolean {
    return this.counter <  this.instructions.length;
  }
}
