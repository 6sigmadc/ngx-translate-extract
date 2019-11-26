import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
export declare class PipeParser implements ParserInterface {
    extract(source: string, filePath: string): TranslationCollection | null;
    protected parseTemplate(template: string): TranslationCollection;
}
