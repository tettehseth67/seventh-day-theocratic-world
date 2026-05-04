import { motion } from 'motion/react';
import { Search, Mail, Phone, UserCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getMembers } from '../../services/dataService';
import { Member } from '../../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function DirectorySection() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getMembers();
        setMembers(data);
      } catch (e) {
        console.error("Failed to load members from Firestore", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="directory" className="py-24 md:py-32 bg-white overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 text-center mb-6 md:mb-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
        >
          <span className="text-brand-gold font-black uppercase tracking-[0.4em] text-[9px]">Community</span>
          <h2 className="text-3xl md:text-5xl font-serif mt-3 mb-6 leading-tight">Our Congregation</h2>
          <p className="text-base md:text-lg text-brand-ink/50 max-w-2xl mx-auto mb-10 italic font-serif">
            "We are a tapestry of faithful souls, each a unique map of divine grace, bound together by sacred theocratic stewardship."
          </p>

          <div className="relative max-w-xl mx-auto group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-brand-ink/20 group-focus-within:text-brand-gold transition-colors" />
            </div>
            <Input 
              type="text" 
              placeholder="Search directory..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-6 bg-brand-cream border-brand-olive/10 rounded-2xl focus:ring-brand-gold/20 focus:border-brand-gold/30 transition-all text-sm shadow-lg shadow-brand-olive/5"
            />
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="group h-full p-4 rounded-[24px] border-brand-olive/5 hover:border-brand-gold/30 hover:shadow-xl hover:shadow-brand-olive/5 transition-all duration-500 bg-white relative overflow-hidden">
                {/* Subtle highlight */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl -z-10 group-hover:bg-brand-gold/10 transition-colors" />
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-cream flex items-center justify-center text-brand-olive group-hover:bg-brand-olive group-hover:text-white transition-all duration-500 shadow-sm">
                    <UserCircle className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-serif text-lg text-brand-ink mb-0.5">{member.name}</h3>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-brand-gold">{member.role}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between group/item p-2.5 rounded-lg bg-brand-cream/30 border border-brand-olive/5 border-dashed">
                    <div className="flex items-center gap-1.5 text-[10px] text-brand-ink/50 overflow-hidden">
                      <Mail className="w-3 h-3 text-brand-gold shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <Button 
                      asChild
                      variant="ghost"
                      size="xs"
                      className="rounded-lg h-6 px-1.5 hover:bg-brand-gold hover:text-white text-brand-gold transition-all"
                    >
                      <a href={`mailto:${member.email}`} className="text-[9px]">
                        Send
                      </a>
                    </Button>
                  </div>

                  {member.phone && (
                    <div className="flex items-center justify-between group/item p-2.5 rounded-lg bg-brand-cream/30 border border-brand-olive/5 border-dashed">
                      <div className="flex items-center gap-1.5 text-[10px] text-brand-ink/50 overflow-hidden">
                        <Phone className="w-3 h-3 text-brand-gold shrink-0" />
                        <span className="truncate">{member.phone}</span>
                      </div>
                      <Button 
                        asChild
                        variant="ghost"
                        size="xs"
                        className="rounded-lg h-6 px-1.5 hover:bg-brand-olive hover:text-white text-brand-olive transition-all"
                      >
                        <a href={`tel:${member.phone}`} className="text-[9px]">
                          Call
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-brand-olive/5 flex justify-center">
                   <p className="text-[7px] font-black uppercase tracking-[0.3em] text-brand-ink/20">Congregation Member Since 2024</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <div className="w-20 h-20 bg-brand-cream rounded-full flex items-center justify-center mx-auto mb-6">
               <Search size={32} className="text-brand-ink/10" />
            </div>
            <p className="text-lg font-serif italic text-brand-ink/30 italic">
              "No faithful souls match your current quest within these scrolls."
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
