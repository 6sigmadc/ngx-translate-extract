Object.defineProperty(exports, "__esModule", { value: true });
const translation_collection_1 = require("../utils/translation.collection");
const gettext = require("gettext-parser");
class PoCompiler {
    constructor(options) {
        this.extension = 'po';
        this.domain = '';
    }
    compile(collection) {
        const data = {
            charset: 'utf-8',
            headers: {
                'mime-version': '1.0',
                'content-type': 'text/plain; charset=utf-8',
                'content-transfer-encoding': '8bit'
            },
            translations: {
                [this.domain]: Object.keys(collection.values).reduce((translations, key) => {
                    return Object.assign({}, translations, { [key]: {
                            msgid: key,
                            msgstr: collection.get(key)
                        } });
                }, {})
            }
        };
        return gettext.po.compile(data);
    }
    parse(contents) {
        const collection = new translation_collection_1.TranslationCollection();
        const po = gettext.po.parse(contents, 'utf8');
        if (!po.translations.hasOwnProperty(this.domain)) {
            return collection;
        }
        const values = Object.keys(po.translations[this.domain])
            .filter(key => key.length > 0)
            .reduce((result, key) => {
            return Object.assign({}, result, { [key]: po.translations[this.domain][key].msgstr.pop() });
        }, {});
        return new translation_collection_1.TranslationCollection(values);
    }
}
exports.PoCompiler = PoCompiler;
//# sourceMappingURL=po.compiler.js.map