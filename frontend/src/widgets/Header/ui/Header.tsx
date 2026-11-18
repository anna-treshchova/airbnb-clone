import { CircleButton } from '@/shared/ui/CircleButton';
import { Avatar } from '@/shared/ui/Avatar';
import CloseIcon from '@/shared/assets/icons/close.svg?react';

import { SearchPanel } from '@/features/search';
import { UserMenu } from '@/features/auth';

import { useHeader, IntroProvider, useIntroContext } from '../model';

import { RegularNav } from './RegularNav';
import { CompactNav } from './CompactNav';
import { Logo } from './Logo';

import styles from './Header.module.scss';

const HeaderBase = () => {
    const { introStatus } = useIntroContext();
    const { data, pageContext, uiState, actions, refs } = useHeader();

    const datasetAttributes = {
        'data-page-type': pageContext.pageType,
        'data-hub': pageContext.isHub,
        'data-wip': pageContext.isWIP,

        'data-intro-status': introStatus,

        'data-header-collapsed': uiState.isHeaderCollapsed,
        'data-header-overlay': uiState.hasHeaderOverlay,
        'data-nav-hidden': uiState.isNavHidden,
        'data-nav-icons-hidden': uiState.areNavIconsHidden,
    };

    const onOverlayClick = () => {
        if (uiState.isMobile && !uiState.isHeaderCollapsed) return;
        actions.collapseHeader()
    }

    return (
        <div
            className={styles.headerRoot}
            ref={refs.headerRootRef}
            {...datasetAttributes}
        >
            <div className={styles.headerSentinel} ref={refs.headerSentinelRef} />
            <div className={styles.navSentinel} ref={refs.navSentinelRef} />

            <header className={styles.header}>
                <div className={styles.topBar}>
                    <RegularNav />
                    <div className={styles.closeButtonWrapper}>
                        <CircleButton
                            variant='solid'
                            size='lg'
                            onClick={actions.collapseHeader}
                            aria-label='Close'
                        >
                            <CloseIcon />
                        </CircleButton>
                    </div>
                </div>

                <Logo />

                <SearchPanel
                    expandHeader={actions.expandHeader}
                    onSubmit={actions.initRecentSearch}
                    compactNavSlot={<CompactNav />}
                />

                <div className={styles.userWrapper}>
                    {data.me && (
                        <Avatar
                            id={data.me.id}
                            label={data.me.email?.[0]?.toUpperCase() || '?'}
                        />
                    )}
                    <UserMenu me={data.me} />
                </div>
            </header>

            <div className={styles.topBackground} />
            <div className={styles.spacer}/>
            <div className={styles.shadowLine}/>
            <div className={styles.overlay} onClick={onOverlayClick} />
        </div>
    )
}

export const Header = () => {
    return (
        <IntroProvider>
           <HeaderBase />
        </IntroProvider>
    )
}