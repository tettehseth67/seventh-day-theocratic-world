import { motion } from 'motion/react';
import { Donation } from '../../types';
import { Receipt, Calendar, User, Tag, Heart } from 'lucide-react';

interface DonationReceiptProps {
  donation: Donation;
  userRole?: string;
}

export default function DonationReceipt({ donation, userRole }: DonationReceiptProps) {
  const isAdmin = userRole === 'admin';
  
  const message = isAdmin 
    ? "This record has been officially logged into the congregation's stewardship ledger. Thank you for your faithful administration."
    : "Your sacrificial gift sustains our digital sanctuary and sanctifies our collective mission in Ghana and beyond.";

  const timestamp = donation.timestamp?.seconds 
    ? new Date(donation.timestamp.seconds * 1000) 
    : new Date();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[32px] overflow-hidden border border-brand-olive/5 shadow-2xl"
    >
      <div className="bg-brand-ink p-8 text-white text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-gold/20 flex items-center justify-center text-brand-gold mx-auto mb-4 border border-brand-gold/10">
          <Heart size={32} />
        </div>
        <h3 className="text-2xl font-serif italic mb-1">Official Receipt</h3>
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-gold/60">Stewardship Confirmation</p>
      </div>
      
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/30 mb-2">{isAdmin ? 'Administrative Log' : 'Faithful Steward'}</p>
            <div className="flex items-center gap-2 mb-1">
              <User size={14} className="text-brand-olive" />
              <p className="font-bold text-brand-ink text-sm">{donation.userName}</p>
            </div>
            <p className="text-[10px] text-brand-ink/40 font-mono ml-5">{donation.userEmail}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/30 mb-2">Receipt Details</p>
            <p className="text-xs font-bold text-brand-ink mb-1">#{donation.id?.slice(-8).toUpperCase() || 'NEW-ENTRY'}</p>
            <div className="flex items-center justify-end gap-2 text-[10px] text-brand-ink/40">
              <Calendar size={12} />
              <span>{timestamp.toLocaleDateString('en-GB')}</span>
            </div>
          </div>
        </div>

        <div className="bg-brand-cream/50 rounded-2xl p-6 border border-brand-olive/5">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-brand-olive/40" />
              <span className="text-xs font-bold text-brand-ink/60 uppercase racking-wider">{donation.category}</span>
            </div>
            <span className="text-2xl font-serif italic text-brand-olive">GH₵ {donation.amount.toLocaleString()}</span>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[9px] font-bold uppercase tracking-widest border border-green-100">
            Transaction Verified
          </div>
          <p className="text-xs text-brand-ink/60 leading-relaxed font-serif italic px-4">
            "{message}"
          </p>
        </div>

        <div className="pt-6 border-t border-dashed border-brand-olive/10 text-center">
          <p className="text-[8px] text-brand-ink/20 uppercase tracking-widest font-bold">Finance Department &bull; Digital Sanctuary Archive</p>
        </div>
      </div>
    </motion.div>
  );
}
