export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface space-y-4">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">
          progress_activity
        </span>
      </div>
      <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">
        Memuat Halaman...
      </p>
    </div>
  );
}

