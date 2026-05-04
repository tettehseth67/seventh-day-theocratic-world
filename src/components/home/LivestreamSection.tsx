import { motion, AnimatePresence } from 'motion/react';
import { Radio, Users, Heart, MessageSquare, Send, Share2, Maximize2, Volume2, Info, Sparkles, ArrowRight } from 'lucide-react';
import { LIVESTREAM_URL } from '../../constants';
import { useState, useEffect, useRef } from 'react';
import { createPrayerRequest } from '../../services/dataService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

const MOCK_PRAYER_REQUESTS = [
  { id: 1, name: 'Sister Miriam', request: 'Healing for the family', time: '2m ago', active: true },
  { id: 2, name: 'Brother David', request: 'Travel mercies for missionary work', time: '5m ago', active: true },
  { id: 3, name: 'Deacon John', request: 'Inspirational wisdom for the youth', time: '12m ago', active: true },
  { id: 4, name: 'Sister Sarah', request: 'Gratitude for a new beginnings', time: '15m ago', active: true },
];

export default function LivestreamSection() {
  const { user } = useAuth();
  const [prayerText, setPrayerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'info'>('chat');
  const [viewerCount, setViewerCount] = useState(1248);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeTab]);

  const handleSubmitPrayer = async () => {
    if (!prayerText.trim()) return;

    setIsSubmitting(true);
    try {
      if (user) {
        await createPrayerRequest({
          name: user.displayName || 'Guest',
          request: prayerText,
          userId: user.uid
        });
        setPrayerText('');
        toast.success('Incense of prayer transmitted to the Altar.');
      } else {
        toast.error('Identity required for intercession. Please join the fold.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Transmission failed. Recalibrate connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="livestream" className="py-24 md:py-32 bg-white text-brand-ink overflow-hidden relative">
      {/* Dynamic Atmospheric Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(234,179,8,0.05)_0%,_transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
        
        {/* Drifting Sacred Orbs */}
        <motion.div 
          animate={{ y: [0, -40, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 right-[10%] w-[500px] h-[500px] bg-brand-gold/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ y: [0, 60, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 left-[5%] w-[400px] h-[400px] bg-brand-olive/5 rounded-full blur-[100px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Transmission Area */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-0.5 bg-red-600 rounded-full animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white">Live</span>
                </div>
                <div className="h-[1px] w-10 bg-white/10" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-gold">Global Access</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic mb-1 tracking-tighter leading-none">
                Sacred <span className="text-brand-gold">Connectivity</span>
              </h2>
            </motion.div>
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.98 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="relative group lg:shadow-[0_60px_100px_-20px_rgba(0,0,0,0.6)] rounded-2xl lg:rounded-[32px] overflow-hidden border border-white/10"
            >
              <div className="aspect-video relative overflow-hidden bg-black">
                <iframe
                  src={LIVESTREAM_URL}
                  title="Church Livestream"
                  className="w-full h-full grayscale hover:grayscale-0 transition-all duration-1000 opacity-80 group-hover:opacity-100"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                ></iframe>

                {/* Video Overlays */}
                <div className="absolute top-6 left-6 flex items-center gap-4 pointer-events-none z-20">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                    <Users size={14} className="text-brand-gold" />
                    <span className="text-[10px] font-black text-white tabular-nums">{viewerCount.toLocaleString()} Members</span>
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 flex items-center gap-3 z-20">
                  <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white/60 hover:text-brand-gold hover:border-brand-gold/30 transition-all border border-white/20">
                    <Maximize2 size={16} />
                  </button>
                  <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white/60 hover:text-brand-gold hover:border-brand-gold/30 transition-all border border-white/20">
                    <Volume2 size={16} />
                  </button>
                </div>
              </div>

              {/* Player Status Bar */}
              <div className="bg-brand-cream/20 backdrop-blur-3xl border-t border-brand-olive/10 p-6 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full brand-gradient flex items-center justify-center shadow-lg">
                      <Radio size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-ink/40 leading-none mb-1">Status</p>
                      <p className="text-xs font-serif italic text-brand-ink/90">Theocratic Stream 4K</p>
                    </div>
                  </div>
                  <div className="w-[1px] h-8 bg-brand-ink/10 hidden sm:block" />
                  <div className="hidden sm:flex items-center gap-3">
                    <Sparkles size={14} className="text-brand-olive" />
                    <p className="text-xs font-serif italic text-brand-ink/60">Transferred via Spiritual Fiber</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <a href="https://youtube.com/@example" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-brand-ink/5 hover:bg-brand-ink/10 rounded-xl border border-brand-ink/5 transition-all text-[10px] font-black uppercase tracking-widest text-brand-ink/60 hover:text-brand-ink">
                    <Share2 size={14} /> YouTube Live
                  </a>
                  <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-brand-ink/5 hover:bg-brand-ink/10 rounded-xl border border-brand-ink/5 transition-all text-[10px] font-black uppercase tracking-widest text-brand-ink/60 hover:text-brand-ink">
                    <Radio size={14} /> Podcast
                  </a>
                  <button className="flex items-center gap-2 px-5 py-2.5 brand-gradient text-white rounded-xl shadow-xl hover:-translate-y-0.5 transition-all text-[10px] font-black uppercase tracking-widest">
                    <Heart size={14} /> Bless Now
                  </button>
                </div>
              </div>
            </motion.div>

            <div className="flex flex-wrap gap-8 items-center justify-start opacity-40 hover:opacity-100 transition-opacity">
               {['#FAITH_UNLIMITED', '#DIASPORA_SPIRE', '#THEOCRATIC_UNITY', '#SACRED_TECH'].map(tag => (
                  <span key={tag} className="text-[9px] font-black uppercase tracking-[0.4em] bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-white/60">{tag}</span>
               ))}
            </div>
          </div>

              {/* Interaction Pane */}
          <div className="lg:col-span-4 space-y-6 h-fit lg:sticky lg:top-24">
            <div className="bg-white border border-brand-olive/10 rounded-[32px] flex flex-col h-[580px] shadow-2xl relative overflow-hidden group/pane">
               {/* Pane Header Tabs */}
               <div className="flex border-b border-brand-olive/5 p-1.5 bg-brand-cream/20">
                 <button 
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${activeTab === 'chat' ? 'bg-white text-brand-olive shadow-sm' : 'text-brand-ink/40 hover:text-brand-ink/60'}`}
                 >
                   <MessageSquare size={14} />
                   <span className="text-[9px] font-black uppercase tracking-widest">Intercession</span>
                 </button>
                 <button 
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${activeTab === 'info' ? 'bg-white text-brand-olive shadow-sm' : 'text-brand-ink/40 hover:text-brand-ink/60'}`}
                 >
                   <Info size={14} />
                   <span className="text-[9px] font-black uppercase tracking-widest">Liturgy</span>
                 </button>
               </div>

               <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto custom-scrollbar relative">
                 <AnimatePresence mode="wait">
                   {activeTab === 'chat' ? (
                     <motion.div 
                        key="chat"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                     >
                       {MOCK_PRAYER_REQUESTS.map((req) => (
                         <div key={req.id} className="relative group/msg">
                           <div className="flex justify-between items-center mb-1.5">
                             <div className="flex items-center gap-2.5">
                               <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/60" />
                               <span className="text-[9px] font-black uppercase tracking-widest text-brand-ink/40">{req.name}</span>
                             </div>
                             <span className="text-[8px] text-brand-ink/20 font-black uppercase tracking-widest">{req.time}</span>
                           </div>
                           <div className="pl-3 border-l border-brand-olive/10 group-hover/msg:border-brand-gold/30 transition-all">
                             <p className="text-[14px] text-brand-ink/70 italic font-serif leading-relaxed">"{req.request}"</p>
                           </div>
                         </div>
                       ))}
                     </motion.div>
                   ) : (
                     <motion.div 
                        key="info"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-5"
                     >
                        <div className="space-y-1.5">
                          <h4 className="text-[9px] font-black uppercase tracking-widest text-brand-gold">Current Proceeding</h4>
                          <p className="text-lg font-serif text-brand-ink">The Theology of Diaspora</p>
                        </div>
                        <div className="space-y-3">
                          <div className="p-3.5 bg-brand-cream/30 rounded-xl border border-brand-olive/5">
                            <p className="text-[9px] font-black uppercase tracking-widest text-brand-ink/30 mb-1.5">Presiding Elder</p>
                            <p className="text-sm font-serif text-brand-olive italic">Dr. Emmanuel Mensah</p>
                          </div>
                          <div className="p-3.5 bg-brand-cream/30 rounded-xl border border-brand-olive/5">
                            <p className="text-[9px] font-black uppercase tracking-widest text-brand-ink/30 mb-1.5">Theme Scripture</p>
                            <p className="text-sm font-serif text-brand-ink/70 italic">Isaiah 43:19</p>
                          </div>
                        </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>

               {/* Interaction Input */}
               <div className="p-4 border-t border-brand-olive/5 bg-brand-cream/10">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={prayerText}
                      onChange={(e) => setPrayerText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmitPrayer()}
                      placeholder={user ? "Transmit intercession..." : "Join to transmit..."}
                      disabled={isSubmitting || !user}
                      className="w-full bg-white border border-brand-olive/10 rounded-xl py-4 pl-6 pr-14 text-sm text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-gold/40 transition-all font-serif italic disabled:opacity-50 shadow-sm"
                    />
                    <button 
                      onClick={handleSubmitPrayer}
                      disabled={isSubmitting || !user}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 brand-gradient text-white rounded-lg hover:shadow-[0_10px_30px_rgba(234,179,8,0.3)] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center disabled:opacity-50"
                    >
                      <Send size={16} className={isSubmitting ? 'animate-spin' : 'text-white'} />
                    </button>
                  </div>
                  {!user && (
                    <p className="text-center mt-3 text-[8px] font-black uppercase tracking-widest text-brand-ink/20">
                      Identity verification required
                    </p>
                  )}
               </div>
            </div>

            {/* CTA Widget */}
            <motion.div 
               whileHover={{ y: -5 }}
               className="group relative brand-gradient rounded-[24px] p-5 lg:p-6 flex items-center gap-5 overflow-hidden cursor-pointer shadow-2xl hover:shadow-brand-gold/40 transition-all"
               onClick={() => (window.location.href = '/give')}
            >
               <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="w-14 h-14 rounded-xl bg-white/20 glass flex items-center justify-center text-white shrink-0 rotate-[10deg] shadow-2xl group-hover:rotate-0 transition-transform duration-700">
                  <Heart size={28} className="fill-white" />
               </div>
               <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white mb-0.5">Divine Stewardship</p>
                  <p className="text-xl font-serif italic text-white leading-tight">Anchor the Spire</p>
               </div>
               <div className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-700">
                  <ArrowRight size={20} className="text-white" />
               </div>
            </motion.div>
          </div>
        </div>
      </div>

      
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[200px] opacity-30" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-olive/5 rounded-full blur-[200px] opacity-30" />
    </section>
  );
}
