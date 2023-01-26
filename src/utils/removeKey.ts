export function removeKey(o: any, key: string) {
    const [a, ...others] = key.split(/\./g);

    if (!others.length) delete o[a];

    if (!!o[a] && ('object' === typeof o[a])) removeKey(o[a], others.join('.'));
}

export default removeKey;