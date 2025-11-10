import classNames from 'classnames/bind';
import styles from './Ranking.module.scss';
import useNumberFormat from '../../hooks/useNumberFormat';

const cx = classNames.bind(styles);

function Ranking({ title, data, icon, iconColor }) {
    const formatNumber = useNumberFormat('en-US');

    return (
        <>
            <h4 className={cx('title')}>{title}</h4>
            <div className={cx('ranking-list')}>
                {data.map((item, index) => (
                    <div key={index} className={cx('item')}>
                        <img src={item.thumbnail} alt={item.title} className={cx('thumbnail')} />
                        <div className={cx('info')}>
                            <p className={cx('item-title')}>{item.title}</p>
                            <p className={cx('value')}>
                                <span className={cx('icon')} style={{ color: iconColor }}>
                                    {icon}
                                </span>{' '}
                                {formatNumber(item.value)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Ranking;