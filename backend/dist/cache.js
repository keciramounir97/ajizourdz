export class TtlCache {
    entries = new Map();
    get(key) {
        const entry = this.entries.get(key);
        if (!entry)
            return undefined;
        if (Date.now() > entry.expiresAt) {
            this.entries.delete(key);
            return undefined;
        }
        return entry.value;
    }
    set(key, value, ttlMs = 60_000) {
        this.entries.set(key, { value, expiresAt: Date.now() + ttlMs });
    }
    deletePrefix(prefix) {
        for (const key of this.entries.keys()) {
            if (key.startsWith(prefix))
                this.entries.delete(key);
        }
    }
    stats() {
        return { entries: this.entries.size };
    }
}
export const cache = new TtlCache();
