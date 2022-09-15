import { TranslationCollection } from "../../utils/translation.collection";

export interface TaskInterface {
  execute: (print?: boolean) =>  TranslationCollection
}
