import * as deepl from 'deepl-node';
import {SourceLanguageCode, TargetLanguageCode} from "deepl-node";
import unprepareParams from "../utils/unprepareParams";
import prepareParams from "../utils/prepareParams";

const translators: Record<string, deepl.Translator> = {};

let sourceLanguages: Record<string, Record<string, true>> = {};
let targetLanguages: Record<string, Record<string, true>> = {};

async function getTranslator({authKey, serverUrl}: any): Promise<[deepl.Translator, Record<string, true>, Record<string, true>]> {
    if (!translators[authKey]) {
        const options = serverUrl ? {serverUrl} : undefined;
        const t = new deepl.Translator(authKey, options);
        sourceLanguages[authKey] = (await t.getSourceLanguages()).reduce((acc, l) => Object.assign(acc, {[l.code]: true}), {});
        targetLanguages[authKey] = (await t.getTargetLanguages()).reduce((acc, l) => Object.assign(acc, {[l.code]: true}), {});
        translators[authKey] = t;
    }
    return [translators[authKey], sourceLanguages[authKey], targetLanguages[authKey]];
}

function mapSourceLocale(locale: string, sl: Record<string, true>): SourceLanguageCode {
    const l = locale.replace('_', '-');
    if (sl[l]) return l as SourceLanguageCode;
    const [ll] = l.split('-');
    if (sl[ll]) return ll as SourceLanguageCode;
    throw new Error(`Unsupported source locale '${locale}' (available: ${Object.keys(sl).join(', ')}`);
}

function mapTargetLocale(locale: string, tl: Record<string, true>): TargetLanguageCode {
    const l = locale.replace('_', '-');
    if (tl[l]) return l as TargetLanguageCode;
    const [ll] = l.split('-');
    if (tl[ll]) return ll as TargetLanguageCode;
    throw new Error(`Unsupported target locale '${locale}' (available: ${Object.keys(tl).join(', ')}`);
}

function mapTextToTranslatableText(t: string) {
    return prepareParams(t);
}
function mapTextToTranslatedText(t: string) {
    return unprepareParams(t);
}
async function translate(texts: string[], from: string, to: string, config: any) {
    const [t, sl, tl] = await getTranslator(config);

    return (await t.translateText(
        texts.map(mapTextToTranslatableText),
        mapSourceLocale(from, sl),
        mapTargetLocale(to, tl),
        {tagHandling: 'xml', ignoreTags: ['X']}
    )).map(x => mapTextToTranslatedText(x.text));
}

export default translate;