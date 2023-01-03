import {i18n_generator_options, project_definition} from "../types";
import processAll from "./processAll";
import loadProjectGenerator from "./loadProjectGenerator";

async function listProjectLocales(project: project_definition, options: any) {
    return (await loadProjectGenerator(project, options)).listLocales();
}

export async function listLocales(options: i18n_generator_options) {
    return processAll(options, listProjectLocales);
}

export default listLocales;