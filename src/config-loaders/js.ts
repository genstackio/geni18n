import {resolve} from "path";

export function js(path: string) {
    const o = require(resolve(path));

    return (o && o.default) ? o.default : o;
}

// noinspection JSUnusedGlobalSymbols
export default js;