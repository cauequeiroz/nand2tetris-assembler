"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SymbolTable = /** @class */ (function () {
    function SymbolTable() {
        this.memory = {};
        this.nextAvailableAddress = 16;
        this.memory = {
            'SP': 0,
            'LCL': 1,
            'ARG': 2,
            'THIS': 3,
            'THAT': 4,
            'R0': 0,
            'R1': 1,
            'R2': 2,
            'R3': 3,
            'R4': 4,
            'R5': 5,
            'R6': 6,
            'R7': 7,
            'R8': 8,
            'R9': 9,
            'R10': 10,
            'R11': 11,
            'R12': 12,
            'R13': 13,
            'R14': 14,
            'R15': 15,
            'SCREEN': 16384,
            'KBD': 24576
        };
    }
    SymbolTable.prototype.save = function (name, value) {
        this.memory[name] = value;
    };
    SymbolTable.prototype.get = function (name) {
        var isVariableOrLabel = !/^\d+$/.test(name);
        if (!isVariableOrLabel)
            return name;
        if (this.memory[name] === undefined) {
            this.memory[name] = this.nextAvailableAddress;
            this.nextAvailableAddress++;
        }
        return this.memory[name];
    };
    return SymbolTable;
}());
exports.default = SymbolTable;
