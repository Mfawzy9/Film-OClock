import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number; // Token expiration time in seconds
  [key: string]: string | number | undefined;
}

const getDecodedToken = (idToken: string): DecodedToken | null => {
  try {
    return jwtDecode(idToken);
  } catch (error) {
    console.error("Error decoding token", error);
    return null;
  }
};

export const isTokenExpired = (idToken: string): boolean => {
  const decoded = getDecodedToken(idToken);
  if (decoded && decoded.exp) {
    const expiryTime = decoded.exp * 1000;
    const currentTime = Date.now();
    return currentTime >= expiryTime;
  }
  return true;
};
