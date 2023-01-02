import yargs from 'yargs/yargs';
import * as c1 from '../commands/generate';

export function cli(argv: string[]) {
    yargs(argv.slice(2))
        .command(c1)
        .argv
    ;
}

// noinspection JSUnusedGlobalSymbols
export default cli;