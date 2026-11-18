import { useLayoutEffect, useRef, type ReactNode } from 'react';
import styles from './AnimatedHeight.module.scss';

interface AnimatedHeightProps {
    isOpened: boolean;
    children: ReactNode;
    onCollapseTransitionEnd?: () => void;
}

export const AnimatedHeight = ({
    isOpened,
    children,
    onCollapseTransitionEnd,
}: AnimatedHeightProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const onCollapseEndRef = useRef(onCollapseTransitionEnd);

    onCollapseEndRef.current = onCollapseTransitionEnd;

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleTransitionEnd = (e: TransitionEvent) => {
            if (e.target !== container || e.propertyName !== 'height') return;

            if (isOpened) {
                container.style.height = 'auto';
            } else {
                onCollapseEndRef.current?.();
            }

            container.removeEventListener('transitionend', handleTransitionEnd);
        };

        if (isOpened) {
            const height = container.scrollHeight;
            container.style.height = `${height}px`;

            container.addEventListener('transitionend', handleTransitionEnd);

            return () => container.removeEventListener('transitionend', handleTransitionEnd);
        } else {
            if (container.style.height === 'auto') {
                container.style.height = `${container.scrollHeight}px`;
            }

            void container.offsetHeight;

            container.style.height = '0px';

            container.addEventListener('transitionend', handleTransitionEnd);

            return () => container.removeEventListener('transitionend', handleTransitionEnd);
        }
    }, [isOpened]);

    return (
        <div
            ref={containerRef}
            className={styles.animatedHeight}
            data-open={isOpened}
        >
            {children}
        </div>
    );
}