import { Church, Facebook, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CHURCH_NAME } from '../../constants';

export default function Footer() {
  return (
    <footer className="bg-brand-cream/30 border-t border-brand-olive/5 pt-28 md:pt-40 pb-16 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-gold/[0.03] rounded-full blur-[140px] -z-10 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-24 mb-28">
          <div className="space-y-10 lg:col-span-1">
            <Link to="/" className="flex items-center gap-5 group transition-all">
              <div className="w-14 h-14 brand-gradient text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-olive/20 group-hover:rotate-12 transition-all duration-500">
                <Church size={28} />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-3xl font-bold tracking-tighter text-brand-ink leading-none uppercase">
                  THEOCRACY
                </span>
                <span className="text-[9px] uppercase tracking-[0.5em] text-brand-gold font-black mt-1.5 opacity-80">
                  {CHURCH_NAME}
                </span>
              </div>
            </Link>
            <p className="text-brand-ink/40 text-lg leading-relaxed italic font-serif font-light pr-6">
              "Archiving the spiritual journey of a global congregation; manifests divine governance in every digital interaction."
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-[20px] bg-white text-brand-ink/30 hover:text-brand-gold hover:shadow-[0_15px_35px_-5px_rgba(197,160,89,0.2)] hover:-translate-y-1 transition-all duration-500 flex items-center justify-center border border-brand-olive/5">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-brand-gold mb-10">SACRED NAVIGATION</h4>
            <ul className="space-y-5 text-[10px] font-black uppercase tracking-[0.3em] text-brand-ink/40">
              <li><Link to="/" className="hover:text-brand-gold hover:translate-x-2 transition-all inline-block duration-500">Sacred Home</Link></li>
              <li><Link to="/events" className="hover:text-brand-gold hover:translate-x-2 transition-all inline-block duration-500">Divine Calendar</Link></li>
              <li><Link to="/sermons" className="hover:text-brand-gold hover:translate-x-2 transition-all inline-block duration-500">Spiritual Archive</Link></li>
              <li><Link to="/livestream" className="hover:text-brand-gold hover:translate-x-2 transition-all inline-block duration-500">Divine Stream</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-brand-gold mb-10">STEWARDSHIP</h4>
            <ul className="space-y-5 text-[10px] font-black uppercase tracking-[0.3em] text-brand-ink/40">
              <li><Link to="/give" className="hover:text-brand-gold hover:translate-x-2 transition-all inline-block duration-500">Sacred Offerings</Link></li>
              <li><Link to="/directory" className="hover:text-brand-gold hover:translate-x-2 transition-all inline-block duration-500">Soul Directory</Link></li>
              <li><a href="#" className="hover:text-brand-gold hover:translate-x-2 transition-all inline-block duration-500">Divine Covenant</a></li>
              <li><a href="#" className="hover:text-brand-gold hover:translate-x-2 transition-all inline-block duration-500">Congregant Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-brand-gold mb-10">ASCENSION HUB</h4>
            <ul className="space-y-8 text-[11px] font-black uppercase tracking-[0.2em] text-brand-ink/50">
              <li className="flex gap-4 group/item">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-gold shrink-0 border border-brand-olive/5 shadow-sm group-hover/item:rotate-12 transition-transform">
                  <MapPin size={18} />
                </div>
                <span className="leading-relaxed opacity-60">123 Tabernacle Way,<br />Heaven Haven, SANCTUARY</span>
              </li>
              <li className="flex gap-4 group/item">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-gold shrink-0 border border-brand-olive/5 shadow-sm group-hover/item:-rotate-12 transition-transform">
                  <Mail size={18} />
                </div>
                <span className="opacity-60 lowercase">oracle@theocracy.app</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-16 border-t border-brand-olive/10 flex flex-col md:flex-row justify-between items-center gap-10 text-[10px] text-brand-ink/30 uppercase tracking-[0.4em] font-black">
          <div className="flex items-center gap-4">
             <div className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
             <p>© 2026 {CHURCH_NAME}. THEOCRATIC STEWARDSHIP.</p>
          </div>
          <div className="flex gap-10">
            <span className="hover:text-brand-gold cursor-pointer transition-colors">Faithfulness</span>
            <span className="hover:text-brand-gold cursor-pointer transition-colors">Order</span>
            <span className="hover:text-brand-gold cursor-pointer transition-colors">Dominion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
