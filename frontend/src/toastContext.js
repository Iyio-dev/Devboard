import { createContext, useContext } from "react";

// Toast context lives in its own file so components can import the
// useToast hook without pulling in the ToastProvider component
// (keeps react-fast-refresh happy).
export const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);
