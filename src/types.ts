export type i18n_generator_options = {
    template?: string;
    target: string;
    configFile?: string;
    config?: Record<string, any>;
    projects?: projects_definition;
    [key: string]: any;
}

export type projects_definition = Record<string, Omit<project_definition, 'name'>>;

export type project_definition = {
    name: string;
    translations?: translations_project_definition;
    index?: index_project_definition;
    config?: Record<string, any>;
}

export type translations_project_definition = {
    flat?: boolean;
    sort?: boolean;
    clean?: boolean;
    dir: string;
    file: string;
    locales: string[];
    master: string;
}

export type index_project_definition = {
    sort?: boolean;
    localePattern?: string;
    path: string;
    format: string;
    vars?: Record<string, any>;
}