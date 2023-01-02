import getGeneratorClass from "./getGeneratorClass";

export function buildAvailableGenerators(types: string[]) {
    const defaultType = types[0];
    return {
        default: getGeneratorClass(defaultType),
        ...types.reduce((acc, t: string) => {
            acc[t] = getGeneratorClass(t);
            return acc;
        }, {} as any),
    };
}

// noinspection JSUnusedGlobalSymbols
export default buildAvailableGenerators;