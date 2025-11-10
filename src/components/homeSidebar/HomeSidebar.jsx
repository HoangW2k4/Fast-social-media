import "./HomeSidebar.css";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSnowflake,
  faTshirt,
  faTemperatureLow,
  faWifi,
  faMotorcycle,
  faToilet,
  faUtensils,
  faClock,
  faChevronDown,
  faEraser,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

const amenityList = [
  { key: "airConditioner", label: "Điều hòa", icon: faSnowflake },
  { key: "washingMachine", label: "Máy giặt", icon: faTshirt },
  { key: "refrigerator", label: "Tủ lạnh", icon: faTemperatureLow },
  { key: "wifi", label: "Wifi", icon: faWifi },
  { key: "parking", label: "Chỗ để xe", icon: faMotorcycle },
  { key: "privateToilet", label: "Toilet riêng", icon: faToilet },
  { key: "kitchen", label: "Nhà bếp", icon: faUtensils },
  { key: "freeTime", label: "Giờ giấc tự do", icon: faClock },
];

const HomeSidebar = ({
  clearFilters,
  hasActiveFilters = false,
  filteredCount = 0,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [amenities, setAmenities] = useState({
    airConditioner: false,
    washingMachine: false,
    refrigerator: false,
    wifi: false,
    parking: false,
    privateToilet: false,
    kitchen: false,
    freeTime: false,
  });

  const toggleAmenity = (key) => {
    setAmenities((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSearch = () => {
    console.log({
      sortOption,
      amenities,
    });
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
    <div className={`sidebar-container${scrolled ? " scrolled" : ""}`}>
      <div className="sidebar-section">
        <label className="sidebar-label">Sắp xếp theo</label>
        <div className="sidebar-select-wrapper">
          <select
            className="sidebar-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Mới nhất</option>
            <option value="priceAsc">Giá: Thấp đến cao</option>
            <option value="priceDesc">Giá: Cao đến thấp</option>
            <option value="areaAsc">Diện tích: Nhỏ đến lớn</option>
            <option value="areaDesc">Diện tích: Lớn đến nhỏ</option>
          </select>
          <span className="sidebar-select-icon">
            <FontAwesomeIcon icon={faChevronDown} />
          </span>
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-label">Tiện ích</h3>
        <div className="sidebar-amenities">
          {amenityList.map((item) => (
            <div className="sidebar-amenity" key={item.key}>
              <input
                type="checkbox"
                id={`amenity-${item.key}`}
                checked={!!amenities[item.key]}
                onChange={() => toggleAmenity(item.key)}
                className="sidebar-checkbox"
              />
              <label htmlFor={`amenity-${item.key}`} className="sidebar-amenity-label">
                <FontAwesomeIcon icon={item.icon} className="sidebar-amenity-icon" />
                {item.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-btn-container">
       
        <button className="sidebar-search-btn" type="button" onClick={handleSearch}>
          <FontAwesomeIcon icon={faMagnifyingGlass} style={{ marginRight: 3 }} />
          Tìm kiếm
        </button>
         <button className="sidebar-clean-btn" type="button" onClick={() => {
          // Reset all filters
          setSortOption('');
          clearFilters();
        }}>
          <FontAwesomeIcon icon={faEraser} style={{ marginRight: 3 }} />
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
};

export default HomeSidebar;