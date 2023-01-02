export function camelCase(s: string) {
    return `${s.slice(0, 1).toUpperCase()}${s.slice(1)}`;
}

export default camelCase;
