import { jwtDecode } from "jwt-decode";

export const getUserInfo = () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return {
      isStaff: false,
      isAuthenticated: false,
    };
  }

  try {
    const decoded = jwtDecode(token);
    return {
      isStaff: decoded.is_staff,
      userId: decoded.user_id,
      isAuthenticated: true,
    };
  } catch (err) {
    console.error(err)
    return {
      isStaff: false,
      isAuthenticated: false,
    };
  }
};
