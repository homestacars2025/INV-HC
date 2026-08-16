// Single source of truth for the non-investor rejection, shown both by the sign-in
// action (credentials rejected) and by the login page when the middleware signs an
// already-authenticated non-investor out (?error=not_investor).
export const NOT_INVESTOR_ERROR = "not_investor";
export const NOT_INVESTOR_MESSAGE = "هذه البوابة مخصصة للمستثمرين فقط";
