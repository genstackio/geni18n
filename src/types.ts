export type i18n_generator_options = {
    template: string;
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
    dir: string;
    file: string;
    locales: string[];
    master: string;
}

export type index_project_definition = {
    path: string;
    format: string;
    vars?: Record<string, any>;
}

export type translatable_item = {
    text: string;
    path: string;
}

export type translated_item = {
    translation: string;
    item: translatable_item;
}