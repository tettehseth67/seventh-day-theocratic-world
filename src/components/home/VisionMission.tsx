import React from 'react';
import { motion } from 'motion/react';
import { Target, Compass, Sparkles, Church } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function VisionMission() {
  return (
    <section className="py-32 md:py-64 bg-white relative overflow-hidden">
      {/* Cinematic Textures and Gradients */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold/[0.01] -z-10" />
      <div className="absolute top-1/2 left-0 w-[800px] h-[800px] bg-brand-cream/50 rounded-full blur-[140px] -z-10 -translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-24 lg:gap-36 items-center">
          
          {/* Visual Side: Architectural Frame */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative z-10 p-6 md:p-8 bg-brand-cream rounded-[60px] md:rounded-[80px] shadow-[0_50px_100px_-30px_rgba(90,90,64,0.2)] border border-brand-olive/5">
               <div className="aspect-[4/5] rounded-[40px] md:rounded-[60px] overflow-hidden relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1200" 
                    alt="Sacred Sanctuary" 
                    className="w-full h-full object-cover grayscale-[0.05] contrast-105 group-hover:scale-110 transition-transform duration-[4s]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/80 via-brand-ink/10 to-transparent opacity-80" />
                  
                  {/* Luxury Texture Overlay */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-20 pointer-events-none" />
               </div>
            </div>
            
            {/* Theocratic Credo Tablet */}
            <motion.div 
              initial={{ y: 50, x: 50, opacity: 0 }}
              whileInView={{ y: 0, x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
              className="absolute -bottom-10 md:-bottom-20 -right-4 md:-right-16 bg-white p-10 md:p-14 rounded-[40px] md:rounded-[60px] text-brand-ink shadow-[0_40px_100px_-20px_rgba(90,90,64,0.15)] max-w-sm md:max-w-md z-20 border border-brand-olive/5"
            >
                <div className="w-16 h-16 brand-gradient rounded-2xl flex items-center justify-center mb-10 shadow-xl shadow-brand-olive/20 animate-float">
                  <Sparkles className="w-8 h-8 text-brand-gold" />
                </div>
                <p className="text-xl md:text-2xl font-serif italic leading-[1.3] mb-10 text-brand-ink/80">
                  "Our sanctuary is an architectural homily; where every stone is a prayer and every interaction a divine appointment."
                </p>
                <div className="flex items-center gap-5 pt-8 border-t border-brand-olive/5">
                   <div className="w-12 h-12 rounded-full bg-brand-cream flex items-center justify-center text-brand-gold border border-brand-olive/5">
                      <Church size={20} />
                   </div>
                   <div>
                     <p className="text-[10px] md:text-[11px] uppercase font-black tracking-[0.4em] text-brand-gold">The Oracle Archive</p>
                     <p className="text-xs text-brand-ink/30 italic mt-1">Foundation Year 1994</p>
                   </div>
                </div>
            </motion.div>

            {/* Decorative background circle */}
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-brand-gold/5 rounded-full blur-[100px] -z-10" />
          </motion.div>

          {/* Content Side */}
          <div className="space-y-20 md:space-y-28 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="space-y-10"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1.5px] bg-brand-gold" />
                <span className="text-[11px] font-black uppercase tracking-[0.6em] text-brand-gold">SACRED MISSION</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-serif italic text-brand-ink leading-[0.85] tracking-tighter">
                Cultivating the <br /> <span className="text-brand-olive">Kingdom</span> Presence.
              </h2>
              <p className="text-brand-ink/40 text-xl md:text-2xl leading-relaxed font-serif italic pr-10">
                To establish a spiritually governed community where divine principles manifest through radical love, unwavering truth, and the architectural beauty of faith.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-16">
              {[
                { 
                  title: "Sacred Vision", 
                  desc: "To be the foremost citadel of higher spiritual enlightenment and theocratic leadership.",
                  icon: <Compass className="w-6 h-6" />
                },
                { 
                  title: "Holy Mission", 
                  desc: "Nurturing an environment for genuine divine encounters and biblical stewardship.",
                  icon: <Target className="w-6 h-6" />
                }
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * i, duration: 0.8 }}
                  className="space-y-6 group"
                >
                  <div className="w-16 h-16 bg-brand-cream rounded-3xl flex items-center justify-center text-brand-olive group-hover:bg-brand-olive group-hover:text-white transition-all duration-700 shadow-sm border border-brand-olive/5">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-serif italic text-brand-ink group-hover:text-brand-olive transition-colors">{item.title}</h3>
                  <p className="text-brand-ink/40 text-base leading-relaxed font-serif italic">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            <Button 
               size="lg"
               variant="outline"
               className="h-16 md:h-18 px-10 md:px-12 rounded-2xl md:rounded-3xl border-brand-olive/10 text-brand-olive text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] hover:bg-brand-olive hover:text-white transition-all duration-700 w-full sm:w-auto"
               asChild
            >
               <Link to="/about">Explore Sacred Charter</Link>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
