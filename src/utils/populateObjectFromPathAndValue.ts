export function populateObjectFromPathAndValue(o: any, p: string, v: string) {
    let oo = o;
    const parts = p.split(/\|\|\|/g);
    const lastPart = parts.pop();
    parts.forEach(x => {
        if (!oo[x]) oo[x] = {};
        oo = oo[x];
    })
    oo[lastPart!] = v;
    return o;
}

export default populateObjectFromPathAndValue;
