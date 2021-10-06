Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceParser = void 0;
const tsquery_1 = require("@phenomnomnominal/tsquery");
const translation_collection_1 = require("../utils/translation.collection");
const ast_helpers_1 = require("../utils/ast-helpers");
const TRANSLATE_SERVICE_TYPE_REFERENCE = 'TranslateService';
const TRANSLATE_SERVICE_METHOD_NAMES = ['get', 'instant', 'stream'];
class ServiceParser {
    extract(source, filePath, custServiceName, custMethodName) {
        const sourceFile = tsquery_1.tsquery.ast(source, filePath);
        const serviceName = custServiceName ? custServiceName : TRANSLATE_SERVICE_TYPE_REFERENCE;
        if (custMethodName && custMethodName !== '' && TRANSLATE_SERVICE_METHOD_NAMES.findIndex(value => value === custMethodName) < 0)
            TRANSLATE_SERVICE_METHOD_NAMES.push(custMethodName);
        const classDeclarations = (0, ast_helpers_1.findClassDeclarations)(sourceFile);
        if (!classDeclarations) {
            return null;
        }
        let collection = new translation_collection_1.TranslationCollection();
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
                const strings = (0, ast_helpers_1.getStringsFromExpression)(firstArg);
                collection = collection.addKeys(strings);
            });
        });
        return collection;
    }
    findConstructorParamCallExpressions(classDeclaration, serviceName, methodNames) {
        const constructorDeclaration = (0, ast_helpers_1.findConstructorDeclaration)(classDeclaration);
        if (!constructorDeclaration) {
            return [];
        }
        const paramName = (0, ast_helpers_1.findMethodParameterByType)(constructorDeclaration, serviceName);
        return (0, ast_helpers_1.findMethodCallExpressions)(constructorDeclaration, paramName, methodNames);
    }
    findPropertyCallExpressions(classDeclaration, serviceName, methodNames) {
        const propName = (0, ast_helpers_1.findClassPropertyByType)(classDeclaration, serviceName);
        if (!propName) {
            return [];
        }
        return (0, ast_helpers_1.findPropertyCallExpressions)(classDeclaration, propName, methodNames);
    }
}
exports.ServiceParser = ServiceParser;
//# sourceMappingURL=service.parser.js.map