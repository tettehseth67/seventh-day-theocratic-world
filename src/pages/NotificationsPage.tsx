import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Bell, 
  Check, 
  Trash2, 
  Clock, 
  Sparkles, 
  Filter, 
  ChevronRight,
  ArrowLeft,
  Heart,
  MessageSquare,
  Shield,
  Search
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { ChurchNotification, getNotificationIcon } from '../constants/notifications';
import { 
  getDonations, 
  getRegistrations, 
  getSermons, 
  getEvents, 
  getPrayerRequests,
  getAuditLogs
} from '../services/dataService';
import PageHeader from '../components/layout/PageHeader';
import { CHURCH_NAME } from '../constants';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<ChurchNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'system' | 'interaction'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const isAdmin = user.role === 'admin';
      const [donations, registrations, sermons, events, prayers, audit] = await Promise.all([
        getDonations(isAdmin ? undefined : user.uid),
        getRegistrations(isAdmin ? undefined : user.uid),
        getSermons(10),
        getEvents(),
        getPrayerRequests(isAdmin ? undefined : user.uid),
        isAdmin ? getAuditLogs() : Promise.resolve([])
      ]);

      const aggregated: ChurchNotification[] = [];

      donations.forEach(d => {
        aggregated.push({
          id: `don-${d.id}`,
          type: 'donation',
          title: isAdmin ? `Donation from ${d.userName}` : 'Stewardship Logged',
          description: `A contribution of GH₵ ${d.amount} for ${d.category} has been recorded.`,
          timestamp: d.timestamp?.toDate() || new Date(),
          isRead: false,
          link: '/donations'
        });
      });

      registrations.forEach(r => {
        const event = events.find(e => e.id === r.eventId);
        aggregated.push({
          id: `reg-${r.id}`,
          type: 'registration',
          title: isAdmin ? `New RSVP: ${r.userName}` : 'Registration Confirmed',
          description: isAdmin ? `Enlisted for ${event?.title || 'Theocratic Gathering'}` : `Your place is reserved for ${event?.title || 'the event'}.`,
          timestamp: r.timestamp?.toDate() || new Date(),
          isRead: false,
          link: isAdmin ? '/admin/registrations' : '/events'
        });
      });

      sermons.forEach(s => {
        aggregated.push({
          id: `ser-${s.id}`,
          type: 'system',
          title: 'New Sermon Archived',
          description: `"${s.title}" by ${s.speaker} is now available in the library.`,
          timestamp: s.date ? new Date(s.date) : new Date(),
          isRead: false,
          link: `/sermons/${s.id}`
        });
      });

      prayers.forEach(p => {
        aggregated.push({
          id: `pray-${p.id}`,
          type: 'message',
          title: isAdmin ? `Prayer Need: ${p.name}` : 'Request Manifested',
          description: isAdmin ? p.request : `Your prayer request has been entered into the sanctuary logs.`,
          timestamp: p.timestamp?.toDate() || new Date(),
          isRead: false,
          link: isAdmin ? '/admin/audit-logs' : '/livestream'
        });
      });

      if (isAdmin) {
        audit.forEach(l => {
           aggregated.push({
             id: `audit-${l.id}`,
             type: 'system',
             title: 'Admin Activity',
             description: l.details || `${l.action} ${l.targetType}`,
             timestamp: l.timestamp?.toDate() || new Date(),
             isRead: true,
             link: '/admin/audit-logs'
           });
        });
      }

      aggregated.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setNotifications(aggregated);
    } catch (error) {
      console.error("Failed to aggregate notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" />;

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.isRead;
    if (filter === 'system') return n.type === 'system';
    if (filter === 'interaction') return n.type === 'message' || n.type === 'registration';
    return true;
  });

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.isRead).length,
    donations: notifications.filter(n => n.type === 'donation').length
  };

  return (
    <div className="min-h-screen bg-brand-cream/30 pb-24 md:pb-44">
      <PageHeader 
        title={CHURCH_NAME} 
        subtitle="The recorded chronicle of your spiritual journey and sanctuary engagements."
        category="Sanctuary Chronicles"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 -mt-24 md:-mt-32 relative z-20">
        <div className="grid lg:grid-cols-12 gap-10 md:gap-14">
          
          {/* Sidebar Stats */}
          <div className="lg:col-span-3 space-y-8 mt-20">
            <Card className="bg-white rounded-[48px] p-10 border-brand-olive/5 shadow-3xl shadow-brand-olive/5 border">
              <h3 className="text-2xl font-serif italic text-brand-ink mb-10">Archive Vitals</h3>
              <div className="space-y-8">
                <div className="flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-brand-cream border border-brand-olive/5 flex items-center justify-center text-brand-olive group-hover:bg-brand-olive group-hover:text-white transition-all shadow-sm">
                      <Clock size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-ink/40">Total</span>
                  </div>
                  <span className="text-sm font-black text-brand-ink">{stats.total}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 border border-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-all shadow-sm">
                      <Sparkles size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-ink/40">Manifesting</span>
                  </div>
                  <span className="text-sm font-black text-brand-gold">{stats.unread}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-brand-olive/10 border border-brand-olive/10 flex items-center justify-center text-brand-sky group-hover:bg-brand-sky group-hover:text-white transition-all shadow-sm">
                      <Heart size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-ink/40">Sacrifices</span>
                  </div>
                  <span className="text-sm font-black text-brand-olive">{stats.donations}</span>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-brand-olive/5">
                <Button 
                  onClick={markAllAsRead}
                  className="w-full py-7 brand-gradient text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:shadow-2xl shadow-brand-olive/20 transition-all flex items-center justify-center gap-4 group h-auto"
                >
                  <Check size={16} className="group-hover:rotate-12 group-hover:scale-125 transition-transform" />
                  Cleanse Chronicles
                </Button>
              </div>
            </Card>

            <Button asChild variant="ghost" className="w-full p-0 h-auto group bg-brand-ink hover:bg-brand-ink/90 rounded-[32px] overflow-hidden">
               <Link to="/profile" className="flex items-center gap-5 p-7 justify-center text-white relative">
                  <div className="relative z-10 flex items-center gap-4">
                    <ArrowLeft size={18} className="group-hover:-translate-x-3 transition-transform text-brand-gold" />
                    <span className="text-[11px] font-black uppercase tracking-[0.4em]">Sanctuary Return</span>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
               </Link>
            </Button>
          </div>

          {/* Main List */}
          <div className="lg:col-span-9 space-y-10">
            <Card className="bg-white rounded-[48px] border border-brand-olive/5 shadow-3xl shadow-brand-olive/5 overflow-hidden border">
              {/* Toolbar */}
              <div className="p-10 border-b border-brand-olive/5 bg-brand-cream/10 flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="flex flex-wrap gap-4">
                  {[
                    { id: 'all', label: 'All Scrolls', icon: Bell },
                    { id: 'unread', label: 'Manifesting', icon: Sparkles },
                    { id: 'interaction', label: 'Spiritual Acts', icon: MessageSquare },
                  ].map(item => (
                    <Button 
                      key={item.id}
                      variant={filter === item.id ? 'default' : 'ghost'}
                      onClick={() => setFilter(item.id as any)}
                      className={`flex items-center gap-3 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all h-auto ${filter === item.id ? 'bg-brand-ink text-white shadow-xl' : 'text-brand-ink/30 hover:bg-white border border-brand-olive/5'}`}
                    >
                      <item.icon size={14} className={filter === item.id ? 'text-brand-gold' : ''} />
                      {item.label}
                    </Button>
                  ))}
                </div>

                <div className="relative group w-full lg:w-96">
                  <div className="absolute inset-0 bg-brand-gold/5 blur-xl group-focus-within:bg-brand-gold/10 transition-all opacity-0 group-focus-within:opacity-100" />
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-ink/20 group-focus-within:text-brand-gold transition-colors" />
                  <Input 
                    type="text" 
                    placeholder="Sift through the logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border-brand-olive/5 rounded-2xl py-7 pl-16 pr-8 text-base italic font-serif focus-visible:ring-brand-gold/20 focus-visible:border-brand-gold transition-all shadow-sm relative z-10"
                  />
                </div>
              </div>

              {/* List Content */}
              <div className="divide-y divide-brand-olive/5">
                {loading ? (
                  <div className="py-44 text-center">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      className="inline-block relative"
                    >
                      <Shield size={64} className="text-brand-gold/10" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles size={24} className="text-brand-gold animate-pulse" />
                      </div>
                    </motion.div>
                    <p className="mt-10 text-xl font-serif italic text-brand-ink/20">Unfurling the sacred archives...</p>
                  </div>
                ) : filteredNotifications.length > 0 ? (
                  <AnimatePresence>
                    {filteredNotifications.map((notif, i) => {
                      const { icon: Icon, color, bg } = getNotificationIcon(notif.type);
                      return (
                        <motion.div 
                          key={notif.id}
                          initial={{ opacity: 0, scale: 0.98, x: -10 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.5 }}
                          className={`p-10 flex flex-col md:flex-row gap-10 hover:bg-brand-cream/20 transition-all group relative border-l-[6px] border-transparent hover:border-brand-gold ${!notif.isRead ? 'bg-brand-olive/[0.04]' : ''}`}
                        >
                          <div className={`w-16 h-16 rounded-3xl ${bg} ${color} flex items-center justify-center shrink-0 shadow-xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 border border-white/50`}>
                            <Icon size={28} />
                          </div>
                          
                          <div className="flex-grow">
                            <div className="flex justify-between items-start mb-4">
                              <div className="space-y-2">
                                <h4 className={`text-2xl md:text-3xl font-serif italic tracking-tight leading-none ${!notif.isRead ? 'text-brand-ink' : 'text-brand-ink/50'}`}>
                                  {notif.title}
                                </h4>
                                <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-ink/20">
                                  <span className="flex items-center gap-2 group-hover:text-brand-gold transition-colors"><Clock size={12} /> {formatTime(notif.timestamp)}</span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/20" />
                                  <span className="group-hover:text-brand-gold/40 transition-colors">Manifestation ID: {notif.id}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all translate-x-10 group-hover:translate-x-0 duration-700">
                                {notif.link && (
                                  <Button variant="ghost" size="icon" asChild className="w-14 h-14 bg-white rounded-2xl border border-brand-olive/5 text-brand-ink/30 hover:text-brand-olive hover:shadow-2xl transition-all">
                                    <Link to={notif.link}>
                                      <ChevronRight size={20} />
                                    </Link>
                                  </Button>
                                )}
                              </div>
                            </div>
                            <p className="text-xl text-brand-ink/40 leading-relaxed max-w-3xl italic font-serif">
                              {notif.description}
                            </p>
                          </div>
                          
                          {!notif.isRead && (
                            <div className="absolute top-10 right-10 w-3 h-3 rounded-full bg-brand-gold shadow-[0_0_20px_rgba(234,179,8,0.6)] animate-pulse" />
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                ) : (
                  <div className="py-44 text-center px-12">
                    <div className="w-24 h-24 rounded-[40px] bg-brand-cream flex items-center justify-center mx-auto mb-10 text-brand-olive/20 shadow-inner group transition-all">
                      <Bell size={56} className="group-hover:rotate-12 transition-transform" />
                    </div>
                    <h3 className="text-4xl font-serif italic text-brand-ink mb-6 tracking-tight">Archives are Silent</h3>
                    <p className="text-xl text-brand-ink/30 font-serif italic max-w-lg mx-auto leading-relaxed md:px-10">
                      "The silence of the sanctuary is a gift, a moment for reflection and meditation." 
                      <br /><br />
                      Try adjusting your spiritual search coordinates to locate specific logs.
                    </p>
                    <Button 
                      variant="ghost"
                      onClick={() => { setFilter('all'); setSearchTerm(''); }}
                      className="mt-12 px-10 py-5 bg-brand-cream/50 border border-brand-olive/10 text-brand-olive rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-brand-olive hover:text-white transition-all shadow-sm h-auto"
                    >
                      Reset Scroll Navigation
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <div className="text-center pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-ink/10 animate-pulse">
                Encrypted via Divine Protocol • Sanctuary Archive System
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
