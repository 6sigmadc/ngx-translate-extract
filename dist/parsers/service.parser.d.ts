import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
export declare class ServiceParser implements ParserInterface {
    extract(source: string, filePath: string, custServiceName?: string, custMethodName?: string): TranslationCollection | null;
}
