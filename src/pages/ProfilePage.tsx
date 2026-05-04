import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Shield, Calendar, Clock, ArrowRight, Star, Heart, Bookmark, Receipt, Edit2, Check, X, Loader2, TrendingUp, Bell, Mail, MessageSquare, Camera, Sparkles } from 'lucide-react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { getDonations, getRegistrations, getPrayerRequests } from '../services/dataService';
import { Donation } from '../types';
import { CHURCH_NAME } from '../constants';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogFooter, DialogDescription, DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, logout, loading, updateProfileName, updatePreferences } = useAuth();
  const navigate = useNavigate();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [tempName, setTempName] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [donationsLoading, setDonationsLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  const togglePreference = async (prefId: string) => {
    if (!user) return;
    const currentPrefs = user.preferences || { liturgyAlerts: true, donationReceipts: true, communityNews: true };
    const nextPrefs = { 
      ...currentPrefs, 
      [prefId]: !currentPrefs[prefId as keyof typeof currentPrefs] 
    };
    try {
      await updatePreferences(nextPrefs);
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  useEffect(() => {
    if (user) {
      setTempName(user.displayName || '');
      fetchDonations();
      fetchActivities();
    }
  }, [user]);

  const fetchActivities = async () => {
    if (!user) return;
    setActivitiesLoading(true);
    try {
      const isAdmin = user.role === 'admin';
      const [donationsData, regs, prayers] = await Promise.all([
        getDonations(isAdmin ? undefined : user.uid),
        getRegistrations(isAdmin ? undefined : user.uid),
        getPrayerRequests(isAdmin ? undefined : user.uid)
      ]);
      
      const allActivities = [
        ...donationsData.map(d => ({ ...d, type: 'donation', category: 'Offering' })),
        ...regs.map(r => ({ ...r, type: 'registration', category: 'RSVP' })),
        ...prayers.map(p => ({ ...p, type: 'prayer', category: 'Spiritual Request' }))
      ].sort((a, b) => {
        const dateA = a.timestamp?.seconds ? a.timestamp.seconds : 0;
        const dateB = b.timestamp?.seconds ? b.timestamp.seconds : 0;
        return dateB - dateA;
      });

      setActivities(allActivities.slice(0, 10)); // Limit to most recent 10
    } catch (error) {
      console.error(error);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const fetchDonations = async () => {
    if (!user) return;
    try {
      const data = await getDonations(user.uid);
      setDonations(data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setDonationsLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream/20">
       <motion.div 
         animate={{ rotate: 360 }} 
         transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
         className="w-16 h-16 border-4 border-brand-olive border-t-transparent rounded-full shadow-2xl"
       />
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;

  const handleSaveName = async () => {
    if (!tempName.trim()) return;
    setSaveLoading(true);
    try {
      await updateProfileName(tempName.trim());
      toast.success('Sacred Identity Updated', {
        description: 'Your record has been successfully modified in the digital scrolls.'
      });
      setIsEditModalOpen(false);
      setIsEditingInline(false);
    } catch (error) {
      console.error(error);
      toast.error('Identity Update Failed', {
        description: 'An error occurred while attempting to modify the sanctuary records.'
      });
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="pb-40 bg-[#F3F3F3] min-h-screen selection:bg-brand-gold/20">
      {/* Cinematic Identity Header */}
      <div className="relative h-[560px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1600" 
            className="w-full h-full object-cover brightness-105"
            alt={CHURCH_NAME}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F3F3F3] via-transparent to-black/20" />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-12 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end w-full gap-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                className="relative group"
              >
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-[32px] bg-brand-ink border-4 border-white shadow-3xl flex items-center justify-center text-brand-gold overflow-hidden relative">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={56} className="opacity-20 translate-y-3" />
                  )}
                  <div className="absolute inset-0 bg-brand-olive/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer">
                    <Camera size={20} className="text-white" />
                  </div>
                </div>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-brand-gold flex items-center justify-center text-white shadow-xl border-4 border-white"
                >
                  <Shield size={14} />
                </motion.div>
              </motion.div>
              
              <div className="text-center md:text-left mb-6">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-brand-gold/10 border border-brand-gold/20 rounded-full mb-4 backdrop-blur-md"
                >
                  <Sparkles size={12} className="text-brand-gold animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-gold">Member of the Fold</span>
                </motion.div>
                
                <div className="relative group">
                  <AnimatePresence mode="wait">
                    {!isEditingInline ? (
                      <motion.div
                        key="display"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3"
                      >
                        <h1 className="text-4xl md:text-6xl font-serif italic text-white leading-tight tracking-tighter drop-shadow-lg">
                          Shalom, <br />
                          <span className="text-brand-gold font-bold">{(user.displayName || 'Beloved').split(' ')[0]}</span>
                        </h1>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setIsEditingInline(true)}
                          className="text-white/40 hover:text-brand-gold hover:bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-all w-8 h-8"
                        >
                          <Edit2 size={16} />
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="edit"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center gap-3 bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-2xl"
                      >
                        <Input 
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          className="bg-transparent border-none text-white text-3xl md:text-4xl font-serif italic focus-visible:ring-0 w-full max-w-xs px-3 h-auto"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                        />
                        <div className="flex gap-1.5">
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            onClick={handleSaveName}
                            disabled={saveLoading}
                            className="rounded-lg bg-brand-gold text-white hover:bg-brand-gold/80 w-8 h-8"
                          >
                            {saveLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setIsEditingInline(false)}
                            className="rounded-lg text-white/60 hover:text-white w-8 h-8"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button asChild size="lg" className="px-8 py-6 brand-gradient text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.3em] shadow-3xl shadow-brand-olive/20 group hover:-translate-y-1.5 transition-all h-auto">
                <Link to="/notifications">
                  Activity Records
                  <Bell size={16} className="ml-2.5 group-hover:rotate-12 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" onClick={logout} className="px-8 py-6 bg-white border-brand-ink/5 text-brand-ink rounded-[20px] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-ink hover:text-white group shadow-xl hover:-translate-y-1.5 transition-all h-auto">
                  Terminate Session
                  <LogOut size={16} className="ml-2.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white shadow-3xl shadow-brand-olive/5 rounded-[32px] p-3 border border-brand-olive/5">
           {[
             { label: 'Cloud Verification', val: 'Entity Authenticated', icon: Shield, color: 'brand-gold' },
             { label: 'Ecclesiastical Role', val: user.role === 'admin' ? 'Eldership Admin' : 'Faithful Layman', icon: Star, color: 'brand-olive' },
             { label: 'Spiritual Tenure', val: 'Permanent Access', icon: Clock, color: 'brand-ink' }
           ].map((stat, i) => (
             <div key={stat.label} className="flex items-center gap-4 p-5 rounded-[24px] hover:bg-brand-cream/30 transition-all group">
                <div className={`w-12 h-12 rounded-xl bg-brand-cream flex items-center justify-center text-${stat.color} group-hover:rotate-12 transition-transform shadow-inner`}>
                   <stat.icon size={20} />
                </div>
                <div>
                   <p className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-ink/30 mb-0.5">{stat.label}</p>
                   <p className="text-xs font-bold text-brand-ink">{stat.val}</p>
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Account Summary */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="rounded-[32px] p-8 border-brand-olive/5 shadow-2xl bg-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 transition-all group-hover:scale-150" />
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h2 className="text-xl font-serif italic text-brand-ink">Sanctuary Register</h2>
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl bg-brand-cream text-brand-olive hover:bg-brand-olive hover:text-white shadow-sm">
                      <Edit2 size={14} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md rounded-[32px] p-8 bg-white border-brand-olive/5 shadow-4xl">
                    <DialogHeader className="mb-6">
                      <div className="w-14 h-14 rounded-[22px] brand-gradient flex items-center justify-center text-white mb-4 mx-auto shadow-2xl shadow-brand-olive/20">
                        <User size={28} />
                      </div>
                      <DialogTitle className="text-2xl font-serif italic text-brand-ink text-center">Refine Identification</DialogTitle>
                      <DialogDescription className="text-center text-brand-ink/40 mt-2">
                        Adjust how you are memorialized in the digital archives.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      <div className="space-y-2.5">
                        <Label htmlFor="modalName" className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-ink/40 ml-2">
                          Chosen Sovereign Name
                        </Label>
                        <Input
                          id="modalName"
                          placeholder="Your sacred name"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          className="rounded-2xl border-brand-olive/10 h-16 px-6 text-base font-serif italic focus-visible:ring-brand-gold/20 shadow-inner"
                        />
                      </div>
                    </div>

                    <DialogFooter className="mt-8 gap-4 sm:justify-center flex-col sm:flex-row">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsEditModalOpen(false)}
                        className="rounded-xl h-14 text-[10px] font-black uppercase tracking-[0.4em] text-brand-ink/20 hover:text-brand-ink"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSaveName}
                        disabled={saveLoading || !tempName.trim()}
                        className="rounded-xl h-14 bg-brand-ink hover:bg-brand-olive text-white px-8 text-[10px] font-black uppercase tracking-[0.4em] shadow-3xl shadow-brand-olive/20"
                      >
                        {saveLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Commit Record'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-6 relative z-10">
                {[
                  { label: 'Archives Name', val: user.displayName || 'Unnamed Being', mono: false },
                  { label: 'Divine Address', val: user.email, mono: false },
                  { label: 'Ecclesiastical UID', val: user.uid, mono: true },
                ].map((item, i) => (
                  <div key={item.label}>
                    <p className="text-[9px] uppercase tracking-[0.4em] font-black text-brand-ink/20 mb-2">{item.label}</p>
                    <p className={`font-serif italic text-brand-ink text-lg truncate ${item.mono ? 'font-mono text-[10px] opacity-40 italic-none' : ''}`}>
                      {item.val}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[32px] p-8 border-brand-olive/5 shadow-2xl bg-white">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-brand-cream flex items-center justify-center text-brand-olive">
                   <Bell size={18} />
                </div>
                <h2 className="text-xl font-serif italic text-brand-ink">Liturgy Sync</h2>
              </div>
              
              <div className="space-y-4">
                {[
                  { id: 'liturgyAlerts', label: 'Service Reminders', desc: 'Upcoming gathering alerts', icon: MessageSquare },
                  { id: 'donationReceipts', label: 'Stewardship Records', desc: 'Receipts for offered seeds', icon: Receipt },
                  { id: 'communityNews', label: 'Congregation Pulse', desc: 'Updates from the elders', icon: Mail },
                ].map((pref) => (
                  <div 
                    key={pref.id} 
                    onClick={() => togglePreference(pref.id)}
                    className="flex items-center justify-between gap-4 p-4 rounded-[24px] bg-brand-cream/20 hover:bg-brand-cream/50 transition-all cursor-pointer group border border-transparent hover:border-brand-olive/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-olive shrink-0 shadow-sm border border-brand-olive/5 group-hover:scale-110 transition-transform">
                        <pref.icon size={16} />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-brand-ink mb-0.5">{pref.label}</p>
                        <p className="text-[9px] text-brand-ink/40 font-medium italic">{pref.desc}</p>
                      </div>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <div className={`w-9 h-5 transition-all duration-500 rounded-full relative ${
                        (user.preferences?.[pref.id as keyof typeof user.preferences] ?? true) ? 'bg-brand-olive' : 'bg-brand-ink/10'
                      }`}>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-500 shadow-sm ${
                          (user.preferences?.[pref.id as keyof typeof user.preferences] ?? true) ? 'left-4.5' : 'left-0.5'
                        }`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="bg-brand-ink p-8 rounded-[32px] text-white overflow-hidden relative group">
              <div className="relative z-10">
                <Star size={32} className="text-brand-gold mb-6 group-hover:rotate-[360deg] transition-transform duration-1000" />
                <h3 className="text-2xl font-serif italic mb-4">Need Support?</h3>
                <p className="text-sm text-white/50 font-serif italic leading-relaxed mb-8">
                  "Our digital elders are standing by to assist with your sanctuary connection."
                </p>
                <Button variant="ghost" className="p-0 text-brand-gold hover:text-white hover:bg-transparent text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                  CONCILIAR SUPPORT <ArrowRight size={14} />
                </Button>
              </div>
              <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-brand-gold/5 rounded-full blur-[60px] group-hover:scale-125 transition-transform" />
            </div>
          </div>

          {/* Right Column: Activity & Benefits */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Metrics */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { title: 'Divine RSVPs', icon: Bookmark, count: 'Inactive', path: '#' },
                { 
                  title: 'Seeds Sown', 
                  icon: Receipt, 
                  count: `GH₵ ${donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}`, 
                  path: '/donations' 
                },
                { 
                  title: 'Spiritual Events', 
                  icon: Clock, 
                  count: activities.length.toString(), 
                  path: '/notifications' 
                },
              ].map((item, i) => (
                <Link key={item.title} to={item.path} className="bg-white p-8 rounded-[32px] border border-brand-olive/5 shadow-2xl hover:shadow-3xl hover:-translate-y-1.5 transition-all group block relative overflow-hidden">
                   <item.icon size={24} className="text-brand-olive mb-6 group-hover:scale-125 transition-transform duration-500" />
                   <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-ink/20 mb-1.5">{item.title}</p>
                   <p className="text-3xl font-serif italic text-brand-ink">{item.count}</p>
                   <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={18} className="text-brand-gold" />
                   </div>
                </Link>
              ))}
            </div>

            {/* Optimized Recent Activity Feed */}
            <Card className="rounded-[32px] border-brand-olive/5 shadow-2xl overflow-hidden flex flex-col bg-white">
               <div className="p-8 border-b border-brand-olive/5 flex justify-between items-center bg-brand-cream/10">
                  <h2 className="text-2xl font-serif italic text-brand-ink tracking-tight">Recent Activity</h2>
                  <Button variant="ghost" asChild className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-olive hover:text-brand-ink transition-colors h-auto p-0">
                    <Link to="/notifications" className="flex items-center gap-2.5">
                      Archive <ArrowRight size={14} />
                    </Link>
                  </Button>
               </div>
               
               <div className="max-h-[350px] overflow-y-auto scrollbar-hide">
                 {activitiesLoading ? (
                    <div className="p-16 text-center">
                       <Loader2 size={32} className="text-brand-olive/20 animate-spin mx-auto mb-4" />
                       <p className="text-sm text-brand-ink/40 font-serif italic">Scanning records...</p>
                    </div>
                 ) : activities.length > 0 ? (
                    <div className="divide-y divide-brand-olive/5">
                      {activities.slice(0, 5).map((activity, i) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          key={activity.id || i} 
                          className="p-6 hover:bg-brand-cream/20 transition-all flex items-center justify-between group cursor-default"
                        >
                          <div className="flex items-center gap-5 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-brand-cream flex items-center justify-center text-brand-olive group-hover:brand-gradient group-hover:text-white transition-all shadow-sm shrink-0">
                              {activity.type === 'donation' ? <Receipt size={20} /> : activity.type === 'registration' ? <Calendar size={20} /> : <MessageSquare size={20} />}
                            </div>
                            <div className="min-w-0">
                               <p className="text-[9px] uppercase tracking-[0.4em] font-black text-brand-ink/30 mb-1">
                                 {activity.category}
                               </p>
                               <h4 className="font-serif italic text-brand-ink text-lg truncate pr-4">
                                 {activity.type === 'donation' ? `Seed: GH₵ ${activity.amount}` : activity.name || activity.request || 'Gathering Confirmed'}
                               </h4>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[8px] font-black tracking-[0.2em] text-brand-ink/20 uppercase bg-brand-ink/5 px-3 py-1.5 rounded-full">
                              {activity.timestamp?.seconds ? new Date(activity.timestamp.seconds * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recent'}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-16 text-center flex flex-col items-center justify-center">
                       <div className="w-16 h-16 rounded-full bg-brand-cream/30 flex items-center justify-center text-brand-cream mb-6">
                          <Bell size={32} />
                       </div>
                       <p className="text-lg text-brand-ink/40 font-serif italic mb-2">The scrolls are vacant.</p>
                       <p className="text-[9px] text-brand-ink/20 tracking-[0.2em] uppercase font-black max-w-[200px]">Your sacred interactions will manifest here.</p>
                    </div>
                  )}
               </div>
            </Card>

            {/* Donation Overview */}
            <Card className="rounded-[32px] border-brand-olive/5 overflow-hidden shadow-2xl bg-white">
               <div className="p-8 border-b border-brand-olive/5 flex justify-between items-center">
                  <h2 className="text-2xl font-serif italic text-brand-ink tracking-tight">Offering History</h2>
                  <Button asChild variant="ghost" className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-olive hover:text-brand-ink transition-colors p-0 h-auto">
                    <Link to="/donations" className="flex items-center gap-2.5">
                      New Seed <ArrowRight size={14} />
                    </Link>
                  </Button>
               </div>
               
               <div className="max-h-[350px] overflow-y-auto scrollbar-hide">
                 {donationsLoading ? (
                    <div className="p-16 text-center">
                       <Loader2 size={28} className="text-brand-olive/20 animate-spin mx-auto mb-3" />
                       <p className="text-xs text-brand-ink/40 italic">Consulting scribes...</p>
                    </div>
                 ) : donations.length > 0 ? (
                    <div className="divide-y divide-brand-olive/5">
                      {donations.slice(0, 4).map((donation) => (
                        <div key={donation.id} className="p-8 hover:bg-brand-cream/10 transition-all flex justify-between items-center group">
                           <div className="flex items-center gap-6">
                              <div className="w-14 h-14 bg-brand-cream rounded-[20px] flex items-center justify-center text-brand-olive group-hover:scale-110 transition-transform shadow-inner">
                                 <Heart size={20} className={donation.amount > 100 ? "fill-current" : ""} />
                              </div>
                              <div>
                                 <div className="flex items-center gap-2 mb-1">
                                   <p className="text-[9px] uppercase tracking-[0.4em] font-black text-brand-ink/40">
                                     {donation.category}
                                   </p>
                                   <span className="w-1 h-1 rounded-full bg-brand-olive/20" />
                                   <p className="text-[9px] uppercase font-black text-brand-ink/20 tracking-widest">
                                     {donation.timestamp?.seconds ? new Date(donation.timestamp.seconds * 1000).toLocaleDateString() : 'Recent'}
                                   </p>
                                 </div>
                                 <p className="font-serif italic text-brand-ink text-xl">GH₵ {donation.amount.toLocaleString()}</p>
                              </div>
                           </div>
                           <div className="flex flex-col items-end gap-2 pr-2">
                              <span className={`text-[8px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border ${
                                donation.status === 'completed' ? 'border-green-500/20 text-green-600 bg-green-50' : 'border-brand-gold/20 text-brand-gold bg-brand-gold/5'
                              }`}>
                                {donation.status}
                              </span>
                              <TrendingUp size={14} className="text-brand-olive/20" />
                           </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-16 text-center py-20">
                       <Receipt size={40} className="text-brand-cream mx-auto mb-6" />
                       <p className="text-lg text-brand-ink/40 font-serif italic mb-2">No offerings yet.</p>
                       <p className="text-[9px] text-brand-ink/20 tracking-[0.2em] font-black uppercase">Your seeds of faith will be recorded.</p>
                    </div>
                 )}
               </div>
            </Card>

            {/* Empty States / Exploration */}
            <div className="bg-brand-cream/30 rounded-[32px] border border-brand-olive/5 overflow-hidden p-10 text-center relative group">
               <div className="max-w-md mx-auto relative z-10">
                  <div className="w-16 h-16 bg-brand-olive/10 rounded-[24px] flex items-center justify-center text-brand-olive mx-auto mb-8 group-hover:rotate-[360deg] transition-transform duration-1000">
                    <Calendar size={28} />
                  </div>
                  <h2 className="text-2xl font-serif italic text-brand-ink mb-4">Explore the Diaspora</h2>
                  <p className="text-sm text-brand-ink/40 font-serif italic leading-relaxed mb-8 px-4">
                    "Find your place in our global gatherings and community events across the nations."
                  </p>
                  <Button asChild size="lg" className="rounded-xl px-8 h-14 brand-gradient text-white text-[10px] font-black uppercase tracking-[0.4em] shadow-3xl shadow-brand-olive/20 hover:scale-105 transition-all">
                    <Link to="/events">Discover Events</Link>
                  </Button>
               </div>
               <div className="absolute top-0 right-0 p-10 opacity-10">
                  <ArrowRight size={100} className="rotate-45" />
               </div>
            </div>

            {/* Role Escalation / Authority */}
            {user.role === 'admin' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-ink p-10 rounded-[40px] border border-brand-gold/20 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group shadow-4xl shadow-brand-ink/20"
              >
                <div className="w-20 h-20 rounded-[24px] bg-brand-gold flex items-center justify-center text-brand-ink shrink-0 shadow-2xl group-hover:rotate-12 transition-transform">
                   <Shield size={32} />
                </div>
                <div className="text-center md:text-left relative z-10">
                   <h3 className="text-3xl font-serif italic text-white mb-3 tracking-tighter">Eldership Command</h3>
                   <p className="text-white/40 text-base font-serif italic leading-relaxed mb-8 max-w-lg">
                     Divine authority granted. Control the flow of sermons, curate the digital fold, and shape the sanctuary's future.
                   </p>
                   <Button asChild size="lg" className="bg-white text-brand-ink hover:bg-brand-gold hover:text-white rounded-xl h-14 px-8 text-[10px] font-black uppercase tracking-[0.4em] transition-all">
                      <Link to="/admin">COMMAND CENTER</Link>
                   </Button>
                </div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand-gold/5 rounded-full blur-[90px]" />
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
