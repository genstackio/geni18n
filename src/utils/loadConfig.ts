import {i18n_generator_options} from '../types';
import * as configLoaders from '../config-loaders';

export async function loadConfig(dsn: any, options: i18n_generator_options): Promise<void> {
    if (!dsn) return;
    if ('object' === typeof dsn) Object.assign(options, dsn);
    if ('string' === typeof dsn) {
        const extension = dsn.replace(/^.+\.([^.]+)$/, '$1').toLowerCase();
        const configLoader = configLoaders[extension];
        if (!configLoader) throw new Error(`Unknown config file format '${extension}'`);
        try {
            Object.assign(options, await configLoader(dsn));
        } catch (e: any) {
            throw new Error(`Unable to load ${extension} config from '${dsn}': ${e.message}`);
        }
    }
}

export default loadConfig;