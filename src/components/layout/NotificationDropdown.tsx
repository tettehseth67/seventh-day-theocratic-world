import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Check, Trash2, ExternalLink, Clock, Sparkles } from 'lucide-react';
import { ChurchNotification, getNotificationIcon } from '../../constants/notifications';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CHURCH_NAME } from '../../constants';
import { 
  getDonations, 
  getRegistrations, 
  getSermons, 
  getEvents, 
  getPrayerRequests,
  getAuditLogs
} from '../../services/dataService';
import { Button } from '@/components/ui/button';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<ChurchNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      return;
    }

    setLoading(true);
    try {
      const isAdmin = user.role === 'admin';
      
      // Fetch source data in parallel
      const [donations, registrations, sermons, events, prayers, audit] = await Promise.all([
        getDonations(isAdmin ? undefined : user.uid),
        getRegistrations(isAdmin ? undefined : user.uid),
        getSermons(5),
        getEvents(),
        getPrayerRequests(isAdmin ? undefined : user.uid),
        isAdmin ? getAuditLogs() : Promise.resolve([])
      ]);

      const aggregated: ChurchNotification[] = [];

      // Transform data into notifications
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
          description: isAdmin ? `Enlisted for ${event?.title || 'Sanctuary Gathering'}` : `Your place is reserved for ${event?.title || 'the event'}.`,
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
        audit.slice(0, 5).forEach(l => {
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

      // Sort by timestamp descending
      aggregated.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      // Limit to most recent 10 to keep it clean
      setNotifications(aggregated.slice(0, 10));
    } catch (error) {
      console.error("Failed to aggregate sanctuary notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 0) return 'Just now';
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-2xl transition-all relative ${isOpen ? 'bg-brand-olive text-white shadow-xl rotate-12' : 'bg-brand-cream/50 text-brand-ink/30 hover:text-brand-olive hover:bg-brand-cream hover:rotate-6'}`}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-bounce-slow"></span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute right-0 mt-4 w-80 sm:w-[420px] bg-white/95 backdrop-blur-2xl rounded-[40px] shadow-3xl border border-brand-olive/5 overflow-hidden z-50 ring-1 ring-black/5"
          >
            <div className="p-8 border-b border-brand-olive/5 flex items-center justify-between bg-brand-cream/30">
              <div className="space-y-1">
                <h3 className="text-xl font-serif italic text-brand-ink">Sanctuary Alerts</h3>
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">{unreadCount} Pending Manifestations</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={markAllRead}
                  className="w-10 h-10 text-brand-olive hover:bg-brand-olive hover:text-white rounded-xl transition-all shadow-sm"
                  title="Mark all as read"
                >
                  <Check size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={clearAll}
                  className="w-10 h-10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                  title="Clear all"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>

            <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
              {loading && notifications.length === 0 ? (
                 <div className="py-24 text-center">
                   <Sparkles className="w-10 h-10 animate-pulse text-brand-gold mx-auto mb-6" />
                   <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-ink/20">Consulting Sanctuary Archives...</p>
                 </div>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => {
                  const { icon: Icon, color, bg } = getNotificationIcon(notification.type);
                  return (
                    <div 
                      key={notification.id}
                      className={`p-6 flex gap-6 transition-all border-b border-brand-olive/5 relative group hover:bg-brand-cream/40 ${!notification.isRead ? 'bg-brand-olive/[0.03]' : ''}`}
                    >
                      <div className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center shrink-0 shadow-sm border border-brand-olive/5 group-hover:scale-110 transition-transform`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <p className={`text-sm font-black truncate leading-tight tracking-tight ${!notification.isRead ? 'text-brand-ink' : 'text-brand-ink/50'}`}>
                            {notification.title}
                          </p>
                          <span className="text-[9px] font-black text-brand-ink/20 uppercase tracking-[0.2em] whitespace-nowrap ml-4 flex items-center gap-1.5">
                            <Clock size={10} /> {formatTime(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-brand-ink/40 leading-relaxed line-clamp-2 italic font-serif group-hover:text-brand-ink/60 transition-colors">
                          {notification.description}
                        </p>
                        
                        {!notification.isRead && (
                          <Button 
                            variant="ghost"
                            size="xs"
                            onClick={(e) => markAsRead(notification.id, e)}
                            className="mt-4 p-0 text-[10px] uppercase tracking-widest font-black text-brand-olive hover:text-brand-gold hover:bg-transparent h-auto"
                          >
                            Acknowledge <Check size={12} className="ml-1" />
                          </Button>
                        )}
                      </div>
                      {notification.link && (
                        <Link to={notification.link} className="absolute inset-0 z-0" onClick={() => setIsOpen(false)} />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-24 text-center px-10">
                  <div className="w-20 h-20 rounded-[32px] bg-brand-cream flex items-center justify-center mx-auto mb-6 text-brand-olive/10 shadow-inner">
                    <Bell size={40} />
                  </div>
                  <p className="text-xl font-serif italic text-brand-ink/30 leading-relaxed md:px-6">
                    "The sanctuary archives are silent. No new visions or updates have manifested."
                  </p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-6 bg-brand-ink text-center">
                <Link 
                  to="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] font-black uppercase tracking-[0.5em] text-brand-gold hover:text-white transition-all flex items-center justify-center gap-3 mx-auto"
                >
                  Enter Notification Hall <ExternalLink size={14} />
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
