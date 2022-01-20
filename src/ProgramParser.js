//@flow

import type { Program, ProgramBlock } from './types';
import { parseLoopLabel } from './Utils';

// TODO: Set label on endLoop blocks
// TODO: If the loop label stack is empty when processing an endLoop,
//       throw an Error: endLoop without startLoop
// TODO: If the loop label stack is not empty at the end of the program,
//       throw an Error: startLoop without endLoop

export type ProgramParserResult = {
    program: Program,
    highestLoopNumber: number
};

export default class ProgramParser {
    text: string;
    textIndex: number;
    ch: ?string;
    labelsUsed: Set<string>;
    highestLoopNumber: number;

    constructor() {
        this.text = '';
        this.textIndex = 0;
        this.ch = null;
        this.labelsUsed = new Set();
        this.highestLoopNumber = 0;
    }

    parse(text: string): ProgramParserResult {
        this.text = text;
        this.textIndex = 0;
        this.labelsUsed.clear();
        this.highestLoopNumber = 0;
        this.nextCh();

        const program  = [];
        let block = this.getNextBlock();
        while (block) {
            program.push(block);
            block = this.getNextBlock();
        }
        return {
            program: program,
            highestLoopNumber: this.highestLoopNumber
        };
    }

    getNextBlock(): ?ProgramBlock {
        if (this.ch == null) {
            return null;
        }

        switch(this.ch) {
            case '1':
                this.nextCh();
                return { block: 'forward1' };
            case '2':
                this.nextCh();
                return { block: 'forward2' };
            case '3':
                this.nextCh();
                return { block: 'forward3' };
            case '4':
                this.nextCh();
                return { block: 'backward1' };
            case '5':
                this.nextCh();
                return { block: 'backward2' };
            case '6':
                this.nextCh();
                return { block: 'backward3' };
            case 'A':
                this.nextCh();
                return { block: 'left45' };
            case 'B':
                this.nextCh();
                return { block: 'left90' };
            case 'D':
                this.nextCh();
                return { block: 'left180' };
            case 'a':
                this.nextCh();
                return { block: 'right45' };
            case 'b':
                this.nextCh();
                return { block: 'right90' };
            case 'd':
                this.nextCh();
                return { block: 'right180' };
            case 's':
                return this.getStartLoop();
            case 'z':
                this.nextCh();
                return { block: 'endLoop' };
            default:
                throw new Error(`Unexpected character: ${this.ch}`);
        }
    }

    getStartLoop(): ProgramBlock {
        // Consume the 's'
        this.nextCh();

        // Read the label
        let label = '';
        while (this.ch != null
                && this.ch.charCodeAt(0) >= 'A'.charCodeAt(0)
                && this.ch.charCodeAt(0) <= 'Z'.charCodeAt(0)) {
            label += this.ch;
            this.nextCh();
        }
        if (label === '') {
            throw new Error('Missing loop label');
        }

        // Check the number of letters in the loop label
        if (label.length > 2) {
            throw new Error(`Loop label too long: ${label}`);
        }

        // Check that we haven't seen the label before
        if (this.labelsUsed.has(label)) {
            throw new Error(`Duplicate loop label: ${label}`);
        }

        // Read the number of iterations
        let iterationsStr = '';
        while(this.ch != null
                && this.ch.charCodeAt(0) >= '0'.charCodeAt(0)
                && this.ch.charCodeAt(0) <= '9'.charCodeAt(0)) {
            iterationsStr += this.ch;
            this.nextCh();
        }
        if (iterationsStr === '') {
            throw new Error('Missing loop number of iterations');
        }

        const iterations = parseInt(iterationsStr, 10);

        // Check the number of iterations
        if (iterations > 99) {
            throw new Error(`Loop has too many iteraions: ${iterations}`);
        }

        // Check for terminating 's'
        if (this.ch !== 's') {
            throw new Error("Missing startLoop terminating 's'");
        }

        // Consume the terminating 's'
        this.nextCh();

        // Record the loop label
        this.labelsUsed.add(label);

        // Update highestLoopNumber as needed
        const loopNumber = parseLoopLabel(label);
        if (loopNumber > this.highestLoopNumber) {
            this.highestLoopNumber = loopNumber;
        }

        return {
            block: 'startLoop',
            iterations: iterations,
            label: label
        };
    }

    nextCh() {
        if (this.textIndex >= this.text.length) {
            this.ch = null;
        } else {
            this.ch = this.text.charAt(this.textIndex);
            this.textIndex += 1;
        }
    }
};
