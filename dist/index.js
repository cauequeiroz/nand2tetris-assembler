#! /usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Parser_1 = __importStar(require("./Parser"));
var SymbolTable_1 = __importDefault(require("./SymbolTable"));
var Translator_1 = __importDefault(require("./Translator"));
var HackAssembler = /** @class */ (function () {
    function HackAssembler() {
        this.parser = new Parser_1.default(process.argv[2]);
        this.translator = new Translator_1.default();
        this.symbolTable = new SymbolTable_1.default();
        this.saveLabelAddresses();
        this.assemble();
    }
    HackAssembler.prototype.saveLabelAddresses = function () {
        while (this.parser.hasNextInstruction()) {
            var instruction = this.parser.nextInstruction;
            if (instruction.type === Parser_1.instructionTypes.LABEL) {
                this.symbolTable.save(instruction.name, this.parser.lineCounter + 1);
            }
            this.parser.advance();
        }
        this.parser.reset();
    };
    HackAssembler.prototype.assemble = function () {
        while (this.parser.hasNextInstruction()) {
            var instruction = this.parser.nextInstruction;
            var binary = '';
            if (instruction.type === Parser_1.instructionTypes.LABEL) {
                this.parser.advance();
                continue;
            }
            if (instruction.type === Parser_1.instructionTypes.A_INSTRUCTION) {
                instruction.value = String(this.symbolTable.get(instruction.value));
            }
            binary = this.translator.convertInstruction(instruction);
            this.parser.writeOnOutputFile(binary);
            this.parser.advance();
        }
    };
    return HackAssembler;
}());
new HackAssembler();
