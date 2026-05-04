import Hero from '../components/home/Hero';
import EventsSection from '../components/home/EventsSection';
import VisionMission from '../components/home/VisionMission';
import { motion } from 'motion/react';
import { ArrowRight, Heart, Users, Radio, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CHURCH_NAME } from '../constants';

export default function HomePage() {
  return (
    <div className="pb-32">
      <Hero />
      
      {/* Quick Links Section */}
      <section className="py-32 md:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cream text-brand-olive rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                <Sparkles size={12} />
                Spiritual Pathways
              </div>
              <h2 className="text-3xl md:text-4xl font-serif italic text-brand-ink">How we serve you</h2>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
              <Link to="/livestream" className="group p-8 rounded-[32px] bg-brand-ink text-white hover:bg-brand-olive transition-all duration-700 shadow-2xl shadow-brand-ink/10 relative overflow-hidden">
                 <div className="relative z-10">
                   <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/5 transition-transform group-hover:scale-110">
                    <Radio className="w-8 h-8 text-brand-gold" />
                   </div>
                   <h3 className="text-2xl font-serif mb-3 italic">The Live Altar</h3>
                   <p className="text-white/50 mb-8 text-sm leading-relaxed">Experience our theocratic worship through the divine medium of live broadcast.</p>
                   <span className="inline-flex items-center gap-2 text-brand-gold font-bold text-[10px] uppercase tracking-widest">
                      Watch Live Broadcast <ArrowRight className="w-4 h-4" />
                   </span>
                 </div>
                 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-gold/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>

              <Link to="/give" className="group p-8 rounded-[32px] bg-brand-cream border border-brand-olive/5 hover:bg-white hover:shadow-2xl hover:shadow-brand-olive/5 transition-all duration-700 relative overflow-hidden">
                 <div className="relative z-10">
                   <div className="w-16 h-16 bg-brand-olive/5 rounded-2xl flex items-center justify-center mb-6 border border-brand-olive/5 transition-transform group-hover:scale-110">
                    <Heart className="w-8 h-8 text-brand-olive" />
                   </div>
                   <h3 className="text-2xl font-serif mb-3 italic text-brand-ink">A Graceful Gift</h3>
                   <p className="text-brand-ink/50 mb-8 text-sm leading-relaxed">Support the expansion of the sanctuary through your holy contributions and tithes.</p>
                   <span className="inline-flex items-center gap-2 text-brand-olive font-bold text-[10px] uppercase tracking-widest">
                      Proceed to Offering <ArrowRight className="w-4 h-4" />
                   </span>
                 </div>
              </Link>

              <Link to="/directory" className="group p-8 rounded-[32px] bg-brand-cream border border-brand-olive/5 hover:bg-white hover:shadow-2xl hover:shadow-brand-olive/5 transition-all duration-700 relative overflow-hidden">
                 <div className="relative z-10">
                   <div className="w-16 h-16 bg-brand-olive/5 rounded-2xl flex items-center justify-center mb-6 border border-brand-olive/5 transition-transform group-hover:scale-110">
                    <Users className="w-8 h-8 text-brand-olive" />
                   </div>
                   <h3 className="text-2xl font-serif mb-3 italic text-brand-ink">Our Shepherdry</h3>
                   <p className="text-brand-ink/50 mb-8 text-sm leading-relaxed">Connect with the elders and ministries that form the pillar of our congregation.</p>
                   <span className="inline-flex items-center gap-2 text-brand-olive font-bold text-[10px] uppercase tracking-widest">
                      View the Directory <ArrowRight className="w-4 h-4" />
                   </span>
                 </div>
              </Link>
           </div>
        </div>
      </section>

      <VisionMission />

      <EventsSection />
      
      {/* Featured Sermon CTA */}
       <section className="py-32 md:py-48 bg-brand-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-brand-olive rounded-[40px] p-8 md:p-14 text-white relative shadow-2xl shadow-brand-olive/20">
              <div className="max-w-2xl relative z-10">
                 <div className="inline-block px-4 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-gold mb-8">Featured Lesson</div>
                 <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight italic">Rooted in Eternal Truth, <br /> Growing in the Holy Spirit.</h2>
                 <p className="text-white/70 mb-10 text-lg font-light leading-relaxed">Browse our full archive of transformational messages and sermons from our theocratic world congregation, preserved for your spiritual growth.</p>
                 <Link to="/sermons" className="inline-flex items-center gap-4 bg-white text-brand-olive px-8 py-4 rounded-2xl font-bold hover:bg-brand-gold hover:text-white transition-all shadow-xl shadow-black/10">
                    Explore {CHURCH_NAME} <ArrowRight className="w-5 h-5" />
                 </Link>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-gold/10 to-transparent pointer-events-none" />
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-gold/20 rounded-full blur-[120px] pointer-events-none transition-all duration-1000 group-hover:scale-110" />
           </div>
        </div>
      </section>
    </div>
  );
}
