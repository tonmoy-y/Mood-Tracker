const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="flex min-h-[45vh] items-center justify-center">
      <div className="surface-card flex items-center gap-3 px-5 py-3">
        <span className="h-3 w-3 animate-pulse rounded-full bg-[#1d4d8a]" />
        <p className="text-sm font-medium text-slate-700">{message}</p>
      </div>
    </div>
  )
}

export default LoadingScreen
