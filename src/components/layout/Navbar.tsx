import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Church, LogIn, LogOut, User, Heart } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CHURCH_NAME } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import { Button } from '@/components/ui/button';
import Logo from './Logo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close mobile menu on location change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Sermons', href: '/sermons' },
    { name: 'Livestream', href: '/livestream' },
  ];

  if (user && (user.role === 'member' || user.role === 'admin')) {
    navLinks.push({ name: 'Directory', href: '/directory' });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav 
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
      scrolled || isOpen 
        ? 'py-2 bg-white/95 backdrop-blur-3xl shadow-2xl shadow-brand-olive/5 border-b border-brand-olive/5' 
        : 'py-4 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex justify-between items-center">
          
          <Logo />

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-brand-gold relative group ${
                    isActive(link.href) ? 'text-brand-olive' : 'text-brand-ink/70 hover:text-brand-ink'
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-3 left-0 h-[3px] bg-brand-gold transition-all duration-700 ${isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full opacity-50'}`} />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-6 pl-10 border-l border-brand-olive/10">
              {user ? (
                <div className="flex items-center gap-6">
                  <Link to="/profile" className="flex items-center gap-4 group">
                    <div className="text-right">
                      <p className="text-[11px] font-black text-brand-ink group-hover:text-brand-olive transition-colors leading-none mb-1 uppercase tracking-wider">
                        {user.displayName?.split(' ')[0] || 'Member'}
                      </p>
                      <p className="text-[9px] uppercase tracking-widest text-brand-gold font-black opacity-80">Sanctuary</p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-brand-cream border border-brand-olive/5 flex items-center justify-center text-brand-olive group-hover:bg-brand-olive group-hover:text-white transition-all duration-500 shadow-sm overflow-hidden relative">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="p-3 text-brand-ink/20 hover:text-red-500 hover:bg-red-50/50 transition-all rounded-xl"
                  >
                    <LogOut size={18} />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  asChild
                  className="text-[11px] font-black text-brand-ink/40 hover:text-brand-olive transition-all uppercase tracking-[0.2em]"
                >
                  <Link to="/login">
                    <LogIn size={16} className="mr-2" /> Sign In
                  </Link>
                </Button>
              )}
              
              <Button
                asChild
                className="brand-gradient text-white px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] hover:shadow-3xl hover:shadow-brand-olive/30 hover:-translate-y-2 transition-all duration-700 flex items-center gap-4 group relative overflow-hidden"
              >
                <Link to="/give">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-in-out" />
                  <Heart size={16} className="group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 text-brand-gold fill-brand-gold" />
                  Sacred Tithings
                </Link>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-4 lg:hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="w-12 h-12 bg-white/50 backdrop-blur-md rounded-2xl text-brand-ink border-brand-olive/10 shadow-sm"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-3xl border-t border-brand-olive/5 overflow-hidden shadow-3xl"
          >
            <div className="flex flex-col gap-6 p-6">
              {user && (
                <Link 
                  to="/profile" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-6 p-6 bg-brand-cream/50 rounded-[32px] border border-brand-olive/5 shadow-inner group"
                >
                  <div className="w-16 h-16 rounded-3xl bg-brand-olive/10 flex items-center justify-center text-brand-olive overflow-hidden relative border-2 border-white shadow-xl group-hover:scale-105 transition-transform">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                    ) : (
                      <User size={28} />
                    )}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-brand-ink tracking-tight">{user.displayName || 'Spiritual Member'}</p>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-black mt-1">Access Sanctuary Sanctuary →</p>
                  </div>
                </Link>
              )}
              
              <div className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`text-3xl font-serif py-3 border-b border-brand-olive/5 italic tracking-tighter transition-all ${
                          isActive(link.href) ? 'text-brand-olive px-4 border-brand-olive/20 scale-105' : 'text-brand-ink/30 hover:text-brand-ink'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
              </div>

              <div className="flex flex-col gap-6 pt-6">
                <Button
                  asChild
                  className="bg-brand-ink text-white px-10 py-9 rounded-[32px] text-center font-black uppercase tracking-[0.4em] text-sm flex items-center justify-center gap-4 shadow-2xl shadow-brand-ink/20 transform active:scale-95 transition-all"
                >
                  <Link to="/give" onClick={() => setIsOpen(false)}>
                    <Heart size={20} className="fill-brand-gold text-brand-gold" /> Offerings & Sacrifice
                  </Link>
                </Button>
                
                <div className="grid grid-cols-2 gap-4">
                  {!user ? (
                    <Button
                      variant="outline"
                      asChild
                      className="w-full py-8 rounded-3xl font-black text-center text-brand-ink/40 border-brand-olive/10 text-[10px] uppercase tracking-[0.3em]"
                    >
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="w-full py-8 rounded-3xl font-black text-center text-red-500 border-red-500/10 text-[10px] uppercase tracking-[0.3em] bg-red-50/20"
                    >
                      Dissolve Session
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-8 rounded-3xl font-black text-center text-brand-ink/30 border-brand-olive/10 text-[10px] uppercase tracking-[0.3em]"
                  >
                    Seal Menu
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
