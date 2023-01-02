export function deepSort(a: any) {
    if (!a) return a;
    switch (typeof a) {
        case 'string': return a;
        case 'object':
            if (Array.isArray(a)) {
                a.sort((aa, bb) => (('string' === typeof aa) && ('string' === typeof bb)) ? (aa > bb ? 1 : (aa < bb ? -1 : 0)) : 0);
                return a;
            }
            const keys = Object.keys(a);
            keys.sort();

            return keys.reduce((acc, k) => {
                acc[k] = deepSort(a[k])
                return acc;
            }, {});
        default: return a;
    }
}

export default deepSort;