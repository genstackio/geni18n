import {generate} from '../utils/generate';
import buildAvailableGenerators from "../utils/buildAvailableGenerators";

export const command = ['generate', '$0'];

export const describe = 'generate specified i18n translations files in the specified target directory'

export const builder = {
    config: {
        default: '<target>/.i18ngen.yml',
    },
    target: {
        default: '.',
    }
}

export const handler = async argv => {
    await generate({
        config: ('string' === typeof argv.config) ? argv.config.replace('<target>', argv.target) : argv.config,
        target: argv.target,
        availableI18nGenerators: buildAvailableGenerators(['genstackio']),
    });
}