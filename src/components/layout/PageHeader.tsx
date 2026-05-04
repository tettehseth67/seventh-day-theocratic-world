import { motion } from 'motion/react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  category?: string;
  theme?: 'light' | 'dark';
}

export default function PageHeader({ title, subtitle, category, theme = 'light' }: PageHeaderProps) {
  const isDark = theme === 'dark';
  
  return (
    <section className={`relative pt-32 pb-20 md:pt-52 md:pb-32 overflow-hidden ${isDark ? 'bg-brand-ink text-white' : 'bg-brand-cream text-brand-ink'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-3xl"
        >
          {category && (
            <span className={`inline-block px-3 py-1 rounded-full ${isDark ? 'bg-brand-gold/20 text-brand-gold' : 'bg-brand-olive/10 text-brand-olive'} text-[9px] font-black tracking-[0.4em] uppercase mb-4`}>
              {category}
            </span>
          )}
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-serif leading-[0.9] mb-4 tracking-tighter ${isDark ? 'text-white' : 'text-brand-ink'}`}>
            {title.split(' ').map((word, i) => (
              <span key={i} className={i % 2 !== 0 ? 'italic opacity-90' : ''}>
                {word}{' '}
              </span>
            ))}
          </h1>
          <p className={`text-base md:text-lg leading-relaxed max-w-xl font-light italic font-serif ${isDark ? 'text-white/60' : 'text-brand-ink/60'}`}>
            {subtitle}
          </p>
          <div className="h-0.5 w-10 bg-brand-gold/30 mt-8 rounded-full" />
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -z-0 opacity-20 ${isDark ? 'bg-brand-gold' : 'bg-brand-olive'}`} />
      <div className={`absolute bottom-0 left-0 w-48 h-48 rounded-full blur-[60px] -z-0 opacity-10 ${isDark ? 'bg-brand-olive' : 'bg-brand-gold'}`} />
    </section>
  );
}
