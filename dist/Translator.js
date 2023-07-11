"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computationMap = exports.jumpMap = exports.destinationMap = void 0;
var Parser_1 = require("./Parser");
exports.destinationMap = {
    '': '000',
    'M': '001',
    'D': '010',
    'MD': '011',
    'A': '100',
    'AM': '101',
    'AD': '110',
    'AMD': '111',
};
exports.jumpMap = {
    '': '000',
    'JGT': '001',
    'JEQ': '010',
    'JGE': '011',
    'JLT': '100',
    'JNE': '101',
    'JLE': '110',
    'JMP': '111'
};
exports.computationMap = {
    '0': '101010',
    '1': '111111',
    '-1': '111010',
    'D': '001100',
    'A': '110000',
    'M': '110000',
    '!D': '001101',
    '!A': '110001',
    '!M': '110001',
    '-D': '001111',
    '-A': '110011',
    '-M': '110011',
    'D+1': '011111',
    'A+1': '110111',
    'M+1': '110111',
    'D-1': '001110',
    'A-1': '110010',
    'M-1': '110010',
    'D+A': '000010',
    'D+M': '000010',
    'D-A': '010011',
    'D-M': '010011',
    'A-D': '000111',
    'M-D': '000111',
    'D&A': '000000',
    'D&M': '000000',
    'D|A': '010101',
    'D|M': '010101'
};
var Translator = /** @class */ (function () {
    function Translator() {
    }
    Translator.prototype.convertInstruction = function (instruction) {
        if (instruction.type === Parser_1.instructionTypes.LABEL) {
            throw new Error('You cannot pass a Label Instruction.');
        }
        return instruction.type === Parser_1.instructionTypes.A_INSTRUCTION
            ? this.convertAInstruction(instruction)
            : this.convertCInstruction(instruction);
    };
    Translator.prototype.convertCInstruction = function (instruction) {
        if (instruction.type !== Parser_1.instructionTypes.C_INSTRUCTION) {
            throw new Error('You must pass a C-Instruction.');
        }
        ;
        return [
            '111',
            instruction.computation.includes('M') ? '1' : '0',
            exports.computationMap[instruction.computation],
            exports.destinationMap[instruction.destination],
            exports.jumpMap[instruction.jump]
        ].join('');
    };
    Translator.prototype.convertAInstruction = function (instruction) {
        if (instruction.type !== Parser_1.instructionTypes.A_INSTRUCTION) {
            throw new Error('You must pass a A-Instruction.');
        }
        var number = Number(instruction.value);
        var binary = '';
        for (var i = 14; i >= 0; i--) {
            if (Math.pow(2, i) > number) {
                binary += '0';
                continue;
            }
            binary += '1';
            number -= Math.pow(2, i);
        }
        return [
            '0',
            binary
        ].join('');
    };
    return Translator;
}());
exports.default = Translator;
