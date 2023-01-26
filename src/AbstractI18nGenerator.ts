import II18nGenerator from './II18nGenerator';
import {i18n_generator_options, project_definition} from "./types";

export abstract class AbstractI18nGenerator implements II18nGenerator {
    protected project: project_definition;
    protected options: i18n_generator_options;
    protected constructor(project: project_definition, options: i18n_generator_options) {
        this.project = project;
        this.options = options;
    }
    getProject(): project_definition {
        return this.project;
    }
    getOptions(): i18n_generator_options {
        return this.options;
    }
    async listLocales(): Promise<Record<string, { sourceLocales: string[]; targetLocales: string[] }>> {
        return {};
    }
    abstract cleanKeys(keys: string[]): Promise<void>;
    async generate(): Promise<void> {
    }
}

// noinspection JSUnusedGlobalSymbols
export default AbstractI18nGenerator;