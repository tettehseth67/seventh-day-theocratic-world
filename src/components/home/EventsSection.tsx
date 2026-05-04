import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, MapPin, ArrowRight, Filter, Loader2, Sparkles } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../../services/dataService';
import { Event } from '../../types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (e) {
        console.error("Failed to load events from Firestore", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(events.map(e => e.category));
    return ['All', ...Array.from(cats)];
  }, [events]);

  const filteredEvents = events.filter(event => 
    selectedCategory === 'All' || event.category === selectedCategory
  );

  return (
    <section id="events" className="py-32 md:py-40 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-olive/5 rounded-full blur-[100px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-8 md:mb-10 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-10 h-[1px] bg-brand-gold" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-gold">Sanctuary Calendar</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif italic text-brand-ink leading-tight">Upcoming Gathering</h2>
          </div>
          <p className="text-lg md:text-xl text-brand-ink/40 max-w-sm italic font-serif leading-relaxed lg:text-right">
            "Behold, how good and how pleasant it is for brethren to dwell together in unity!"
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-10 items-center">
          <div className="flex items-center gap-3 text-brand-ink/30 mr-1 text-[8px] font-black uppercase tracking-widest bg-brand-cream/50 px-2.5 py-1.5 rounded-full border border-brand-olive/5">
            <Filter size={10} className="text-brand-gold" />
            Province:
          </div>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-3 rounded-xl md:rounded-[16px] text-[8px] font-black uppercase tracking-[0.2em] transition-all h-auto ${
                selectedCategory === cat 
                ? 'brand-gradient border-transparent shadow-xl shadow-brand-olive/20' 
                : 'bg-white text-brand-ink/40 border-brand-olive/10 hover:border-brand-olive'
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="group h-full rounded-[48px] bg-white border-2 border-brand-olive/5 shadow-[0_15px_40px_-10px_rgba(40,40,20,0.05)] hover:shadow-[0_50px_120px_-30px_rgba(90,90,64,0.15)] hover:-translate-y-3 transition-all duration-700 relative overflow-hidden flex flex-col cursor-pointer hover:border-brand-gold/30">
                {/* Typographic Header instead of Image */}
                <div className="p-10 md:p-12 bg-[#FAF9F6] relative overflow-hidden border-b border-brand-olive/5">
                  {/* Abstract Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/[0.03] rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
                  
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="space-y-4">
                      <div className="bg-brand-gold/10 text-brand-gold px-4 py-1.5 rounded-full border border-brand-gold/20 inline-block">
                         <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                           {event.category}
                         </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                         <span className="text-5xl md:text-6xl font-serif italic text-brand-ink">
                            {event.date.split('-')[2]}
                         </span>
                         <span className="text-xl font-serif italic text-brand-ink/40">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'long' })}
                         </span>
                      </div>
                    </div>
                    
                    {event.priority === 'High' && (
                       <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-red-500 shadow-xl shadow-red-500/10 border border-red-500/10 group-hover:scale-110 transition-transform duration-700">
                          <Sparkles size={20} />
                       </div>
                    )}
                  </div>
                </div>

                {/* Card Content Wrapper */}
                <div className="relative z-10 p-10 md:p-12 flex-grow flex flex-col">
                  <div className="mt-1">
                    <h3 className="text-2xl md:text-3xl font-serif italic mb-6 text-brand-ink leading-[1.1] tracking-tighter transition-colors group-hover:text-brand-olive">
                      {event.title}
                    </h3>
                    
                    <p className="text-brand-ink/40 mb-10 overflow-hidden text-ellipsis line-clamp-3 font-serif italic transition-colors text-base md:text-lg leading-relaxed">
                      {event.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-6 mb-12 pt-8 border-t border-brand-olive/5">
                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-gold">Commencement</span>
                        <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-brand-ink/60">
                           <Clock size={14} className="text-brand-olive/40" />
                           <span>{event.time}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-gold">Location</span>
                        <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-brand-ink/60">
                           <MapPin size={14} className="text-brand-olive/40" />
                           <span className="truncate">Grand Sanctuary</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      asChild
                      variant="outline" 
                      className="w-full h-18 rounded-[24px] border-brand-olive/10 text-[11px] font-black uppercase tracking-[0.4em] text-brand-olive hover:bg-brand-olive hover:text-white transition-all duration-700 shadow-sm"
                    >
                      <Link to={`/events/${event.id}`}>
                        Inquire Further
                        <ArrowRight size={14} className="ml-5 group-hover:translate-x-2 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {filteredEvents.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-brand-cream/30 rounded-[48px] border border-brand-olive/5 border-dashed"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl text-brand-ink/10">
               <CalendarIcon size={32} />
            </div>
            <p className="text-xl font-serif italic text-brand-ink/30 leading-relaxed max-w-sm mx-auto">
               "No divine gatherings match your chosen path within the scrolls."
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
