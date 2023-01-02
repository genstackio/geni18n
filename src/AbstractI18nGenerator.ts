import II18nGenerator from './II18nGenerator';
import {i18n_generator_options} from "./types";

export abstract class AbstractI18nGenerator implements II18nGenerator {
    protected options: i18n_generator_options;
    protected constructor(options: i18n_generator_options) {
        this.options = options;
    }
    getOptions(): i18n_generator_options {
        return this.options;
    }
    async generate(): Promise<void> {
        console.log("todo");
    }
}

// noinspection JSUnusedGlobalSymbols
export default AbstractI18nGenerator;