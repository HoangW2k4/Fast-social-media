import { faEraser, faMagnifyingGlass, faChevronDown, faPencil, faUser, faUserCircle, faIdBadge, faGear, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import "./HomeHeading.css";
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PORT = "http://localhost:8080";
const API = {
  provinces: `${PORT}/api/provinces/getAll`,
  districts: (provinceId) => `${PORT}/api/districts/getByProvince/${provinceId}`,
  wards: (districtId) => `${PORT}/api/wards/getByDistrict/${districtId}`,
};

const HomeHeading = ({ onSearch }) => {
  const { user, isAuthenticated, logout } = useAuth();
  // read token inside component (keeps in sync if user logs in/out)
  const TOKEN = localStorage.getItem('token') || '';
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [area, setArea] = useState(30);
  const [occupants, setOccupants] = useState('');
  const [occupantsOpen, setOccupantsOpen] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // custom dropdown states
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [wardOpen, setWardOpen] = useState(false);

  // Kiểm tra đăng nhập và lấy userName được handle bởi AuthContext

  const toggleProvince = () => { setProvinceOpen(p => !p); setDistrictOpen(false); setWardOpen(false); };
  const toggleDistrict = () => { setDistrictOpen(d => !d); setProvinceOpen(false); setWardOpen(false); };
  const toggleWard = () => { setWardOpen(w => !w); setProvinceOpen(false); setDistrictOpen(false); };
  const toggleOccupants = () => { setOccupantsOpen(o => !o); setProvinceOpen(false); setDistrictOpen(false); setWardOpen(false); };

  const selectProvince = (id) => {
    setProvince(id);
    setDistrict(''); // reset lower levels
    setWard('');
    setProvinceOpen(false);
  };
  const selectDistrict = (id) => {
    setDistrict(id);
    setWard('');
    setDistrictOpen(false);
  };
  const selectWard = (id) => {
    setWard(id);
    setWardOpen(false);
  };
  const selectOccupant = (val) => {
    setOccupants(val);
    setOccupantsOpen(false);
  };

  const getProvinceLabel = () => {
    if (!province) return 'Tỉnh/Thành phố';
    const p = provinces.find(x => String(x.provinceId) === String(province));
    return p ? p.provinceName : 'Tỉnh/Thành phố';
  };
  const getDistrictLabel = () => {
    if (!district) return 'Quận/Huyện';
    const d = districts.find(x => String(x.districtId) === String(district));
    return d ? d.districtName : 'Quận/Huyện';
  };
  const getWardLabel = () => {
    if (!ward) return 'Phường/Xã';
    const w = wards.find(x => String(x.wardId) === String(ward));
    return w ? w.wardName : 'Phường/Xã';
  };

  const minArea = 10;
  const maxArea = 100;
  const percent = ((area - minArea) / (maxArea - minArea)) * 100;

  useEffect(() => {
    fetch(API.provinces, {
      headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
    })
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch(() => setProvinces([]));
  }, [TOKEN]);

  // Lấy danh sách quận/huyện khi chọn tỉnh
  useEffect(() => {
    if (!province) {
      setDistricts([]);
      setDistrict('');
      return;
    }
    fetch(API.districts(province), {
      headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
    })
      .then((res) => res.json())
      .then((data) => setDistricts(data))
      .catch(() => setDistricts([]));
  }, [province, TOKEN]);

  // Lấy danh sách phường/xã khi chọn quận/huyện
  useEffect(() => {
    if (!district) {
      setWards([]);
      setWard('');
      return;
    }
    fetch(API.wards(district), {
      headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
    })
      .then((res) => res.json())
      .then((data) => setWards(data))
      .catch(() => setWards([]));
  }, [district, TOKEN]);

  const handleSearch = () => {
    const searchData = {
      province,
      district,
      ward,
      priceFrom,
      priceTo,
      area,
      occupants
    };
    
    console.log('Search data:', searchData);
    
    // Gọi callback function từ Home component
    if (onSearch) {
      onSearch(searchData);
    }
  };
  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleDocClick = (e) => {
      // guard menuRef.contains and closest (avoid errors when target is not Element)
      try {
        if (menuRef.current && menuRef.current.contains && !menuRef.current.contains(e.target)) {
          setMenuOpen(false);
        }
      } catch (err) {
        // ignore
      }
      const clickedInsideCustom = e.target && typeof e.target.closest === 'function' && e.target.closest('.custom-select');
      if (!clickedInsideCustom) {
        setProvinceOpen(false);
        setDistrictOpen(false);
        setWardOpen(false);
        setOccupantsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, []);

  const handleToggleMenu = () => setMenuOpen(prev => !prev);
  const goToProfile = () => { console.log('User go to Profile'); };
  const goToSettings = () => { console.log('User go to Setting'); };
  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
    console.log('User logged out');
  };

  useEffect(() => {
    let lastScrollTop = window.scrollY;
    let lastTriggeredScrollTop = window.scrollY;
    const scrollThreshold = 20; // Ngưỡng 20px

    const handleScroll = () => {
      const currentScrollTop = window.scrollY;
      const scrollDifference = Math.abs(currentScrollTop - lastTriggeredScrollTop);

      // Chỉ thực hiện sự kiện khi cuộn ít nhất 20px
      if (scrollDifference >= scrollThreshold) {
        if (currentScrollTop > lastScrollTop) {
          // Đang cuộn xuống
          setScrolled(true);
        } else if (currentScrollTop < lastScrollTop) {
          // Đang cuộn lên
          setScrolled(false);
        }
        
        lastTriggeredScrollTop = currentScrollTop;
      }

      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  return (
    <header className={`search-header${scrolled ? " scrolled" : ""}`}>
      <div className="heading-info">
        <img src={require('../../assets/Logo2.png')} alt="S-House Logo" className="heading-brand" />
        {!isAuthenticated ? (
          <div className="auth-actions">
            <button className="btn-signUp">
              <FontAwesomeIcon icon={faPencil} className="auth-icon"/>Đăng ký
            </button>
            <button className="btn-signIn">
              <FontAwesomeIcon icon={faUser} className="auth-icon"/>Đăng nhập
            </button>  
          </div>
        ) : (
          <div className="user-wrapper" ref={menuRef}>
            <div
              className="user-info"
              onClick={handleToggleMenu}
              aria-expanded={menuOpen}
            >
              <h2 className="user-name">
                {user?.username || "User"}
                <p>User@gmail.com</p>
              </h2>
              <FontAwesomeIcon icon={faUserCircle} className="user-circle" />
            </div>

            {menuOpen && (
              <div className="user-menu">
                <div className="point"></div>
                <button className="menu-item" onClick={goToProfile}>
                  <FontAwesomeIcon icon={faIdBadge} />
                  Hồ sơ cá nhân
                </button>
                <button className="menu-item" onClick={goToSettings}>
                  <FontAwesomeIcon icon={faGear} />
                  Cài đặt
                </button>
                <button className="menu-item" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faArrowRightFromBracket} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
         )}
      </div>

      <div className="search-container">
        <div className="location-container">
          {/* custom province dropdown */}
          <div className="custom-select custom-select--province">
            <button type="button" className="custom-select-button" onClick={toggleProvince}>
              {getProvinceLabel()}
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
            <ul role="listbox" className={`custom-options ${provinceOpen ? 'open' : ''}`}>
              <li
                role="option"
                className={`custom-option ${province === '' ? 'selected' : ''}`}
                key="p-none"
                onClick={(e)=>{ e.stopPropagation(); selectProvince(''); }}
                aria-selected={province === ''}
              >
                Tất cả
              </li>
              {provinces.map((item) => (
                <li
                  role="option"
                  className={`custom-option ${String(province) === String(item.provinceId) ? 'selected' : ''}`}
                  key={item.provinceId}
                  onClick={(e) => { e.stopPropagation(); selectProvince(item.provinceId); }}
                  aria-selected={String(province) === String(item.provinceId)}
                >
                  {item.provinceName}
                </li>
              ))}
            </ul>
          </div>

          {/* custom district dropdown */}
          <div className="custom-select custom-select--district">
            <button
              type="button"
              className="custom-select-button"
              onClick={toggleDistrict}
              disabled={!province}
            >
              {getDistrictLabel()}
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
            <ul role="listbox" className={`custom-options ${districtOpen ? 'open' : ''}`}>
              {!province && <li role="option" className="custom-option disabled" aria-disabled="true" aria-selected="false">Hãy chọn tỉnh/thành</li>}
              {province && districts.map((item) => (
                <li
                  role="option"
                  className={`custom-option ${String(district) === String(item.districtId) ? 'selected' : ''}`}
                  key={item.districtId}
                  onClick={(e) => { e.stopPropagation(); selectDistrict(item.districtId); }}
                  aria-selected={String(district) === String(item.districtId)}
                >
                  {item.districtName}
                </li>
              ))}
            </ul>
          </div>

          {/* custom ward dropdown */}
          <div className="custom-select custom-select--ward">
            <button
              type="button"
              className="custom-select-button"
              onClick={toggleWard}
              disabled={!district}
            >
              {getWardLabel()}
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
            <ul role="listbox" className={`custom-options ${wardOpen ? 'open' : ''}`}>
              {!district && <li role="option" className="custom-option disabled" aria-disabled="true" aria-selected="false">Hãy chọn quận/huyện</li>}
              {district && wards.map((item) => (
                <li
                  role="option"
                  className={`custom-option ${String(ward) === String(item.wardId) ? 'selected' : ''}`}
                  key={item.wardId}
                  onClick={(e) => { e.stopPropagation(); selectWard(item.wardId); }}
                  aria-selected={String(ward) === String(item.wardId)}
                >
                  {item.wardName}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="heading-option">
          <input
            type="number"
            value={priceFrom}
            onChange={(e) => setPriceFrom(Math.max(0, Math.round(e.target.value / 100000) * 100000))}
            className="price"
            step={100000}
            min={0}
            placeholder="Giá từ"
          />

          <input
            type="number"
            value={priceTo}
            onChange={(e) => setPriceTo(Math.max(0, Math.round(e.target.value / 100000) * 100000))}
            className="price"
            step={100000}
            min={0}
            placeholder="Đến"
          />

          <div className="slider-container">
            <label className="slider-label" htmlFor="areaSlider">
              Diện tích: {area} m<sup>2</sup>
            </label>
            <input
              type="range"
              id="areaSlider"
              min={minArea}
              max={maxArea}
              step={1}
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="area"
              style={{
                background: `linear-gradient(to right, #e5e7eb ${percent}%, #e5e7eb ${percent}%)`
              }}
            />
          </div>
          {/* custom occupants dropdown */}
          <div className="custom-select custom-select--occupants">
            <button
              type="button"
              className="custom-select-button"
              onClick={toggleOccupants}
            >
              {occupants ? (occupants === '4+' ? '4+ người' : `${occupants} người`) : 'Số người ở'}
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
            <ul role="listbox" className={`custom-options ${occupantsOpen ? 'open' : ''}`}>
              <li role="option" className={`custom-option ${occupants === '' ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); selectOccupant(''); }} aria-selected={occupants === ''}>Số người ở</li>
              <li role="option" className={`custom-option ${occupants === '1' ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); selectOccupant('1'); }} aria-selected={occupants === '1'}>1 người</li>
              <li role="option" className={`custom-option ${occupants === '2' ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); selectOccupant('2'); }} aria-selected={occupants === '2'}>2 người</li>
              <li role="option" className={`custom-option ${occupants === '3' ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); selectOccupant('3'); }} aria-selected={occupants === '3'}>3 người</li>
              <li role="option" className={`custom-option ${occupants === '4+' ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); selectOccupant('4+'); }} aria-selected={occupants === '4+'}>4+ người</li>
            </ul>
          </div>
          <div className="btn-container">
            <button className="btn-clean" type="button" onClick={() => {
              // Reset all filters
              setProvince('');
              setDistrict('');
              setWard('');
              setPriceFrom('');
              setPriceTo('');
              setArea(30);
              setOccupants('');
            }}>
              <FontAwesomeIcon icon={faEraser} style={{ marginRight: 3 }} />
              Xóa bộ lọc
            </button>
            <button className="btn-search" type="button" onClick={handleSearch}>
              <FontAwesomeIcon icon={faMagnifyingGlass} style={{ marginRight: 3 }} />
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeading;
