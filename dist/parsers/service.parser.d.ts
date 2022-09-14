import { ClassDeclaration, CallExpression } from 'typescript';
import { ParserInterface } from './parser.interface.js';
import { TranslationCollection } from '../utils/translation.collection.js';
export declare class ServiceParser implements ParserInterface {
    extract(source: string, filePath: string, custServiceName?: string, custMethodName?: string): TranslationCollection | null;
    protected findConstructorParamCallExpressions(classDeclaration: ClassDeclaration): CallExpression[];
    protected findPropertyCallExpressions(classDeclaration: ClassDeclaration, serviceName: string): CallExpression[];
}
