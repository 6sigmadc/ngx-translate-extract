import { ClassDeclaration, CallExpression } from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';

import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
import {
	findClassDeclarations,
	findClassPropertyByType,
	findPropertyCallExpressions,
	findMethodCallExpressions,
	getStringsFromExpression,
	findMethodParameterByType,
	findConstructorDeclaration
} from '../utils/ast-helpers';

const TRANSLATE_SERVICE_TYPE_REFERENCE = 'TranslateService';
const TRANSLATE_SERVICE_METHOD_NAMES: string[] = ['get', 'instant', 'stream'];

export class ServiceParser implements ParserInterface {
	public extract(source: string, filePath: string, custServiceName?: string, custMethodName?: string): TranslationCollection | null {
		const sourceFile = tsquery.ast(source, filePath);
		const serviceName = custServiceName ? custServiceName : TRANSLATE_SERVICE_TYPE_REFERENCE;
		if(custMethodName && custMethodName !== '' && TRANSLATE_SERVICE_METHOD_NAMES.findIndex(value => value===custMethodName) < 0) TRANSLATE_SERVICE_METHOD_NAMES.push(custMethodName);

		const classDeclarations = findClassDeclarations(sourceFile);
		if (!classDeclarations) {
			return null;
		}

		let collection: TranslationCollection = new TranslationCollection();

		classDeclarations.forEach((classDeclaration) => {
			const callExpressions = [
				...this.findConstructorParamCallExpressions(classDeclaration, serviceName, TRANSLATE_SERVICE_METHOD_NAMES),
				...this.findPropertyCallExpressions(classDeclaration, serviceName, TRANSLATE_SERVICE_METHOD_NAMES)
			];

			callExpressions.forEach((callExpression) => {
				const [firstArg] = callExpression.arguments;
				if (!firstArg) {
					return;
				}
				const strings = getStringsFromExpression(firstArg);
				collection = collection.addKeys(strings);
			});
		});
		return collection;
	}

	protected findConstructorParamCallExpressions(classDeclaration: ClassDeclaration, serviceName: string, methodNames: string[]): CallExpression[] {
		const constructorDeclaration = findConstructorDeclaration(classDeclaration);
		if (!constructorDeclaration) {
			return [];
		}
		const paramName = findMethodParameterByType(constructorDeclaration, serviceName);
		return findMethodCallExpressions(constructorDeclaration, paramName, methodNames);
	}

	protected findPropertyCallExpressions(classDeclaration: ClassDeclaration, serviceName: string, methodNames: string[]): CallExpression[] {
		const propName: string = findClassPropertyByType(classDeclaration, serviceName);
		if (!propName) {
			return [];
		}
		return findPropertyCallExpressions(classDeclaration, propName, methodNames);
	}
}
