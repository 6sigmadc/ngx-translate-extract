import { CompilerInterface } from './compiler.interface.js'
import { TranslationCollection, TranslationType } from '../utils/translation.collection.js'

import pkg from 'gettext-parser'
const { po } = pkg

export class PoCompiler implements CompilerInterface {
  public extension = 'po'

  /**
	 * Translation domain
	 */
  public domain = ''

  public constructor (options?: any) {}

  public compile (collection: TranslationCollection): string {
    const data = {
      charset: 'utf-8',
      headers: {
        'mime-version': '1.0',
        'content-type': 'text/plain; charset=utf-8',
        'content-transfer-encoding': '8bit'
      },
      translations: {
        [this.domain]: Object.keys(collection.values).reduce<any>((translations, key) => {
          return {
            ...translations,
            [key]: {
              msgid: key,
              msgstr: collection.get(key)
            }
          }
        }, {})
      }
    }

    return po.compile(data).toString('utf8')
  }

  public parse (contents: string): TranslationCollection {
    const collection = new TranslationCollection()

    const parsedPo = po.parse(contents, 'utf8')

    if (!parsedPo.translations.hasOwnProperty(this.domain)) {
      return collection
    }

    const values = Object.keys(parsedPo.translations[this.domain])
      .filter((key) => key.length > 0)
      .reduce<TranslationType>((result, key) => {
      return {
        ...result,
        [key]: parsedPo.translations[this.domain][key].msgstr.pop()
      }
    }, {})

    return new TranslationCollection(values)
  }
}
