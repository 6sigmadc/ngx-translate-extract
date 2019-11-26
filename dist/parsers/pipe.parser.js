Object.defineProperty(exports, "__esModule", { value: true });
const translation_collection_1 = require("../utils/translation.collection");
const utils_1 = require("../utils/utils");
class PipeParser {
    extract(source, filePath) {
        if (filePath && utils_1.isPathAngularComponent(filePath)) {
            source = utils_1.extractComponentInlineTemplate(source);
        }
        return this.parseTemplate(source);
    }
    parseTemplate(template) {
        let collection = new translation_collection_1.TranslationCollection();
        const regExp = /(['"`])((?:(?!\1).|\\\1)+)\1\s*\|\s*translate/g;
        let matches;
        while ((matches = regExp.exec(template))) {
            collection = collection.add(matches[2].split("\\'").join("'"));
        }
        return collection;
    }
}
exports.PipeParser = PipeParser;
//# sourceMappingURL=pipe.parser.js.map