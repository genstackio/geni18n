import {i18n_generator_options, project_definition} from '../types';
import II18nGenerator from "../II18nGenerator";

export async function loadProjectGenerator(project: project_definition, options: i18n_generator_options): Promise<II18nGenerator> {
    const {template = 'default', availableI18nGenerators = {}} = options;

    const tries: string[] = [
        ('default' !== template) && !!template && template.replace(/-/g, '_'),
        'default',
    ].filter(x => !!x) as string[];

    const name = tries.find((k: string) => !!availableI18nGenerators[k]);

    if (!name) throw new Error(`Unknown i18n generator '${template}'`);

    const g = availableI18nGenerators[name];

    const generator = new g(project, options);

    if (('undefined' === typeof generator.generate) || ('undefined' === typeof generator.getOptions)) {
        throw new Error(`Generator (name: ${name}, class: ${g}) is not an instance of II18nGenerator`);
    }

    return generator;
}

// noinspection JSUnusedGlobalSymbols
export default loadProjectGenerator;