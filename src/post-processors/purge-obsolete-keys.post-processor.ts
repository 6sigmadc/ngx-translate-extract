import { TranslationCollection } from '../utils/translation.collection.js'
import { PostProcessorInterface } from './post-processor.interface.js'

export class PurgeObsoleteKeysPostProcessor implements PostProcessorInterface {
  public name = 'PurgeObsoleteKeys'

  public process (draft: TranslationCollection, extracted: TranslationCollection, _existing: TranslationCollection): TranslationCollection {
    return draft.intersect(extracted)
  }
}
