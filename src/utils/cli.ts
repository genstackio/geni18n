import yargs from 'yargs/yargs';
import * as c1 from '../commands/generate';
import * as c2 from '../commands/list-locales';

export function cli(argv: string[]) {
    yargs(argv.slice(2))
        .command(c1)
        .command(c2)
        .argv
    ;
}

// noinspection JSUnusedGlobalSymbols
export default cli;