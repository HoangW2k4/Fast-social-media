import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  getUserInfo, 
  isAuthenticated, 
  hasRole, 
  clearAuthData, 
  storeAuthData, 
  getDefaultPath,
  ROLES 
} from '../utils/authUtils';

// Initial state
const initialState = {
  token: localStorage.getItem('token'),
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.AUTH_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case AUTH_ACTIONS.AUTH_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case AUTH_ACTIONS.AUTH_FAILURE:
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      
      if (token && isAuthenticated(token)) {
        const userInfo = getUserInfo(token);
        if (userInfo) {
          dispatch({
            type: AUTH_ACTIONS.AUTH_SUCCESS,
            payload: {
              token,
              user: userInfo
            }
          });
        } else {
          dispatch({
            type: AUTH_ACTIONS.AUTH_FAILURE,
            payload: { error: 'Invalid token' }
          });
          clearAuthData();
        }
      } else {
        dispatch({
          type: AUTH_ACTIONS.AUTH_FAILURE,
          payload: { error: 'No valid token found' }
        });
        clearAuthData();
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Sai tên đăng nhập hoặc mật khẩu.');
      }

      const data = await response.json();
      
      if (data.token) {
        // Validate and decode token
        if (!isAuthenticated(data.token)) {
          throw new Error('Token không hợp lệ');
        }

        const userInfo = getUserInfo(data.token);
        if (!userInfo) {
          throw new Error('Không thể lấy thông tin người dùng');
        }

        // Store auth data
        storeAuthData(data.token);

        dispatch({
          type: AUTH_ACTIONS.AUTH_SUCCESS,
          payload: {
            token: data.token,
            user: userInfo
          }
        });

        return {
          success: true,
          user: userInfo,
          redirectPath: getDefaultPath(data.token)
        };
      } else {
        throw new Error('Không nhận được token từ server');
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.AUTH_FAILURE,
        payload: { error: error.message }
      });
      
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Logout function
  const logout = () => {
    clearAuthData();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Check if user has specific role
  const checkRole = (role) => {
    return state.token ? hasRole(state.token, role) : false;
  };

  // Check if user is manager
  const isManager = () => checkRole(ROLES.MANAGER);

  // Check if user is regular user
  const isUser = () => checkRole(ROLES.USER);

  // Get user's default redirect path
  const getUserDefaultPath = () => {
    return state.token ? getDefaultPath(state.token) : '/login';
  };

  const value = {
    // State
    ...state,
    
    // Actions
    login,
    logout,
    clearError,
    
    // Helper functions
    checkRole,
    isManager,
    isUser,
    getUserDefaultPath,
    
    // Constants
    ROLES
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Export context for advanced usage
export { AuthContext };
export default AuthProvider;