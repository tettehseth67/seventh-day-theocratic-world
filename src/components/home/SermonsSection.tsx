import { motion, AnimatePresence } from 'motion/react';
import { Play, Calendar, User, Search, Filter, Share2, ArrowRight, Tag, X } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSermons } from '../../services/dataService';
import { Sermon } from '../../types';
import { toast } from 'sonner';
import { SERMON_TAGS, CHURCH_NAME } from '../../constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface SermonCardProps {
  sermon: Sermon;
  index: number;
  onShare: (s: Sermon) => Promise<void> | void;
}

const SermonCard: React.FC<SermonCardProps> = ({ sermon, index, onShare }) => {
  const [isInView, setIsInView] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      onViewportEnter={() => setIsInView(true)}
      transition={{ delay: index * 0.1, duration: 1, ease: [0.19, 1, 0.22, 1] }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <Card
        className="bg-white rounded-[40px] md:rounded-[56px] overflow-hidden shadow-[0_10px_40px_-15px_rgba(40,40,20,0.05)] hover:shadow-[0_50px_100px_-20px_rgba(90,90,64,0.15)] hover:-translate-y-3 transition-all duration-1000 group border-brand-olive/5 flex flex-col h-[520px] md:h-[580px] cursor-pointer relative border-2 hover:border-brand-gold/20"
        onClick={() => navigate(`/sermons/${sermon.id}`)}
      >
        {/* Cinematic Thumbnail Area */}
        <div className="h-48 md:h-60 relative flex items-center justify-center overflow-hidden m-4 md:m-5 rounded-[28px] md:rounded-[40px]">
          {isInView && sermon.thumbnail ? (
            <motion.img 
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              src={sermon.thumbnail} 
              alt={sermon.title}
              className="absolute inset-0 w-full h-full object-cover grayscale-[0.05] contrast-105 group-hover:scale-110 transition-transform duration-[3s]"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="absolute inset-0 bg-brand-olive/5 animate-pulse" />
          )}
          
          <div className="absolute inset-0 bg-brand-ink/40 opacity-0 group-hover:opacity-100 transition-all duration-1000 flex items-center justify-center z-10 backdrop-blur-[2px]">
            <div className="w-20 md:w-24 h-20 md:h-24 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white flex items-center justify-center shadow-3xl scale-50 group-hover:scale-100 transition-all duration-700">
              <Play className="w-8 md:w-10 h-8 md:h-10 fill-current translate-x-1" />
            </div>
          </div>

          <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
            <div className="bg-white/90 backdrop-blur-md text-brand-olive px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] shadow-xl border border-white/20">
              {sermon.category}
            </div>
          </div>

          {/* New: Status/Duration indicator overlay */}
          <div className="absolute bottom-6 right-6 z-20">
             <div className="bg-brand-ink/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-brand-gold animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest leading-none">42:15</span>
             </div>
          </div>
        </div>
        
        <div className="px-8 md:px-10 pb-8 md:pb-12 pt-4 flex-grow flex flex-col">
          <div className="mb-6 flex items-center gap-3">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">
                Theocracy Archive
             </span>
             <div className="h-[1px] w-8 bg-brand-gold/20" />
          </div>

          <h3 className="text-2xl md:text-3xl font-serif italic group-hover:text-brand-olive transition-colors leading-[1.05] tracking-tighter mb-4 line-clamp-2">
            {sermon.title}
          </h3>
          
          <p className="text-brand-ink/40 text-sm md:text-base font-serif italic leading-relaxed mb-10 line-clamp-2 pr-4 transition-colors group-hover:text-brand-ink/60">
             {sermon.description || "A deep exploration into the sacred principles of our faith and community governance."}
          </p>
          
          <div className="mt-auto flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div className="flex -space-x-3">
                 <div className="w-10 h-10 rounded-full border-2 border-white bg-brand-cream overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${sermon.speaker}`} alt={sermon.speaker} />
                 </div>
                 <div className="flex flex-col justify-center pl-6">
                    <span className="text-[8px] font-black uppercase tracking-widest text-brand-gold mb-1">Speaker</span>
                    <span className="text-[10px] font-bold text-brand-ink/80 uppercase tracking-widest">{sermon.speaker}</span>
                 </div>
              </div>

              <Button 
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(sermon);
                }}
                className="w-14 h-14 bg-brand-cream/50 text-brand-ink/20 hover:text-brand-gold hover:bg-white hover:shadow-2xl rounded-2xl transition-all border border-brand-olive/5 p-0"
              >
                <Share2 size={24} />
              </Button>
            </div>

            <div className="flex items-center justify-between border-t border-brand-olive/5 pt-8">
               <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-brand-ink/30">
                  <Calendar size={12} className="text-brand-gold" />
                  <span>{new Date(sermon.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
               </div>

               <div className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-brand-olive group-hover:text-brand-gold group-hover:gap-6 transition-all duration-700">
                Engage Word <ArrowRight size={18} />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function SermonsSection() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSeries, setSelectedSeries] = useState<string>('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    setVisibleCount(3);
  }, [searchTerm, selectedCategory, selectedSeries, selectedTags]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getSermons();
        setSermons(data);
      } catch (e) {
        console.error("Failed to load sermons from Firestore", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(sermons.map(s => s.category));
    return ['All', ...Array.from(cats)];
  }, [sermons]);

  const series = useMemo(() => {
    const sers = new Set(sermons.map(s => s.series).filter(Boolean));
    return ['All', ...Array.from(sers)];
  }, [sermons]);

  const filteredSermons = useMemo(() => {
    return sermons.filter(sermon => {
      const matchesSearch = sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (sermon.series && sermon.series.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || sermon.category === selectedCategory;
      const matchesSeries = selectedSeries === 'All' || sermon.series === selectedSeries;
      const matchesTags = selectedTags.length === 0 || 
                         (sermon.tags && selectedTags.some(tag => sermon.tags!.includes(tag)));
      return matchesSearch && matchesCategory && matchesSeries && matchesTags;
    });
  }, [sermons, searchTerm, selectedCategory, selectedSeries, selectedTags]);

  const displayedSermons = filteredSermons.slice(0, visibleCount);
  const hasMore = visibleCount < filteredSermons.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleShare = async (sermon: Sermon) => {
    const shareData = {
      title: `${sermon.title} - ${sermon.speaker}`,
      text: `Listen to this sermon: ${sermon.title} by ${sermon.speaker}`,
      url: window.location.origin + '/sermons'
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Sermon link copied to clipboard');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <section id="sermons" className="py-32 md:py-40 bg-brand-cream relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[140px] -z-10 translate-x-1/4 translate-y-1/4" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-6 md:mb-8 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-10 h-[1px] bg-brand-gold" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-gold">{CHURCH_NAME} Archive</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif italic text-brand-ink leading-[0.85] tracking-tighter">Sacred Provisions</h2>
          </div>
          <div className="relative w-full lg:w-80 group">
            <div className="absolute inset-0 bg-brand-gold/10 blur-2xl group-focus-within:bg-brand-gold/20 transition-all opacity-0 group-focus-within:opacity-100" />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-ink/20 group-focus-within:text-brand-gold transition-colors" />
            <Input 
              type="text" 
              placeholder={`Search...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-5 py-5 bg-white border-brand-olive/5 rounded-2xl focus-visible:ring-4 focus-visible:ring-brand-gold/10 transition-all text-xs relative z-10 shadow-lg shadow-brand-olive/5"
            />
          </div>
        </div>

        {/* Filters Wrapper */}
        <div className="space-y-6 md:space-y-8 mb-12 md:mb-16">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-2 text-brand-ink/30 mr-1 text-[8px] font-black uppercase tracking-[0.3em] bg-white/50 px-3 py-1.5 rounded-full border border-brand-olive/5">
              <Filter size={12} className="text-brand-gold" />
              Province:
            </div>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] transition-all h-auto border-2 ${
                  selectedCategory === cat 
                  ? 'brand-gradient border-transparent shadow-xl shadow-brand-olive/20' 
                  : 'bg-white text-brand-ink/40 border-brand-olive/10 hover:border-brand-gold'
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 text-brand-ink/30 mr-1 text-[8px] font-black uppercase tracking-[0.3em] bg-white/50 px-3 py-1.5 rounded-full border border-brand-olive/5">
              <Tag size={12} className="text-brand-gold" />
              Keywords:
            </div>
            <div className="relative">
              <Button 
                variant="outline"
                onClick={() => setShowTagDropdown(!showTagDropdown)}
                className="bg-white border-2 border-brand-olive/10 rounded-xl px-4 py-2.5 text-[8px] font-black uppercase tracking-[0.2em] text-brand-ink/40 hover:border-brand-gold transition-all flex items-center gap-2 h-auto"
              >
                {selectedTags.length === 0 ? 'Select Tags' : `${selectedTags.length} Selected`}
                <ArrowRight size={12} className={`transition-transform duration-500 ${showTagDropdown ? '-rotate-90' : 'rotate-90'}`} />
              </Button>
              
              <AnimatePresence>
                {showTagDropdown && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute top-full left-0 mt-3 w-64 bg-white rounded-[32px] shadow-3xl p-6 z-50 border border-brand-olive/5 grid grid-cols-1 gap-3"
                    >
                    {SERMON_TAGS.map(tag => (
                        <label key={tag} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded-md border-2 border-brand-olive/10 text-brand-gold focus:ring-brand-gold transition-all"
                            checked={selectedTags.includes(tag)}
                            onChange={() => toggleTag(tag)}
                        />
                        <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${selectedTags.includes(tag) ? 'text-brand-gold' : 'text-brand-ink/40 group-hover:text-brand-ink'}`}>
                            {tag}
                        </span>
                        </label>
                    ))}
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              {selectedTags.map(tag => (
                <button 
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="bg-brand-gold/10 text-brand-gold px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-brand-gold hover:text-white transition-all border border-brand-gold/10"
                >
                  {tag}
                  <X size={10} />
                </button>
              ))}
              {selectedTags.length > 0 && (
                <Button 
                  variant="ghost"
                  size="xs"
                  onClick={() => setSelectedTags([])}
                  className="text-[8px] font-black uppercase tracking-widest text-brand-ink/30 hover:text-red-500 hover:bg-transparent transition-colors ml-2"
                >
                  Dissolve Filters
                </Button>
              )}
            </div>
          </div>

          {series.length > 1 && (
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-2 text-brand-ink/30 mr-1 text-[8px] font-black uppercase tracking-[0.3em] bg-white/50 px-3 py-1.5 rounded-full border border-brand-olive/5">
                <Play size={12} className="text-brand-gold rotate-90" />
                Theme:
              </div>
              {series.map((ser) => (
                <Button
                  key={ser}
                  variant={selectedSeries === ser ? 'default' : 'outline'}
                  onClick={() => setSelectedSeries(ser)}
                  className={`px-4 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] transition-all border-2 h-auto ${
                    selectedSeries === ser 
                    ? 'bg-brand-ink text-white border-transparent shadow-xl' 
                    : 'bg-white text-brand-ink/40 border-brand-olive/10 hover:border-brand-gold'
                  }`}
                >
                  {ser!}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayedSermons.map((sermon, index) => (
            <SermonCard 
              key={sermon.id} 
              sermon={sermon} 
              index={index} 
              onShare={handleShare} 
            />
          ))}
        </div>

        {hasMore && (
           <div className="mt-12 md:mt-16 text-center">
             <Button 
               size="lg"
               onClick={handleLoadMore}
               className="brand-gradient text-white px-12 py-6 rounded-[28px] font-black uppercase tracking-[0.4em] text-[9px] hover:shadow-3xl hover:shadow-brand-olive/30 transition-all h-auto relative overflow-hidden group"
             >
                <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-gold group-hover:h-full transition-all duration-700 opacity-20 pointer-events-none" />
                Explore Deep Archive
                <ArrowRight size={16} className="ml-3 group-hover:translate-x-2 transition-transform" />
             </Button>
           </div>
        )}
        
        {filteredSermons.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-40 bg-white/40 rounded-[80px] border-2 border-brand-olive/5 border-dashed"
          >
            <div className="w-24 h-24 bg-brand-cream rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
               <Search size={40} className="text-brand-ink/10" />
            </div>
            <p className="text-2xl font-serif italic text-brand-ink/30 max-w-lg mx-auto leading-relaxed">
               "No sacred teachings found matching your current coordinates in the spiritual realm."
            </p>
            <Button 
              variant="ghost"
              onClick={() => {setSearchTerm(''); setSelectedCategory('All'); setSelectedSeries('All'); setSelectedTags([]);}}
              className="mt-8 text-brand-olive font-black uppercase tracking-[0.3em] text-[10px] hover:text-brand-gold hover:bg-transparent"
            >
              Reset Archive Navigation
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
