
export const safeSetItem = (key: string, value: string) => {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
            console.warn('Storage quota exceeded, clearing half of the cache to make room.');
            // Clear items that start with 'lab_cache_' or 'study_cache_' to prioritize user data
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && (k.startsWith('lab_cache_') || k.startsWith('study_cache_'))) {
                    keys.push(k);
                }
            }
            
            // Remove about 50% of the cache entries
            for (let i = 0; i < Math.ceil(keys.length / 2); i++) {
                localStorage.removeItem(keys[i]);
            }
            
            // Try setting it again
            try {
                localStorage.setItem(key, value);
            } catch (retryError) {
                console.error('Failed to set item even after clearing cache:', retryError);
            }
        }
    }
};

export const safeGetItem = (key: string): string | null => {
    return localStorage.getItem(key);
};
