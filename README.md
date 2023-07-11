# Nand2Tetris Assembler

Assembler written in Typescript for Nand2Tetris Hack Computer. This assembler is the week 6 project of [Nand2Tetris Part 1](https://www.coursera.org/learn/build-a-computer) course.

**Input:** `.asm` file (hack computer assembly language)  
**Output:** `.hack` file (hack computer machine code)

More information at: [https://www.nand2tetris.org/project06](https://www.nand2tetris.org/project06)

## Usage

```
$ npm install -g @cauequeiroz/nand2tetris-assembler
$ nand2tetris-assembler ./path/to/file.asm
```

```
$ npx @cauequeiroz/nand2tetris-assembler ./path/to/file/asm
```

After that, the output file with machine code only (`.hack`) will appears on the same directory of input file.
