export function prepareParams(a: string) {
    return a.replace(/(\{\{([a-z0-9_]+)\}\})/gi, (match, p1, p2) => `<X>${p2}</X>`);
}

export default prepareParams;
