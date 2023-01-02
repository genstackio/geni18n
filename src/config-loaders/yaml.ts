import {resolve} from "path";
import YAML from "yaml";
import {readFileSync} from "fs";

export function yaml(path: string) {
    return YAML.parse(readFileSync(resolve(path), 'utf-8'));
}

export const yml = yaml;

// noinspection JSUnusedGlobalSymbols
export default yaml;