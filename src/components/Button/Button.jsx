import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

function Button({
    to,
    href,
    primary,
    outline = false,
    text = false,
    disabled = false,
    rounded = false,
    size = 'medium',
    leftIcon,
    rightIcon,
    className,
    children,
    onClick,
    color,
    backgroundColor,
    hoverBackground,
    ...passProps
}) {
    const [isHovered, setIsHovered] = useState(false);

    let Comp = 'button';
    const props = {
        onClick,
        ...passProps,
    };

    const currentBgColor = isHovered && hoverBackground && !disabled ? hoverBackground : backgroundColor;

    if (currentBgColor) {
        props.style = {
            backgroundColor: currentBgColor,
            transition: 'background-color 0.3s ease, transform 0.2s ease',
            ...(props.style || {}),
        };
    }

    if (hoverBackground && !disabled) {
        props.onMouseEnter = (e) => {
            setIsHovered(true);
            passProps.onMouseEnter?.(e);
        };
        props.onMouseLeave = (e) => {
            setIsHovered(false);
            passProps.onMouseLeave?.(e);
        };
    }

    if (disabled) {
        props.disabled = disabled;
    }

    if (to) {
        props.to = to;
        Comp = Link;
    } else if (href) {
        props.href = href;
        Comp = 'a';
    }

    const classes = cx('wrapper', {
        primary,
        outline,
        text,
        disabled,
        rounded,
        leftIcon,
        rightIcon,
        [className]: className,
        [size]: size,
    });

    return (
        <Comp className={classes} {...props}>
            {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
            <span className={cx('title')}>{children}</span>
            {rightIcon && <span className={cx('icon')}>{rightIcon}</span>}
        </Comp>
    );
}

export default Button;
