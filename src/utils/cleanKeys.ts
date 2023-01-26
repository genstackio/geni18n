import {i18n_generator_options, project_definition} from "../types";
import processOne from "./processOne";
import loadProjectGenerator from "./loadProjectGenerator";

async function cleanProjectLocales(project: project_definition, keys: string[], options: any) {
    return (await loadProjectGenerator(project, options)).cleanKeys(keys);
}

export async function cleanKeys({keys, project}: {keys: string[], project: string}, options: i18n_generator_options) {
    return processOne(project, options, async (project: project_definition, options: any) => cleanProjectLocales(project, keys, options));
}

export default cleanKeys;