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
        if (custMethodName)
            TRANSLATE_SERVICE_METHOD_NAMES.push(custMethodName);
        const classDeclarations = (0, ast_helpers_1.findClassDeclarations)(sourceFile);
        if (!classDeclarations) {
            return null;
        }
        let collection = new translation_collection_1.TranslationCollection();
        classDeclarations.forEach(classDeclaration => {
            const propName = (0, ast_helpers_1.findClassPropertyByType)(classDeclaration, serviceName);
            if (!propName) {
                return;
            }
            const callExpressions = (0, ast_helpers_1.findMethodCallExpressions)(classDeclaration, propName, TRANSLATE_SERVICE_METHOD_NAMES);
            callExpressions.forEach(callExpression => {
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
}
exports.ServiceParser = ServiceParser;
//# sourceMappingURL=service.parser.js.map