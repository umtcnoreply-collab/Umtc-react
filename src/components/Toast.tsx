import { useEffect } from 'react';

type ToastProps = {
  message: string;
  visible: boolean;
  onClose: () => void;
};

export default function Toast({ message, visible, onClose }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed top-6 right-6 z-[200] animate-[slideIn_0.3s_ease-out]">
      <div className="flex items-center gap-3 bg-[#9fcb54] text-white px-6 py-4 rounded-xl shadow-2xl font-['Inter'] font-semibold text-sm">
        <span className="material-symbols-outlined">check_circle</span>
        {message}
      </div>
    </div>
  );
}
