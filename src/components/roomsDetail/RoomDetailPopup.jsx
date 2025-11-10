import React, { useState, useEffect } from 'react';
import './RoomDetailPopup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons';

const RoomDetailPopup = ({ roomId, onClose }) => {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found in localStorage');
          return;
        }

        // Lấy thông tin phòng
        const roomResponse = await fetch(
          `http://localhost:8080/api/rooms/getById/${roomId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!roomResponse.ok) {
          throw new Error('Failed to fetch room details');
        }

        const roomData = await roomResponse.json();

        // Lấy thông tin địa chỉ
        const addressResponse = await fetch(
          `http://localhost:8080/api/rooms/getDirectionUrl?roomId=${roomId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const addressData = await addressResponse.json();

        // Lấy thông tin media (hình ảnh)
        const mediaResponse = await fetch(
          `http://localhost:8080/api/room-media/getByRoomId/${roomId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const mediaData = await mediaResponse.json();

        // Lấy thông tin nội thất
        const furnitureResponse = await fetch(
          `http://localhost:8080/api/room-furniture/getByRoomId/${roomId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const furnitureData = await furnitureResponse.json();
        console.log('Furniture data:', furnitureData);
        setRoom({
          ...roomData,
          address: addressData.address,
          directionUrl: addressData.directionUrl,
          media: mediaData,
          furniture: furnitureData.utilities,
        });
      } catch (error) {
        console.error('Error fetching room details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoomDetail();
    }
  }, [roomId]);

  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const nextImage = () => {
    const mediaList = room.media || [];
    if (mediaList.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === mediaList.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    const mediaList = room.media || [];
    if (mediaList.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? mediaList.length - 1 : prev - 1
      );
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <div className="room-detail-popup-overlay" onClick={onClose}>
        <div className="room-detail-popup" onClick={(e) => e.stopPropagation()}>
          <div className="popup-header">
            <h2>Chi tiết phòng trọ</h2>
            <button className="popup-close" onClick={onClose}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          <div className="loading">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Đang tải thông tin phòng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="room-detail-popup-overlay" onClick={onClose}>
        <div className="room-detail-popup" onClick={(e) => e.stopPropagation()}>
          <div className="popup-header">
            <h2>Chi tiết phòng trọ</h2>
            <button className="popup-close" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="error">
            <i className="fas fa-exclamation-triangle"></i>
            <p>Không tìm thấy thông tin phòng</p>
          </div>
        </div>
      </div>
    );
  }

  // Danh sách tất cả media (bao gồm cả video và ảnh)
  const allMediaList = room.media || [];

  return (
    <div className="room-detail-popup-overlay" onClick={onClose}>
      <div className="room-detail-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>Chi tiết phòng trọ</h2>
          <button className="popup-close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="popup-content">
          <div className="room-detail-content">
            {/* Phần media (ảnh và video) */}
            <div className="room-images-section">
              <h3>Hình ảnh phòng</h3>
              {allMediaList.length > 0 ? (
                <div className="images-grid">
                  <button 
                    className="carousel-nav prev" 
                    onClick={prevImage}
                    disabled={allMediaList.length <= 1}
                  >
                    <FontAwesomeIcon icon={faAngleLeft} />
                  </button>
                  
                  <div 
                    className="image-item"
                    onClick={() => openImageModal(currentImageIndex)}
                  >
                    {/* Kiểm tra xem media hiện tại là video hay ảnh */}
                    {allMediaList[currentImageIndex]?.mediaUrl && 
                     /\.(mp4|avi|mov|webm)$/i.test(allMediaList[currentImageIndex].mediaUrl) ? (
                      <video 
                        src={allMediaList[currentImageIndex].mediaUrl} 
                        className="room-image"
                        controls
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <img 
                        src={allMediaList[currentImageIndex]?.mediaUrl} 
                        alt={`Media ${currentImageIndex + 1}`}
                        className="room-image"
                      />
                    )}
                    <div className="image-overlay">
                      <i className="fas fa-search-plus"></i>
                    </div>
                    {allMediaList.length > 1 && (
                      <div className="image-counter">
                        {currentImageIndex + 1} / {allMediaList.length}
                      </div>
                    )}
                  </div>
                  
                  <button 
                    className="carousel-nav next" 
                    onClick={nextImage}
                    disabled={allMediaList.length <= 1}
                  >
                    <FontAwesomeIcon icon={faAngleRight} />
                  </button>
                </div>
              ) : (
                <div className="no-images">
                  <i className="fas fa-image"></i>
                  <p>Chưa có media nào</p>
                </div>
              )}
            </div>

            {/* Thông tin chi tiết */}
            <div className="room-info-section">
              <div className="room-header">
                <h3 className="room-title">{room.title}</h3>
                <span className={`room-status ${room.isActive ? 'active' : 'inactive'}`}>
                  {room.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
                </span>
              </div>

              <div className="room-price">
                <span className="price-label">Giá thuê:</span>
                <span className="price-value">{formatPrice(room.price)}đ/tháng</span>
              </div>

              <div className="room-details-grid">
                <div className="detail-item">  
                  <i className="fas fa-expand detail-icon"></i>
                  <span className="detail-label">Diện tích:</span>
                  <span className="detail-value">{room.area}m²</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-user detail-icon"></i>
                  <span className="detail-label">Số người ở tối đa:</span>
                  <span className="detail-value">{room.maxOccupants} người</span>
                </div>
              </div>

              <div className="room-address">
                <i className="fas fa-map-marker-alt address-icon"></i>
                {room.directionUrl ? (
                  <a 
                    href={room.directionUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="address-link"
                    style={{fontSize: '16px'}}
                  >
                    {room.address || 'Đang tải địa chỉ...'}
                  </a>
                ) : (
                  <span className="address-text">
                    {room.address || 'Đang tải địa chỉ...'}
                  </span>
                )}
              </div>

              {room.furniture && room.furniture.length > 0 && (
                <div className="room-furniture">
                  <h4>Nội thất có sẵn</h4>
                  <div className="furniture-list">
                    {room.furniture.map((item, index) => (
                      <span key={index} className="furniture-item">
                        <i className="fas fa-check furniture-icon"></i>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {room.description && (
                <div className="room-description">
                  <h4>Mô tả chi tiết</h4>
                  <p className="description-text">
                    {/* {room.description} */}
                        Phòng trọ nằm trong khu dân cư yên tĩnh, an ninh tốt, phù hợp cho sinh viên hoặc người đi làm có thu nhập trung bình. Diện tích khoảng 15–20m², được thiết kế gọn gàng, thoáng mát với cửa sổ hướng ra ngoài giúp đón ánh sáng tự nhiên. 
                        Phòng có sẵn quạt trần, đèn chiếu sáng, và ổ cắm điện bố trí hợp lý. Nền lát gạch men dễ lau chùi, tường được sơn sáng màu tạo cảm giác sạch sẽ, rộng rãi. Khu vực nhà vệ sinh khép kín có trang bị bồn cầu, vòi sen và chỗ đặt máy giặt nhỏ gọn.
                        Khu trọ có chỗ để xe miễn phí, lối đi riêng và giờ giấc tự do. Wi-Fi tốc độ cao được cung cấp miễn phí cho toàn bộ dãy trọ. Môi trường sống thân thiện, chủ trọ dễ tính, hỗ trợ người thuê khi cần.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal hiển thị media lớn */}
        {showImageModal && allMediaList.length > 0 && (
          <div className="image-modal" onClick={closeImageModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeImageModal}>
                <i className="fas fa-times"></i>
              </button>
              <button className="modal-nav prev" onClick={prevImage}>
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>
              
              {/* Hiển thị video hoặc ảnh tùy vào loại file */}
              {allMediaList[currentImageIndex]?.mediaUrl && 
               /\.(mp4|avi|mov|webm)$/i.test(allMediaList[currentImageIndex].mediaUrl) ? (
                <video 
                  src={allMediaList[currentImageIndex].mediaUrl} 
                  className="modal-image"
                  controls
                  autoPlay
                  style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }}
                />
              ) : (
                <img 
                  src={allMediaList[currentImageIndex]?.mediaUrl} 
                  alt={`Media ${currentImageIndex + 1}`}
                  className="modal-image"
                />
              )}
              
              <button className="modal-nav next" onClick={nextImage}>
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
              <div className="modal-counter">
                {currentImageIndex + 1} / {allMediaList.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetailPopup;