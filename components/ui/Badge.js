export default function Badge({
    children,
    variant = 'default',
    className = ''
}) {
    const variants = {
        default: "bg-white/10 text-gray-300 border-white/10",
        primary: "bg-primary-500/10 text-primary-400 border-primary-500/20",
        success: "bg-green-500/10 text-green-400 border-green-500/20",
        warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        gold: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]"
    }

    return (
        <div className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
      ${variants[variant]}
      ${className}
    `}>
            {children}
        </div>
    )
}
