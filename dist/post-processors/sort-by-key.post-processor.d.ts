import { TranslationCollection } from '../utils/translation.collection.js';
import { PostProcessorInterface } from './post-processor.interface.js';
export declare class SortByKeyPostProcessor implements PostProcessorInterface {
    name: string;
    process(draft: TranslationCollection, _extracted: TranslationCollection, _existing: TranslationCollection): TranslationCollection;
}
