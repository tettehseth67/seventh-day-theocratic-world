import React from 'react';
import { motion } from 'motion/react';
import { Shield, Users, Heart, Sparkles, Anchor, BookOpen, Leaf, Stethoscope, GraduationCap, Flame, Cross } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const ministrySections = [
    {
      title: "The Ministry of Preaching",
      subtitle: "Restoration of the True Gospel",
      description: "Our primary mission is the proclamation of the restored Gospel and the Sanctuary Service. We lead the world back to the Mount Sinai Covenant, restoring the authentic system of worship established by Yahweh. Through the preaching of the Word, we prepare souls for the Second Coming of Yeshua Hamashiach.",
      icon: Flame,
      scripture: "Mark 16:15",
      points: ["Mount Sinai Covenant Restoration", "Sanctuary Service Teachings", "Prophetic End-Time Proclamation"]
    },
    {
      title: "The Ministry of Healing",
      subtitle: "Holistic Wellness and Restoration",
      description: "We believe in the total sanctity of the human temple. Our healing ministry employs a divine synergy of natural herbs, biblically-grounded dietary laws, faith-based prayer, and the wisdom of conventional medicine. We believe that all healing is a manifestation of Yahweh's mercy.",
      icon: Stethoscope,
      scripture: "James 5:14",
      points: ["Herbal & Natural Remedies", "Intercessory Prayer", "Integrated Medical Care"]
    },
    {
      title: "The Ministry of Teaching",
      subtitle: "Theocracy Educational Complex",
      description: "Dedicated to holistic human development, our educational complex trains the Hands, the Head, and the Heart. We provide academic excellence rooted in theocratic values, ensuring that our students grow in stature, wisdom, and favor with God and man.",
      icon: GraduationCap,
      scripture: "2 Timothy 2:15",
      points: ["Values-Based Education", "Vocational Training", "Spiritual Mentorship"]
    }
  ];

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
              Our Sacred Ministry
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[0.85] text-brand-ink mb-10 italic tracking-tighter">
              Restoring the <br /> <span className="text-brand-olive">Divine Order</span>
            </h1>
            <p className="text-brand-ink/50 text-xl md:text-2xl font-light italic font-serif leading-relaxed max-w-3xl mx-auto">
              "A global mission dedicated to preaching the restored gospel, 
              holistic healing, and teaching for human development."
            </p>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-brand-gold/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-olive/5 rounded-full blur-[120px]" />
      </section>

      {/* Ministry Sections */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="space-y-40">
            {ministrySections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`grid lg:grid-cols-2 gap-20 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative group">
                    <div className="aspect-[4/5] rounded-[80px] overflow-hidden shadow-2xl relative">
                       <img 
                         src={
                           index === 0 ? "https://images.unsplash.com/photo-1544427928-c49cdfb8194d?auto=format&fit=crop&q=80&w=1200" :
                           index === 1 ? "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1200" :
                           "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200"
                         }
                         alt={section.title}
                         className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                         referrerPolicy="no-referrer"
                       />
                       <div className="absolute inset-0 bg-brand-ink/20 group-hover:bg-transparent transition-all duration-700" />
                    </div>
                    {/* Floating Verse */}
                    <motion.div 
                      initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className={`absolute bottom-10 ${index % 2 === 0 ? '-right-10' : '-left-10'} bg-white/95 backdrop-blur-xl p-8 rounded-[40px] shadow-3xl border border-brand-olive/5 max-w-[240px]`}
                    >
                      <p className="text-brand-olive font-serif italic text-lg mb-2">"{section.scripture}"</p>
                      <div className="w-8 h-[2px] bg-brand-gold" />
                    </motion.div>
                  </div>
                </div>

                <div className="space-y-12">
                   <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-cream flex items-center justify-center text-brand-gold shadow-sm">
                           <section.icon size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">{section.subtitle}</span>
                      </div>
                      <h2 className="text-5xl md:text-6xl font-serif italic text-brand-ink leading-tight tracking-tighter">
                        {section.title}
                      </h2>
                      <p className="text-brand-ink/50 text-xl font-light italic font-serif leading-relaxed">
                        {section.description}
                      </p>
                   </div>

                   <ul className="space-y-6">
                      {section.points.map((point) => (
                        <li key={point} className="flex items-center gap-4 text-brand-ink/60 group">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-gold group-hover:scale-[2] transition-transform" />
                          <span className="text-[11px] font-black uppercase tracking-[0.3em] font-sans">{point}</span>
                        </li>
                      ))}
                   </ul>

                   <div className="pt-6">
                      <Button variant="outline" className="h-16 px-10 rounded-[20px] border-brand-olive/10 text-brand-olive text-[10px] font-black uppercase tracking-[0.4em] hover:bg-brand-olive hover:text-white transition-all duration-500">
                         Inquire Further
                      </Button>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative Section - Legacy & Vision */}

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
