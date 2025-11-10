import './SignIn.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function SignIn({ onSwitchToSignUp, onSignInSuccess }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(formData);
      
      if (result.success) {
        console.log('Đăng nhập thành công:', result.user);
        setFormData({ username: '', password: '' }); // Clear form
        
        if (onSignInSuccess) onSignInSuccess(); // Callback nếu có
        
        // Redirect dựa trên role
        navigate(result.redirectPath);
      } else {
        setError(result.error || 'Đăng nhập thất bại');
        setFormData({ ...formData, password: '' }); // Clear password
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signIn-container">
      <div className="signIn-card">
        <div className="signIn-left">
          <img src={require('../../assets/Logo2.png')} alt="S-House Logo" className="signIn-brand" />
          <h1 className="signIn-heading">Kết nối người thuê và chủ trọ một cách thông minh & tiện lợi</h1>
          <ul className="signIn-benefits">
            <li>✅ Tìm phòng trọ nhanh chóng theo khu vực</li>
            <li>✅ Đăng bài và quản lý thông tin trọ</li>
            <li>✅ Giao diện đơn giản, dễ dùng cho tất cả mọi người</li>
          </ul>
          <FontAwesomeIcon icon={faHouse} className="signIn-house-icon" />
        </div>
        <div className="signIn-right">
          <div className="signIn-tabs">
            <button
              className="signIn-tab active"
            >
              Đăng nhập
            </button>
            <button
              onClick={onSwitchToSignUp}
              className="signIn-tab"
            >
              Đăng ký
            </button>
          </div>
          <form onSubmit={handleSubmit} className="signIn-form">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="Nhập tên đăng nhập"
              autoComplete="username"
            />

            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
            />

            {error && <div className="signIn-error" style={{color: 'red'}}>{error}</div>}

            <button type="submit" className="signIn-submit" disabled={isLoading}>
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
            <p className="signIn-switch">
              Bạn chưa có tài khoản?{' '}
              <span onClick={onSwitchToSignUp}>Đăng ký</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;