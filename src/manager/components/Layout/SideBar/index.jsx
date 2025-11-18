import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartColumn,
  faNewspaper,
  faSignOutAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

import styles from "./ManagerSideBar.module.scss";
import { AuthContext } from "../../../../context/AuthContext";
import Button from "../../../../components/Button/Button";
import InfoItem from "./InfoItem";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import InsertChartIcon from "@mui/icons-material/InsertChart";

const cx = classNames.bind(styles);

// Import ảnh mặc định
const avatarPlaceholder = require("../../../../assets/avatar.jpg");

const menuItems = [
  {
    title: "Dashboard",
    icon: faChartColumn,
    path: "/manager/dashboard",
  },
  {
    title: "Quản lý bài viết",
    icon: faNewspaper,
    path: "/manager/posts",
  },
];

const changeInfoBtn = {
  title: "Sửa thông tin",
  leftIcon: <FontAwesomeIcon icon={faPenToSquare} />,
};

function ManagerSideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [visibleInfo, setVisibleInfo] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy thông tin manager từ API
  useEffect(() => {
    const fetchManagerProfile = async () => {
      try {
        setLoading(true);

        // Lấy token từ localStorage hoặc context
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Không tìm thấy token đăng nhập");
        }

        // Giả sử bạn lưu managerId trong localStorage khi đăng nhập
        // Hoặc có thể decode từ JWT token
        const managerId = localStorage.getItem("managerId") || "1";

        const response = await fetch(
          `http://localhost:8080/api/managers/getById/${managerId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Transform API data to match component structure
        setProfile({
          name: "Nguyễn Văn Anh", // Fake data - không có trong API
          avatar: avatarPlaceholder, // Có thể thêm avatar URL từ API nếu có
          email: data.email,
          dateOfBirth: "01/01/1990", // Fake data - không có trong API
          joinDate: new Date(data.createdAt).toLocaleDateString("vi-VN"),
          phoneNumber: data.phone,
          address: data.address,
          isMale: true, // Fake data - không có trong API
          role: data.role === "ROLE_MANAGER" ? "Chủ trọ" : data.role,
          extraContact: data.extraContact,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching manager profile:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchManagerProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleInfo = () => {
    setVisibleInfo(!visibleInfo);
  };

  // Loading state
  if (loading) {
    return (
      <div className={cx("wrapper")}>
        <div className={cx("header")}>
          <InsertChartIcon className={cx("logo-icon")} />
          <h2 className={cx("logo")}>Manager Dashboard</h2>
        </div>
        <div
          className={cx("content")}
          style={{ textAlign: "center", padding: "20px" }}
        >
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cx("wrapper")}>
        <div className={cx("header")}>
          <InsertChartIcon
            sx={{ fontSize: 30, color: "#377be0ff", marginRight: "8px" }}
            className={cx("logo-icon")}
          />
          <h2 className={cx("logo")}>Manager Dashboard</h2>
        </div>
        <div
          className={cx("content")}
          style={{ textAlign: "center", padding: "20px" }}
        >
          <p style={{ color: "red" }}>Lỗi: {error}</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <InsertChartIcon
          sx={{ fontSize: 30, color: "#377be0ff", marginRight: "8px" }}
          className={cx("logo-icon")}
        />
        <h2 className={cx("logo")}>Manager Dashboard</h2>
      </div>

      {/* profile */}
      <div className={cx("content")}>
        <div className={cx("profile")}>
          <img
            src={profile.avatar}
            alt={profile.name}
            className={cx("avatar")}
          />
          <h3 className={cx("name")}>{profile.name}</h3>
          <p className={cx("role")}>
            {profile.role} • Tham gia từ {profile.joinDate}
          </p>
          <button className={cx("more-btn")} onClick={toggleInfo}>
            {visibleInfo ? "Thu gọn" : "Xem thêm"}
            <span className={cx("more-btn-icon", { active: visibleInfo })}>
              <FontAwesomeIcon icon={faChevronDown} />
            </span>
          </button>
        </div>

        <div className={cx("profile-info", { visible: visibleInfo })}>
          <Button
            leftIcon={changeInfoBtn.leftIcon}
            size="large"
            primary
            className={cx("change-info-btn")}
          >
            {changeInfoBtn.title}
          </Button>
          <InfoItem
            title="Email"
            value={profile.email}
            icon={<MailIcon sx={{ fontSize: 20 }} />}
          />
          <InfoItem
            title="Số điện thoại"
            value={profile.phoneNumber}
            icon={<PhoneIcon sx={{ fontSize: 20 }} />}
          />
          <div className={cx("divider")}>
            <InfoItem
              title="Giới tính"
              value={profile.isMale ? "Nam" : "Nữ"}
              iconRight={
                profile.isMale ? (
                  <MaleIcon sx={{ fontSize: 16, color: "#4dbbff" }} />
                ) : (
                  <FemaleIcon sx={{ fontSize: 16, color: "#ff47a0" }} />
                )
              }
              size="medium"
            />
            <InfoItem
              title="Ngày sinh"
              value={profile.dateOfBirth}
              icon={<CalendarMonthIcon sx={{ fontSize: 20 }} />}
              size="medium"
            />
          </div>
          <InfoItem
            title="Nơi ở"
            value={profile.address}
            icon={<LocationOnIcon sx={{ fontSize: 20 }} />}
          />
          {profile.extraContact && (
            <InfoItem
              title="Liên hệ khác"
              value={profile.extraContact}
              icon={<PhoneIcon sx={{ fontSize: 20 }} />}
            />
          )}
        </div>
      </div>

      <nav className={cx("navigation")}>
        {menuItems.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className={cx("nav-item", {
              active: location.pathname === item.path,
            })}
          >
            <FontAwesomeIcon icon={item.icon} className={cx("icon")} />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className={cx("footer")}>
        <button onClick={handleLogout} className={cx("logout-btn")}>
          <FontAwesomeIcon icon={faSignOutAlt} className={cx("logout-icon")} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}

export default ManagerSideBar;
