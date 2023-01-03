import buildAvailableGenerators from "../utils/buildAvailableGenerators";
import listLocales from "../utils/listLocales";

export const command = ['list-locales'];

export const describe = 'list available locales'

export const builder = {
    config: {
        default: '<target>/.i18ngen.yml',
    },
    target: {
        default: '.',
    }
}

export const handler = async argv => {
    console.log(JSON.stringify(await listLocales({
        config: ('string' === typeof argv.config) ? argv.config.replace('<target>', argv.target) : argv.config,
        target: argv.target,
        availableI18nGenerators: buildAvailableGenerators(['genstackio']),
    }), null, 4));
}