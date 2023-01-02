import loadConfig from "./loadConfig";
import loadGenerator from "./loadGenerator";

export async function generate(options: any) {
    options.config && await loadConfig(options.config, options);

    return (await loadGenerator(options)).generate();
}

export default generate;