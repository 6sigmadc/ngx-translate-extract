Object.defineProperty(exports, "__esModule", { value: true });
exports.cli = void 0;
const fs = require("fs");
const yargs = require("yargs");
const extract_task_1 = require("./tasks/extract.task");
const pipe_parser_1 = require("../parsers/pipe.parser");
const directive_parser_1 = require("../parsers/directive.parser");
const service_parser_1 = require("../parsers/service.parser");
const marker_parser_1 = require("../parsers/marker.parser");
const sort_by_key_post_processor_1 = require("../post-processors/sort-by-key.post-processor");
const key_as_default_value_post_processor_1 = require("../post-processors/key-as-default-value.post-processor");
const null_as_default_value_post_processor_1 = require("../post-processors/null-as-default-value.post-processor");
const purge_obsolete_keys_post_processor_1 = require("../post-processors/purge-obsolete-keys.post-processor");
const compiler_factory_1 = require("../compilers/compiler.factory");
const donate_1 = require("../utils/donate");
exports.cli = yargs
    .usage('Extract strings from files for translation.\nUsage: $0 [options]')
    .version(require(__dirname + '/../../package.json').version)
    .alias('version', 'v')
    .help('help')
    .alias('help', 'h')
    .option('input', {
    alias: 'i',
    describe: 'Paths you would like to extract strings from. You can use path expansion, glob patterns and multiple paths',
    default: [process.env.PWD],
    type: 'array',
    normalize: true,
    required: true
})
    .check(options => {
    options.input.forEach((dir) => {
        if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
            throw new Error(`The path you supplied was not found: '${dir}'`);
        }
    });
    return true;
})
    .option('patterns', {
    alias: 'p',
    describe: 'Extract strings from the following file patterns',
    type: 'array',
    default: ['/**/*.html', '/**/*.ts']
})
    .option('output', {
    alias: 'o',
    describe: 'Paths where you would like to save extracted strings. You can use path expansion, glob patterns and multiple paths',
    type: 'array',
    normalize: true,
    required: true
})
    .option('format', {
    alias: 'f',
    describe: 'Output format',
    default: 'json',
    type: 'string',
    choices: ['json', 'namespaced-json', 'pot']
})
    .option('format-indentation', {
    alias: 'fi',
    describe: 'Output format indentation',
    default: '\t',
    type: 'string'
})
    .option('replace', {
    alias: 'r',
    describe: 'Replace the contents of output file if it exists (Merges by default)',
    type: 'boolean'
})
    .option('sort', {
    alias: 's',
    describe: 'Sort strings in alphabetical order when saving',
    type: 'boolean'
})
    .option('clean', {
    alias: 'c',
    describe: 'Remove obsolete strings when merging',
    type: 'boolean'
})
    .option('key-as-default-value', {
    alias: 'k',
    describe: 'Use key as default value for translations',
    type: 'boolean'
})
    .option('null-as-default-value', {
    alias: 'n',
    describe: 'Use null as default value for translations',
    type: 'boolean'
})
    .option('servicename', {
    alias: 'sn',
    describe: 'Translate service name to be used',
    type: 'string'
})
    .option('methodname', {
    alias: 'mn',
    describe: 'Translate function name to be used',
    type: 'string'
})
    .conflicts('key-as-default-value', 'null-as-default-value')
    .exitProcess(true)
    .parse(process.argv);
const extractTask = new extract_task_1.ExtractTask(exports.cli.input, exports.cli.output, {
    replace: exports.cli.replace,
    patterns: exports.cli.patterns,
    custService: exports.cli.servicename,
    custMethod: exports.cli.methodname
});
const parsers = [new pipe_parser_1.PipeParser(), new directive_parser_1.DirectiveParser(), new service_parser_1.ServiceParser(), new marker_parser_1.MarkerParser()];
extractTask.setParsers(parsers);
const postProcessors = [];
if (exports.cli.clean) {
    postProcessors.push(new purge_obsolete_keys_post_processor_1.PurgeObsoleteKeysPostProcessor());
}
if (exports.cli.keyAsDefaultValue) {
    postProcessors.push(new key_as_default_value_post_processor_1.KeyAsDefaultValuePostProcessor());
}
else if (exports.cli.nullAsDefaultValue) {
    postProcessors.push(new null_as_default_value_post_processor_1.NullAsDefaultValuePostProcessor());
}
if (exports.cli.sort) {
    postProcessors.push(new sort_by_key_post_processor_1.SortByKeyPostProcessor());
}
extractTask.setPostProcessors(postProcessors);
const compiler = compiler_factory_1.CompilerFactory.create(exports.cli.format, {
    indentation: exports.cli.formatIndentation
});
extractTask.setCompiler(compiler);
extractTask.execute();
console.log(donate_1.donateMessage);
//# sourceMappingURL=cli.js.map