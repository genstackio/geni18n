import {resolve} from "path";

export function json(path: string) {
    return require(resolve(path));
}

// noinspection JSUnusedGlobalSymbols
export default json;