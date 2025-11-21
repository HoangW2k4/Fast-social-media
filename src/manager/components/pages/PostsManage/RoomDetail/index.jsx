import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes,
    faChevronLeft,
    faChevronRight,
    faExpand,
} from '@fortawesome/free-solid-svg-icons';
import './RoomDetail.css';

const RoomDetail = ({ room, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!room) return null;

    // Support both old and new media structure
    const images = room.medias && room.medias.length > 0 ? room.medias : (room.media || []);
    const hasImages = images.length > 0;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const getFurnitureDisplayName = (furniture) => {
        const furnitureMap = {
            'Điều hòa': 'Điều hòa',
            'Tủ lạnh': 'Tủ lạnh',
            Bếp: 'Bếp',
        };
        return furnitureMap[furniture] || furniture;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const getFullAddress = (address) => {
        if (!address) return 'Đang tải địa chỉ...';
        
        // Use fullAddress if available (new API structure)
        if (address.fullAddress) {
            return address.fullAddress;
        }
        
        // Build address from parts (fallback)
        const parts = [
            address.streetAddress,
            address.wardName || address.ward,
            address.districtName || address.district, 
            address.provinceName || address.province
        ].filter(part => part && part.trim() !== '');
        
        return parts.length > 0 ? parts.join(', ') : 'Địa chỉ không xác định';
    };

    return (
        <div className="room-detail-overlay" onClick={onClose}>
            <div className="room-detail-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                <div className="room-detail-content">
                    {/* Image Gallery */}
                    {hasImages ? (
                        <div className="image-gallery">
                            <div className="main-image-container">
                                <img
                                    src={images[currentImageIndex]?.mediaUrl}
                                    alt={room.title}
                                    className="main-image"
                                />
                                
                                {images.length > 1 && (
                                    <>
                                        <button className="nav-button prev" onClick={prevImage}>
                                            <FontAwesomeIcon icon={faChevronLeft} />
                                        </button>
                                        <button className="nav-button next" onClick={nextImage}>
                                            <FontAwesomeIcon icon={faChevronRight} />
                                        </button>
                                    </>
                                )}
                                
                                <div className="image-counter">
                                    {currentImageIndex + 1} / {images.length}
                                </div>
                            </div>
                            
                            {images.length > 1 && (
                                <div className="thumbnail-strip">
                                    {images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image.mediaUrl}
                                            alt={`${room.title} ${index + 1}`}
                                            className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                            onClick={() => setCurrentImageIndex(index)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="no-image-placeholder">
                            <FontAwesomeIcon icon={faExpand} className="placeholder-icon" />
                            <p>Không có hình ảnh</p>
                        </div>
                    )}

                    {/* Room Information */}
                    <div className="room-info">
                        <h2 className="room-title">{room.title}</h2>
                        
                        <div className="room-details">
                            <div className="detail-row">
                                <i className="fas fa-dollar-sign detail-icon"></i>
                                <span className="detail-label">Giá thuê:</span>
                                <span className="detail-value">{formatPrice(room.price)}</span>
                            </div>
                            <div className="detail-row">
                                <i className="fas fa-expand-alt detail-icon"></i>
                                <span className="detail-label">Diện tích:</span>
                                <span className="detail-value">{room.area} m²</span>
                            </div>
                            <div className="detail-row">
                                <i className="fas fa-user detail-icon"></i>
                                <span className="detail-label">Số người ở tối đa:</span>
                                <span className="detail-value">{room.maxOccupants} người</span>
                            </div>
                        </div>

                        <div className="room-address">
                            <i className="fas fa-map-marker-alt address-icon"></i>
                            <span className="address-text">
                                {getFullAddress(room.address)}
                            </span>
                        </div>

                        {((room.furniture && room.furniture.length > 0) || (room.utilities && room.utilities.length > 0)) && (
                            <div className="room-furniture">
                                <h3>Nội thất có sẵn</h3>
                                <div className="furniture-list">
                                    {(room.utilities || room.furniture || []).map((item, index) => (
                                        <span key={index} className="furniture-item">
                                            {/* <i className="fas fa-check furniture-icon"></i> */}
                                            {getFurnitureDisplayName(typeof item === 'string' ? item : item.name || item)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {room.description && (
                            <div className="room-description">
                                <h3>Mô tả chi tiết</h3>
                                <p>{room.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetail;