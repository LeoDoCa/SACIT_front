import { jwtDecode } from 'jwt-decode';

export const extractUserIdFromToken = (token) => {
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    const subject = decoded.sub;
    const parts = subject.split(', ');
    if (parts.length === 2) {
      return parts[1]; 
    }
    return null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const extractUuidFromToken = (token) => {
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.uuid; 
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const saveUserIdsToSession = (token) => {
  if (!token) return null;
  
  const userId = extractUserIdFromToken(token);
  const userUuid = extractUuidFromToken(token);
  
  if (userId) sessionStorage.setItem('userId', userId);
  if (userUuid) sessionStorage.setItem('userUuid', userUuid);
  
  return { userId, userUuid };
};

export const getUserIdFromSession = () => {
  return sessionStorage.getItem('userId');
};

export const getUserUuidFromSession = () => {
  return sessionStorage.getItem('userUuid');
};

export const clearUserIdsFromSession = () => {
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('userUuid');
};