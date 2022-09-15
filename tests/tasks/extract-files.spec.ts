import { expect } from 'chai';
import path from 'path';

import { ExtractTask } from '../../src/cli/tasks/extract.task';
import { CompilerInterface } from '../../src/compilers/compiler.interface';
import { ServiceParser } from '../../src/parsers/service.parser.js';
import { NamespacedJsonCompiler } from '../../src/compilers/namespaced-json.compiler';
import { DirectiveParser } from '../../src/parsers/directive.parser';
import { PipeParser } from '../../src/parsers/pipe.parser';
import { normalizePaths } from '../../src/utils/fs-helpers';


describe('StringCollection', () => {

	it('should initialize with key/value pairs', () => {

        const patterns = ["/**/!(*.spec).{ts,html}"];

        const compiler: CompilerInterface = new NamespacedJsonCompiler();
          
        const inputs = ['./tests/'];
        const paths = normalizePaths(inputs, patterns)
        
        const outPath = ['./output.json'];
        const extractTask = new ExtractTask(paths, outPath)
        extractTask.setCompiler(compiler)
        
        extractTask.setParsers([new ServiceParser(), new DirectiveParser(), new PipeParser()])
        extractTask.print = false;
        const translations = extractTask.execute();
        expect(translations.values['Wubba Lubba Dub Dub']).to.be.equal('');
        expect(translations.values[' Test translate']).to.be.equal('');
        expect(Object.keys(translations.values).length).to.be.equal(5);
	});
});