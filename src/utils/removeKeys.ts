import removeKey from "./removeKey";

export function removeKeys(o: any, keys: string[]) {
    keys.forEach(k => removeKey(o, k));

    return o;
}

export default removeKeys;