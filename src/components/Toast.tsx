"use client";
import { createContext, useContext, useState, useCallback } from "react";

interface ToastContextType {
  showToast: (msg: string, type: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error"; visible: boolean } | null>(null);

  const showToast = useCallback((msg: string, type: "success" | "error") => {
    setToast({ msg, type, visible: true });
    setTimeout(() => setToast(null), 2000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999]`}
             style={{ minWidth: 220 }}>
          <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} shadow-lg animate-fade-in`}> 
            <span>{toast.msg}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
} 