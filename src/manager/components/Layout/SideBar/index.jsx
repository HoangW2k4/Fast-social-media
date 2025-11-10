import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChartColumn,
    faNewspaper,
    faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import styles from './ManagerSideBar.module.scss';
import { AuthContext } from '../../../../context/AuthContext';

const cx = classNames.bind(styles);

// Import ảnh
const avatarPlaceholder = require('../../../../assets/house.jpeg');

const menuItems = [
    {
        title: 'Dashboard',
        icon: faChartColumn,
        path: '/manager/dashboard',
    },
    {
        title: 'Quản lý bài viết',
        icon: faNewspaper,
        path: '/manager/posts',
    },
];

const profile = {
    name: 'Mạch Quang Huy',
    avatar: avatarPlaceholder,
    email: 'manager@gmail.com',
    dateOfBirth: '01/01/1990',
    joinDate: '01/01/2024',
    phoneNumber: '0987654321',
    address: 'Hà Nội',
    isMale: true,
    role: 'Chủ trọ',
    isActiveEmail: true,
    isActivedPhone: true,
    is2Fa: true,
};

function ManagerSideBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h2 className={cx('logo')}>Manager Dashboard</h2>
            </div>

            <div className={cx('profile-section')}>
                <div className={cx('profile-header')}>
                    <img 
                        src={profile.avatar} 
                        alt={profile.name} 
                        className={cx('avatar')} 
                    />
                    <div className={cx('profile-info')}>
                        <h3 className={cx('name')}>{profile.name}</h3>
                        <p className={cx('role')}>{profile.role}</p>
                    </div>
                </div>
            </div>

            <nav className={cx('navigation')}>
                <ul className={cx('menu-list')}>
                    {menuItems.map((item, index) => (
                        <li key={index} className={cx('menu-item')}>
                            <Link 
                                to={item.path} 
                                className={cx('menu-link', {
                                    active: location.pathname === item.path
                                })}
                            >
                                <FontAwesomeIcon icon={item.icon} className={cx('menu-icon')} />
                                <span className={cx('menu-text')}>{item.title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className={cx('footer')}>
                <button 
                    onClick={handleLogout}
                    className={cx('logout-btn')}
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className={cx('logout-icon')} />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </div>
    );
}

export default ManagerSideBar;