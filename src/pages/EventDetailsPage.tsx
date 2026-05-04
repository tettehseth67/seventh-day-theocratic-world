import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, ArrowLeft, Share2, Heart, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MOCK_EVENTS } from '../constants';
import { getEvent } from '../services/dataService';
import { Event } from '../types';
import PageHeader from '../components/layout/PageHeader';

import RegistrationForm from '../components/events/RegistrationForm';

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(MOCK_EVENTS.find(e => e.id === id) || null);
  const [loading, setLoading] = useState(!event);

  useEffect(() => {
    async function loadEvent() {
      if (!id) return;
      try {
        const data = await getEvent(id);
        if (data) {
          setEvent(data);
        }
      } catch (e) {
        console.error("Failed to load event", e);
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-40 pb-20 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand-olive mx-auto mb-4" />
        <p className="text-brand-ink/40 font-serif italic text-xl">Preparing the event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="pt-40 pb-20 text-center">
        <h2 className="text-4xl font-serif mb-6 italic text-brand-ink">Event Not Found</h2>
        <p className="text-brand-ink/40 mb-10">The event you are looking for may have been moved or completed.</p>
        <Link to="/events" className="text-brand-olive font-bold uppercase tracking-widest text-xs hover:underline flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Calendar
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-40 pt-44 bg-brand-cream/30 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-12">
          <Link to="/events" className="flex items-center gap-2 text-brand-ink/40 hover:text-brand-olive transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Sacred Calendar</span>
          </Link>
          
          <div className="flex gap-4">
             <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-ink/40 hover:text-brand-gold hover:shadow-xl transition-all border border-brand-olive/5">
                <Share2 size={16} />
             </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Main Event Content */}
          <div className="lg:col-span-8 space-y-12">
            {event.thumbnail && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full aspect-video rounded-[48px] overflow-hidden shadow-2xl border border-brand-olive/5"
              >
                <img 
                  src={event.thumbnail} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            )}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <span className="bg-brand-gold text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={12} /> {event.category}
                </span>
                <span className="bg-brand-olive/10 text-brand-olive text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest">
                  Live Gathering
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-serif italic text-brand-ink leading-tight">
                {event.title}
              </h1>

              <div className="flex flex-wrap items-center gap-10 py-8 border-y border-brand-olive/10">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-brand-olive/5 flex items-center justify-center text-brand-olive shadow-sm">
                       <Calendar size={28} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-brand-ink/30 mb-1">Occasion Date</p>
                      <p className="text-xl font-serif italic text-brand-ink">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-brand-olive/5 flex items-center justify-center text-brand-gold shadow-sm">
                       <Clock size={28} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-brand-ink/30 mb-1">Assembly Time</p>
                      <p className="text-xl font-serif italic text-brand-ink">{event.time}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-brand-olive/5 flex items-center justify-center text-brand-olive shadow-sm">
                       <MapPin size={28} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-brand-ink/30 mb-1">Sacred Location</p>
                      <p className="text-xl font-serif italic text-brand-ink">Main Tabernacle</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* About Section with Polish */}
            <div className="relative p-12 md:p-16 bg-white rounded-[64px] border border-brand-olive/5 shadow-sm overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-[100px] -z-10" />
               <h3 className="text-2xl font-serif italic text-brand-ink mb-10 flex items-center gap-4">
                 <div className="w-8 h-[1px] bg-brand-olive/20" />
                 About the Congregation
               </h3>
               
               <div className="prose prose-brand max-w-none">
                 <p className="text-xl text-brand-ink/70 leading-relaxed font-light mb-8 whitespace-pre-wrap">
                   {event.description}
                 </p>
                 <div className="p-8 bg-brand-cream/50 rounded-3xl border border-brand-olive/5 italic font-serif text-brand-olive/80 leading-relaxed">
                   "Where two or three are gathered together in my name, there am I in the midst of them." 
                   <span className="block mt-4 text-[10px] uppercase tracking-widest font-bold not-italic">— Theocratic Verse</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Sidebar: Registration & Actions */}
          <div className="lg:col-span-4 space-y-8">
            <RegistrationForm eventId={event.id} eventTitle={event.title} />

            <div className="p-12 bg-brand-gold rounded-[56px] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />
               <Heart className="w-12 h-12 mb-8 group-hover:scale-110 transition-transform" />
               <h4 className="text-3xl font-serif italic mb-4 leading-tight">Support Global Stewardship</h4>
               <p className="text-white/80 text-sm leading-relaxed mb-10 font-light">
                 Your contributions enable us to archive these divine gatherings and share the word across all frontiers.
               </p>
               <Link 
                 to="/give" 
                 className="inline-flex h-14 items-center justify-center px-8 bg-white text-brand-olive rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-brand-ink hover:text-white transition-all shadow-xl"
               >
                 Manifest Support
               </Link>
            </div>
            
            <div className="p-10 rounded-[56px] border border-brand-olive/10 group hover:bg-brand-olive transition-all">
               <p className="text-brand-ink/40 text-[10px] uppercase tracking-widest font-bold mb-4 group-hover:text-white/60">Digital Outreach</p>
               <p className="text-brand-ink font-serif italic text-lg mb-6 leading-tight group-hover:text-white">
                 Invigorate others by circulating this event into your secular networks.
               </p>
               <button className="text-brand-olive text-[10px] font-bold uppercase tracking-widest border-b border-brand-olive/20 pb-1 group-hover:text-brand-gold group-hover:border-brand-gold transition-all">
                  Circulate Liturgy
               </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
