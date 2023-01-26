import {i18n_generator_options} from "./types";

export interface II18nGenerator {
    generate(): Promise<void>;
    listLocales(): Promise<Record<string, { sourceLocales: string[]; targetLocales: string[] }>>;
    cleanKeys(keys: string[]): Promise<void>;
    getOptions(): i18n_generator_options;
}

export default II18nGenerator;