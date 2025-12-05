import { motion } from 'framer-motion'

export default function Card({
    children,
    className = '',
    hover = true,
    glass = true,
    ...props
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={hover ? { y: -5, boxShadow: "0 20px 40px -15px rgba(124, 58, 237, 0.2)" } : {}}
            className={`
        relative overflow-hidden rounded-xl p-6
        ${glass ? 'bg-surface/50 backdrop-blur-xl border border-white/10' : 'bg-surface'}
        ${className}
      `}
            {...props}
        >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    )
}
