export function prepareParams(a: string) {
    return a.replace(/(<X>([a-z0-9_]+)<\/X>)/gi, (match, p1, p2) => `{{${p2}}}`);
}

export default prepareParams;
