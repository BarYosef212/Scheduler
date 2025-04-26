export const BOOKING_MESSAGES = {
  SUCCESS_UPDATE: "התור עודכן בהצלחה",
  FAIL_NEW_BOOKING: "שגיאה בעת הזמנת התור, אנא נסה שנית",
  FAIL_UPDATE_BOOKING: "שגיאה בעת עדכון התור, אנא נסה שנית",
  FAIL_CANCEL_BOOKING: "שגיאה בעת ביטול התור, אנא נסה שנית",
  BOOKING_ALREADY_EXISTS: "קיימת ללקוח זה הזמנה באותו יום, לא ניתן לבצע הזמנה נוספת",
  GOOGLE_EVENT_CREATION_FAILED: "שגיאה ביצירת האירוע ביומן Google, אנא נסה שנית",
  ERROR:'שגיאה בעת הזמנת התור, אנא נסה שנית'
};

export const GENERAL_MESSAGES = {
  UNKNOWN_ERROR: "An unknown error occurred.",
  PARAMETERS_NOT_PROVIDED: "Required parameters were not provided",
  API_ERROR: "API request failed.",
  SUCCESS: "הפעולה בוצעה בהצלחה",
  INVALID_PARAMS: "The provided parameters are invalid."
};

export const AVAILABILITY_MESSAGES = {
  FAIL_GET_AVAILABILITIES: "לא נמצאו זמינויות",
  OVERLAP_AVAILABILITIES: "קיימים התנגשויות בין תורים קיימים",
  FAIL_REMOVE_TIME: "שגיאה בעת מחיקת הזמינות",
  REMOVE_SUCCESS: "התורים נמחקו בהצלחה",
  UPDATE_FAILED: "העדכון נכשל",
  TIME_SLOT_UNAVAILABLE: "הזמן המבוקש אינו זמין",
  NOT_FOUND: "הזמינות לא נמצאה",
  TIME_SLOT_ALREADY_EXISTS: "הזמן המבוקש כבר קיים בזמינות"
};

export const USER_MESSAGE = {
  NOT_FOUND: "המשתמש לא נמצא",
  LOGIN: "התחברת בהצלחה",
  LOGOUT: "התנתקת בהצלחה",
  INVALID_DETAILS: "השם משתמש או הסיסמה שהזנת שגויים, אנא נסה שוב",
  UPDATE_FAILED:"העדכון נכשל אנא נסה שוב",
  REGISTER:'המשתמש נרשם בהצלחה'
}

export const JWT_MESSAGES = {
  AUTH_HEADER_MISSING: "Authorization header is missing",
  TOKEN_MISSING: "Token is missing",
  VERIFICATION_FAILED: "Token verification failed: ",
  INVALID_TOKEN: "Invalid token",
  UNAUTHORIZED: "אינך מורשה!"
}

