interface PageErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function PageError({ message, onRetry }: PageErrorProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="glass w-full max-w-sm rounded-3xl p-8 text-center">
        <div className="mb-4 text-4xl">⚠️</div>
        <h2 className="mb-2 text-lg font-bold text-white">Something went wrong</h2>
        <p className="mb-6 text-sm text-slate-400">
          {message ?? "We couldn't load the data. Please check your connection and try again."}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
