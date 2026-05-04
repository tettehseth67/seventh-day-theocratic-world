import React from 'react';
import { motion } from 'motion/react';
import { Shield, Users, Heart, Sparkles, Anchor, BookOpen } from 'lucide-react';

export default function AboutPage() {
  const beliefs = [
    {
      title: "Solitary Truth",
      description: "We believe in the absolute authority of the sacred scriptures as the inspired, unerring word of God.",
      icon: BookOpen
    },
    {
      title: "Radical Love",
      description: "Love is our primary manifestation. We are called to love God with all our essence and our neighbors as ourselves.",
      icon: Heart
    },
    {
      title: "Theocratic Governance",
      description: "We recognize the divine order and leadership established by God for the spiritual nourishment of His people.",
      icon: Shield
    },
    {
      title: "Communal Sanctity",
      description: "Every member is a vital part of the holy body, called to holiness and active participation in the ministry.",
      icon: Users
    }
  ];

  return (
    <div className="pb-32">
      {/* Header */}
      <section className="pt-64 pb-44 bg-brand-cream overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 glass text-brand-olive rounded-full text-[9px] font-black uppercase tracking-[0.4em] mb-10 border border-brand-olive/5">
              <Anchor size={12} className="text-brand-gold" />
              Our Sacred Heritage
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[0.85] text-brand-ink mb-10 italic tracking-tighter">
              Rooted in <br /> <span className="text-brand-olive">Eternal Truth</span>
            </h1>
            <p className="text-brand-ink/50 text-lg md:text-xl font-light italic font-serif leading-relaxed max-w-3xl mx-auto">
              "A global sanctuary dedicated to the manifestation of theocratic values, 
              spiritual transformation, and the uncompromised truth of the eternal Father."
            </p>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-brand-gold/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-olive/5 rounded-full blur-[120px]" />
      </section>

      {/* Narrative Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 1 }}
               className="relative"
             >
                <div className="aspect-[4/5] rounded-[64px] overflow-hidden shadow-2xl shadow-brand-olive/20 border-6 border-white">
                  <img 
                    src="https://images.unsplash.com/photo-1544427928-c49cdfb8194d?auto=format&fit=crop&q=80&w=1200" 
                    alt="Theocratic Fellowship" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-10 -right-10 w-56 h-56 brand-gradient rounded-[48px] flex items-center justify-center text-white shadow-2xl rotate-6 p-10 border-4 border-white">
                   <p className="font-serif italic text-xl text-center leading-relaxed">"Rooted in Sovereign Grace & Eternal Purpose."</p>
                </div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="space-y-12"
             >
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-[1px] bg-brand-gold" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">Our Narrative</span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-serif italic text-brand-ink leading-tight">An Ascension of Faith</h2>
                  <p className="text-brand-ink/50 leading-relaxed font-light text-xl italic font-serif">
                    Established decades ago, our congregation began as a small gathering of truth-seekers yearning for a deeper, more intentional relationship with the Divine. What started as a divine spark has grown into a global manifestation of faith.
                  </p>
                  <p className="text-brand-ink/50 leading-relaxed font-light text-xl italic font-serif">
                    We remain committed to the original vision: to be a beacon of light in a shifting world, anchored in the immutable principles of theocratic governance and sacred worship.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-12 py-12 border-y border-brand-olive/10">
                  <div>
                    <p className="text-6xl font-serif italic text-brand-olive mb-4">40+</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-ink/30">Years of Service</p>
                  </div>
                  <div>
                    <p className="text-6xl font-serif italic text-brand-olive mb-4">200+</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-ink/30">Global Spires</p>
                  </div>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Core Beliefs */}
      <section className="py-32 bg-brand-cream/30 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[150px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="text-center mb-20 space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-10 h-[1px] bg-brand-gold" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">Foundational Pillars</span>
              <div className="w-10 h-[1px] bg-brand-gold" />
            </div>
            <h2 className="text-4xl md:text-6xl font-serif italic text-brand-ink">Our Sacred Creed</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beliefs.map((belief, i) => (
              <motion.div 
                key={belief.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="bg-white p-10 rounded-[48px] border border-brand-olive/5 shadow-sm hover:shadow-2xl hover:translate-y-[-12px] transition-all duration-700 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-3xl group-hover:bg-brand-olive/5 transition-all" />
                
                <div className="w-16 h-16 bg-brand-cream rounded-2xl flex items-center justify-center mb-8 text-brand-olive group-hover:brand-gradient group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-sm relative z-10">
                  <belief.icon size={28} />
                </div>
                <h3 className="text-2xl font-serif italic text-brand-ink mb-4 relative z-10">{belief.title}</h3>
                <p className="text-brand-ink/40 text-sm leading-relaxed font-light italic font-serif relative z-10 group-hover:text-brand-ink/60 transition-colors">{belief.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="brand-gradient rounded-[64px] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(90,90,64,0.4)]">
             <div className="relative z-10 space-y-10">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12">
                  <Sparkles size={32} className="text-brand-gold animate-pulse" />
                </div>
                <h2 className="text-5xl md:text-7xl font-serif italic leading-[0.9] tracking-tight">Gather with <br /> the Saints</h2>
                <p className="text-white/60 text-lg md:text-xl font-light max-w-2xl mx-auto italic font-serif">
                  "Every soul seeking the uncompromised frequency of Divine Truth is welcomed into the fold of theocratically aligned fellowship."
                </p>
                <div className="pt-10">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white text-brand-olive px-12 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-black/20 hover:bg-brand-gold hover:text-white transition-all"
                  >
                    Locate Sanctuaries
                  </motion.button>
                </div>
             </div>
             
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10 pointer-events-none" />
             <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-gold/20 rounded-full blur-[120px]" />
             <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-[120px]" />
          </div>
        </div>
      </section>
    </div>
  );
}
