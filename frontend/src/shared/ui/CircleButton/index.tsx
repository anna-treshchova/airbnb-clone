import type { ComponentPropsWithoutRef } from 'react';
import styles from './CircleButton.module.scss';

type CircleButtonVariant = 'solid' | 'glass' | 'outline' | 'ghost';
type CircleButtonSize = 'sm' | 'md' | 'lg';
type CircleButtonHover =  'default' | 'scale' | 'bg';

type CircleButtonProps = ComponentPropsWithoutRef<'button'> & {
    variant?: CircleButtonVariant;
    size: CircleButtonSize;
    hover?: CircleButtonHover;
}

export const CircleButton = ({
    type = 'button',
    variant = 'solid',
    size,
    hover = 'default',
    children,
    className,
    ...props
}: CircleButtonProps) => {

    const buttonClasses = [
       styles.button,
       styles[variant],
       styles[size],
       styles[`hover-${hover}`],
       className,
   ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={buttonClasses}
            {...props}
        >
            {children}
        </button>
    )
}