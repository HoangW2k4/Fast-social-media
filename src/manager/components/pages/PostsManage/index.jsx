import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './PostsManage.module.scss';
import classNames from 'classnames/bind';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCirclePlus,
    faPenToSquare,
    faEye,
    faCheck,
    faCloudUploadAlt,
    faSpinner,
    faEllipsisV,
    faMapMarkerAlt,
    faMoneyBillWave,
    faExpand,
    faUser,
    faSnowflake,
    faUtensils,
    faCouch,
} from '@fortawesome/free-solid-svg-icons';

import RoomDetail from './RoomDetail';

const cx = classNames.bind(styles);

const PostsManage = () => {
    const [showPostForm, setShowPostForm] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [amenities, setAmenities] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        area: '',
        maxOccupants: '',
        streetAddress: '',
    });
    const [files, setFiles] = useState([]);
    const [managerInfo, setManagerInfo] = useState({
        userName: '',
        email: '',
        phone: '',
        address: '',
        managerId: 0,
    });
    const [rooms, setRooms] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);

    const fileInputRef = useRef(null);

    const openDetailPopup = (room) => {
        setSelectedRoom(room);
        setIsDetailPopupOpen(true);
    };

    const closeDetailPopup = () => {
        setIsDetailPopupOpen(false);
        setSelectedRoom(null);
    };

    // Fetch manager info from JWT token
    useEffect(() => {
        const fetchManagerInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token not found in localStorage');
                    return;
                }

                const decoded = jwtDecode(token);
                const managerName = decoded.sub;

                const response = await fetch(
                    `http://localhost:8080/api/managers/getByName?managerName=${managerName}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch manager info');
                }
                const data = await response.json();

                setManagerInfo({
                    userName: data.userName || 'Unknown',
                    email: data.email || 'No email provided',
                    phone: data.phone || 'No phone provided',
                    address: data.address || 'No address provided',
                    managerId: data.managerId || 0,
                });
            } catch (error) {
                console.error('Error fetching manager info:', error);
            }
        };

        fetchManagerInfo();
    }, []);

    // Fetch provinces on component mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token not found in localStorage');
                    return;
                }

                const response = await fetch('http://localhost:8080/api/provinces/getAll', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch provinces');
                }
                const data = await response.json();
                setProvinces(data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };

        fetchProvinces();
    }, []);

    // Fetch districts when province changes
    useEffect(() => {
        if (!selectedProvince) {
            setDistricts([]);
            setSelectedDistrict('');
            setWards([]);
            setSelectedWard('');
            return;
        }

        const fetchDistricts = async () => {
            try {
                // Find the selected province data from provinces array
                const selectedProvinceData = provinces.find(
                    (province) => province.provinceId === selectedProvince
                );
                
                if (selectedProvinceData) {
                    setDistricts(selectedProvinceData.districts || []);
                } else {
                    setDistricts([]);
                }
                
                setSelectedDistrict('');
                setWards([]);
                setSelectedWard('');
            } catch (error) {
                console.error('Error fetching districts:', error);
            }
        };

        fetchDistricts();
    }, [selectedProvince, provinces]);

    // Fetch wards when district changes
    useEffect(() => {
        if (!selectedDistrict) {
            setWards([]);
            setSelectedWard('');
            return;
        }

        const fetchWards = async () => {
            try {
                // Find the selected district data from districts array
                const selectedDistrictData = districts.find(
                    (district) => district.districtId === selectedDistrict
                );
                
                if (selectedDistrictData) {
                    setWards(selectedDistrictData.wards || []);
                } else {
                    setWards([]);
                }
                
                setSelectedWard('');
            } catch (error) {
                console.error('Error fetching wards:', error);
            }
        };

        fetchWards();
    }, [selectedDistrict, districts]);

    // Fetch rooms for the current manager
    const fetchRooms = useCallback(async () => {
        if (!managerInfo.managerId) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }

            const response = await fetch(`http://localhost:8080/api/rooms/search/by-manager-id?id=${managerInfo.managerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch rooms');
            }

            const data = await response.json();
            setRooms(data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    }, [managerInfo.managerId]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    const toggleAmenity = (amenity) => {
        if (amenities.includes(amenity)) {
            setAmenities(amenities.filter((item) => item !== amenity));
        } else {
            setAmenities([...amenities, amenity]);
        }
    };

    const handlePostFormToggle = () => {
        setShowPostForm(!showPostForm);
        if (!showPostForm) {
            setFormData({
                title: '',
                description: '',
                price: '',
                area: '',
                maxOccupants: '',
                streetAddress: '',
            });
            setFiles([]);
            setSelectedProvince('');
            setSelectedDistrict('');
            setSelectedWard('');
            setAmenities([]);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleFileChange = (e) => {
        if (!e.target.files) return;
        const newlySelected = Array.from(e.target.files);

        // Cộng dồn các lần chọn và loại bỏ trùng theo name+size
        setFiles((prev) => {
            const uniqueKey = (f) => `${f.name}_${f.size}`;
            const map = new Map(prev.map((f) => [uniqueKey(f), f]));
            newlySelected.forEach((f) => map.set(uniqueKey(f), f));
            return Array.from(map.values());
        });
    };

    // Helper function to get full address for display
    const getDisplayAddress = (address) => {
        if (!address) return 'Địa chỉ không xác định';
        
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }

            if (!managerInfo.managerId) {
                console.error('Manager ID not available');
                return;
            }

            const roomData = {
                managerId: managerInfo.managerId,
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                area: parseFloat(formData.area),
                maxOccupants: formData.maxOccupants ? parseInt(formData.maxOccupants) : 1,
                streetAddress: formData.streetAddress,
                wardId: selectedWard ? parseInt(selectedWard) : null,
            };

            // Gửi room data trước
            const response = await fetch('http://localhost:8080/api/rooms/create', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(roomData),
            });

            if (!response.ok) {
                throw new Error('Failed to create room');
            }

            const roomResult = await response.json();
            console.log('Room created successfully:', roomResult);

            // Sử dụng data từ response của API
            const newRoom = {
                roomId: roomResult.roomId,
                title: roomResult.title,
                description: roomResult.description,
                price: roomResult.price,
                area: roomResult.area,
                maxOccupants: roomResult.maxOccupants,
                isActive: roomResult.isActive,
                managerId: roomResult.managerId,
                createdAt: roomResult.createdAt,
                updatedAt: roomResult.updatedAt,
                address: roomResult.address,
                utilities: roomResult.utilities || amenities,
                medias: roomResult.medias || [],
                // Thêm media từ files đã upload (nếu có)
                media: files.length > 0
                    ? files.map((file, index) => ({
                          mediaId: `temp_${Date.now()}_${index}`,
                          mediaUrl: URL.createObjectURL(file),
                          roomId: roomResult.roomId,
                      }))
                    : [],
            };

            // Upload files nếu có
            if (files.length > 0) {
                try {
                    const formDataFiles = new FormData();
                    files.forEach((file) => {
                        formDataFiles.append('files', file);
                    });

                    const uploadResponse = await fetch(`http://localhost:8080/api/room-media/create?roomId=${roomResult.roomId}`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: formDataFiles,
                    });

                    if (uploadResponse.ok) {
                        const uploadResult = await uploadResponse.json();
                        console.log('Files uploaded successfully:', uploadResult);
                        
                        // uploadResult là array các media objects
                        // Cập nhật medias cho newRoom với cấu trúc mới
                        newRoom.medias = uploadResult.map(media => ({
                            mediaId: media.mediaId,
                            roomId: media.roomId,
                            mediaUrl: media.mediaUrl,
                            uploadedAt: media.uploadedAt
                        }));
                    } else {
                        console.error('Failed to upload files');
                        // Log thêm thông tin lỗi
                        const errorText = await uploadResponse.text();
                        console.error('Upload error details:', errorText);
                    }
                } catch (uploadError) {
                    console.error('Error uploading files:', uploadError);
                }
            }

            // Thêm vào đầu danh sách rooms
            setRooms((prevRooms) => [newRoom, ...prevRooms]);
            console.log('Đã thêm bài viết mới vào danh sách!');

            setShowPostForm(false);
            setFormData({
                title: '',
                description: '',
                price: '',
                area: '',
                maxOccupants: '',
                streetAddress: '',
            });
            setFiles([]);
            setSelectedProvince('');
            setSelectedDistrict('');
            setSelectedWard('');
            setAmenities([]);

            // Refresh danh sách rooms từ server
            await fetchRooms();
        } catch (error) {
            console.error('Error creating room:', error);
            alert('Có lỗi xảy ra khi tạo bài viết. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <div className={cx('header-content')}>
                    <h1 className={cx('title')}>Quản lý bài đăng</h1>
                    <p className={cx('subtitle')}>Quản lý tất cả bài đăng phòng trọ của bạn</p>
                </div>
                <button className={cx('add-post-btn')} onClick={handlePostFormToggle}>
                    <FontAwesomeIcon icon={faCirclePlus} className={cx('add-icon')} />
                    Đăng tin mới
                </button>
            </div>

            {/* Form đăng bài */}
            {showPostForm && (
                <div className={cx('post-form-overlay')} onClick={handlePostFormToggle}>
                    <div className={cx('post-form-modal')} onClick={(e) => e.stopPropagation()}>
                        <div className={cx('form-header')}>
                            <h2 className={cx('form-title')}>Đăng tin phòng trọ mới</h2>
                            <button className={cx('close-btn')} onClick={handlePostFormToggle}>
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={cx('post-form')}>
                            {/* Tiêu đề */}
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor="title">
                                    Tiêu đề <span className={cx('required')}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    className={cx('form-input')}
                                    placeholder="VD: Phòng trọ cao cấp Q1, full nội thất"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            {/* File upload */}
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')}>
                                    Hình ảnh <span className={cx('optional')}>(tối đa 10 ảnh)</span>
                                </label>
                                <div className={cx('upload-area')} onClick={() => fileInputRef.current?.click()}>
                                    <FontAwesomeIcon icon={faCloudUploadAlt} className={cx('upload-icon')} />
                                    <p className={cx('upload-text')}>Nhấp để chọn ảnh hoặc kéo thả vào đây</p>
                                    <p className={cx('upload-hint')}>PNG, JPG, JPEG (tối đa 5MB mỗi ảnh)</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className={cx('file-input')}
                                />

                                {/* Preview ảnh đã chọn */}
                                {files.length > 0 && (
                                    <div className={cx('file-preview-grid')}>
                                        {files.map((file, index) => (
                                            <div key={index} className={cx('file-preview-item')}>
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Preview ${index + 1}`}
                                                    className={cx('preview-image')}
                                                />
                                                <button
                                                    type="button"
                                                    className={cx('remove-file-btn')}
                                                    onClick={() => removeFile(index)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Grid 2 cột cho giá và diện tích */}
                            <div className={cx('form-row')}>
                                <div>
                                    <label className={cx('form-label')} htmlFor="price">
                                        Giá thuê (VNĐ) <span className={cx('required')}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        className={cx('form-input')}
                                        placeholder="VD: 5000000"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={cx('form-label')} htmlFor="area">
                                        Diện tích (m²)
                                    </label>
                                    <input
                                        type="text"
                                        id="area"
                                        className={cx('form-input')}
                                        placeholder="VD: 30.5"
                                        value={formData.area}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div>
                                    <label className={cx('form-label')} htmlFor="maxOccupants">
                                        Số người ở tối đa
                                    </label>
                                    <input
                                        type="number"
                                        id="maxOccupants"
                                        className={cx('form-input')}
                                        placeholder="VD: 3"
                                        value={formData.maxOccupants}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Nội thất */}
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')}>Nội thất</label>
                                <div className={cx('amenities-grid')}>
                                    {['Điều hòa', 'Tủ lạnh', 'Bếp'].map((item) => (
                                        <div key={item} className={cx('amenity-item')}>
                                            <input
                                                type="checkbox"
                                                id={item}
                                                checked={amenities.includes(item)}
                                                onChange={() => toggleAmenity(item)}
                                                className={cx('amenity-checkbox')}
                                            />
                                            <label htmlFor={item} className={cx('amenity-label')}>
                                                {item}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Địa chỉ */}
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')}>
                                    Địa chỉ <span className={cx('required')}>*</span>
                                </label>

                                {/* Grid 3 cột cho địa chỉ */}
                                <div className={cx('address-row')}>
                                    <div>
                                        <label className={cx('form-label')} htmlFor="province">
                                            Tỉnh/Thành phố
                                        </label>
                                        <select
                                            id="province"
                                            className={cx('form-select')}
                                            value={selectedProvince}
                                            onChange={(e) => setSelectedProvince(e.target.value)}
                                        >
                                            <option value="">Chọn Tỉnh/Thành phố</option>
                                            {provinces.map((province) => (
                                                <option key={province.provinceId} value={province.provinceId}>
                                                    {province.provinceName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className={cx('form-label')} htmlFor="district">
                                            Quận/Huyện
                                        </label>
                                        <select
                                            id="district"
                                            className={cx('form-select')}
                                            value={selectedDistrict}
                                            onChange={(e) => setSelectedDistrict(e.target.value)}
                                            disabled={!selectedProvince}
                                        >
                                            <option value="">Chọn Quận/Huyện</option>
                                            {districts.map((district) => (
                                                <option key={district.districtId} value={district.districtId}>
                                                    {district.districtName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className={cx('form-label')} htmlFor="ward">
                                            Phường/Xã
                                        </label>
                                        <select
                                            id="ward"
                                            className={cx('form-select')}
                                            value={selectedWard}
                                            onChange={(e) => setSelectedWard(e.target.value)}
                                            disabled={!selectedDistrict}
                                        >
                                            <option value="">Chọn Phường/Xã</option>
                                            {wards.map((ward) => (
                                                <option key={ward.wardId} value={ward.wardId}>
                                                    {ward.wardName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Địa chỉ chi tiết */}
                                <div style={{ marginTop: '1rem' }}>
                                    <label className={cx('form-label')} htmlFor="streetAddress">
                                        Địa chỉ chi tiết <span className={cx('required')}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="streetAddress"
                                        className={cx('form-input')}
                                        placeholder="VD: 123 Nguyễn Văn A"
                                        value={formData.streetAddress}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Mô tả */}
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor="description">
                                    Mô tả thêm
                                </label>
                                <textarea
                                    id="description"
                                    className={cx('form-textarea')}
                                    placeholder="Nhập mô tả chi tiết về phòng trọ..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>

                            {/* Form actions */}
                            <div className={cx('form-actions')}>
                                <button
                                    type="button"
                                    onClick={handlePostFormToggle}
                                    className={cx('cancel-button')}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={cx('submit-button')}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} className={cx('spinner')} spin />
                                            Đang đăng...
                                        </>
                                    ) : (
                                        'Đăng tin'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Danh sách bài đăng */}
            <div className={cx('posts-grid')}>
                {rooms.length === 0 ? (
                    <div className={cx('empty-state')}>
                        <p>Chưa có bài đăng nào. Hãy tạo bài đăng đầu tiên!</p>
                    </div>
                ) : (
                    rooms.map((room) => (
                        <div key={room.roomId} className={cx('post-card')} onClick={() => openDetailPopup(room)}>
                            <div className={cx('post-image-container')}>
                                {((room.media && room.media.length > 0) || (room.medias && room.medias.length > 0)) ? (
                                    <img
                                        src={(room.medias && room.medias.length > 0) ? room.medias[0].mediaUrl : room.media[0].mediaUrl}
                                        alt={room.title}
                                        className={cx('post-image')}
                                    />
                                ) : (
                                    <div className={cx('no-image')}>
                                        <FontAwesomeIcon icon={faExpand} className={cx('no-image-icon')} />
                                        <span>Không có ảnh</span>
                                    </div>
                                )}
                                <div className={cx('image-count')}>
                                    {room.media ? room.media.length : 0} ảnh
                                </div>
                                <div className={cx('post-status', { active: room.isActive })}>
                                    {room.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
                                </div>
                            </div>

                            <div className={cx('post-content')}>
                                <div className={cx('post-header')}>
                                    <h3 className={cx('post-title')}>{room.title}</h3>
                                    <div className={cx('post-menu')}>
                                        <button
                                            className={cx('menu-button')}
                                            aria-label="Mở menu tùy chọn"
                                            title="Mở menu tùy chọn"
                                        >
                                            <FontAwesomeIcon icon={faEllipsisV} />
                                        </button>
                                        <div className={cx('menu-dropdown')}>
                                            <button className={cx('menu-item')}>
                                                <FontAwesomeIcon icon={faPenToSquare} className={cx('menu-icon')} />
                                                Chỉnh sửa
                                            </button>
                                            <button className={cx('menu-item')}>
                                                {room.isActive ? (
                                                    <FontAwesomeIcon icon={faEye} className={cx('menu-icon')} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faCheck} className={cx('menu-icon')} />
                                                )}
                                                {room.isActive ? 'Ẩn bài đăng' : 'Hiển thị bài đăng'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className={cx('post-details')}>
                                    <div className={cx('detail-item')}>
                                        <FontAwesomeIcon icon={faMoneyBillWave} className={cx('detail-icon')} />
                                        <span className={cx('detail-value', 'price')}>{formatPrice(room.price)}</span>
                                    </div>
                                    <div className={cx('detail-item')}>
                                        <FontAwesomeIcon icon={faExpand} className={cx('detail-icon')} />
                                        <span className={cx('detail-value')}>{room.area} m²</span>
                                    </div>
                                    <div className={cx('detail-item')}>
                                        <FontAwesomeIcon icon={faUser} className={cx('detail-icon')} />
                                        <span className={cx('detail-value')}>{room.maxOccupants} người</span>
                                    </div>
                                </div>

                                <div className={cx('post-amenities')}>
                                    {(room.utilities || room.furniture || [])?.map((item, index) => {
                                        const itemName = typeof item === 'string' ? item : item.name || item;
                                        const amenityMap = {
                                            'Điều hòa': { icon: faCouch, name: 'Điều hòa' }, // Giả sử 'couch' là điều hòa
                                            'Tủ lạnh': { icon: faSnowflake, name: 'Tủ lạnh' },
                                            Bếp: { icon: faUtensils, name: 'Bếp' },
                                        };
                                        const amenity = amenityMap[itemName];
                                        if (!amenity) return null;
                                        return (
                                            <span key={`${itemName}-${index}`} className={cx('amenity-tag')}>
                                                <FontAwesomeIcon
                                                    icon={amenity.icon}
                                                    className={cx('amenity-icon')}
                                                />
                                                {amenity.name}
                                            </span>
                                        );
                                    })}
                                </div>

                                <div className={cx('post-address')}>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className={cx('address-icon')} />
                                    <span className={cx('address-text')}>
                                        {getDisplayAddress(room.address)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Room Detail Popup */}
            {isDetailPopupOpen && <RoomDetail room={selectedRoom} onClose={closeDetailPopup} />}
        </div>
    );
};

export default PostsManage;