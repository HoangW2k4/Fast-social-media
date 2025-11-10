import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMapMarkerAlt, faMoneyBillWave, faRulerCombined, faUsers,
   faWifi, faSnowflake as faSnowflakeSolid, faChevronRight, faPhone, faMotorcycle, faShirt, faToilet, faThermometerHalf } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import "./RoomPost.css";

function RoomPost({
  managerName,
  managerAvatar,
  roomId, // <-- truyền id bài viết / phòng vào component
  timeAgo,
  title,
  description,
  price,
  area,
  maxOccupants,
  createdAt,
  address,
  addressUrl,
  images,
  roomAmenities,
  onViewDetails, // Handler từ Home để mở popup
}) {
  const [bookmarked, setBookmarked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const videoRefs = useRef({});

  // Tính thời gian đăng nếu không truyền vào
  const getTimeAgo = () => {
    if (timeAgo) return timeAgo;
    if (!createdAt) return "";
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now - createdDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} ngày trước`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths} tháng trước`;
    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears} năm trước`;
  };

  // Map tiện ích sang icon
  const amenityIcons = {
    "Wifi": faWifi,
    "Điều hòa": faSnowflakeSolid,
    "Chỗ để xe": faMotorcycle,
    "Tủ lạnh": faThermometerHalf,
    "Máy giặt": faShirt,
    "Nhà vệ sinh": faToilet,
    // Thêm các tiện ích khác nếu cần
  };

  // Xử lý click media (cả ảnh và video)
  const handleMediaClick = (idx) => {
    // Mở RoomDetail modal khi click ảnh/video (yêu cầu của bạn)
    // nếu cần vẫn có thể giữ hành vi Lightbox — hiện ta mở chi tiết
    if (onViewDetails) {
      onViewDetails();
    }
  };

  // Xử lý lỗi video
  const handleVideoError = (e) => {
    console.error('Video loading error:', e);
    // Có thể thêm fallback image hoặc message
  };

  // Hàm để play video
  const playVideo = (videoId) => {
    const video = videoRefs.current[videoId];
    if (video) {
      video.play().catch(err => {
        console.log('Video autoplay failed:', err);
      });
    }
  };

  // Phân loại media thành video và ảnh
  const videos = images?.filter(url => url.includes('.mp4') || url.includes('.avi') || url.includes('.mov') || url.includes('.webm')) || [];
  const photos = images?.filter(url => !url.includes('.mp4') && !url.includes('.avi') && !url.includes('.mov') && !url.includes('.webm')) || [];
  
  // Ưu tiên video làm media chính
  const mainMedia = videos.length > 0 ? videos[0] : photos[0];
  const isMainVideo = videos.length > 0;
  
  // Số ảnh tối đa hiển thị ở gallery (ví dụ 3)
  const maxGallery = 3;
  const allMedia = [...videos, ...photos];
  const showOverlay = allMedia.length > maxGallery;
  const overlayCount = allMedia.length - maxGallery + 1;

  // Effect để tự động play video khi component mount
  useEffect(() => {
    // Play tất cả video sau một khoảng thời gian ngắn
    const timer = setTimeout(() => {
      Object.keys(videoRefs.current).forEach(videoId => {
        playVideo(videoId);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="room-post">
      <div className="room-header">
        <div className="manager-info">
          <div className="manager-avatar-container">
            {managerAvatar ? (
              <img src={managerAvatar} alt={managerName} className="manager-avatar" />
            ) : (
              <FontAwesomeIcon icon={faUser} className="manager-avatar-icon" />
            )}
          </div>
          <div className="manager-meta">
            <span className="manager-name">{managerName}</span>
            <span className="time-ago">{getTimeAgo()}</span>
          </div>
        </div>
        <button
          className="bookmark-btn"
          title="Lưu tin"
          onClick={() => setBookmarked(!bookmarked)}
        >
          <FontAwesomeIcon
            icon={bookmarked ? faBookmarkSolid : faBookmarkRegular}
            className={bookmarked ? "bookmarked" : ""}
          />
        </button>
      </div>
      <div className="images-gallery">
        {/* Nếu chỉ có 1 media */}
        {allMedia.length === 1 && (
          isMainVideo ? (
            <video 
              ref={el => videoRefs.current['main'] = el}
              src={mainMedia} 
              className="room-image main" 
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster={photos[0] || ''}
              onError={handleVideoError}
              onClick={() => handleMediaClick(0)}
            />
            ) : (
             <img src={mainMedia} alt="room-main" className="room-image main" onClick={() => handleMediaClick(0)} />
           )
        )}
        
        {/* Nếu có 2 media */}
        {allMedia.length === 2 && (
          <>
            {isMainVideo ? (
              <video 
                ref={el => videoRefs.current['main'] = el}
                src={mainMedia} 
                className="room-image half" 
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster={photos[0] || ''}
                onError={handleVideoError}
                onClick={() => handleMediaClick(0)}
              />
                ) : (
               <img src={allMedia[0]} alt="room-0" className="room-image half" onClick={() => handleMediaClick(0)} />
             )}
             <img src={allMedia[1]} alt="room-1" className="room-image half" onClick={() => handleMediaClick(1)} />
          </>
        )}
        
        {/* Nếu có nhiều hơn 2 media */}
        {allMedia.length > 2 && (
          <>
            <div className="main-image-container">
              {isMainVideo ? (
                <video 
                  ref={el => videoRefs.current['main'] = el}
                  src={mainMedia} 
                  className="room-image main" 
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  poster={photos[0] || ''}
                  onError={handleVideoError}
                  onClick={() => handleMediaClick(0)}
                />
                ) : (
                 <img src={allMedia[0]} alt="room-main" className="room-image main" onClick={() => handleMediaClick(0)} />
               )}
            </div>
            <div className="side-images">
              {allMedia.slice(1, maxGallery).map((media, idx) => {
                const isVideo = media.includes('.mp4') || media.includes('.avi') || media.includes('.mov') || media.includes('.webm');
                
                  if (showOverlay && idx === maxGallery - 2) {
                   return (
                     <div className={`side-image-overlay-container clickable`} key={idx} onClick={() => handleMediaClick(idx + 1)}>
                       {isVideo ? (
                         <video 
                           ref={el => videoRefs.current[`side-${idx}`] = el}
                           src={media} 
                           className="room-image side" 
                           autoPlay
                           loop
                           muted
                           playsInline
                           preload="auto"
                         />
                       ) : (
                         <img src={media} alt={`room-side-${idx}`} className="room-image side" />
                       )}
                       <div className="image-overlay">+{overlayCount}</div>
                     </div>
                   );
                 }
                 
                 return isVideo ? (
                   <video 
                     key={idx} 
                     ref={el => videoRefs.current[`side-${idx}`] = el}
                     src={media} 
                     className="room-image side" 
                     autoPlay
                     loop
                     muted
                     playsInline
                     preload="auto"
                     onClick={() => handleMediaClick(idx + 1)}
                   />
                 ) : (
                   <img key={idx} src={media} alt={`room-side-${idx}`} className="room-image side" onClick={() => handleMediaClick(idx + 1)} />
                 );
              })}
            </div>
          </>
        )}
      </div>
      {isOpen && (
        <Lightbox
          mainSrc={allMedia[photoIndex]}
          nextSrc={allMedia[(photoIndex + 1) % allMedia.length]}
          prevSrc={allMedia[(photoIndex + allMedia.length - 1) % allMedia.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + allMedia.length - 1) % allMedia.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % allMedia.length)}
          enableZoom={false}
          clickOutsideToClose={true}
        />
      )}
      
      <div className="room-details">
        <h3 className="room-address">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" style={{color: '#ea4335'}} />
          {addressUrl ? (
            <a
              href={addressUrl}
              className="address-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {address}
            </a>
          ) : (
            address
          )}
        </h3>
        <div className="room-info-row">
          <span className="room-info"><FontAwesomeIcon icon={faMoneyBillWave} className="icon green" /> {price} đ/tháng</span>
          <span className="room-info"><FontAwesomeIcon icon={faRulerCombined} className="icon blue" /> {area} m²</span>
          <span className="room-info"><FontAwesomeIcon icon={faUsers} className="icon orange" /> {maxOccupants} người</span>
        </div>
        <div className="amenities">
          {roomAmenities && roomAmenities.map((amenity, index) => (
            <span key={index} className="amenity">
              {amenityIcons[amenity] && <FontAwesomeIcon icon={amenityIcons[amenity]} className="icon" />} {amenity}
            </span>
          ))}
        </div>
        <div className="room-title">
          <FontAwesomeIcon icon={faChevronRight} className="icon blue" /> {title}
        </div>
      </div>
      <div className="room-actions">
        <button
          className="view-details"
          onClick={onViewDetails}
        >
          <FontAwesomeIcon icon={faChevronRight} /> Xem chi tiết
        </button>
        <button className="contact-now"><FontAwesomeIcon icon={faPhone} /> Liên hệ ngay</button>
      </div>
    </div>
  );
}
 
 export default RoomPost;