import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { roomService } from '../services/roomService';

// Custom hook để quản lý rooms data và logic
export const useRooms = (initialFilters = {}) => {
  // States
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const observerRef = useRef(null);
  // Filter states - match với API thực tế
  const [filters, setFilters] = useState({
    provinceId: '',
    districtId: '',
    wardId: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    page: 0,
    ...initialFilters
  });

  // Pagination states
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch rooms với error handling đơn giản
  const fetchRooms = useCallback(async (searchFilters = filters, isInitialLoad = false) => {
    try {
      setLoading(true);
      setError(null);

      // Sử dụng getRoomsWithDetails để lấy dữ liệu đầy đủ
      const result = await roomService.getRoomsWithDetails(searchFilters);

      // Xử lý response
      if (result && result.content) {
        // Nếu là initial load hoặc filter thay đổi, reset rooms
        // Nếu là load more, append vào rooms hiện tại
        if (isInitialLoad || searchFilters.page === 0) {
          setRooms(result.content);
        } else {
          setRooms(prev => [...prev, ...result.content]);
        }
        
        setTotalElements(result.totalElements || 0);
        setTotalPages(result.totalPages || 0);
        setPageSize(result.size || 8);
        console.log(`Loaded ${result.content.length} rooms, total: ${result.content.length}/${result.totalElements} , page: ${result.totalPages}`);
      } else {  
        if (isInitialLoad || searchFilters.page === 0) {
          setRooms([]);
        }
        setTotalElements(0);
        setTotalPages(0);
      }

    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải danh sách phòng');
      if (isInitialLoad || searchFilters.page === 0) {
        setRooms([]);
      }
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    // Reset rooms và pagination khi filter thay đổi
    setRooms([]);
    setTotalElements(0);
    setTotalPages(0);
    setFilters(prev => ({ ...prev, ...newFilters, page: 0 })); // Reset page khi filter change
    console.log('Filters updated, reset pagination');
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    // Reset rooms và pagination khi clear filters
    setRooms([]);
    setTotalElements(0);
    setTotalPages(0);
    
    const clearedFilters = {
      provinceId: '',
      districtId: '',
      wardId: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      page: 0
    };
    setFilters(clearedFilters);
  }, []);

  // Search rooms với debounce effect
  const searchRooms = useCallback((searchFilters) => {
    updateFilters(searchFilters);
  }, [updateFilters]);

  // Refresh data
  const refresh = useCallback(() => {
    fetchRooms(filters, true);
  }, [fetchRooms, filters]);

  // Computed values
  const filteredRoomsCount = useMemo(() => totalElements, [totalElements]);
  
  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'page') return false; // Ignore page for filter detection
      return value !== '' && value !== null && value !== undefined;
    });
  }, [filters]);

  // Effect to fetch rooms when filters change (với debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Chỉ fetch khi page = 0 (initial load hoặc filter change)
      if (filters.page === 0) {
        fetchRooms(filters, true);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(timeoutId);
  }, [filters, fetchRooms]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initial load
  useEffect(() => {
    // Reset page về 0 khi khởi tạo
    setFilters(prev => ({ ...prev, page: 0 }));
    console.log('Initial load started');
    fetchRooms({ ...filters, page: 0 }, true);
  }, []); // Chỉ chạy 1 lần khi mount

  // Infinite scroll effect
  useEffect(() => {
    if (rooms.length > 0 && rooms.length >= totalElements) {
      console.log('All rooms loaded, no more to fetch');
      return;
    }

    if (isLoading) {
      console.log('Already loading, skip');
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsLoading(true);
        const nextPage = filters.page + 1;
        
        roomService.getRoomsWithDetails({ ...filters, page: nextPage }).then(result => {
          if (result && result.content && result.content.length > 0) {
            // Append rooms mới vào danh sách hiện tại
            setRooms(prev => [...prev, ...result.content]);
            
            // Update filters với page mới
            setFilters(prev => ({ ...prev, page: nextPage }));
            
            if (result.totalElements !== undefined) {
              setTotalElements(result.totalElements);
            }
            if (result.totalPages !== undefined) {
              setTotalPages(result.totalPages);
            }
            console.log(`Loaded ${result.content.length} more rooms. Total: ${rooms.length + result.content.length}/${result.totalElements || totalElements}`);
          } else {
            console.log('No more rooms to load');
          }
          setIsLoading(false);
        }).catch(err => {
          console.error('Error loading more rooms:', err);
          setIsLoading(false);
        });
      }
    }, { 
      root: null, 
      rootMargin: "10px", 
      threshold: 0.1 
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [rooms.length, totalElements, isLoading, filters, observerRef]);

  return {
    // Data
    rooms,
    loading,
    error,
    filters,
    totalElements,
    totalPages,
    pageSize,
    currentPage: filters.page,
    filteredRoomsCount,
    hasActiveFilters,
    isLoading,

    // Actions
    fetchRooms,
    updateFilters,
    clearFilters,
    searchRooms,
    refresh,

    // Computed
    isEmpty: !loading && rooms.length === 0,
    isSearching: loading && rooms.length === 0,
    
    // Ref for infinite scroll
    observerRef,
  };
};

export default useRooms;