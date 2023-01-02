import {project_definition} from "../types";
import deepMerge from "./deepMerge";
import deepReplace from "./deepReplace";

export function mergeProjectWithCommonConfig(project: project_definition, common: any) {
    return deepMerge(project, deepReplace(common, (s: string) => s.replace(/\{\{project}}/g, project.name)));
}

export default mergeProjectWithCommonConfig;