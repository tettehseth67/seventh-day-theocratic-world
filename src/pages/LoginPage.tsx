import { CHURCH_NAME } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Church, LogIn, ArrowRight, ShieldCheck, Mail, Lock, User, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const { login, loginWithEmail, signupWithEmail, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'options' | 'email-login' | 'email-signup'>('options');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'member') {
        navigate('/profile', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, authLoading, navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const role = await login();
      toast.success('Divine connection established');
      if (role === 'admin') navigate('/admin');
      else if (role === 'member') navigate('/profile');
      else navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const role = await loginWithEmail(email, password);
      toast.success('Welcome back to the sanctuary');
      if (role === 'admin') navigate('/admin');
      else if (role === 'member') navigate('/profile');
      else navigate('/');
    } catch (error: any) {
      console.error('Email login error:', error);
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return toast.error('Please enter your name');
    setLoading(true);
    try {
      const role = await signupWithEmail(email, password, name);
      toast.success('Membership activated successfully');
      if (role === 'admin') navigate('/admin');
      else navigate('/profile');
    } catch (error: any) {
      console.error('Email signup error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden selection:bg-brand-gold/30">
      {/* Left Pane: Cinematic & Narrative */}
      <div className="hidden lg:flex lg:w-3/5 relative bg-brand-ink items-center justify-center p-16 overflow-hidden">
        {/* Animated Background Image */}
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 0.6 }}
          transition={{ duration: 3, ease: "easeOut" }}
        >
          <img 
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1600" 
            alt={CHURCH_NAME} 
            className="w-full h-full object-cover grayscale brightness-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-ink via-brand-ink/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold/5 via-transparent to-transparent opacity-50" />
        </motion.div>

        {/* Narrative Content */}
        <div className="relative z-10 max-w-2xl text-left">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.2 }}
          >
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-brand-gold/10 border border-brand-gold/20 rounded-full mb-12 backdrop-blur-md">
              <Sparkles size={16} className="text-brand-gold animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-brand-gold">Theocratic Gateway</span>
            </div>
            
            <h1 className="text-6xl font-serif italic text-white mb-8 leading-[1] tracking-tighter">
              A SACRED <br />
              <span className="text-brand-gold">REUNION</span> <br />
              OF SOULS
            </h1>
            
            <p className="text-brand-cream/60 font-serif italic text-xl leading-relaxed mb-12 max-w-lg">
              "Behold, how good and how pleasant it is for brethren to dwell together in unity!"
            </p>

            <div className="flex items-center gap-10">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div 
                    key={i} 
                    initial={{ scale: 0, x: -20 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ delay: 1 + (i * 0.1) }}
                    className="w-14 h-14 rounded-full border-4 border-brand-ink bg-brand-cream/10 overflow-hidden shadow-2xl"
                  >
                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="Member" className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white">
                  2,400+ FAITHFUL MEMBERS
                </p>
                <p className="text-[9px] uppercase tracking-[0.4em] text-brand-gold font-black opacity-60">Connected Across Diaspora</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-brand-ink to-transparent" />
        <div className="absolute top-20 right-20 w-48 h-48 border border-brand-gold/10 rounded-full animate-spin-slow opacity-30" />
      </div>

      {/* Right Pane: Interface */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 md:p-16 relative bg-white">
        <div className="max-w-md w-full">
          {/* Mobile/Small Screen Header */}
          <div className="lg:hidden mb-16 flex items-center justify-between">
            <Link to="/" className="inline-flex items-center justify-center w-14 h-14 brand-gradient rounded-2xl shadow-2xl shadow-brand-olive/20">
              <Church size={24} className="text-white" />
            </Link>
            <Button asChild variant="ghost" className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-ink/40">
              <Link to="/">
                <ArrowLeft size={16} className="mr-2" /> Return Home
              </Link>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="mb-12 text-left relative">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="hidden lg:flex w-16 h-16 brand-gradient rounded-2xl items-center justify-center shadow-3xl shadow-brand-olive/20 hover:rotate-12 hover:scale-105 transition-all duration-700">
                  <Church size={28} className="text-white" />
                </Link>
                <Button variant="ghost" asChild className="hidden lg:flex text-[11px] font-black uppercase tracking-[0.4em] text-brand-ink/20 hover:text-brand-olive hover:bg-transparent transition-all group p-0">
                  <Link to="/">
                    <ArrowLeft size={18} className="mr-3 group-hover:-translate-x-2 transition-transform" />
                    Archive Exit
                  </Link>
                </Button>
              </div>
              <h2 className="text-4xl font-serif text-brand-ink mb-4 italic tracking-tighter">Welcome Beloved</h2>
              <div className="flex items-center gap-4">
                <div className="h-[2px] w-12 bg-brand-gold/30" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-ink/20">Establishing Divine Connection</p>
              </div>
            </div>

            <div className="min-h-[480px]">
              <AnimatePresence mode="wait">
                {mode === 'options' && (
                  <motion.div
                    key="options"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <Button
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="w-full group bg-brand-ink text-white p-6 rounded-[28px] text-[11px] font-black uppercase tracking-[0.5em] flex items-center justify-between hover:bg-brand-olive hover:shadow-3xl hover:shadow-brand-olive/20 transition-all duration-700 disabled:opacity-50 h-auto"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:rotate-12 transition-all duration-500 shadow-inner">
                          <LogIn size={24} />
                        </div>
                        <span>Google Manifestation</span>
                      </div>
                      <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform text-brand-gold" />
                    </Button>

                    <div className="relative py-12 flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-ink/5" /></div>
                      <span className="relative px-8 bg-white text-[10px] font-black uppercase tracking-[0.6em] text-brand-ink/10 italic">Archival Passage</span>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setMode('email-login')}
                      className="w-full group bg-brand-cream/10 border-brand-olive/10 text-brand-ink p-6 rounded-[28px] text-[11px] font-black uppercase tracking-[0.5em] flex items-center justify-between hover:bg-brand-cream hover:border-brand-olive/20 transition-all duration-500 h-auto"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-olive shadow-sm border border-brand-olive/5 group-hover:scale-110 transition-transform">
                          <Mail size={22} />
                        </div>
                        <span>Email Protocol</span>
                      </div>
                      <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform text-brand-ink/30" />
                    </Button>

                    <div className="pt-16 text-center">
                      <p className="text-[11px] text-brand-ink/30 font-black uppercase tracking-[0.3em] leading-relaxed">
                        Establishing membership? <br />
                        <Link to="/" className="text-brand-olive hover:text-brand-gold underline underline-offset-[12px] decoration-brand-olive/20 transition-all font-black mt-4 inline-block">CONTACT THE COVENANT ELDERS</Link>
                      </p>
                    </div>
                  </motion.div>
                )}

                {(mode === 'email-login' || mode === 'email-signup') && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="space-y-10"
                  >
                    <Button 
                      variant="ghost"
                      onClick={() => setMode('options')}
                      className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-brand-olive hover:text-brand-gold hover:bg-transparent p-0 h-auto"
                    >
                      <ArrowLeft size={18} /> BACK TO GATEWAY
                    </Button>

                    <form onSubmit={mode === 'email-login' ? handleEmailLogin : handleEmailSignup} className="space-y-8">
                      <div className="space-y-5">
                        {mode === 'email-signup' && (
                          <div className="relative group">
                            <User className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-ink/20 group-focus-within:text-brand-gold transition-colors z-10" />
                            <Input 
                              type="text" 
                              placeholder="Spirit Name"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full h-18 bg-brand-cream/20 border-brand-olive/5 rounded-2xl pl-16 pr-8 text-base font-serif italic focus-visible:ring-brand-gold/10 focus-visible:border-brand-gold/40 focus:bg-white transition-all text-brand-ink shadow-sm py-9"
                            />
                          </div>
                        )}
                        <div className="relative group">
                          <Mail className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-ink/20 group-focus-within:text-brand-gold transition-colors z-10" />
                          <Input 
                            type="email" 
                            placeholder="Divine Address"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-18 bg-brand-cream/20 border-brand-olive/5 rounded-2xl pl-16 pr-8 text-base font-serif italic focus-visible:ring-brand-gold/10 focus-visible:border-brand-gold/40 focus:bg-white transition-all text-brand-ink shadow-sm py-9"
                          />
                        </div>
                        <div className="relative group">
                          <Lock className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-ink/20 group-focus-within:text-brand-gold transition-colors z-10" />
                          <Input 
                            type="password" 
                            placeholder="Sacred Key"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-18 bg-brand-cream/20 border-brand-olive/5 rounded-2xl pl-16 pr-8 text-base font-serif italic focus-visible:ring-brand-gold/10 focus-visible:border-brand-gold/40 focus:bg-white transition-all text-brand-ink shadow-sm py-9"
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-9 brand-gradient text-white rounded-3xl text-[12px] font-black uppercase tracking-[0.6em] shadow-3xl shadow-brand-olive/20 hover:shadow-brand-olive/40 hover:-translate-y-2 transition-all duration-700 flex items-center justify-center gap-4 disabled:opacity-50 h-auto"
                      >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : (
                          <>
                            {mode === 'email-login' ? 'ESTABLISH ACCESS' : 'ENLIST SOUL'}
                            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                          </>
                        )}
                      </Button>

                      <div className="text-center pt-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-ink/20">
                          {mode === 'email-login' ? "Identity Unlisted?" : "Already part of the fold?"} {" "}
                          <Button 
                            variant="ghost" 
                            type="button"
                            onClick={() => setMode(mode === 'email-login' ? 'email-signup' : 'email-login')}
                            className="text-brand-olive hover:text-brand-gold font-black ml-2 p-0 h-auto hover:bg-transparent underline decoration-brand-olive/30"
                          >
                            {mode === 'email-login' ? "ENLIST NOW" : "RECONNECT"}
                          </Button>
                        </p>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-24 pt-12 border-t border-brand-ink/5 flex flex-col items-center gap-8">
               <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-[0.5em] text-brand-ink/10 group hover:text-brand-gold transition-all duration-700">
                  <ShieldCheck size={18} className="group-hover:rotate-12 transition-transform text-brand-gold/40" />
                  Divinely Encrypted Archive
               </div>
               <p className="text-[10px] text-brand-ink/20 font-serif italic text-center leading-relaxed max-w-[280px]">
                 "Your spiritual footprints are protected across the global sanctuary of the diaspora."
               </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
