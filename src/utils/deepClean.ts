export function deepClean(a: any, b: any) {
    if (!a) return a;
    switch (typeof a) {
        case 'string': return a;
        case 'object':
            if (Array.isArray(a)) return a.map((aa: any, index:number) => deepClean(aa, b[index]));
            if ('object' !== typeof b) return {};
            return Object.entries(a).reduce((acc, [k, v]) => {
                if ('undefined' === typeof b[k]) return acc;
                acc[k] = deepClean(v, b[k]);
                return acc;
            }, {});
        default: return a;
    }
}

export default deepClean;