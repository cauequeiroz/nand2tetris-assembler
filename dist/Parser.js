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
Object.defineProperty(exports, "__esModule", { value: true });
exports.instructionTypes = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var instructionTypes;
(function (instructionTypes) {
    instructionTypes["A_INSTRUCTION"] = "A";
    instructionTypes["C_INSTRUCTION"] = "C";
    instructionTypes["LABEL"] = "LABEL";
})(instructionTypes || (exports.instructionTypes = instructionTypes = {}));
;
var Parser = /** @class */ (function () {
    function Parser(filename) {
        this.file = "";
        this.instructions = [];
        this.counter = 0;
        this.lineCounter = 0;
        this.getFileFromDisk(filename);
        this.createOutputFile(filename);
        this.convertFileToInstructions();
        this.updateNextInstruction();
    }
    Parser.prototype.writeOnOutputFile = function (instruction) {
        this.outputFile.write("".concat(instruction, "\n"));
    };
    Parser.prototype.hasNextInstruction = function () {
        return this.counter < this.instructions.length;
    };
    Parser.prototype.advance = function () {
        this.counter++;
        this.updateNextInstruction();
        if (this.nextInstruction && this.nextInstruction.type !== instructionTypes.LABEL) {
            this.lineCounter++;
        }
    };
    Parser.prototype.reset = function () {
        this.counter = 0;
        this.updateNextInstruction();
    };
    Parser.prototype.getFileFromDisk = function (filename) {
        this.file = fs.readFileSync(path.resolve(process.cwd(), filename), {
            encoding: "utf-8",
            flag: "r"
        });
    };
    Parser.prototype.convertFileToInstructions = function () {
        var _this = this;
        this.instructions = this.file
            .split("\n")
            .map(function (line) {
            if (line.startsWith("//") || line.startsWith("\r") || !line)
                return;
            var instruction = line;
            instruction = instruction.replace('\r', '');
            instruction = instruction.split('//')[0].trim();
            return _this.createInstruction(instruction);
        }).filter(function (line) { return line; });
    };
    Parser.prototype.createInstruction = function (instruction) {
        if (instruction.startsWith('@')) {
            return {
                type: instructionTypes.A_INSTRUCTION,
                value: instruction.replace('@', '')
            };
        }
        if (instruction.startsWith('(')) {
            return {
                type: instructionTypes.LABEL,
                name: instruction.replace('(', '').replace(')', '')
            };
        }
        var destination = instruction.includes('=') ? instruction.split('=')[0] : '';
        var jump = instruction.includes(';') ? instruction.split(';')[1] : '';
        var computation = instruction;
        computation = destination ? computation.split('=')[1] : computation;
        computation = jump ? computation.split(';')[0] : computation;
        return {
            type: instructionTypes.C_INSTRUCTION,
            destination: destination,
            computation: computation,
            jump: jump
        };
    };
    Parser.prototype.updateNextInstruction = function () {
        this.nextInstruction = this.instructions[this.counter];
    };
    Parser.prototype.createOutputFile = function (filename) {
        this.outputFile = fs.createWriteStream(path.resolve(process.cwd(), filename.replace('.asm', '.hack')), { flags: 'w' });
    };
    return Parser;
}());
exports.default = Parser;
