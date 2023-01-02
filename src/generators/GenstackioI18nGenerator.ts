import AbstractI18nGenerator from "../AbstractI18nGenerator";
import {
    i18n_generator_options, index_project_definition,
    project_definition,
    translatable_item,
    translated_item,
    translations_project_definition
} from "../types";
import path from 'path';
import fs from 'fs';
import {translate} from "../services/translator";
import ejs from 'ejs';
import deepClone from "../utils/deepClone";
import populateObjectFromPathAndValue from "../utils/populateObjectFromPathAndValue";

export abstract class GenstackioI18nGenerator extends AbstractI18nGenerator {
    async generate(): Promise<void> {
        const project = this.getProject();
        const options = this.getOptions();

        if (!project.translations) throw new Error(`No project translations configuration`);

        const masterKeys = await this.fetchMasterTranslation(project.translations);
        const generatedLocales = (project.translations.locales || []).filter(l => l !== project.translations!.master);

        const reports = await Promise.allSettled(generatedLocales.map(async (locale) =>
            this.generateProjectLocale(locale, project.translations!.master, masterKeys, project, options)
        ));

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
        const localeKeys = await this.fetchTranslationFile(project.translations!, locale);
        const translatableKeys = await this.computeTranslatableKeys(masterKeys, localeKeys);
        const translatedKeys = await this.translateTranslatableKeys(translatableKeys, masterLocale, locale, options.config);
        const updatedLocaleKeys = await this.mergeTranslatedKeysIntoLocaleKeys(translatedKeys, localeKeys);
        await this.saveTranslationFile(project.translations!, locale, updatedLocaleKeys);
    }
    protected async computeTranslatableKeys(aKeys, bKeys) {
        return Object.entries(aKeys).reduce((acc, [k, v]: [string, any]) => {
            acc[k] = Object.entries(v).reduce((acc2, [kk, vv]) => {
                if (bKeys && bKeys[k] && bKeys[k][kk]) return acc2;
                acc2[kk] = vv;
                return acc2;
            }, {});
            if (!Object.keys(acc[k]).length) delete acc[k];
            return acc;
        }, {});
    }
    protected convertTranslatedItemsToKeys(items: translated_item[]) {
        return items.reduce((acc, item) => {
            return populateObjectFromPathAndValue(acc, item.item.path, item.translation)
        }, {});
    }
    protected convertKeysToTranslatableItems(keys: Record<string, any>) {
        return Object.entries(keys).reduce((acc, [k, v]: [string, any]) => {
            return Object.entries(v as Record<string, any>).reduce((acc2, [kk, vv]: [string, string]) => {
                acc2.push({text: vv, path: `${k}|||${kk}`});
                return acc2;
            }, acc) as any;
        }, [] as translatable_item[]);
    }
    protected async translateTranslatableKeys(translatableKeys, sourceLocale, targetLocale, config?: any) {
        return this.convertTranslatedItemsToKeys(await translate(this.convertKeysToTranslatableItems(translatableKeys), sourceLocale, targetLocale, config));
    }
    protected async mergeTranslatedKeysIntoLocaleKeys(translatedKeys, localeKeys) {
        return Object.entries(translatedKeys).reduce((acc, [k, v]: [string, any]) => {
            if (!acc[k]) acc[k] = {};
            acc[k] = Object.entries(v).reduce((acc2, [kk, vv]) => {
                acc2[kk] = vv;
                return acc2;
            }, acc[k]);
            return acc;
        }, deepClone(localeKeys));
    }
    // noinspection JSUnusedLocalSymbols
    protected async saveTranslationFile(def: translations_project_definition, locale: string, updatedLocaleKeys: any) {
        fs.writeFileSync(this.getLocaleTranslationFilePath(def.dir, def.file, locale), JSON.stringify(updatedLocaleKeys, null, 4));
    }
    protected async saveIndexFile(def: index_project_definition, locales: string[]) {
        if (!def || !def.path) return;

        const vars = def.vars;

        const x = await ejs.render(fs.readFileSync(`${__dirname}/../../resources/templates/genstackio/index.ts.ejs`, 'utf-8'), {...(vars || {}), locales});
        fs.writeFileSync(path.resolve(def.path), x);
    }
}

// noinspection JSUnusedGlobalSymbols
export default GenstackioI18nGenerator;