import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { getDonations } from '../services/dataService';
import { Donation } from '../types';
import { Receipt, Calendar, Tag, ChevronRight, Loader2, Sparkles, Heart, Download } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import { generateDonationReceipt } from '../lib/pdfGenerator';

export default function DonationsPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      if (user) {
        // Members only see their own. Admins can see all but here we usually show user's own in their portal
        const data = await getDonations(user.role === 'admin' ? undefined : user.uid);
        setDonations(data);
        setLoading(true); // Artificial delay for effect? No, just loading.
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchDonations();
  }, [user]);

  const totalDonated = donations.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-32"
    >
      <PageHeader 
        title="Offering History" 
        subtitle="A record of your sacred contributions to the sanctuary's mission."
        category="Stewardship"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Summary Card */}
          <div className="lg:col-span-1">
             <div className="bg-brand-ink text-white rounded-[32px] p-8 shadow-2xl shadow-brand-ink/20 sticky top-24">
                <Heart size={24} className="text-brand-gold mb-6" />
                <h2 className="text-xl font-serif italic mb-1 text-white">Total Contributions</h2>
                <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-6">All-time stewardship</p>
                
                <div className="text-3xl md:text-4xl font-serif italic text-brand-gold mb-8">
                  GH₵ {totalDonated.toLocaleString()}
                </div>

                <div className="space-y-3 pt-6 border-t border-white/10">
                   <div className="flex justify-between items-center text-white">
                      <span className="text-[10px] text-white/40">Total Records</span>
                      <span className="text-xs font-bold">{donations.length}</span>
                   </div>
                   <div className="flex justify-between items-center text-white">
                      <span className="text-[10px] text-white/40">Active Status</span>
                      <span className="text-[9px] bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full font-bold uppercase">Faithful</span>
                   </div>
                </div>
                
                <div className="mt-8 p-5 bg-white/5 rounded-2xl border border-white/5">
                   <p className="text-[10px] text-white/60 leading-relaxed italic">
                     "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
                   </p>
                </div>
             </div>
          </div>

          {/* Records List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="bg-white rounded-[32px] p-16 flex flex-col items-center justify-center border border-brand-olive/5">
                <Loader2 size={32} className="text-brand-olive animate-spin mb-4" />
                <p className="text-brand-ink/30 italic font-serif text-lg">Opening the scrolls...</p>
              </div>
            ) : donations.length > 0 ? (
              <div className="space-y-3">
                {donations.map((donation, i) => (
                  <motion.div 
                    key={donation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-3xl p-6 border border-brand-olive/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:shadow-xl hover:shadow-brand-olive/5 transition-all group"
                  >
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 rounded-2xl bg-brand-cream flex items-center justify-center text-brand-olive group-hover:bg-brand-olive group-hover:text-white transition-all shadow-sm">
                          <Receipt size={24} />
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <p className="font-bold text-brand-ink">{donation.category}</p>
                             <span className="text-[10px] uppercase font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                               {donation.status}
                             </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-brand-ink/40">
                             <span className="flex items-center gap-1.5"><Calendar size={12} /> {donation.timestamp?.seconds ? new Date(donation.timestamp.seconds * 1000).toLocaleDateString() : 'Recent'}</span>
                             <span className="flex items-center gap-1.5"><Tag size={12} /> Receipt #{donation.id?.slice(-6).toUpperCase()}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                       <div className="text-right flex-grow sm:flex-grow-0">
                          <p className="text-2xl font-serif italic text-brand-olive leading-none mb-1">GH₵ {donation.amount}</p>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/20">Contribution</p>
                       </div>
                       <button 
                         onClick={() => generateDonationReceipt(donation, user?.role)}
                         className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-ink/20 hover:text-brand-gold hover:bg-brand-gold/10 transition-all tooltip"
                         title="Download Receipt"
                       >
                          <Download size={18} />
                       </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-brand-cream/30 rounded-[40px] p-20 text-center border border-dashed border-brand-olive/20">
                 <Sparkles size={48} className="text-brand-olive/20 mx-auto mb-8" />
                 <h3 className="text-2xl font-serif italic text-brand-ink mb-4">A Blank Slate of Stewardship</h3>
                 <p className="text-sm text-brand-ink/40 max-w-sm mx-auto leading-relaxed">
                   Your donation history is currently clear. Contributions made through our online portal will appear here as a record of your generosity.
                 </p>
                 <a href="/give" className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-brand-olive text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-ink transition-all shadow-lg shadow-brand-olive/20">
                   Make Your First Offering
                 </a>
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}
