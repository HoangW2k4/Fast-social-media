import React, { useState } from 'react';
import './Home.css';
import HomeSidebar from '../../components/homeSidebar/HomeSidebar.jsx';
import HomeHeading from '../../components/homeHeading/HomeHeading.jsx';
import RoomPost from "../../components/posts/RoomPost.jsx";
import RoomDetailPopup from '../../components/roomsDetail/RoomDetailPopup.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import useRooms from '../../hooks/useRooms.js';

function Home() {
  // State để quản lý popup ở trang Home
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [showRoomDetail, setShowRoomDetail] = useState(false);

  // Sử dụng custom hook để quản lý rooms data và logic
  const {
    rooms,
    error,
    filteredRoomsCount,
    hasActiveFilters,
    isEmpty,
    isSearching,
    updateFilters,
    clearFilters,
    refresh,
    observerRef,
    isLoading,
    totalElements,
  } = useRooms();

  // Handler cho search từ HomeHeading
  const handleSearch = (searchData) => {
    console.log('Search triggered with:', searchData);
    updateFilters({
      provinceId: searchData.province,
      districtId: searchData.district,
      wardId: searchData.ward,
      minPrice: searchData.priceFrom,
      maxPrice: searchData.priceTo,
      minArea: searchData.area,
      maxArea: searchData.maxArea,
    });
  };

  // Handlers cho popup
  const openRoomDetail = (roomId) => {
    setSelectedRoomId(roomId);
    setShowRoomDetail(true);
  };

  const closeRoomDetail = () => {
    setShowRoomDetail(false);
    setSelectedRoomId(null);
  };

  // Render loading state
  const renderLoading = () => {
    if (isSearching) {
      return (
        <LoadingSpinner 
          size="large" 
          message="Đang tìm kiếm phòng trọ phù hợp..." 
        />
      );
    }
    return null;
  };

  // Render error state
  const renderError = () => {
    if (error) {
      return (
        <ErrorMessage 
          message={error}
          onRetry={refresh}
          type="error"
        />
      );
    }
    return null;
  };

  // Render empty state
  const renderEmpty = () => {
    if (isEmpty) {
      const message = hasActiveFilters 
        ? "Không tìm thấy phòng nào phù hợp với tiêu chí tìm kiếm của bạn"
        : "Chưa có phòng trọ nào được đăng";
      
      return (
        <div className="empty-state">
          <div className="empty-content">
            <div className="empty-icon">🏠</div>
            <h3 className="empty-title">Không có phòng trọ</h3>
            <p className="empty-message">{message}</p>
            {hasActiveFilters && (
              <button 
                className="empty-clear-btn"
                onClick={clearFilters}
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Render room posts
  const renderRooms = () => {
    if (!rooms || rooms.length === 0) return null;

    try {
      return rooms.map((room, index) => {
        return (
          <div 
            key={`${room.roomId}-${index}`} // Unique key để tránh re-render
            className="room-post-wrapper"
          >
            <RoomPost
              roomId={room.roomId}
              managerName={room.manager?.username || "Chưa có thông tin"}
              managerAvatar={room.manager?.avatar}
              title={room.title || "Không có tiêu đề"}
              description={room.description || "Không có mô tả"}
              price={room.price?.toLocaleString() || '0'}
              area={room.area || 0}
              maxOccupants={room.maxOccupants || 1}
              createdAt={room.createdAt}
              address={room.address || "Chưa có thông tin địa chỉ"}
              addressUrl={room.directionUrl}
              images={room.images || []}
              roomAmenities={room.amenities || []}
              onViewDetails={() => openRoomDetail(room.roomId)}
              onContact={() => {
                // Handle contact action
                console.log('Contact manager for room:', room.roomId, 'Manager:', room.manager);
              }}
            />
          </div>
        );
      });
    } catch (err) {
      console.error('Error rendering rooms:', err);
      return (
        <div className="error-state">
          <p>Có lỗi xảy ra khi hiển thị danh sách phòng</p>
          <button onClick={refresh}>Thử lại</button>
        </div>
      );
    }
  };

  return (
    <div className='home'>
      <HomeHeading onSearch={handleSearch} />
      
      <HomeSidebar
        clearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        filteredCount={filteredRoomsCount}
      />
      
      <div className="main-layout">
        <div className="port-container">

          {/* Loading state */}
          {renderLoading()}

          {/* Error state */}
          {renderError()}

          {/* Empty state */}
          {renderEmpty()}

          {/* Room posts */}
          {renderRooms()}

          {/* Infinite scroll observer */}
          {rooms.length > 0 && rooms.length < totalElements && (
            <div 
              ref={observerRef}
              className="infinite-scroll-trigger"
              style={{ height: '20px', margin: '20px 0' }}
            >
              {isLoading && (
                <LoadingSpinner 
                  size="small" 
                  message="Đang tải thêm phòng..." 
                />
              )}
            </div>
          )}

        </div>
      </div>

      {/* Room Detail Popup */}
      {showRoomDetail && selectedRoomId && (
        <RoomDetailPopup
          roomId={selectedRoomId}
          onClose={closeRoomDetail}
        />
      )}
    </div>
  );
}

export default Home;