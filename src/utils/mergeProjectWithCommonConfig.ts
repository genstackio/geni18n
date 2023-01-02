import {project_definition} from "../types";
import deepMerge from "./deepMerge";

export function mergeProjectWithCommonConfig(project: project_definition, common: any) {
    return deepMerge(project, common);
}

export default mergeProjectWithCommonConfig;