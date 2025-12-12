"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "destructive";
}

let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

function notifyListeners() {
  toastListeners.forEach((listener) => listener([...toasts]));
}

export function toast(options: Omit<Toast, "id">) {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: Toast = { ...options, id };
  toasts = [...toasts, newToast];
  notifyListeners();

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notifyListeners();
  }, 5000);
}

export function Toaster() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    toastListeners.push(setCurrentToasts);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setCurrentToasts);
    };
  }, []);

  const removeToast = (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    notifyListeners();
  };

  if (currentToasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {currentToasts.map((t) => (
        <div
          key={t.id}
          className={`p-4 rounded-lg shadow-lg border flex items-start gap-3 animate-in slide-in-from-right ${
            t.variant === "destructive"
              ? "bg-red-50 border-red-200 text-red-900"
              : t.variant === "success"
              ? "bg-green-50 border-green-200 text-green-900"
              : "bg-card border-border text-card-foreground"
          }`}
        >
          <div className="flex-1">
            <p className="font-medium text-sm">{t.title}</p>
            {t.description && (
              <p className="text-sm opacity-80 mt-1">{t.description}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="opacity-50 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
