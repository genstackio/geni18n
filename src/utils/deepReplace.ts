export function deepReplace(a: any, replacerFn: (s: string) => string) {
    if (!a) return a;
    switch (typeof a) {
        case 'string': return replacerFn(a);
        case 'object':
            if (Array.isArray(a)) return a.map(aa => deepReplace(aa, replacerFn));
            return Object.entries(a).reduce((acc, [k, v]) => {
                acc[replacerFn(k)] = deepReplace(v, replacerFn);
                return acc;
            }, {});
        default: return a;
    }
}

export default deepReplace;