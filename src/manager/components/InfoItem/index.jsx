import classNames from 'classnames/bind';
import styles from './InfoItem.module.scss';

const cx = classNames.bind(styles);

function InfoItem({ title, value, icon = null, iconRight = null, size = 'large', children }) {
    const classes = cx('wrapper', {
        [size]: size,
    });

    return (
        <div className={classes}>
            {icon && <div className={cx('icon')}>{icon}</div>}
            <div className={cx('text')}>
                <p className={cx('title')}>{title}</p>
                <p className={cx('value')}>
                    {value}
                    {iconRight && <span className={cx('icon-right')}>{iconRight}</span>}
                </p>
            </div>
        </div>
    );
}

export default InfoItem;