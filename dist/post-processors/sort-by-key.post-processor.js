export class SortByKeyPostProcessor {
    name = 'SortByKey';
    process(draft, _extracted, _existing) {
        return draft.sort();
    }
}
//# sourceMappingURL=sort-by-key.post-processor.js.map