const API_BASE_URL = 'http://localhost:8080';
const getToken = () => localStorage.getItem('token') || '';

// Utility function để tạo headers
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

// Utility function để handle API response
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP Error: ${response.status}`);
  }
  return response.json();
};

// Room Service
export const roomService = {
  // Tìm kiếm phòng với filters và pagination
  async searchRooms(searchParams = {}) {
    try {
      const queryString = new URLSearchParams();
      
      // Thêm các tham số tìm kiếm theo API thực tế
      if (searchParams.provinceId) queryString.append('provinceId', searchParams.provinceId);
      if (searchParams.districtId) queryString.append('districtId', searchParams.districtId);
      if (searchParams.wardId) queryString.append('wardId', searchParams.wardId);
      if (searchParams.minPrice) queryString.append('minPrice', searchParams.minPrice);
      if (searchParams.maxPrice) queryString.append('maxPrice', searchParams.maxPrice);
      if (searchParams.minArea) queryString.append('minArea', searchParams.minArea);
      if (searchParams.maxArea) queryString.append('maxArea', searchParams.maxArea);
      if (searchParams.page !== undefined) queryString.append('page', searchParams.page || 1);
      
      const url = `${API_BASE_URL}/api/rooms/search?${queryString.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error searching rooms:', error);
      throw error;
    }
  },

  // Lấy địa chỉ và direction URL của phòng
  async getRoomAddress(roomId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rooms/getDirectionUrl?roomId=${roomId}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error fetching room address for room ${roomId}:`, error);
      throw error;
    }
  },

  // Lấy media của phòng
  async getRoomMedia(roomId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/room-media/getByRoomId/${roomId}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error fetching room media for room ${roomId}:`, error);
      throw error;
    }
  },

  // Lấy amenities/furniture của phòng
  async getRoomAmenities(roomId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/room-furniture/getByRoomId/${roomId}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error fetching room amenities for room ${roomId}:`, error);
      throw error;
    }
  },

  // Lấy thông tin manager
  async getManagerById(managerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/managers/getById/${managerId}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error fetching manager ${managerId}:`, error);
      throw error;
    }
  },

  // Lấy thông tin đầy đủ của 1 phòng (bao gồm tất cả related data)
  async getRoomDetails(roomId) {
    try {
      const [address, media, amenities] = await Promise.all([
        this.getRoomAddress(roomId).catch(() => null),
        this.getRoomMedia(roomId).catch(() => []),
        this.getRoomAmenities(roomId).catch(() => ({ utility: [] }))
      ]);

      return {
        address,
        media,
        amenities: amenities?.utility || []
      };
    } catch (error) {
      console.error(`Error fetching room details for room ${roomId}:`, error);
      throw error;
    }
  },

  // Lấy danh sách phòng với thông tin đầy đủ
  async getRoomsWithDetails(searchParams = {}) {
    try {
      // Lấy danh sách phòng cơ bản
      const searchResult = await this.searchRooms(searchParams);
      
      if (!searchResult.content || searchResult.content.length === 0) {
        return searchResult;
      }

      // Lấy thông tin chi tiết cho từng phòng
      const roomsWithDetails = await Promise.all(
        searchResult.content.map(async (room) => {
          try {
            const [details, manager] = await Promise.all([
              this.getRoomDetails(room.roomId),
              this.getManagerById(room.managerId).catch(() => null)
            ]);

            // Debug log để xem cấu trúc dữ liệu
            console.log(`Room ${room.roomId} manager:`, manager);
            return {
              ...room,
              address: details.address?.address || '',
              directionUrl: details.address?.directionUrl || '',
              images: details.media?.map(m => m.mediaUrl || m.url || m) || [],
              amenities: details.amenities || [],
              manager: manager || null
            };
          } catch (error) {
            console.error(`Error enriching room ${room.roomId}:`, error);
            // Return room với minimal info nếu có lỗi
            return {
              ...room,
              address: '',
              directionUrl: '',
              images: [],
              amenities: [],
              manager: null
            };
          }
        })
      );

      return {
        ...searchResult,
        content: roomsWithDetails
      };
    } catch (error) {
      console.error('Error fetching rooms with details:', error);
      throw error;
    }
  },
  
};

export default roomService; 