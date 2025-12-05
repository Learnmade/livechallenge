import { motion } from 'framer-motion'

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    ...props
}) {
    const baseStyles = "relative inline-flex items-center justify-center font-bold transition-all duration-300 rounded-lg overflow-hidden group"

    const variants = {
        primary: "bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 border border-primary-500/20",
        secondary: "bg-surface border border-white/10 hover:border-white/20 text-gray-300 hover:text-white hover:bg-white/5",
        glow: "bg-black text-white border border-primary-500/50 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]",
        ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
    }

    const sizes = {
        sm: "px-4 py-1.5 text-sm",
        md: "px-6 py-2.5 text-base",
        lg: "px-8 py-3.5 text-lg"
    }

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            onClick={onClick}
            {...props}
        >
            <span className="relative z-10 flex items-center gap-2">{children}</span>
            {variant === 'primary' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            )}
        </motion.button>
    )
}
