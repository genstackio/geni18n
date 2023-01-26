import buildAvailableGenerators from "../utils/buildAvailableGenerators";
import cleanKeys from "../utils/cleanKeys";

export const command = ['clean-keys <project>'];

export const describe = 'clean keys'

export const builder = {
    config: {
        default: '<target>/.i18ngen.yml',
    },
    target: {
        default: '.',
    },
    project: {

    },
    keys: {

    }
}

export const handler = async argv => {
    const keys = (argv.keys || '').length ? (argv.keys || '').split(/\s*,\s*/g) : [];
    await cleanKeys({keys, project: argv.project}, {
        config: ('string' === typeof argv.config) ? argv.config.replace('<target>', argv.target) : argv.config,
        target: argv.target,
        availableI18nGenerators: buildAvailableGenerators(['genstackio']),
    });
}