import { create } from 'zustand';

export type ScreenType = 'mob' | 'tab' | 'desk';

type ScreenQueries = Record<ScreenType, MediaQueryList> | null;

interface SetHeaderStateParams {
    isHeaderCollapsed: boolean;
    isMainContentLifted?: boolean;
    hasHeaderOverlay?: boolean;
}

export interface UIState {
    screen: ScreenType;
    isHeaderCollapsed: boolean;
    isMainContentLifted: boolean;
    hasHeaderOverlay: boolean;
    isAuthModalOpen: boolean;
    hasAppTransitions: boolean;
}

interface UIActions {
    setScreen: (value: ScreenType ) => void;
    setHeaderState: (params: SetHeaderStateParams) => void;
    setMainContentLifted: (value: boolean) => void;
    setHeaderOverlay: (value: boolean) => void,
    openAuthModal: () => void,
    closeAuthModal: () => void,
    setAppTransitions: (value: boolean) => void,
    syncScrollState: () => void,
}

export type UIStore  = UIState & {
    actions: UIActions
}

const screenQueries: ScreenQueries =
    typeof window !== 'undefined'
        ? {
            mob: window.matchMedia('(max-width: 767px)'),
            tab: window.matchMedia('(min-width: 768px) and (max-width: 991px)'),
            desk: window.matchMedia('(min-width: 992px)')
        } : null;


const getScreen = (): ScreenType => {
    if (!screenQueries) return 'mob';
    if (screenQueries.mob.matches) return 'mob';
    if (screenQueries.tab.matches) return 'tab';
    return 'desk';
}

export const useUIStore = create<UIStore>()((set) => ({
    screen: getScreen(),

    isHeaderCollapsed: false,
    isMainContentLifted: false,
    hasHeaderOverlay: false,

    isAuthModalOpen: false,

    hasAppTransitions: true,

    actions: {
        setScreen: (value) => set({ screen: value }),

        setHeaderState: ({
            isHeaderCollapsed,
            isMainContentLifted,
            hasHeaderOverlay = false
        }) => set((state) => ({
            isHeaderCollapsed,
            isMainContentLifted: isMainContentLifted ?? state.isMainContentLifted,
            hasHeaderOverlay: state.screen !== 'mob' ? hasHeaderOverlay : false
        })),
        setMainContentLifted: (value) => set({ isMainContentLifted: value }),
        setHeaderOverlay: (value) => set({ hasHeaderOverlay: value }),

        openAuthModal: () => set({ isAuthModalOpen: true }),
        closeAuthModal: () => set({ isAuthModalOpen: false}),

        setAppTransitions: (value) => set({ hasAppTransitions: value }),
        syncScrollState: () => set({
            isHeaderCollapsed: window.scrollY > 50,
            isMainContentLifted: window.scrollY > 50,
        }),
    },
}))

if (screenQueries) {
    let transitionsTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleMediaChange = (e: MediaQueryListEvent) => {
        if (!e.matches) return;

        const { setScreen, setAppTransitions } = useUIStore.getState().actions;

        setScreen(getScreen())
        setAppTransitions(false);

        if (transitionsTimeout) {
            clearTimeout(transitionsTimeout);
        }

        transitionsTimeout = setTimeout(() => {
            setAppTransitions(true);
            transitionsTimeout = null;
        }, 150)
    }

    screenQueries.mob.addEventListener('change', handleMediaChange);
    screenQueries.tab.addEventListener('change', handleMediaChange);
    screenQueries.desk.addEventListener('change', handleMediaChange);
}