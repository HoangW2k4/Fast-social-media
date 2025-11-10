import React, { useState } from 'react';
import './SignUp.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faHouse, faLocationDot, faSquarePollVertical, faStar, faUpload, faUsers, faStarOfLife } from '@fortawesome/free-solid-svg-icons';

function SignUp({ onSignUp, onSwitchToSignIn }) {
  const [isLandlord, setIsLandlord] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    address: '',
    cmnd: '',
    extraContact: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLandlordToggle = () => {
    setIsLandlord(!isLandlord);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      let response;
      if (isLandlord) {
        // Gọi API tạo manager
        response = await fetch('http://localhost:8080/api/managers/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: formData.username,
            password: formData.password,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            cmnd: formData.cmnd,
            extraContact: formData.extraContact,
            createdAt: "",
            role: "ROLE_MANEGER"
          })
        });
      } else {
        // Gọi API tạo user (bỏ qua trường address)
        response = await fetch('http://localhost:8080/api/users/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: formData.username,
            password: formData.password,
            email: formData.email,
            phone: formData.phone,
            role: "ROLE_USER",
            addressId: null
          })
        });
      }

      const resJson = await response.json();

      if (!response.ok) {
        if (resJson.message === "Email already exists") {
          setError("Email đã được sử dụng.");
        } else if (resJson.message === "Username already exists") {
          setError("Tên đăng nhập đã tồn tại.");
        } else {
          setError('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
        }
        return;
      }

      // Đăng ký thành công, thực hiện đăng nhập tự động
      try {
        const loginRes = await fetch('http://localhost:8080/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password
          })
        });
        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.token) {
          localStorage.setItem('token', loginData.token);
          console.log('Đăng ký và đăng nhập thành công:', loginData.token);
          setSuccess('Đăng ký và đăng nhập thành công!');
          setFormData({
            username: '',
            password: '',
            email: '',
            phone: '',
            address: '',
            cmnd: '',
            extraContact: '',
          });
          setIsLandlord(false);
          // Nếu muốn đóng form đăng ký, gọi onSwitchToSignIn hoặc callback khác tại đây
          // if (onSignUp) onSignUp();
        } else {
          setSuccess('Đăng ký thành công! Nhưng đăng nhập tự động thất bại.');
        }
      } catch (err) {
        setSuccess('Đăng ký thành công! Nhưng đăng nhập tự động thất bại.');
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left">
          <img src={require('../../assets/Logo2.png')} alt="S-House Logo" className="auth-brand" />
          <h1 className="auth-heading">
          Kết nối người thuê và chủ trọ một cách thông minh & tiện lợi
          </h1>
          
          <div className="auth-benefits"> 
            <div className="benefit-column-right">
              <div className="arrow-box right"> <FontAwesomeIcon icon={faLocationDot} className='icon-right'/>Tìm phòng nhanh theo vị trí và nhu cầu cá nhân</div>
              <div className="arrow-box right"> <FontAwesomeIcon icon={faStar} className='icon-right'/>Xem đánh giá & hình ảnh phòng thực tế</div>
              <div className="arrow-box right"> <FontAwesomeIcon icon={faComments} className='icon-right'/>Liên hệ nhanh với chủ trọ qua nhiều nền tảng</div>
              <img src={require('../../assets/user.png')} alt="User" className="user-icon" />
            </div>

            <div className="benefit-column-left">
              <div className="arrow-box left"> <FontAwesomeIcon icon={faUpload} className='icon-left'/>Đăng bài dễ dàng, quản lý thông tin phòng</div>
              <div className="arrow-box left"> <FontAwesomeIcon icon={faUsers} className='icon-left'/>Quản lý tin đăng và lượt xem chuyên nghiệp</div>
              <div className="arrow-box left"> <FontAwesomeIcon icon={faSquarePollVertical} className='icon-left'/> Thống kê lượng người quan tâm mỗi tuần</div>
              <img src={require('../../assets/maneger.png')} alt="Maneger" className="maneger-icon" />
            </div>
          </div>

          <FontAwesomeIcon icon={faHouse} className="auth-house-icon" />
        </div>

        <div className="auth-right">
          <div className="auth-tabs">
            <button
              onClick={onSwitchToSignIn}
              className="auth-tab"
            >
              Đăng nhập
            </button>
            <button
              className="auth-tab active"
            >
              Đăng ký
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Tên đăng nhập <FontAwesomeIcon icon={faStarOfLife} className="required-icon" />
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="Nhập tên đăng nhập"
            />

            <label>
              Mật khẩu <FontAwesomeIcon icon={faStarOfLife} className="required-icon" />
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Nhập mật khẩu"
            />

            <label>
              Email <FontAwesomeIcon icon={faStarOfLife} className="required-icon" />
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Nhập email"
            />

            <label>
              Số điện thoại <FontAwesomeIcon icon={faStarOfLife} className="required-icon" />
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="Nhập số điện thoại"
            />

            {isLandlord && (
              <div className="auth-extra">
                <label>
                  Địa chỉ <FontAwesomeIcon icon={faStarOfLife} className="required-icon" />
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập địa chỉ"
                />

                <label>
                  CMND/CCCD <FontAwesomeIcon icon={faStarOfLife} className="required-icon" />
                </label>
                <input
                  type="text"
                  name="cmnd"
                  value={formData.cmnd}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập CMND/CCCD"
                />

                <label>Thông tin liên hệ khác (tùy chọn)</label>
                <input
                  type="text"
                  name="extraContact"
                  value={formData.extraContact}
                  onChange={handleInputChange}
                  placeholder="Nhập thông tin liên hệ khác"
                />
              </div>
            )}
            <div className="auth-checkbox">
              <input
                type="checkbox" 
                id="landlord"
                checked={isLandlord}
                onChange={handleLandlordToggle}
              />
              <label htmlFor="landlord" style={{ margin: 0 }}>Tôi là chủ trọ</label>
            </div>
            
            {error && <div className="auth-error" style={{ color: 'red' }}>{error}</div>}
            {success && <div className="auth-success" style={{ color: 'green' }}>{success}</div>}

            <button type="submit" className="auth-submit">Đăng ký</button>
            <p className="auth-switch">
              Bạn đã có tài khoản?{' '}
              <span onClick={onSwitchToSignIn}>Đăng nhập</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;