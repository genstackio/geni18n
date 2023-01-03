import AbstractI18nGenerator from "../AbstractI18nGenerator";
import {
    i18n_generator_options, index_project_definition,
    project_definition,
    translations_project_definition
} from "../types";
import fs from 'fs';
import ejs from 'ejs';
import path from 'path';
import {TranslatorService} from "@genstackio/translator";
import {deepSort} from "@genstackio/deep";
import DeeplPlugin from "@genstackio/translator-deepl";
import {AmazonTranslatePlugin} from "@genstackio/translator-amazontranslate";
import ITranslatorService from "@genstackio/translator/lib/ITranslatorService";

export class GenstackioI18nGenerator extends AbstractI18nGenerator {
    protected readonly translator: ITranslatorService;
    constructor(project: project_definition, options: i18n_generator_options) {
        super(project, options);
        this.translator = this.createTranslator();
    }
    async listLocales(): Promise<Record<string, { sourceLocales: string[]; targetLocales: string[] }>> {
        const options = this.getOptions();
        return this.translator.listLocales(options?.config || {});
    }
    async generate(): Promise<void> {
        const project = this.getProject();
        const options = this.getOptions();

        if (!project.translations) throw new Error(`No project translations configuration`);

        const masterKeys = await this.fetchMasterTranslation(project.translations);
        const generatedLocales = (project.translations.locales || []).filter(l => l !== project.translations!.master);

        const reports = await Promise.allSettled(generatedLocales.map(async (locale) =>
            this.generateProjectLocale(locale, project.translations!.master, masterKeys, project, options)
        ));

        await this.saveTranslationFile(project.translations!, project.translations.master, masterKeys);

        const {failures} = reports.reduce((acc: any, r: any, index: number) => {
            if (r.status === 'fulfilled') acc.successes[generatedLocales[index]] = r.value;
            else acc.failures[generatedLocales[index]] = r.reason;
            return acc;
        }, {successes: {}, failures: {}});

        project.index && await this.saveIndexFile(project.index, project.translations.locales);

        if (Object.keys(failures).length) {
            Object.entries(failures).forEach(([locale, failure]: [string, any]) => {
                console.error(`[${project.name}] [${locale}] error: ${failure.message}`);
            });
            throw new Error(`Error(s) in i18n generation for project '${project.name}' and locales: ${Object.keys(failures).join(', ')}`);
        }
    }
    protected getLocaleTranslationFilePath(dir: string, file: string, locale: string) {
        return `${path.resolve(dir)}/${file.replace('%locale%', locale)}`;
    }
    protected async fetchMasterTranslation(def: translations_project_definition) {
        return this.fetchTranslationFile(def, def.master);
    }
    protected async fetchTranslationFile(def: translations_project_definition, locale: string) {
        const p = this.getLocaleTranslationFilePath(def.dir, def.file, locale);
        return fs.existsSync(p) ? require(p) : {};
    }
    protected async generateProjectLocale(locale: string, masterLocale: string, masterKeys: any, project: project_definition, options: i18n_generator_options) {
        await this.saveTranslationFile(
            project.translations!,
            locale,
            await this.translator.translateI18n(
                await this.fetchTranslationFile(project.translations!, locale),
                masterKeys,
                masterLocale,
                locale,
                options.config,
                project.translations
            )
        );
    }
    // noinspection JSUnusedLocalSymbols
    protected async saveTranslationFile(def: translations_project_definition, locale: string, updatedLocaleKeys: any) {
        if (def.sort) {
            updatedLocaleKeys = deepSort(updatedLocaleKeys);
        }
        fs.writeFileSync(this.getLocaleTranslationFilePath(def.dir, def.file, locale), JSON.stringify(updatedLocaleKeys, null, 4));
    }
    protected async saveIndexFile(def: index_project_definition, locales: string[]) {
        if (!def || !def.path) return;

        const vars = def.vars;

        if (def.sort) {
            locales.sort();
        }

        const localePattern = def.localePattern || '{{lg}}-{{CC}}';

        const localeMap = locales.reduce((acc, l) => {
            const [lg, CC] = l.split('_');
            acc[l] = localePattern
                .replace('{{lg}}', lg)
                .replace('{{LG}}', lg.toUpperCase())
                .replace('{{cc}}', CC.toLowerCase())
                .replace('{{CC}}', CC)
            ;
            return acc;
        }, {});
        const x = await ejs.render(fs.readFileSync(`${__dirname}/../../resources/templates/genstackio/index.ts.ejs`, 'utf-8'), {...(vars || {}), locales, localeMap});
        fs.writeFileSync(path.resolve(def.path), x);
    }
    protected createTranslator(): ITranslatorService {
        const t = new TranslatorService();
        t.registerPlugin('deepl', new DeeplPlugin(), {'*': 10});
        t.registerPlugin('amazontranslate', new AmazonTranslatePlugin(), {'*': 1});

        return t;
    }
}

// noinspection JSUnusedGlobalSymbols
export default GenstackioI18nGenerator;