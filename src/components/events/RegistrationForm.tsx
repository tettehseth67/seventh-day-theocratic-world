import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Loader2, Send, Mail, User } from 'lucide-react';
import { registerForEvent } from '../../services/dataService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

interface RegistrationFormProps {
  eventId: string;
  eventTitle: string;
}

export default function RegistrationForm({ eventId, eventTitle }: RegistrationFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.displayName || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please enter your details');
      return;
    }

    const regData: any = {
      eventId,
      userName: formData.name,
      userEmail: formData.email,
    };
    
    if (user?.uid) {
      regData.userId = user.uid;
    }

    setStatus('loading');
    try {
      await registerForEvent(regData);
      setStatus('success');
      toast.success('Divine connection archived');
    } catch (error) {
      console.error(error);
      setStatus('error');
      toast.error('Submission failed. The sanctuary connection was interrupted.');
    }
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-brand-olive text-white p-8 rounded-[40px] text-center shadow-2xl shadow-brand-olive/20"
      >
        <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-brand-gold" />
        </div>
        <h4 className="font-serif text-3xl mb-4 italic">Attendance Manifested</h4>
        <p className="text-white/70 mb-2 text-sm leading-relaxed">Your registration for</p>
        <p className="font-bold mb-8 text-xl text-brand-gold">{eventTitle}</p>
        <div className="pt-6 border-t border-white/10">
          <p className="text-[10px] uppercase tracking-widest font-bold opacity-60 italic">Peace be with you</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-[40px] border border-brand-olive/10 shadow-2xl shadow-brand-olive/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cream rounded-full -translate-y-1/2 translate-x-1/2 -z-10 transition-transform group-hover:scale-110"></div>
      
      <h4 className="font-serif text-2xl mb-2 italic text-brand-ink">Event Attendance</h4>
      <p className="text-brand-ink/50 text-xs mb-8 font-medium leading-relaxed">Secure your presence in the upcoming liturgy.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-ink/40 ml-4">
            <User size={12} className="text-brand-gold" /> Nom de Plume
          </label>
          <input
            required
            type="text"
            className="w-full px-6 py-4 bg-brand-cream border-none rounded-2xl focus:ring-4 focus:ring-brand-olive/5 transition-all text-sm font-medium"
            placeholder="Your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-ink/40 ml-4">
            <Mail size={12} className="text-brand-gold" /> Digital Scroll
          </label>
          <input
            required
            type="email"
            className="w-full px-6 py-4 bg-brand-cream border-none rounded-2xl focus:ring-4 focus:ring-brand-olive/5 transition-all text-sm font-medium"
            placeholder="archived@sanctuary.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <button
          disabled={status === 'loading'}
          className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-xs shadow-lg ${
            status === 'loading' 
              ? 'bg-brand-ink/10 text-brand-ink/40 cursor-not-allowed shadow-none' 
              : 'bg-brand-olive text-white hover:bg-brand-ink hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]'
          }`}
        >
          {status === 'loading' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Manifest Presence <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        {status === 'error' && (
          <div className="text-red-500 text-[10px] text-center font-bold uppercase tracking-tight py-2 bg-red-50 rounded-xl">
            Registration failed. Try again?
          </div>
        )}
      </form>
    </div>
  );
}

