const AuthLayout = ({ children }) => {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8">
      <div className="pointer-events-none absolute -left-12 top-20 h-44 w-44 rounded-full bg-sky-200/60 blur-2xl float-slow" />
      <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-indigo-200/50 blur-3xl float-slower" />
      <div className="pointer-events-none absolute bottom-6 left-1/3 h-40 w-40 rounded-full bg-cyan-100/70 blur-2xl float-slow" />

      <div className="mx-auto flex min-h-[86vh] w-full max-w-6xl items-center justify-center rounded-[2rem] border border-white/70 bg-white/55 p-4 shadow-[0_30px_80px_-35px_rgba(17,48,95,0.35)] backdrop-blur-2xl sm:p-8">
        {children}
      </div>
    </main>
  )
}

export default AuthLayout
