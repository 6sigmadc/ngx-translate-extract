export class PurgeObsoleteKeysPostProcessor {
    name = 'PurgeObsoleteKeys';
    process(draft, extracted, _existing) {
        return draft.intersect(extracted);
    }
}
//# sourceMappingURL=purge-obsolete-keys.post-processor.js.map