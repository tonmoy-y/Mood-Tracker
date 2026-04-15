const Button = ({ children, variant = 'primary', className = '', ...rest }) => {
  const variants = {
    primary:
      'bg-gradient-to-r from-[#1d4d8a] to-[#2e66ad] text-white shadow-md shadow-sky-900/20 hover:from-[#174074] hover:to-[#255792] disabled:from-slate-400 disabled:to-slate-400',
    ghost:
      'border border-slate-200 bg-white/90 text-slate-700 hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400',
    danger: 'bg-rose-600 text-white shadow-sm hover:bg-rose-700 disabled:bg-rose-300',
  }

  return (
    <button
      className={[
        'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed',
        variants[variant],
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
