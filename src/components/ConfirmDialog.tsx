"use client";

interface ConfirmDialogProps {
  show: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  show,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Dialog Card - Sharp layout */}
      <div className="relative bg-white dark:bg-slate-900 rounded-none shadow-2xl border-2 border-slate-900 dark:border-slate-100 max-w-sm w-full p-5 sm:p-6 transform transition-all scale-100 animate-scale-in animate-duration-200">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-300 dark:border-amber-800 rounded-none">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest font-mono">
              VERIFICATION REQUIRED
            </h4>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-sans font-medium">
            {message}
          </p>

          <div className="flex justify-end gap-2.5 mt-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-none border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 rounded-none border border-slate-900 dark:border-slate-100 transition-all shadow-sm cursor-pointer"
            >
              Confirm Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
