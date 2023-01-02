import camelCase from "./camelCase";

export function getGeneratorClass(type: string) {
    return require(`${__dirname}/../generators/${camelCase(type)}I18nGenerator`).default;
}

export default getGeneratorClass;