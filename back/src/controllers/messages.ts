export const BOOKING_MESSAGES = {
  SUCCESS_UPDATE: "התור עודכן בהצלחה",
  FAIL_NEW_BOOKING: "שגיאה בעת הזמנת התור, אנא נסה שנית",
  FAIL_UPDATE_BOOKING: "שגיאה בעת עדכון התור, אנא נסה שנית",
  FAIL_CANCEL_BOOKING: "שגיאה בעת ביטול התור, אנא נסה שנית",
};

export const GENERAL_MESSAGES = {
  UNKNOWN_ERROR: "An unknown error occurred.",
  PARAMETERS_NOT_PROVIDED: "Required parameters were not provided",
  API_ERROR: "API request failed.",
};

export const AVAILABILITY_MESSAGES = {
  FAIL_GET_AVAILABILITIES: "לא נמצאו זמינויות",
  OVERLAP_AVAILABILITIES: "קיימים התנגשויות בין תורים קיימים",
  FAIL_REMOVE_TIME: "שגיאה בעת מחיקת הזמינות",
  REMOVE_SUCCESS: "התורים נמחקו בהצלחה"
};

export const USER_MESSAGE = {
  NOT_FOUND: "User not found",
  LOGIN: "LOGGED IN",
  LOGOUT: "User logged out",
  INVALID_DETAILS: "אחד הפרטים שהוזנו שגויים"
}

export const JWT_MESSAGES = {
  AUTH_HEADER_MISSING: "Authorization header is missing",
  TOKEN_MISSING: "Token is missing",
  VERIFICATION_FAILED: "Token verification failed: ",
  INVALID_TOKEN: "Invalid token",
  UNAUTHORIZED: "אינך מורשה!"
}