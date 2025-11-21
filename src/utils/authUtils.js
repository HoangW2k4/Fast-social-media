// Utility functions for JWT token handling and authentication

/**
 * Decode JWT token without verification (for frontend use only)
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded payload or null if invalid
 */
export const decodeJWT = (token) => {
  try {
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));

    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - true if expired
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

/**
 * Get user roles from JWT token
 * @param {string} token - JWT token
 * @returns {string[]} - Array of roles or empty array
 */
export const getUserRoles = (token) => {
  try {
    const decoded = decodeJWT(token);
    return decoded?.roles || [];
  } catch (error) {
    console.error("Error getting user roles:", error);
    return [];
  }
};

/**
 * Get username from JWT token
 * @param {string} token - JWT token
 * @returns {string|null} - Username or null
 */
export const getUsername = (token) => {
  try {
    const decoded = decodeJWT(token);
    return decoded?.sub || null;
  } catch (error) {
    console.error("Error getting username:", error);
    return null;
  }
};

/**
 * Check if user has specific role
 * @param {string} token - JWT token
 * @param {string} role - Role to check (e.g., 'ROLE_USER', 'ROLE_MANAGER')
 * @returns {boolean} - true if user has the role
 */
export const hasRole = (token, role) => {
  try {
    const roles = getUserRoles(token);
    return roles.includes(role);
  } catch (error) {
    console.error("Error checking role:", error);
    return false;
  }
};

/**
 * Check if user is authenticated and token is valid
 * @param {string} token - JWT token
 * @returns {boolean} - true if authenticated
 */
export const isAuthenticated = (token) => {
  return !!(token && !isTokenExpired(token));
};

/**
 * Get user info from token
 * @param {string} token - JWT token
 * @returns {object|null} - User info object or null
 */
export const getUserInfo = (token) => {
  try {
    const decoded = decodeJWT(token);
    if (!decoded) return null;

    return {
      username: decoded.sub,
      roles: decoded.roles || [],
      jti: decoded.jti,
      issuedAt: decoded.iat,
      expiresAt: decoded.exp,
      isExpired: isTokenExpired(token),
    };
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
};

/**
 * Role constants for easy use
 */
export const ROLES = {
  USER: "ROLE_USER",
  MANAGER: "ROLE_MANAGER",
};

/**
 * Get default redirect path based on user role
 * @param {string} token - JWT token
 * @returns {string} - Default path for user role
 */
export const getDefaultPath = (token) => {
  try {
    if (!isAuthenticated(token)) return "/login";

    if (hasRole(token, ROLES.MANAGER)) {
      return "/manager/dashboard";
    } else if (hasRole(token, ROLES.USER)) {
      return "/";
    }

    return "/login";
  } catch (error) {
    console.error("Error getting default path:", error);
    return "/login";
  }
};

/**
 * Clear authentication data from localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole");
};

/**
 * Store authentication data in localStorage
 * @param {string} token - JWT token
 */
export const storeAuthData = (token) => {
  try {
    const userInfo = getUserInfo(token);
    if (userInfo) {
      localStorage.setItem("token", token);
      localStorage.setItem("userName", userInfo.username);
      localStorage.setItem("userRole", JSON.stringify(userInfo.roles));
    }
  } catch (error) {
    console.error("Error storing auth data:", error);
  }
};
