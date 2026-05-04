import { Church, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CHURCH_NAME } from '../../constants';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
  isDark?: boolean;
}

export default function Logo({ className = "", iconSize = 22, showText = true, isDark = false }: LogoProps) {
  return (
    <Link to="/" className={`flex items-center gap-4 group transition-all ${className}`}>
      <div className="relative">
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-brand-gold/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="w-12 h-12 brand-gradient text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-olive/20 group-hover:rotate-[15deg] group-hover:scale-110 transition-all duration-700 relative z-10 border border-white/20">
          <Church size={iconSize} className="group-hover:scale-110 transition-transform duration-700" />

          {/* Subtle sparkle icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute -top-1 -right-1 bg-brand-gold text-white rounded-full p-1 shadow-lg"
          >
            <Sparkles size={8} fill="white" />
          </motion.div>
        </div>

        {/* Decorative dynamic ring */}
        <div className="absolute inset-0 -m-2 border-2 border-brand-gold/10 rounded-[22px] group-hover:scale-110 group-hover:rotate-[-10deg] transition-all duration-1000 z-0" />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-serif text-3xl font-bold tracking-tighter text-brand-ink leading-none uppercase">
            THEOCRACY
          </span>
          <span className="text-[9px] uppercase tracking-[0.5em] text-brand-gold font-black mt-1.5 opacity-80">
            {CHURCH_NAME}
          </span>
        </div>
      )}
    </Link>
  );
}
