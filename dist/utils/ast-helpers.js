Object.defineProperty(exports, "__esModule", { value: true });
exports.getStringsFromExpression = exports.findMethodCallExpressions = exports.findFunctionCallExpressions = exports.findClassPropertyDeclarationByType = exports.findClassPropertyConstructorParameterByType = exports.findClassPropertyByType = exports.findClassDeclarations = exports.getNamedImportAlias = exports.getNamedImports = void 0;
const tsquery_1 = require("@phenomnomnominal/tsquery");
const typescript_1 = require("typescript");
function getNamedImports(node, moduleName) {
    const query = `ImportDeclaration[moduleSpecifier.text="${moduleName}"] NamedImports`;
    return (0, tsquery_1.tsquery)(node, query);
}
exports.getNamedImports = getNamedImports;
function getNamedImportAlias(node, moduleName, importName) {
    const [namedImportNode] = getNamedImports(node, moduleName);
    if (!namedImportNode) {
        return null;
    }
    const query = `ImportSpecifier:has(Identifier[name="${importName}"]) > Identifier`;
    const identifiers = (0, tsquery_1.tsquery)(namedImportNode, query);
    if (identifiers.length === 1) {
        return identifiers[0].text;
    }
    if (identifiers.length > 1) {
        return identifiers[identifiers.length - 1].text;
    }
    return null;
}
exports.getNamedImportAlias = getNamedImportAlias;
function findClassDeclarations(node) {
    const query = 'ClassDeclaration';
    return (0, tsquery_1.tsquery)(node, query);
}
exports.findClassDeclarations = findClassDeclarations;
function findClassPropertyByType(node, type) {
    return findClassPropertyConstructorParameterByType(node, type) || findClassPropertyDeclarationByType(node, type);
}
exports.findClassPropertyByType = findClassPropertyByType;
function findClassPropertyConstructorParameterByType(node, type) {
    const query = `Constructor Parameter:has(TypeReference > Identifier[name="${type}"]):has(PublicKeyword,ProtectedKeyword,PrivateKeyword) > Identifier`;
    const [result] = (0, tsquery_1.tsquery)(node, query);
    if (result) {
        return result.text;
    }
    return null;
}
exports.findClassPropertyConstructorParameterByType = findClassPropertyConstructorParameterByType;
function findClassPropertyDeclarationByType(node, type) {
    const query = `PropertyDeclaration:has(TypeReference > Identifier[name="${type}"]) > Identifier`;
    const [result] = (0, tsquery_1.tsquery)(node, query);
    if (result) {
        return result.text;
    }
    return null;
}
exports.findClassPropertyDeclarationByType = findClassPropertyDeclarationByType;
function findFunctionCallExpressions(node, fnName) {
    if (Array.isArray(fnName)) {
        fnName = fnName.join('|');
    }
    const query = `CallExpression:has(Identifier[name="${fnName}"]):not(:has(PropertyAccessExpression))`;
    const nodes = (0, tsquery_1.tsquery)(node, query);
    return nodes;
}
exports.findFunctionCallExpressions = findFunctionCallExpressions;
function findMethodCallExpressions(node, prop, fnName) {
    if (Array.isArray(fnName)) {
        fnName = fnName.join('|');
    }
    const query = `CallExpression > PropertyAccessExpression:has(Identifier[name=/^(${fnName})$/]):has(PropertyAccessExpression:has(Identifier[name="${prop}"]):has(ThisKeyword))`;
    const nodes = (0, tsquery_1.tsquery)(node, query).map(n => n.parent);
    return nodes;
}
exports.findMethodCallExpressions = findMethodCallExpressions;
function getStringsFromExpression(expression) {
    if ((0, typescript_1.isStringLiteralLike)(expression)) {
        return [expression.text];
    }
    if ((0, typescript_1.isArrayLiteralExpression)(expression)) {
        return expression.elements.reduce((result, element) => {
            const strings = getStringsFromExpression(element);
            return [...result, ...strings];
        }, []);
    }
    if ((0, typescript_1.isBinaryExpression)(expression)) {
        const [left] = getStringsFromExpression(expression.left);
        const [right] = getStringsFromExpression(expression.right);
        if (expression.operatorToken.kind === typescript_1.SyntaxKind.PlusToken) {
            if (typeof left === 'string' && typeof right === 'string') {
                return [left + right];
            }
        }
        if (expression.operatorToken.kind === typescript_1.SyntaxKind.BarBarToken) {
            const result = [];
            if (typeof left === 'string') {
                result.push(left);
            }
            if (typeof right === 'string') {
                result.push(right);
            }
            return result;
        }
    }
    if ((0, typescript_1.isConditionalExpression)(expression)) {
        const [whenTrue] = getStringsFromExpression(expression.whenTrue);
        const [whenFalse] = getStringsFromExpression(expression.whenFalse);
        const result = [];
        if (typeof whenTrue === 'string') {
            result.push(whenTrue);
        }
        if (typeof whenFalse === 'string') {
            result.push(whenFalse);
        }
        return result;
    }
    return [];
}
exports.getStringsFromExpression = getStringsFromExpression;
//# sourceMappingURL=ast-helpers.js.map