Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectiveParser = void 0;
const translation_collection_1 = require("../utils/translation.collection");
const utils_1 = require("../utils/utils");
const compiler_1 = require("@angular/compiler");
class DirectiveParser {
    extract(source, filePath) {
        if (filePath && (0, utils_1.isPathAngularComponent)(filePath)) {
            source = (0, utils_1.extractComponentInlineTemplate)(source);
        }
        let collection = new translation_collection_1.TranslationCollection();
        const nodes = this.parseTemplate(source, filePath);
        this.getTranslatableElements(nodes).forEach(element => {
            const key = this.getElementTranslateAttrValue(element) || this.getElementContents(element);
            collection = collection.add(key);
        });
        return collection;
    }
    getTranslatableElements(nodes) {
        return nodes
            .filter(element => this.isElement(element))
            .reduce((result, element) => {
            return result.concat(this.findChildrenElements(element));
        }, [])
            .filter(element => this.isTranslatable(element));
    }
    findChildrenElements(node) {
        if (!this.isElement(node)) {
            return [];
        }
        if (this.isTranslatable(node)) {
            return [node];
        }
        return node.children.reduce((result, childNode) => {
            if (this.isElement(childNode)) {
                const children = this.findChildrenElements(childNode);
                return result.concat(children);
            }
            return result;
        }, [node]);
    }
    parseTemplate(template, path) {
        return (0, compiler_1.parseTemplate)(template, path).nodes;
    }
    isElement(node) {
        return node && node.attributes !== undefined && node.children !== undefined;
    }
    isTranslatable(node) {
        if (this.isElement(node) && node.attributes.some(attribute => attribute.name === 'translate')) {
            return true;
        }
        return false;
    }
    getElementTranslateAttrValue(element) {
        const attr = element.attributes.find(attribute => attribute.name === 'translate');
        return (attr && attr.value) || '';
    }
    getElementContents(element) {
        const contents = element.sourceSpan.start.file.content;
        const start = element.startSourceSpan.end.offset;
        const end = element.endSourceSpan.start.offset;
        return contents.substring(start, end).trim();
    }
}
exports.DirectiveParser = DirectiveParser;
//# sourceMappingURL=directive.parser.js.map