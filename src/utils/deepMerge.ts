export function deepMerge(a: any, b: any) {
    // destructive deep merge
    return Object.entries(b || {}).reduce((acc, [k, v]) => {
        if (!a[k]) {
            if (Array.isArray(v)) {
                a[k] = v;
            } else if ('object' === typeof v) {
                a[k] = deepMerge({}, v);
            } else {
                a[k] = v;
            }
            return acc;
        }
        if (Array.isArray(a[k])) return acc;
        if (('object' === typeof a[k]) && ('object' === typeof v)) {
            a[k] = deepMerge(a[k], v);
        }
        return acc;
    }, a);
}

export default deepMerge;
