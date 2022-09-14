import { TranslationCollection } from '../utils/translation.collection.js'
import { PostProcessorInterface } from './post-processor.interface.js'

export class SortByKeyPostProcessor implements PostProcessorInterface {
  public name = 'SortByKey'

  public process (draft: TranslationCollection, _extracted: TranslationCollection, _existing: TranslationCollection): TranslationCollection {
    return draft.sort()
  }
}
