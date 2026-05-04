import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Play, Calendar, User, BookOpen, Share2, 
  ArrowLeft, Download, Video, Music, Sparkles,
  Loader2, AlertCircle
} from 'lucide-react';
import { getSermon } from '../services/dataService';
import { Sermon } from '../types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SermonDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSermon = async () => {
      if (!id) return;
      try {
        const data = await getSermon(id);
        if (data) {
          setSermon(data);
        } else {
          setError('Sermon not found in the sanctuary archives');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to retrieve the homily details');
      } finally {
        setLoading(false);
      }
    };

    fetchSermon();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Divine message link copied to clipboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream/30">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-brand-olive mx-auto" />
          <p className="text-xl font-serif italic text-brand-ink/40">Opening the sacred scrolls...</p>
        </div>
      </div>
    );
  }

  if (error || !sermon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream/30 px-4">
        <div className="max-w-md w-full bg-white p-12 rounded-[48px] text-center shadow-2xl border border-brand-olive/5">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-3xl font-serif italic text-brand-ink mb-4">{error || 'Unknown Error'}</h2>
          <Button 
            onClick={() => navigate('/sermons')}
            className="rounded-full bg-brand-olive hover:bg-brand-ink transition-colors px-8"
          >
            Return to Archives
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-40 pt-44 bg-brand-cream/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between mb-12">
          <motion.button 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/sermons')}
            className="flex items-center gap-2 text-brand-ink/40 hover:text-brand-olive transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Back to Divine Archive</span>
          </motion.button>
          
          <div className="flex gap-4">
             <button onClick={handleShare} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-ink/40 hover:text-brand-gold hover:shadow-xl transition-all border border-brand-olive/5">
                <Share2 size={16} />
             </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* LEFT: Media & Core Info */}
          <div className="lg:col-span-12 space-y-16">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              
              {/* Media Section */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-7 relative group"
              >
                <div className="aspect-video rounded-[64px] overflow-hidden bg-brand-ink shadow-2xl relative">
                  {sermon.thumbnail ? (
                    <img 
                      src={sermon.thumbnail} 
                      alt={sermon.title} 
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-brand-olive/20" />
                  )}
                  
                  {/* Digital Veil (Overlay) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-ink to-transparent opacity-40" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    {sermon.videoUrl ? (
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-brand-gold hover:border-brand-gold/50 shadow-2xl transition-all"
                      >
                        <Play size={32} fill="currentColor" className="ml-1" />
                      </motion.button>
                    ) : (
                      <div className="text-white/40 text-center space-y-4">
                         <div className="w-20 h-20 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto border border-white/10">
                           <Music size={32} />
                         </div>
                         <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Sonic Provision Only</p>
                      </div>
                    )}
                  </div>

                  {/* Corner Sparkle */}
                  <div className="absolute bottom-10 left-10">
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur px-6 py-3 rounded-full border border-white/20">
                      <Sparkles className="w-4 h-4 text-brand-gold" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white">Theocratic Series</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Core Info & Tags */}
              <div className="lg:col-span-5 space-y-10 pt-4">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-brand-olive text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest">
                      {sermon.category}
                    </span>
                    {sermon.series && (
                      <span className="bg-brand-cream border border-brand-olive/10 text-brand-olive text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest">
                        {sermon.series}
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl font-serif italic text-brand-ink leading-[1.1]">
                    {sermon.title}
                  </h1>
                </div>

                <div className="grid grid-cols-2 gap-8 py-10 border-y border-brand-olive/10">
                  <div className="space-y-1">
                    <p className="text-[10px] text-brand-ink/30 uppercase font-bold tracking-widest">Divine Speaker</p>
                    <p className="text-xl font-serif italic text-brand-ink">{sermon.speaker}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-brand-ink/30 uppercase font-bold tracking-widest">Delivered On</p>
                    <p className="text-xl font-serif italic text-brand-ink">{sermon.date}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                   <Button className="flex-1 h-16 rounded-2xl bg-brand-olive hover:bg-brand-ink transition-all text-[10px] uppercase font-bold tracking-widest gap-3 shadow-xl shadow-brand-olive/20">
                     <Play size={16} /> Engage Message
                   </Button>
                   <Button variant="outline" className="flex-1 h-16 rounded-2xl border-brand-olive/10 transition-all text-[10px] uppercase font-bold tracking-widest gap-3">
                     <Download size={16} /> Secular Offline
                   </Button>
                </div>
              </div>
            </div>

            {/* LOWER CONTENT: Description and Sidebars */}
            <div className="grid lg:grid-cols-12 gap-16">
              
              {/* Description (Essence) */}
              <div className="lg:col-span-8 space-y-12">
                <div className="space-y-8 p-10 md:p-14 bg-white rounded-[64px] border border-brand-olive/5 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cream/50 rounded-full blur-[100px] -z-10" />
                   
                   <div className="flex items-center gap-4 mb-2">
                     <div className="w-12 h-[1px] bg-brand-olive/20" />
                     <h3 className="text-lg font-serif italic text-brand-olive">The Homily's Essence</h3>
                   </div>
                   
                   <div className="space-y-6 text-brand-ink/70 text-lg md:text-xl font-light leading-relaxed">
                     <p>
                       {sermon.description || "This message represents a pivotal exploration of spiritual truths, delivered within the holy confines of the main sanctuary. It aims to bridge the gap between human experience and divine directive, offering a roadmap for theocratic living in a modern landscape."}
                     </p>
                     <p>
                       The speaker identifies key intersections of grace and accountability, encouraging the faithful to manifest their destiny through intentional worship and communal stewardship. As you engage with this provision, may your spiritual senses be heightened and your purpose reaffirmed.
                     </p>
                   </div>
                   
                   <div className="pt-10 border-t border-brand-olive/5 flex items-center gap-6">
                     <div className="w-14 h-14 rounded-full bg-brand-cream flex items-center justify-center text-brand-olive">
                        <BookOpen size={24} />
                     </div>
                     <div>
                       <p className="text-[10px] uppercase font-bold tracking-normal text-brand-ink/40 mb-1">Key Scriptures Referenced</p>
                       <p className="text-sm font-serif italic text-brand-ink">Awaiting divine citations library update...</p>
                     </div>
                   </div>
                </div>
              </div>

              {/* Provisions Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                 <div className="bg-brand-ink p-12 rounded-[56px] text-white space-y-10 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent)]" />
                   
                   <div className="relative z-10 space-y-8">
                     <div className="space-y-2">
                        <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">Sacred Resources</h4>
                        <p className="text-2xl font-serif italic">Digital Provisions</p>
                     </div>

                     <div className="space-y-3">
                       {sermon.audioUrl && (
                         <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                           <div className="flex items-center gap-4">
                             <Music size={20} className="text-brand-gold" />
                             <span className="text-xs font-bold uppercase tracking-widest">Audio Archive</span>
                           </div>
                           <Download size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                         </div>
                       )}
                       <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                         <div className="flex items-center gap-4">
                           <Video size={20} className="text-brand-gold" />
                           <span className="text-xs font-bold uppercase tracking-widest">Video Stream</span>
                         </div>
                         <ArrowLeft size={14} className="rotate-180 opacity-40 group-hover:opacity-100 transition-opacity" />
                       </div>
                     </div>
                     
                     <div className="pt-6 border-t border-white/10">
                        <p className="text-[10px] text-white/40 italic font-serif leading-relaxed text-center">
                          "Faith cometh by hearing, and hearing by the word of God."
                        </p>
                     </div>
                   </div>
                 </div>

                 {/* Fellowship Invite */}
                 <div className="p-10 rounded-[56px] bg-brand-cream border border-brand-olive/10 group hover:border-brand-olive/30 transition-all">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-brand-olive mb-4">Deepen Your Faith</h4>
                    <p className="text-brand-ink/60 text-sm leading-relaxed mb-6 font-light italic font-serif">
                      Interested in joining the study group for this series? Connect with our spiritual moderators.
                    </p>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-brand-ink border-b border-brand-ink/20 pb-1 hover:border-brand-ink transition-all">
                      Connect with Moderator
                    </button>
                 </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
