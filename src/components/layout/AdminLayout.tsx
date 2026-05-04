import { ReactNode, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  Users, 
  Shield, 
  LogOut, 
  X,
  Church,
  ChevronRight,
  Bell,
  Search,
  User,
  Heart,
  Settings,
  History
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { useAuth } from '../../contexts/AuthContext';
import { CHURCH_NAME } from '../../constants';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('adminSidebarOpen');
    if (saved !== null) return saved === 'true';
    return window.innerWidth >= 1024;
  });
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    localStorage.setItem('adminSidebarOpen', String(isSidebarOpen));
  }, [isSidebarOpen]);

  // Handle click outside on mobile
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (window.innerWidth < 1024 && isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        // Don't close if clicking the toggle button
        const toggleButton = document.getElementById('sidebar-toggle');
        if (toggleButton && toggleButton.contains(event.target as Node)) return;
        
        setIsSidebarOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
    { icon: Calendar, label: 'Events', path: '/admin/events' },
    { icon: BookOpen, label: 'Sermons', path: '/admin/sermons' },
    { icon: Heart, label: 'Donations', path: '/admin/donations' },
    { icon: Users, label: 'Directory', path: '/admin/members' },
    { icon: Shield, label: 'User Management', path: '/admin/users' },
    { icon: History, label: 'Audit Log', path: '/admin/audit-logs' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex font-sans text-brand-ink">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-brand-ink/40 backdrop-blur-md z-[55]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-[60] w-72 bg-brand-olive text-white transform transition-all duration-300 ease-in-out border-r border-white/5 ${
          isSidebarOpen ? 'translate-x-0 shadow-2xl lg:shadow-none' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-10 px-2">
            <Logo isDark showText={true} />
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all group"
            >
              <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          <nav className="flex-grow space-y-1 py-4">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (index * 0.03) }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${
                      isActive 
                        ? 'bg-white text-brand-olive shadow-xl shadow-black/5 font-bold' 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-brand-olive' : 'text-white/40 group-hover:text-white/60'}`} />
                      <span className="text-sm tracking-wide">{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
            <div className="px-2 pb-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden group/quote">
                <p className="text-[10px] font-serif italic text-white/50 leading-relaxed relative z-10 transition-colors group-hover/quote:text-white/80">
                  "Let all things be done decently and in order, for stewardship is the manifestation of faith."
                </p>
                <div className="absolute -right-2 -bottom-2 opacity-5 text-brand-gold group-hover/quote:scale-110 transition-transform">
                  <Church size={32} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" />
                ) : (
                  <User className="w-5 h-5 text-white/40" />
                )}
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-sm font-bold truncate">{user?.displayName || 'Administrator'}</p>
                <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-white/60 hover:text-white hover:bg-red-500/10 transition-all text-sm group"
            >
              <LogOut className="w-5 h-5 text-white/40 group-hover:text-red-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-grow flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'lg:pl-72' : 'pl-0'}`}>
        {/* Header */}
        <header className="sticky top-0 z-[70] bg-white/80 backdrop-blur-md border-b border-brand-olive/5 h-20 flex items-center">
          <div className="w-full px-4 sm:px-8 flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                id="sidebar-toggle"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex p-3 text-brand-ink/40 hover:text-brand-olive hover:bg-brand-cream rounded-xl transition-all relative group touch-manipulation ring-offset-2 focus:ring-2 focus:ring-brand-olive/20"
                title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center relative transition-transform duration-300 group-hover:scale-110">
                  <motion.span 
                    animate={isSidebarOpen ? { rotate: 45, y: 0, width: "24px" } : { rotate: 0, y: -6, width: "20px" }}
                    className="absolute h-0.5 bg-current rounded-full transition-colors"
                  />
                  <motion.span 
                    animate={isSidebarOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0, width: "16px" }}
                    className="absolute h-0.5 bg-current rounded-full transition-colors left-0.5"
                  />
                  <motion.span 
                    animate={isSidebarOpen ? { rotate: -45, y: 0, width: "24px" } : { rotate: 0, y: 6, width: "20px" }}
                    className="absolute h-0.5 bg-current rounded-full transition-colors"
                  />
                </div>
              </button>
              <div className="hidden xs:block">
                <p className="text-[8px] uppercase tracking-[0.2em] font-bold text-brand-ink/20 leading-none mb-1">Archiepiscopal Vault</p>
                <h1 className="text-xs sm:text-sm font-serif italic text-brand-ink leading-none">Governance</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 ml-auto">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-brand-cream border border-brand-olive/5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-brand-olive/60">Operational</span>
              </div>

              <div className="relative group hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-ink/20 group-focus-within:text-brand-olive transition-colors" />
                <input 
                  type="text" 
                  placeholder="Record lookup..." 
                  className="w-40 xl:w-64 bg-brand-cream/50 border-none rounded-xl pl-10 pr-4 py-2.5 text-[10px] sm:text-xs focus:ring-2 focus:ring-brand-olive/10 focus:w-80 transition-all text-brand-ink placeholder:text-brand-ink/20"
                />
              </div>

              <div className="h-6 w-px bg-brand-olive/5 mx-1 hidden md:block"></div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <NotificationDropdown />

                <div className="relative group">
                  <Link to="/admin/profile" className="flex items-center gap-2 sm:gap-3 hover:bg-brand-cream p-1 rounded-2xl transition-all border border-transparent hover:border-brand-olive/5">
                    <div className="w-8 h-8 rounded-xl bg-brand-olive flex items-center justify-center text-white text-[10px] font-bold shadow-lg shadow-brand-olive/10">
                      {user?.displayName?.[0] || 'A'}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-[10px] font-bold text-brand-ink leading-none mb-0.5 whitespace-nowrap">{user?.displayName?.split(' ')[0] || 'Admin'}</p>
                      <p className="text-[8px] uppercase tracking-widest font-bold text-brand-olive">Overseer</p>
                    </div>
                  </Link>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-56 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-brand-olive/5 p-2 overflow-hidden ring-1 ring-black/5">
                        <Link to="/admin/profile" className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-brand-ink/60 hover:text-brand-olive hover:bg-brand-cream rounded-xl transition-all">
                          <User size={14} className="text-brand-olive" />
                          Vault Profile
                        </Link>
                        <Link to="/admin/profile" className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-brand-ink/60 hover:text-brand-olive hover:bg-brand-cream rounded-xl transition-all">
                          <Settings size={14} className="text-brand-olive" />
                          Configurations
                        </Link>
                        <div className="h-px bg-brand-olive/5 my-2 mx-1"></div>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500/70 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <LogOut size={14} />
                          Terminate Session
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="pb-32 sm:pb-40 pt-4 sm:pt-12 flex-grow">
          <div className="max-w-7xl mx-auto h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
