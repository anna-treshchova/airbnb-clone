import { isRecord } from './type-guards';
import { getSessionItem, setSessionItem, removeSessionItem } from './session-storage';

const SCROLL_RESTORATION_KEY = 'react-router-scroll-positions'
const SCROLL_RESTORATION_META_KEY = 'hotels_scroll_restoration_meta';

interface ScrollRestorationMeta {
    count: number;
    top: number | null;
}

const isScrollMeta = (value: unknown): value is ScrollRestorationMeta => {
    if (!isRecord(value)) return false;

    const isCountValid =
        typeof value.count === 'number' &&
        Number.isFinite(value.count) &&
        value.count >= 0;

    const isTopValid =
        value.top === null ||
        (typeof value.top === 'number' && Number.isFinite(value.top));

    return isCountValid && isTopValid;
}

const getCurrentHistoryEntryKey = (): string => {
    if (typeof window === 'undefined') return 'default';

    const key: unknown = window.history.state?.key;

    return (typeof key === 'string' && key) ? key : 'default';
}

export const getSavedScrollY = (): number => {
    const positions: unknown = getSessionItem(SCROLL_RESTORATION_KEY);
    if (!isRecord(positions)) return 0;

    const key = getCurrentHistoryEntryKey();
    const scrollY = positions[key];

    return typeof scrollY === 'number' ? scrollY : 0;
}

export const clearSavedScrollY = (): void => {
    const positions: unknown = getSessionItem(SCROLL_RESTORATION_KEY);
    const key = getCurrentHistoryEntryKey();

    if (isRecord(positions) && key in positions) {
        delete positions[key];
        setSessionItem(SCROLL_RESTORATION_KEY, positions);
    }
}

export const saveScrollRestorationMeta = (count: number, top: number | null): void => {
    setSessionItem(SCROLL_RESTORATION_META_KEY, { count, top })
}

export const getScrollRestorationMeta = (): ScrollRestorationMeta | null => {
    const savedMeta: unknown = getSessionItem(SCROLL_RESTORATION_META_KEY);
    return isScrollMeta(savedMeta) ? savedMeta : null;
}

export const clearScrollRestorationMeta = (): void => {
    removeSessionItem(SCROLL_RESTORATION_META_KEY);
}