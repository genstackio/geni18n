import loadProjectGenerator from "./loadProjectGenerator";
import {project_definition} from "../types";
import mergeProjectWithCommonConfig from "./mergeProjectWithCommonConfig";

export async function generateProject(project: project_definition, options: any) {
    project = mergeProjectWithCommonConfig(project, options.config?.common?.projects);
    return (await loadProjectGenerator(project, options)).generate();
}

export default generateProject;