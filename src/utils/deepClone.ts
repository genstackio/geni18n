export function deepClone(a) {
    if (!a) return a;
    switch (typeof a) {
        case 'string': return a;
        case 'boolean': return a;
        case 'number': return a;
        case 'object':
            if (Array.isArray(a)) return a.map(x => deepClone(x));
            return Object.entries(a).reduce((acc, [k, v]) => {
                acc[k] = deepClone(v);
                return acc;
            }, {});
        default: return a;
    }
}

export default deepClone;
