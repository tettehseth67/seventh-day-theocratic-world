import { motion, AnimatePresence } from 'motion/react';
import { Heart, CreditCard, Repeat, ShieldCheck, Loader2, CheckCircle2, Download, Church } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { createDonation } from '../../services/dataService';
import { generateDonationReceipt } from '../../lib/pdfGenerator';
import DonationReceipt from '../donations/DonationReceipt';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500];

export default function DonationPortal() {
  const { user } = useAuth();
  const [amount, setAmount] = useState<number | ''>(50);
  const [category, setCategory] = useState('General Offering');
  const [isRecurring, setIsRecurring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CATEGORIES = [
    'General Offering',
    'Tithe',
    'Monthly Dues',
    'Building Fund',
    'Missions & Outreach',
    'Benevolence'
  ];

  const handleDonate = async () => {
    setError(null);

    if (!amount) {
      setError('Please enter or select a donation amount');
      return;
    }

    if (Number(amount) <= 0) {
      setError('Donation amount must be a positive number');
      return;
    }
    
    setLoading(true);
    try {
      await createDonation({
        userId: user?.uid || 'guest',
        userName: user?.displayName || 'Anonymous Donor',
        userEmail: user?.email || 'guest@sdtwc.org',
        amount: Number(amount),
        category: isRecurring ? `Recurring ${category}` : category,
        status: 'completed'
      });
      
      setLoading(false);
      setSuccess(true);
      toast.success('Your soul\'s provision has been successfully recorded in the digital archives.');
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error(error);
      setError('Failed to process donation. Please try again.');
      setLoading(false);
    }
  };

  return (
    <section id="give" className="py-32 md:py-60 bg-[#FCFAFB] relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-brand-gold/[0.03] rounded-full blur-[140px] -z-10 translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-brand-olive/[0.02] rounded-full blur-[140px] -z-10 -translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-24 lg:gap-36 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            viewport={{ once: true }}
            className="space-y-16 md:space-y-20"
          >
            <div>
              <div className="flex items-center gap-5 mb-10">
                <div className="w-12 h-[1.5px] bg-brand-gold" />
                <span className="text-[11px] font-black uppercase tracking-[0.6em] text-brand-gold">DIVINE STEWARDSHIP</span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-serif italic text-brand-ink leading-[0.85] mb-12 tracking-tighter">
                The Grace of <br /> <span className="text-brand-olive relative inline-block">Giving <div className="absolute bottom-1 left-0 w-full h-[1px] bg-brand-gold/30" /></span> <br /> Manifest.
              </h2>
              
              <p className="text-xl md:text-2xl text-brand-ink/40 leading-relaxed font-serif italic pr-12">
                "Your contribution is the architectural support of our mission. Every seed sown fuels the expansion of sacred territory and the manifestation of truth."
              </p>
            </div>

            <div className="grid gap-12">
              {[
                { title: "Sacred Welfare", desc: "Providing essential provisions for marginalized souls within our global diaspora.", icon: <Heart size={26} /> },
                { title: "Temple Expansion", desc: "Sustaining the physical and digital spires of our sanctuary for future generations.", icon: <Church size={26} /> }
              ].map((item, i) => (
                <div key={item.title} className="flex gap-8 group">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-brand-gold shadow-[0_15px_35px_-5px_rgba(40,40,20,0.08)] border border-brand-olive/5 group-hover:bg-brand-gold group-hover:text-white transition-all duration-700">
                    {item.icon}
                  </div>
                  <div className="pt-2">
                    <h4 className="text-2xl font-serif italic text-brand-ink mb-3">{item.title}</h4>
                    <p className="text-brand-ink/40 font-serif italic text-base leading-relaxed pr-8">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-10 rounded-[50px] bg-brand-cream/50 border border-brand-olive/5 flex items-center gap-10 shadow-inner">
               <div className="w-20 h-20 rounded-full brand-gradient flex items-center justify-center text-white shadow-xl shadow-brand-olive/20 animate-float">
                  <ShieldCheck size={36} />
               </div>
               <div>
                  <p className="text-xl font-serif italic text-brand-ink leading-tight">Sanctuary Vault Protocol</p>
                  <p className="text-[10px] uppercase font-black tracking-widest text-brand-ink/30 mt-3">SSL Encrypted Divine Transactions</p>
               </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            viewport={{ once: true }}
            className="relative"
          >
             {/* Glow base */}
             <div className="absolute -inset-10 bg-brand-gold/5 blur-[120px] -z-10 rounded-full" />
             
            <Card className="rounded-[60px] md:rounded-[80px] bg-white border-2 border-brand-olive/5 shadow-[0_60px_130px_-30px_rgba(90,90,64,0.18)] relative overflow-hidden group">
              <div className="bg-white p-10 md:p-14">
                <div className="mb-12 flex flex-col sm:flex-row p-1.5 bg-brand-cream/80 backdrop-blur-md rounded-[32px] gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setIsRecurring(false)}
                    className={`flex-1 h-16 rounded-[28px] text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-700 shadow-none border-none ${!isRecurring ? 'bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] text-brand-olive' : 'text-brand-ink/30 hover:text-brand-ink'}`}
                  >
                    Occasional
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setIsRecurring(true)}
                    className={`flex-1 h-16 rounded-[28px] text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-700 shadow-none border-none flex items-center justify-center gap-3 ${isRecurring ? 'bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] text-brand-olive' : 'text-brand-ink/30 hover:text-brand-ink'}`}
                  >
                    <Repeat size={14} className={isRecurring ? 'animate-spin-slow' : ''} /> Permanent
                  </Button>
                </div>

                <div className="mb-14">
                  <Label className="text-[9px] uppercase tracking-[0.4em] font-black text-brand-gold mb-5 block text-center">Designation of Seeds</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {CATEGORIES.map((cat) => (
                      <Button
                        key={cat}
                        variant="outline"
                        onClick={() => setCategory(cat)}
                        className={`h-16 px-4 rounded-2xl text-[9px] font-bold uppercase tracking-widest transition-all duration-500 border-2 ${
                          category === cat 
                            ? 'bg-brand-olive text-white border-brand-olive shadow-xl' 
                            : 'bg-white text-brand-ink/40 border-brand-cream hover:border-brand-gold/30 hover:bg-brand-cream/20'
                        }`}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-10">
                  {PRESET_AMOUNTS.map((amt) => (
                    <Button
                      key={amt}
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setAmount(amt);
                        setError(null);
                      }}
                      className={`h-20 md:h-24 rounded-[32px] transition-all duration-700 flex flex-col items-center justify-center border-2 group/amt overflow-hidden relative ${amount === amt ? 'bg-brand-olive/5 border-brand-olive text-brand-olive' : 'bg-white border-brand-cream text-brand-ink/50'}`}
                    >
                      <span className="text-[9px] uppercase font-black tracking-widest opacity-40 mb-1">GH₵</span>
                      <span className="text-2xl md:text-3xl font-serif italic">{amt}</span>
                      {amount === amt && (
                         <div className="absolute inset-x-0 bottom-0 h-1 brand-gradient" />
                      )}
                    </Button>
                  ))}
                </div>

                <div className="space-y-4 mb-14">
                  <Label htmlFor="other-amount" className="text-[9px] uppercase tracking-[0.4em] font-black text-brand-gold block text-center">Sacred Amount</Label>
                  <div className="relative group">
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 text-2xl font-serif text-brand-ink/20 group-focus-within:text-brand-olive transition-colors italic">GH₵</span>
                    <Input
                      id="other-amount"
                      type="number"
                      placeholder="Amount of truth"
                      value={amount}
                      onChange={(e) => {
                        setAmount(Number(e.target.value) || '');
                        setError(null);
                      }}
                      className="w-full h-20 md:h-24 pl-24 pr-8 bg-brand-cream/50 border-2 border-transparent focus:border-brand-olive/10 rounded-[32px] md:rounded-[40px] text-3xl font-serif italic focus-visible:ring-0 transition-all text-brand-ink"
                    />
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center mt-4"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <Button 
                  onClick={handleDonate}
                  disabled={loading || success}
                  className="w-full h-20 md:h-24 brand-gradient text-white rounded-[32px] md:rounded-[40px] text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-4 hover:shadow-[0_20px_50px_-10px_rgba(90,90,64,0.4)] hover:-translate-y-1 transition-all duration-700 group disabled:opacity-50 border-none"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : success ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <CreditCard size={20} className="group-hover:scale-125 transition-transform text-white" />
                  )}
                  {loading ? 'Transmitting offering...' : success ? 'Glory to the Almighty' : 'Process Sacred Seed'}
                </Button>

                {success && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="mt-14 space-y-8"
                  >
                    <DonationReceipt 
                      donation={{
                        userId: user?.uid || 'guest',
                        userName: user?.displayName || 'Anonymous Donor',
                        userEmail: user?.email || '',
                        amount: Number(amount),
                        category: isRecurring ? `Recurring ${category}` : category,
                        status: 'completed',
                        timestamp: { seconds: Math.floor(Date.now() / 1000) }
                      }} 
                      userRole={user?.role}
                    />
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        generateDonationReceipt({
                          userId: user?.uid || 'guest',
                          userName: user?.displayName || 'Anonymous Donor',
                          userEmail: user?.email || '',
                          amount: Number(amount),
                          category: isRecurring ? `Recurring ${category}` : category,
                          status: 'completed',
                          timestamp: { seconds: Math.floor(Date.now() / 1000) }
                        }, user?.role);
                      }}
                      className="w-full h-18 md:h-20 border-2 border-brand-olive/10 text-brand-olive rounded-3xl text-[10px] uppercase font-black tracking-[0.3em] gap-4 hover:bg-brand-olive hover:text-white transition-all duration-700 font-serif italic"
                    >
                      <Download size={20} /> Secular Archives (PDF)
                    </Button>
                  </motion.div>
                )}
                
                {!user && !success && (
                   <p className="text-center mt-10 text-[10px] text-brand-ink/30 uppercase font-black tracking-widest leading-relaxed">
                      Contributing as Guest. <Link to="/login" className="text-brand-olive hover:text-brand-gold transition-colors underline decoration-brand-olive/20 underline-offset-8">Archive your identity</Link> for history.
                   </p>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
