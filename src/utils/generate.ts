import {i18n_generator_options, project_definition} from "../types";
import processAll from "./processAll";
import mergeProjectWithCommonConfig from "./mergeProjectWithCommonConfig";
import loadProjectGenerator from "./loadProjectGenerator";

async function generateProject(project: project_definition, options: any) {
    project = mergeProjectWithCommonConfig(project, options.config?.common?.projects);
    return (await loadProjectGenerator(project, options)).generate();
}

export async function generate(options: i18n_generator_options) {
    return processAll(options, generateProject);
}

export default generate;