import { motion } from 'motion/react';
import { ArrowRight, Heart, Users, Church } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CHURCH_NAME } from '../../constants';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section id="home" className="relative pt-44 pb-32 md:pt-64 md:pb-56 overflow-hidden min-h-screen flex items-center bg-[#FCFAFB]">
      {/* Background Ornaments with better color depth and motion */}
      <div className="absolute top-0 right-0 w-[500px] md:w-[1200px] h-[500px] md:h-[1200px] bg-brand-gold/5 rounded-full blur-[120px] md:blur-[200px] -z-10 translate-x-1/3 -translate-y-1/3 animate-pulse duration-[15s]" />
      <div className="absolute bottom-0 left-0 w-[400px] md:w-[900px] h-[400px] md:h-[900px] bg-brand-olive/5 rounded-full blur-[120px] md:blur-[200px] -z-10 -translate-x-1/3 translate-y-1/3 opacity-70" />
      
      {/* Sacred Geometry Texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #5A5A40 1px, transparent 0)', backgroundSize: '48px 48px' }} />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-28 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center justify-center lg:justify-start gap-4 mb-10 md:mb-14">
              <div className="w-12 md:w-16 h-[1.5px] bg-brand-gold rounded-full" />
              <span className="text-[10px] md:text-[11px] font-black tracking-[0.6em] uppercase text-brand-gold">
                DIVINE STEWARDSHIP
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-serif leading-[0.82] text-brand-ink mb-10 md:mb-14 tracking-tighter">
              Where <span className="text-brand-olive">Heaven</span> <br />
              <span className="italic relative inline-block text-brand-ink/90">
                Meets Earth
                <svg className="absolute -bottom-6 md:-bottom-8 left-0 w-full h-8 md:h-12 text-brand-gold/20" viewBox="0 0 100 20">
                  <path d="M0 10 Q 25 20 50 10 T 100 10" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
            </h1>

            <p className="text-base md:text-xl text-brand-ink/40 max-w-xl mx-auto lg:mx-0 mb-12 md:mb-16 leading-relaxed font-serif italic">
              "Experience the convergence of sacred governance and human purpose. A kingdom-minded community dedicated to the architecture of faith."
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-6 items-center justify-center lg:justify-start">
              <Button 
                size="lg"
                className="h-16 md:h-20 px-10 md:px-14 rounded-2xl md:rounded-3xl brand-gradient text-white text-[10px] md:text-[12px] font-black uppercase tracking-[0.34em] hover:shadow-[0_20px_50px_-10px_rgba(90,90,64,0.4)] hover:-translate-y-1.5 transition-all duration-500 group shadow-2xl shadow-brand-olive/5 border-none"
                asChild
              >
                <Link to="/events">
                  Enter Presence 
                  <div className="w-8 h-8 rounded-full bg-white/20 ml-4 flex items-center justify-center group-hover:bg-white/40 transition-colors">
                    <ArrowRight size={16} />
                  </div>
                </Link>
              </Button>
              <Link
                to="/about"
                className="px-10 py-5 text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] text-brand-ink/60 hover:text-brand-gold transition-all duration-500 flex items-center gap-3 decoration-[0.5px] underline-offset-[12px] underline decoration-brand-gold/10 hover:decoration-brand-gold hover:-translate-y-1"
              >
                Our Covenant
              </Link>
            </div>

            <div className="mt-20 md:mt-24 flex items-center justify-center lg:justify-start gap-12 border-t border-brand-olive/5 pt-12">
               <div>
                 <p className="text-3xl md:text-4xl font-serif italic text-brand-ink">5k+</p>
                 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-gold mt-2">Souls Led</p>
               </div>
               <div className="h-10 w-[1px] bg-brand-olive/10" />
               <div>
                 <p className="text-3xl md:text-4xl font-serif italic text-brand-ink">12</p>
                 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-gold mt-2">Missions</p>
               </div>
               <div className="h-10 w-[1px] bg-brand-olive/10" />
               <div className="hidden sm:block text-left">
                  <div className="flex -space-x-4 mb-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-brand-ink/30">Trusted Community</p>
               </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="relative aspect-[4/5] max-w-[560px] mx-auto group">
               {/* Majestic Floating Canvas */}
               <div className="absolute inset-0 bg-brand-olive/5 rounded-[80px] blur-3xl -z-10 group-hover:scale-110 transition-transform duration-[3s]" />
               
               <div className="w-full h-full bg-white rounded-[60px] shadow-[0_60px_130px_-20px_rgba(40,40,20,0.15)] p-5 relative overflow-hidden border border-brand-olive/5">
                  <div className="w-full h-full rounded-[45px] overflow-hidden relative">
                    <img 
                      src="https://images.unsplash.com/photo-1548625361-195fe01823ff?auto=format&fit=crop&q=80&w=1400" 
                      className="w-full h-full object-cover grayscale-[0.1] contrast-105 group-hover:scale-110 transition-transform duration-[4s]"
                      alt="Theocratic Architecture"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/80 via-brand-ink/20 to-transparent opacity-80" />
                    
                    {/* Live Badge */}
                    <div className="absolute top-10 left-10 flex items-center gap-3 bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/20">
                       <span className="relative flex h-2.5 w-2.5">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                       </span>
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Sanctuary Live</span>
                    </div>

                    <div className="absolute bottom-12 left-12 right-12 text-white">
                       <p className="text-brand-gold text-[10px] font-black uppercase tracking-[0.5em] mb-4">Current Revelation</p>
                       <h3 className="text-3xl md:text-4xl font-serif italic leading-tight mb-8">The Sacred Art <br /> of Governance</h3>
                       
                       <Button 
                         variant="outline" 
                         className="h-14 px-8 rounded-2xl bg-white/5 border-white/20 text-white text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-brand-ink transition-all duration-500 backdrop-blur-md"
                       >
                         Watch Path
                       </Button>
                    </div>
                  </div>
               </div>

               {/* Decorative Element */}
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                 className="absolute -top-16 -right-16 w-56 h-56 border border-brand-gold/10 rounded-full flex items-center justify-center -z-10"
               >
                 <div className="w-48 h-48 border border-brand-gold/5 rounded-full" />
               </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
