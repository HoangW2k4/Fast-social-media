import classNames from 'classnames/bind';
import ManagerSideBar from './SideBar';
import ManagerHeader from './Header';
import GlobalStyles from '../GlobalStyles';
import styles from './ManagerLayout.module.scss';

const cx = classNames.bind(styles);

function ManagerLayout({ children }) {
    return (
        <GlobalStyles>
            <div className={cx('wrapper', 'manager-wrapper')}>
                <ManagerSideBar />
                <div className={cx('container')}>
                    <ManagerHeader />
                    <div className={cx('content')}>{children}</div>
                </div>
            </div>
        </GlobalStyles>
    );
}

export default ManagerLayout;