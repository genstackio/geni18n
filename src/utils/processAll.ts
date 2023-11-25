import loadConfig from "./loadConfig";
import {i18n_generator_options, project_definition} from "../types";
import mergeProjectWithCommonConfig from "./mergeProjectWithCommonConfig";
import {chunkize} from "@ohoareau/array";

export async function processAll<T = any>(options: i18n_generator_options, processor: (project: project_definition, options: i18n_generator_options) => Promise<T>) {
    options.config && await loadConfig(options.config, options);

    const {projects: projectsMap = {}} = options;
    const projects = Object.entries(projectsMap).reduce((acc, [k, v]: [string, Omit<project_definition, 'name'>]) => {
        v = v || {}; // in case project is `<projectName>: ~`
        acc.push({name: k, ...v, config: {...(options.config || {}), ...(v.config || {})}});
        return acc;
    }, [] as project_definition[]);

    const reports = await chunkize(projects, 3).reduce(async (acc, chunk) => {
        const localAcc = await acc;
        const results = await Promise.allSettled(chunk.map(async (project: project_definition) =>
            processor(
                mergeProjectWithCommonConfig(project, options.config?.common?.projects),
                options
            )
        ));
        return [...localAcc, ...results];
    }, Promise.resolve([] as any[]));

    const {successes, failures} = reports.reduce((acc: any, r: any, index: number) => {
        if (r.status === 'fulfilled') acc.successes[projects[index].name] = r.value;
        else acc.failures[projects[index].name] = r.reason;
        return acc;
    }, {successes: {}, failures: {}});

    if (Object.keys(failures).length) {
        Object.entries(failures).forEach(([projectName, failure]: [string, any]) => {
            console.error(`[${projectName}] error: ${failure.message}`);
        });
        throw new Error(`Error(s) in i18n processing for project(s): ${Object.keys(failures).join(', ')}`);
    }

    return successes;
}

export default processAll;