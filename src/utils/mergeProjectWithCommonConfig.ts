import {project_definition} from "../types";
import {deepMerge, deepReplace} from "@genstackio/deep";

export function mergeProjectWithCommonConfig(project: project_definition, common: any) {
    return deepMerge(project, deepReplace(common, (s: string) => s.replace(/\{\{project}}/g, project.name)));
}

export default mergeProjectWithCommonConfig;