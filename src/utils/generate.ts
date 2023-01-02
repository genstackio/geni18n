import loadConfig from "./loadConfig";
import {i18n_generator_options, project_definition} from "../types";
import {generateProject} from "./generateProject";

export async function generate(options: i18n_generator_options) {
    options.config && await loadConfig(options.config, options);

    const {projects: projectsMap = {}} = options;
    const projects = Object.entries(projectsMap).reduce((acc, [k, v]: [string, Omit<project_definition, 'name'>]) => {
        v = v || {}; // in case project is `<projectName>: ~`
        acc.push({name: k, ...v, config: {...(options.config || {}), ...(v.config || {})}});
        return acc;
    }, [] as project_definition[]);

    const reports = await Promise.allSettled(projects.map(async (project: project_definition) =>
        generateProject(project, options)
    ));

    const {successes, failures} = reports.reduce((acc: any, r: any, index: number) => {
        if (r.status === 'fulfilled') acc.successes[projects[index].name] = r.value;
        else acc.failures[projects[index].name] = r.reason;
        return acc;
    }, {successes: {}, failures: {}});

    if (Object.keys(failures).length) {
        Object.entries(failures).forEach(([projectName, failure]: [string, any]) => {
            console.error(`[${projectName}] error: ${failure.message}`);
        });
        throw new Error(`Error(s) in i18n generation for project(s): ${Object.keys(failures).join(', ')}`);
    }

    return successes;
}

export default generate;