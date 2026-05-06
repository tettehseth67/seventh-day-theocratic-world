import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, Edit2, Trash2, Calendar, BookOpen, Users, 
  CheckCircle, X, Loader2, Search, Shield, 
  Clock, MapPin, Tag, Video, Phone, Mail, UserPlus,
  Heart, Receipt, AlertCircle, MoreHorizontal, Sparkles, Play, ArrowRight,
  GripVertical
} from 'lucide-react';
import { 
  getEvents, createEvent, updateEvent, deleteEvent,
  getSermons, createSermon, updateSermon, deleteSermon,
  getMembers, createMember, updateMember, deleteMember,
  getRegistrations, registerForEvent,
  getUsers, updateUserRole,
  getDonations, createDonation, updateDonation, deleteDonation,
  getDonationCategories, createDonationCategory, updateDonationCategory, deleteDonationCategory,
  getAuditLogs, createAuditLog, seedChurchData
} from '../services/dataService';
import { Event, Sermon, Member, Registration, AppUser, UserRole, Donation, AuditLog, DonationCategory } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { CHURCH_NAME } from '../constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogFooter, DialogDescription 
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Reorder } from 'motion/react';

type Tab = 'overview' | 'events' | 'sermons' | 'members' | 'registrations' | 'users' | 'profile' | 'donations' | 'audit-logs';

export default function AdminPage() {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  const activeTab: Tab = (tab as Tab) || 'overview';
  
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [donationCategories, setDonationCategories] = useState<DonationCategory[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const { user: authUser, logout } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<DonationCategory | null>(null);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<UserRole>('guest');
  const [pendingRoleChange, setPendingRoleChange] = useState<{ user: AppUser, newRole: UserRole } | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [e, s, m, r, u, d, dc, al] = await Promise.all([
          getEvents(),
          getSermons(),
          getMembers(),
          getRegistrations(),
          getUsers(),
          getDonations(),
          getDonationCategories(),
          getAuditLogs()
        ]);
        setEvents(e);
        setSermons(s);
        setMembers(m);
        setRegistrations(r);
        setUsers(u);
        setDonations(d);
        setDonationCategories(dc);
        setAuditLogs(al);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const loadData = async () => {
    try {
      if (activeTab === 'events') setEvents(await getEvents());
      if (activeTab === 'sermons') setSermons(await getSermons());
      if (activeTab === 'members') setMembers(await getMembers());
      if (activeTab === 'registrations') setRegistrations(await getRegistrations());
      if (activeTab === 'users') setUsers(await getUsers());
      if (activeTab === 'donations') {
        setDonations(await getDonations());
        setDonationCategories(await getDonationCategories());
      }
      if (activeTab === 'audit-logs') setAuditLogs(await getAuditLogs());
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setLoading(true);
    try {
      if (activeTab === 'events') await deleteEvent(itemToDelete.id);
      if (activeTab === 'sermons') await deleteSermon(itemToDelete.id);
      if (activeTab === 'members') await deleteMember(itemToDelete.id);
      if (activeTab === 'donations') await deleteDonation(itemToDelete.id);

      if (authUser) {
        const itemName = itemToDelete.title || itemToDelete.name || itemToDelete.userName || itemToDelete.displayName || 'Unnamed Record';
        let details = `Deleted ${activeTab.slice(0, -1).replace('-', ' ')}: ${itemName}`;
        if (activeTab === 'donations') {
          details = `Deleted donation of $${itemToDelete.amount} from ${itemToDelete.userName}`;
        }
        await createAuditLog({
          adminId: authUser.uid,
          adminEmail: authUser.email || 'unknown',
          action: 'delete',
          targetType: (activeTab === 'audit-logs' ? 'audit-log' : activeTab.slice(0, -1)) as any,
          targetId: itemToDelete.id || itemToDelete.uid,
          targetName: itemName,
          details
        });
      }

      await loadData();
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      toast.success('Record deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: any) => {
    try {
      let action: 'create' | 'update' | 'role_change' = editingItem ? 'update' : 'create';
      let targetId = '';
      let targetName = formData.title || formData.name || formData.userName || formData.displayName || 'Unnamed Record';

      if (activeTab === 'events') {
        if (editingItem) {
          await updateEvent(editingItem.id, formData);
          targetId = editingItem.id;
        } else {
          targetId = await createEvent(formData);
        }
      } else if (activeTab === 'sermons') {
        if (editingItem) {
          await updateSermon(editingItem.id, formData);
          targetId = editingItem.id;
        } else {
          targetId = await createSermon(formData);
        }
      } else if (activeTab === 'members') {
        if (editingItem) {
          await updateMember(editingItem.id, formData);
          targetId = editingItem.id;
        } else {
          targetId = await createMember(formData);
        }
      } else if (activeTab === 'users') {
        const newRole = formData.role as UserRole;
        if (newRole !== editingItem.role) {
          setPendingRoleChange({ user: editingItem, newRole });
          setIsConfirmModalOpen(true);
          return;
        }
        await updateUserRole(editingItem.uid, newRole);
        targetId = editingItem.uid;
        targetName = editingItem.displayName || editingItem.email || 'Unknown User';
        action = 'role_change';
        setUsers(prev => prev.map(u => u.uid === editingItem.uid ? { ...u, role: newRole } : u));
        toast.success(`Role updated successfully to ${newRole}`);
      } else if (activeTab === 'donations') {
        const donationData = {
          ...formData,
          amount: parseFloat(formData.amount as string),
          userId: editingItem?.userId || 'guest'
        };
        if (editingItem) {
          await updateDonation(editingItem.id, donationData);
          targetId = editingItem.id;
        } else {
          targetId = await createDonation(donationData);
        }
        targetName = `Donation from ${formData.userName}`;
      } else if (activeTab === 'registrations') {
        const regData = {
          eventId: formData.eventId as string,
          userName: formData.userName as string,
          userEmail: formData.userEmail as string,
        };
        await registerForEvent(regData);
        targetId = 'new-reg';
        targetName = `RSVP for ${formData.userName}`;
      }

      if (authUser && targetId) {
        let details = `${action === 'create' ? 'Created' : 'Updated'} ${activeTab.slice(0, -1).replace('-', ' ')}: ${targetName}`;
        if (activeTab === 'donations') {
          details = `${action === 'create' ? 'Logged' : 'Revised'} donation of $${formData.amount} from ${formData.userName}`;
        }
        if (activeTab === 'registrations') {
          details = `Manually registered ${formData.userName} for event ID: ${formData.eventId}`;
        }
        if (action === 'role_change' && editingItem) {
          details = `Modified role for ${targetName} from ${editingItem.role.toUpperCase()} to ${formData.role.toUpperCase()}`;
        }
        await createAuditLog({
          adminId: authUser.uid,
          adminEmail: authUser.email || 'unknown',
          action,
          targetType: (activeTab === 'audit-logs' ? 'audit-log' : activeTab.slice(0, -1)) as any,
          targetId,
          targetName,
          details
        });
      }

      setIsModalOpen(false);
      setEditingItem(null);
      if (activeTab !== 'users') {
        await loadData();
        toast.success(`${activeTab.slice(0, -1)} ${action === 'create' ? 'initialized' : 'refined'} successfully`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Operation failed. Please try again.');
    }
  };

  const handleConfirmRoleChange = async () => {
    if (!pendingRoleChange || !authUser) return;
    setLoading(true);
    try {
      await updateUserRole(pendingRoleChange.user.uid, pendingRoleChange.newRole);
      
      await createAuditLog({
        adminId: authUser.uid,
        adminEmail: authUser.email || 'unknown',
        action: 'role_change',
        targetType: 'user',
        targetId: pendingRoleChange.user.uid,
        targetName: pendingRoleChange.user.displayName || pendingRoleChange.user.email || 'User',
        details: `Transitioned role for ${pendingRoleChange.user.email} from ${pendingRoleChange.user.role.toUpperCase()} to ${pendingRoleChange.newRole.toUpperCase()}`
      });

      setUsers(prev => prev.map(u => u.uid === pendingRoleChange.user.uid ? { ...u, role: pendingRoleChange.newRole } : u));
      toast.success(`Access level for ${pendingRoleChange.user.displayName || pendingRoleChange.user.email} updated to ${pendingRoleChange.newRole.toUpperCase()}`);
      setIsConfirmModalOpen(false);
      setIsModalOpen(false);
      setEditingItem(null);
      setPendingRoleChange(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update sanctuary authority level.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySave = async (formData: any) => {
    setLoading(true);
    try {
      if (editingCategory) {
        await updateDonationCategory(editingCategory.id!, formData);
        toast.success('Category updated successfully');
      } else {
        await createDonationCategory(formData);
        toast.success('Category created successfully');
      }
      setDonationCategories(await getDonationCategories());
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    setLoading(true);
    try {
      await deleteDonationCategory(id);
      setDonationCategories(await getDonationCategories());
      toast.success('Category removed successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to remove category');
    } finally {
      setLoading(false);
    }
  };

  const handleReorderCategories = async (newOrder: DonationCategory[]) => {
    // Update local state immediately with new order numbers for UI consistency
    const updatedWithNewOrder = newOrder.map((cat, index) => ({
      ...cat,
      order: index + 1
    }));
    
    setDonationCategories(updatedWithNewOrder);
    
    try {
      // Sync with Firestore - only update those that actually shifted
      const updates = newOrder.map((cat, index) => {
        const newPos = index + 1;
        if (cat.order !== newPos) {
          return updateDonationCategory(cat.id!, { order: newPos });
        }
        return null;
      }).filter(Boolean);

      if (updates.length > 0) {
        await Promise.all(updates);
        toast.info('Category sequence preserved in sanctuary ledger', { duration: 1500 });
      }
    } catch (error) {
      console.error('Failed to sync category order:', error);
      toast.error('Failed to synchronize theographic order');
      // Re-fetch to sync back if failed
      const freshCategories = await getDonationCategories();
      setDonationCategories(freshCategories);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const filteredData: Record<string, any[]> = {
    events: events.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase())),
    sermons: sermons.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase())),
    members: members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())),
    registrations: registrations.filter(r => 
      (r.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (r.userEmail || '').toLowerCase().includes(searchTerm.toLowerCase())
    ),
    users: users.filter(u => (u.displayName || u.email || '').toLowerCase().includes(searchTerm.toLowerCase())),
    donations: donations.filter(d => 
      (d.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      d.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === 'All' || d.category === selectedCategory)
    ),
    'audit-logs': auditLogs.filter(l => 
      (l.adminEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (l.details || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.targetName || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  };

  const paginatedData = activeTab !== 'overview' && activeTab !== 'profile' && filteredData[activeTab]
    ? filteredData[activeTab].slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const totalPages = activeTab !== 'overview' && activeTab !== 'profile' && filteredData[activeTab]
    ? Math.ceil(filteredData[activeTab].length / itemsPerPage)
    : 0;

  const PaginationControls = () => {
    const dataForTab = activeTab !== 'overview' && activeTab !== 'profile' ? filteredData[activeTab] : [];
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-between px-6 py-4 bg-brand-cream/10 border-t border-brand-olive/5">
        <p className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/40">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, dataForTab?.length || 0)} of {dataForTab?.length || 0} records
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider"
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  let mainContent = null;

  if (activeTab === 'profile') {
    mainContent = (
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-serif italic text-brand-ink mb-2">Administrative Profile</h1>
          <p className="text-sm text-brand-ink/40 font-medium">Manage your personal credentials and sanctuary access.</p>
        </div>

        <div className="bg-white rounded-[40px] border border-brand-olive/5 shadow-2xl shadow-brand-olive/5 overflow-hidden">
          <div className="h-32 bg-brand-olive relative">
             <div className="absolute -bottom-10 left-10 w-24 h-24 rounded-3xl bg-white p-2 shadow-xl">
                <div className="w-full h-full bg-brand-cream rounded-2xl flex items-center justify-center text-brand-olive">
                   <Shield size={32} />
                </div>
             </div>
          </div>
          <div className="pt-16 pb-12 px-10">
             <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-2xl font-serif italic text-brand-ink mb-1">{authUser?.displayName || 'Administrator'}</h2>
                  <p className="text-xs font-bold text-brand-olive uppercase tracking-widest bg-brand-olive/10 px-3 py-1 rounded-full inline-block">Theocratic Overseer</p>
                </div>
                <button onClick={logout} className="px-6 py-2.5 border border-red-100 text-red-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-all">Sign Out</button>
             </div>

             <div className="grid md:grid-cols-2 gap-8 pt-10 border-t border-brand-olive/5">
                <div className="space-y-6">
                   <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/30 mb-2">Login Email</p>
                      <p className="font-bold text-brand-ink flex items-center gap-2"><Mail size={14} className="text-brand-olive" /> {authUser?.email}</p>
                   </div>
                   <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/30 mb-2">Unique Identifier</p>
                      <p className="font-mono text-[10px] text-brand-ink/40 bg-brand-cream px-3 py-1.5 rounded-lg inline-block">{authUser?.uid}</p>
                   </div>
                </div>
                <div className="space-y-6">
                   <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/30 mb-2">Access Level</p>
                      <p className="font-bold text-brand-ink flex items-center gap-2"><Shield size={14} className="text-brand-olive" /> Full Root Access</p>
                   </div>
                   <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/30 mb-2">Member Since</p>
                      <p className="font-bold text-brand-ink flex items-center gap-2"><Clock size={14} className="text-brand-olive" /> November 2023</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-brand-cream/30 border border-brand-olive/5 rounded-3xl p-8 flex items-center gap-6">
           <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-brand-gold shadow-sm">
              <CheckCircle size={24} />
           </div>
           <div>
              <p className="text-sm font-bold text-brand-ink">Security Verification</p>
              <p className="text-xs text-brand-ink/40">Your administrative session is secure and encrypted via Firebase Auth.</p>
           </div>
        </div>
      </div>
    );
  } else if (activeTab === 'donations') {
    mainContent = (
      <div className="space-y-8 pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif italic text-brand-ink mb-2">Sacrificial Offerings</h1>
            <p className="text-sm text-brand-ink/40 font-medium">Centralized ledger of all sanctuary contributions and donations.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }}
              className="bg-white border-brand-olive/10 text-brand-ink text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-brand-cream transition-all"
            >
              <Tag size={14} /> Manage Categories
            </Button>
            <div className="relative flex-grow sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-ink/40" />
              <input 
                type="text" 
                placeholder="Search stewardship..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-olive/10 rounded-xl text-xs font-medium focus:ring-4 focus:ring-brand-olive/5 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
              className="bg-brand-olive text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-brand-ink transition-all shadow-md shadow-brand-olive/10 whitespace-nowrap"
            >
              <Plus size={14} /> Log Donation
            </button>
          </div>
        </div>

        {/* Category Filtering */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <p className="text-[10px] uppercase font-bold text-brand-ink/40 tracking-widest mr-2">Filter by Province:</p>
          {['All', ...[...donationCategories].sort((a, b) => (a.order || 0) - (b.order || 0)).map(c => c.name)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                selectedCategory === cat 
                ? 'bg-brand-olive text-white border-brand-olive shadow-lg shadow-brand-olive/20' 
                : 'bg-white text-brand-ink/60 border-brand-olive/10 hover:border-brand-olive/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'Gross Offerings', value: donations.reduce((a, b) => a + b.amount, 0), icon: Heart, color: 'text-brand-gold' },
             { label: 'Total Receipts', value: donations.length, icon: Receipt, color: 'text-brand-olive' },
             { label: 'Avg Contribution', value: donations.length ? Math.round(donations.reduce((a, b) => a + b.amount, 0) / donations.length) : 0, icon: Tag, color: 'text-brand-ink' },
             { label: 'Active Givers', value: new Set(donations.map(d => d.userId)).size, icon: Users, color: 'text-brand-olive' }
           ].map((stat, i) => (
             <div key={i} className="bg-white p-6 rounded-3xl border border-brand-olive/5 shadow-sm">
                <stat.icon size={18} className={`${stat.color} mb-4`} />
                <p className="text-2xl font-serif italic text-brand-ink mb-1">{typeof stat.value === 'number' && (stat.label.includes('Gross') || stat.label.includes('Avg')) ? `GH₵ ${stat.value.toLocaleString()}` : stat.value}</p>
                <p className="text-[10px] uppercase font-bold text-brand-ink/30 tracking-widest">{stat.label}</p>
             </div>
           ))}
        </div>

        <div className="bg-white rounded-3xl border border-brand-olive/5 shadow-xl shadow-brand-olive/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-cream/30 border-b border-brand-olive/5">
                  <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/40">Donor Profile</th>
                  <th className="hidden lg:table-cell px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/40">Allocation</th>
                  <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/40">Stewardship</th>
                  <th className="hidden sm:table-cell px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/40">Registered</th>
                  <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/40 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-olive/5">
                {paginatedData.map(item => (
                  <tr key={`donation-${item.id}`} className="hover:bg-brand-cream/20 transition-all group">
                    <td className="px-8 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-olive/5 flex items-center justify-center text-brand-olive font-serif italic font-bold">
                          {item.userName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-brand-ink text-sm mb-0.5 tracking-tight">{item.userName}</p>
                          <p className="text-[10px] text-brand-ink/30 font-mono tracking-tight">{item.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-8 py-7">
                       <div className="flex flex-col">
                         <span className="text-[10px] font-bold text-brand-ink/70 uppercase tracking-widest mb-1">{item.category}</span>
                         <span className="text-[9px] text-brand-olive/40 font-medium italic">General Fund</span>
                       </div>
                    </td>
                    <td className="px-8 py-7">
                      <p className="text-xl font-serif italic text-brand-olive leading-none">GH₵ {item.amount.toLocaleString()}</p>
                      <p className="sm:hidden text-[8px] text-brand-ink/30 uppercase font-bold mt-1 tracking-widest">{item.timestamp?.seconds ? new Date(item.timestamp.seconds * 1000).toLocaleDateString() : 'Today'}</p>
                    </td>
                    <td className="hidden sm:table-cell px-8 py-7">
                      <div className="flex items-center gap-2 text-brand-ink/40">
                        <Clock size={12} className="text-brand-gold/40" />
                        <span className="text-xs font-medium tracking-tight">
                          {item.timestamp?.seconds ? new Date(item.timestamp.seconds * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Pending...'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-7 text-right">
                       <div className="flex items-center justify-end gap-5">
                          <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.1em] border border-emerald-100">Verified</span>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                            <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-2.5 bg-brand-cream text-brand-ink/60 rounded-xl hover:bg-brand-olive hover:text-white transition-all shadow-sm"><Edit2 size={13} /></button>
                            <button onClick={() => { setItemToDelete(item); setIsDeleteModalOpen(true); }} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={13} /></button>
                          </div>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationControls />
          </div>
        </div>
      </div>
    );
  } else if (activeTab === 'sermons') {
    mainContent = (
      <div className="space-y-8 pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif italic text-brand-ink mb-2">Sacred Sermons</h1>
            <p className="text-sm text-brand-ink/40 font-medium tracking-tight">The stored repository of archived digital liturgies and teachings.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-grow sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-ink/40" />
              <input 
                type="text" 
                placeholder="Search the archive..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-olive/10 rounded-xl text-xs font-medium focus:ring-4 focus:ring-brand-olive/5 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
              className="bg-brand-olive text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-brand-ink transition-all shadow-md shadow-brand-olive/10 whitespace-nowrap"
            >
              <Plus size={14} /> Archive Sermon
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-40 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-brand-olive mx-auto mb-4" />
            <p className="text-brand-ink/30 font-serif italic text-xl">Connecting to vault...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedData.map((sermon: Sermon) => (
                <motion.div 
                  key={sermon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[32px] border border-brand-olive/5 shadow-sm hover:shadow-2xl hover:shadow-brand-olive/10 transition-all group overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-video bg-brand-cream overflow-hidden">
                    {sermon.thumbnail ? (
                      <img 
                        src={sermon.thumbnail} 
                        alt={sermon.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-olive/20 group-hover:scale-110 transition-transform duration-700">
                        <Video size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                       <p className="text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                         <Play size={12} fill="currentColor" /> Preview Recording
                       </p>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                       <button 
                        onClick={() => { setEditingItem(sermon); setIsModalOpen(true); }}
                        className="p-2 bg-white/90 backdrop-blur-md text-brand-ink/60 rounded-xl hover:bg-brand-olive hover:text-white transition-all shadow-lg"
                       >
                         <Edit2 size={12} />
                       </button>
                       <button 
                        onClick={() => { setItemToDelete(sermon); setIsDeleteModalOpen(true); }}
                        className="p-2 bg-white/90 backdrop-blur-md text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
                       >
                         <Trash2 size={12} />
                       </button>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                       <span className="bg-brand-gold/10 text-brand-gold text-[8px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest border border-brand-gold/20">
                         {sermon.category}
                       </span>
                       <span className="text-[10px] text-brand-ink/30 font-medium font-mono">{sermon.date}</span>
                    </div>
                    
                    <h3 className="text-lg font-serif italic text-brand-ink mb-1 group-hover:text-brand-olive transition-colors leading-tight">
                      {sermon.title}
                    </h3>
                    <p className="text-xs font-bold text-brand-ink/40 uppercase tracking-widest mb-4">
                      {sermon.speaker}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-brand-olive/5 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-brand-cream border border-brand-olive/5 flex items-center justify-center text-brand-olive/40">
                             <Video size={14} />
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-brand-cream border border-brand-olive/5 flex items-center justify-center text-brand-olive/40">
                             <BookOpen size={14} />
                          </div>
                       </div>
                       <button className="text-[10px] font-bold uppercase tracking-wider text-brand-olive flex items-center gap-2 group/btn">
                         Inspect Details <Plus size={12} className="group-hover/btn:rotate-90 transition-transform" />
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredData['sermons'].length === 0 && (
               <div className="py-40 text-center bg-brand-cream/10 rounded-[40px] border border-dashed border-brand-olive/20">
                  <BookOpen className="w-16 h-16 text-brand-olive/10 mx-auto mb-4" />
                  <p className="text-brand-ink/30 italic font-serif text-lg">The homiletic archives are empty.</p>
               </div>
            )}
            
            <div className="mt-12">
               <PaginationControls />
            </div>
          </>
        )}
      </div>
    );
  } else if (activeTab === 'audit-logs') {
    mainContent = (
      <div className="space-y-8 pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif italic text-brand-ink mb-2">Sanctuary Audit Logs</h1>
            <p className="text-sm text-brand-ink/40 font-medium">Historical record of all administrative interventions and role transitions.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-ink/40" />
            <input 
              type="text" 
              placeholder="Search audit trail..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-olive/10 rounded-xl text-xs font-medium focus:ring-4 focus:ring-brand-olive/5 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-brand-olive/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-cream/50 border-b border-brand-olive/5">
                  <th className="px-6 py-5 text-[10px] uppercase tracking-widest font-bold text-brand-ink/40">Overseer</th>
                  <th className="px-6 py-5 text-[10px] uppercase tracking-widest font-bold text-brand-ink/40">Action/Details</th>
                  <th className="hidden lg:table-cell px-6 py-5 text-[10px] uppercase tracking-widest font-bold text-brand-ink/40">Target</th>
                  <th className="hidden sm:table-cell px-6 py-5 text-[10px] uppercase tracking-widest font-bold text-brand-ink/40">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-olive/5">
                {paginatedData.map(log => (
                  <tr key={`audit-${log.id}`} className="hover:bg-brand-cream/10 transition-colors">
                    <td className="px-6 py-5">
                      <p className="text-[10px] font-bold text-brand-ink uppercase tracking-widest leading-none mb-1">{log.adminEmail.split('@')[0]}</p>
                      <p className="text-[8px] text-brand-ink/40 font-mono truncate max-w-[80px]">{log.adminId}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          log.action === 'create' ? 'bg-green-500' :
                          log.action === 'update' ? 'bg-brand-gold' :
                          log.action === 'delete' ? 'bg-red-500' : 'bg-brand-ink'
                        }`} />
                        <p className="text-xs font-bold text-brand-ink capitalize">{log.action.replace('_', ' ')}</p>
                      </div>
                      <p className="text-[10px] text-brand-ink/40 mt-1 max-w-[200px] leading-relaxed">{log.details}</p>
                      <div className="lg:hidden mt-2">
                        <p className="text-[8px] uppercase tracking-widest text-brand-olive font-bold">{log.targetType}: {log.targetName}</p>
                      </div>
                      <div className="sm:hidden mt-1 text-[8px] text-brand-ink/30 font-mono">
                        {log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000).toLocaleString() : 'Recent'}
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-5">
                      <p className="text-xs font-bold text-brand-ink">{log.targetName}</p>
                      <p className="text-[9px] uppercase tracking-widest text-brand-olive font-bold mt-1">{log.targetType}</p>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-5 text-right font-mono text-[9px] text-brand-ink/40">
                      {log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000).toLocaleString() : 'Processing...'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData['audit-logs'].length === 0 && (
              <div className="py-20 text-center bg-brand-cream/10">
                <p className="text-brand-ink/30 italic font-serif text-lg">No audit trails found in the archive.</p>
              </div>
            )}
            <PaginationControls />
          </div>
        </div>
      </div>
    );
  } else if (activeTab === 'overview') {
    mainContent = (
      <div className="space-y-8 pb-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif italic text-brand-ink mb-2">Welcome Back, Administrator</h1>
            <p className="text-sm text-brand-ink/40 font-medium tracking-tight">Behold the current pulse of the digital sanctuary across all provinces.</p>
          </div>
          <button 
            onClick={() => navigate('/admin/events')}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-brand-olive text-white rounded-2xl text-[10px] uppercase font-bold tracking-widest hover:bg-brand-ink transition-all shadow-xl shadow-brand-olive/20"
          >
            Orchestrate New Event <Plus size={14} />
          </button>
        </div>

        {/* Seeding Alert */}
        {events.length === 0 && sermons.length === 0 && (
          <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold flex items-center justify-center text-white shrink-0">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="font-serif italic text-xl text-brand-ink">Empty {CHURCH_NAME}</h3>
                <p className="text-xs text-brand-ink/60 font-medium">It looks like your digital scrolls are currently empty. Would you like to initialize your vault with sanctuary sample data?</p>
              </div>
            </div>
            <Button 
              onClick={async () => {
                setLoading(true);
                try {
                  await seedChurchData();
                  toast.success("Archives initialized with sacred sample data");
                  const [e, s, m, r, u, d, al] = await Promise.all([
                    getEvents(), getSermons(), getMembers(), getRegistrations(), getUsers(), getDonations(), getAuditLogs()
                  ]);
                  setEvents(e); setSermons(s); setMembers(m); setRegistrations(r); setUsers(u); setDonations(d); setAuditLogs(al);
                } catch (e) {
                  toast.error("Failed to seed sanctuary data");
                } finally {
                  setLoading(false);
                }
              }}
              className="bg-brand-ink text-white hover:bg-brand-olive px-8 h-14 rounded-2xl text-[10px] uppercase font-bold tracking-widest shrink-0"
            >
              Initialize Archives
            </Button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Active Liturgies', value: events.length, icon: Calendar, color: 'text-brand-olive', bg: 'bg-brand-olive/5', trend: '+12%', desc: 'Upcoming sanctuary events' },
            { label: `${CHURCH_NAME} Archives`, value: sermons.length, icon: BookOpen, color: 'text-brand-gold', bg: 'bg-brand-gold/10', trend: '+4', desc: 'Stored digital teachings' },
            { label: 'Congregation Size', value: members.length + users.length, icon: Users, color: 'text-brand-ink', bg: 'bg-brand-cream', trend: '+8%', desc: 'Enlisted digital souls' },
            { label: 'Total Stewardship', value: `GH₵ ${donations.reduce((a, b) => a + b.amount, 0).toLocaleString()}`, icon: Heart, color: 'text-brand-gold', bg: 'bg-brand-gold/5', trend: '+24%', desc: 'Gross sanctuary offerings' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-[32px] border border-brand-olive/5 shadow-sm shadow-brand-olive/5 hover:shadow-xl hover:shadow-brand-olive/5 transition-all group cursor-default"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                  <stat.icon size={20} />
                </div>
                <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                  {stat.trend}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-serif italic text-brand-ink leading-none">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-brand-ink/40">{stat.label}</p>
              </div>
              <div className="mt-6 pt-6 border-t border-brand-olive/5">
                <p className="text-[10px] font-medium text-brand-olive italic leading-tight">{stat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32">
          {/* Recent Activity / Upcoming Events */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[32px] border border-brand-olive/5 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-olive/5 flex items-center justify-center text-brand-olive">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif italic text-brand-ink leading-tight">Upcoming Liturgies</h2>
                    <p className="text-[10px] uppercase font-bold text-brand-ink/30 tracking-widest mt-0.5">Manifested sanctuary schedule</p>
                  </div>
                </div>
                <button onClick={() => navigate('/admin/events')} className="text-[10px] font-bold uppercase tracking-widest text-brand-olive hover:text-brand-gold transition-colors underline underline-offset-4 decoration-brand-olive/20">All Records</button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {events.slice(0, 4).length > 0 ? events.slice(0, 4).map((event) => (
                  <div key={event.id} className="flex gap-4 group cursor-default p-4 rounded-2xl hover:bg-brand-cream/30 transition-all border border-brand-olive/5 bg-brand-cream/10">
                    <div className="w-12 h-12 rounded-xl bg-white border border-brand-olive/5 flex flex-col items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                      <p className="text-sm font-bold text-brand-olive leading-none">{event.date.split('-')[2]}</p>
                      <p className="text-[8px] font-bold text-brand-ink/30 uppercase mt-1">{new Date(event.date).toLocaleString('en-US', { month: 'short' })}</p>
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-bold text-brand-ink group-hover:text-brand-olive transition-colors leading-tight mb-1 truncate">{event.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-brand-ink/40">
                        <Clock size={12} className="text-brand-gold/60" />
                        <span className="truncate">{event.time}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-12 text-center">
                    <Calendar className="w-12 h-12 text-brand-olive/10 mx-auto mb-4" />
                    <p className="text-xs font-serif italic text-brand-ink/30 leading-relaxed">No upcoming liturgies have been manifested in the archives.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Audit Mini-list */}
            <div className="bg-white rounded-[32px] border border-brand-olive/5 p-8 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-gold/5 flex items-center justify-center text-brand-gold">
                    <Shield size={18} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif italic text-brand-ink leading-tight">Divine Oversight</h2>
                    <p className="text-[10px] uppercase font-bold text-brand-ink/30 tracking-widest mt-0.5">Recent administrative interventions</p>
                  </div>
                </div>
                <button onClick={() => navigate('/admin/audit-logs')} className="text-[10px] font-bold uppercase tracking-widest text-brand-olive hover:text-brand-gold transition-colors underline underline-offset-4 decoration-brand-olive/20">Full Logs</button>
              </div>

              <div className="space-y-4">
                {auditLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="flex items-center gap-4 p-4 rounded-2xl bg-brand-cream/10 border border-brand-olive/5">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      log.action === 'create' ? 'bg-green-500' :
                      log.action === 'update' ? 'bg-brand-gold' :
                      'bg-red-500'
                    }`} />
                    <div className="flex-grow min-w-0">
                      <p className="text-[11px] font-bold text-brand-ink truncate">{log.details}</p>
                      <p className="text-[9px] text-brand-ink/30 font-medium uppercase tracking-widest mt-0.5">By {log.adminEmail.split('@')[0]}</p>
                    </div>
                    <p className="text-[8px] font-mono text-brand-olive/40 whitespace-nowrap">
                      {log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Combined Theocratic Notifications */}
            <div className="bg-white rounded-[32px] border border-brand-olive/5 p-8 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/5 flex items-center justify-center text-emerald-600">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif italic text-brand-ink leading-tight">Sacred Manifestations</h2>
                    <p className="text-[10px] uppercase font-bold text-brand-ink/30 tracking-widest mt-0.5">Real-time sanctuary notifications</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  ...donations.slice(0, 2).map(d => ({ type: 'donation', title: `Donation: ${d.userName}`, value: `GH₵ ${d.amount}`, time: d.timestamp, icon: Heart, color: 'text-brand-gold', bg: 'bg-brand-gold/10' })),
                  ...sermons.slice(0, 2).map(s => ({ type: 'sermon', title: 'Sermon Archived', value: s.title, time: { seconds: new Date(s.date).getTime()/1000 }, icon: BookOpen, color: 'text-brand-olive', bg: 'bg-brand-olive/10' })),
                  ...registrations.slice(0, 2).map(r => ({ type: 'registration', title: `New RSVP: ${r.userName}`, value: r.userEmail, time: r.timestamp, icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-50' })),
                  ...auditLogs.slice(0, 2).map(l => ({ type: 'audit', title: 'Admin Logic', value: l.details || `${l.action} ${l.targetType}`, time: l.timestamp, icon: Shield, color: 'text-brand-ink', bg: 'bg-brand-cream' }))
                ]
                .sort((a, b) => (b.time?.seconds || 0) - (a.time?.seconds || 0))
                .slice(0, 6)
                .map((notif, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-brand-cream/5 border border-brand-olive/5 hover:bg-brand-cream/20 transition-all group">
                    <div className={`w-10 h-10 rounded-xl ${notif.bg} ${notif.color} flex items-center justify-center shrink-0`}>
                      <notif.icon size={16} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[10px] uppercase font-bold text-brand-ink/40 tracking-widest mb-0.5">{notif.title}</p>
                      <p className="text-xs font-bold text-brand-ink leading-tight group-hover:text-brand-olive transition-colors">{notif.value}</p>
                      <p className="text-[8px] text-brand-ink/20 font-mono mt-1.5 uppercase tracking-tighter">
                        {notif.time?.seconds ? new Date(notif.time.seconds * 1000).toLocaleDateString() : 'Awaiting sync...'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Sacred Tools / Quick Actions */}
            <div className="bg-brand-olive text-white rounded-[40px] p-8 md:p-10 relative overflow-hidden shadow-2xl h-full flex flex-col">
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-10">
                  <h2 className="text-3xl font-serif italic mb-2">Sacred Tools</h2>
                  <p className="text-xs text-white/50 font-medium tracking-tight leading-relaxed">Direct manifestations for temple stewardship and sanctuary management.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4 flex-grow">
                  {[
                    { label: 'Register New Soul', icon: UserPlus, path: '/admin/members', color: 'bg-brand-gold/20 text-brand-gold' },
                    { label: 'Archival Homily', icon: Video, path: '/admin/sermons', color: 'bg-emerald-500/20 text-emerald-400' },
                    { label: 'Orchestrate Event', icon: Sparkles, path: '/admin/events', color: 'bg-blue-500/20 text-blue-400' },
                    { label: 'Audit Stewardship', icon: Receipt, path: '/admin/donations', color: 'bg-purple-500/20 text-purple-400' },
                  ].map((action, i) => (
                    <button 
                      key={i}
                      onClick={() => navigate(action.path)}
                      className="flex items-center gap-5 p-5 rounded-[24px] bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left group/btn ring-1 ring-white/5 overflow-hidden relative"
                    >
                      <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center transition-transform group-hover/btn:scale-110 duration-500 relative z-10`}>
                        <action.icon size={20} />
                      </div>
                      <div className="relative z-10">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/90 group-hover/btn:text-brand-gold transition-colors">{action.label}</span>
                        <p className="text-[9px] text-white/30 mt-1 font-medium italic">Execute Sacred Mandate</p>
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-2 transition-all">
                        <ArrowRight size={16} />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-white/10 text-center">
                  <p className="text-[10px] text-white/30 italic font-serif">Veritas per Custodiam</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    mainContent = (
      <div className="space-y-8 pb-32">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif italic text-brand-ink capitalize">{activeTab}</h1>
          <p className="text-sm text-brand-ink/40 font-medium tracking-tight">Database Management System</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-ink/40" />
            <input 
              type="text" 
              placeholder={`Quick search...`}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-olive/10 rounded-xl text-xs font-medium focus:ring-4 focus:ring-brand-olive/5 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {activeTab !== 'users' && (
            <button 
              onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
              className="bg-brand-olive text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-brand-ink transition-all shadow-md shadow-brand-olive/10 whitespace-nowrap"
            >
              <Plus size={14} /> {activeTab === 'registrations' ? 'Register Soul' : 'Add Record'}
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-40 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-brand-olive mx-auto mb-4" />
          <p className="text-brand-ink/30 font-serif italic text-xl">Connecting to vault...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-brand-olive/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-cream/50 border-b border-brand-olive/5">
                  <th className="px-6 py-5 text-[10px] uppercase tracking-widest font-bold text-brand-ink/40">
                    {activeTab === 'users' ? 'Overseer' : activeTab === 'members' ? 'Sacred Soul' : 'Main Details'}
                  </th>
                  <th className="hidden sm:table-cell px-6 py-5 text-[10px] uppercase tracking-widest font-bold text-brand-ink/40">Classification</th>
                  <th className="hidden lg:table-cell px-6 py-5 text-[10px] uppercase tracking-widest font-bold text-brand-ink/40 text-center">
                    {activeTab === 'users' ? 'Preferences' : 'Priority'}
                  </th>
                  <th className="hidden md:table-cell px-6 py-5 text-[10px] uppercase tracking-widest font-bold text-brand-ink/40">
                    {activeTab === 'users' ? 'UID' : 'Status/Date'}
                  </th>
                  <th className="hidden lg:table-cell px-6 py-5 text-[10px] uppercase tracking-widest font-bold text-brand-ink/40 text-center">
                    {activeTab === 'users' ? 'Verified' : 'RSVPs'}
                  </th>
                  <th className="px-6 py-5 text-[10px] uppercase tracking-widest font-bold text-brand-ink/40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-olive/5">
                {activeTab === 'events' && paginatedData.map(item => (
                  <tr key={`event-${item.id}`} className="hover:bg-brand-cream/20 transition-all group border-b border-brand-olive/5 last:border-0 text-brand-ink">
                    <td className="px-8 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-cream overflow-hidden shrink-0 border border-brand-olive/5">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-brand-olive/20">
                              <Calendar size={18} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm mb-1 tracking-tight">{item.title}</p>
                          <div className="flex items-center gap-3 text-[10px] text-brand-ink/40 font-medium">
                             <span className="flex items-center gap-1.5"><Clock size={12} className="text-brand-gold/50" /> {item.time}</span>
                             <span className="hidden sm:inline text-brand-olive/20">|</span>
                             <span className="hidden sm:flex items-center gap-1.5"><MapPin size={12} className="text-brand-gold/50" /> Theocracy Main</span>
                          </div>
                        </div>
                      </div>
                      <div className="sm:hidden mt-3 flex flex-wrap gap-2">
                        <span className="bg-brand-olive text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">{item.category}</span>
                        <span className="text-[9px] font-bold text-brand-olive/40 italic">{item.date}</span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-8 py-7">
                       <span className="bg-brand-olive/5 text-brand-olive text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-widest border border-brand-olive/10">
                         {item.category}
                       </span>
                    </td>
                    <td className="hidden lg:table-cell px-8 py-7 text-center">
                       <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border ${
                         item.priority === 'High' ? 'bg-red-50 border-red-100 text-red-600' :
                         item.priority === 'Medium' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                         'bg-brand-olive/5 border-brand-olive/5 text-brand-olive'
                       }`}>
                         {item.priority || 'Low'}
                       </span>
                    </td>
                    <td className="hidden md:table-cell px-8 py-7">
                      <p className="text-sm font-bold text-brand-ink/60">{item.date}</p>
                      <p className="text-[9px] text-brand-olive/30 uppercase tracking-[0.15em] font-bold mt-1">Confirmed</p>
                    </td>
                    <td className="hidden lg:table-cell px-8 py-7 text-center">
                      <div className="inline-flex items-center justify-center bg-brand-cream px-3 py-1.5 rounded-xl border border-brand-olive/5 shadow-sm min-w-[3rem]">
                        <span className="text-sm font-bold text-brand-olive">
                          {registrations.filter(r => r.eventId === item.id).length}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-7 text-right">
                      <div className="flex justify-end gap-2 opacity-0 lg:group-hover:opacity-100 transition-all">
                         <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-2.5 bg-brand-cream text-brand-ink/60 rounded-xl hover:bg-brand-olive hover:text-white transition-all shadow-sm"><Edit2 size={13} /></button>
                         <button onClick={() => { setItemToDelete(item); setIsDeleteModalOpen(true); }} className="hidden sm:inline-flex p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                 ))}

                {activeTab === 'members' && paginatedData.map(item => (
                  <tr key={`member-${item.id}`} className="hover:bg-brand-cream/20 transition-all group border-b border-brand-olive/5 last:border-0">
                    <td className="px-8 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-olive font-bold text-xs uppercase">
                          {item.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-brand-ink text-sm mb-0.5 tracking-tight">{item.name}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-[10px] text-brand-ink/40 font-medium font-mono">
                             <span className="flex items-center gap-1.5"><Mail size={12} className="text-brand-gold/40" /> {item.email}</span>
                             {item.phone && <span className="flex items-center gap-1.5"><Phone size={12} className="text-brand-gold/40" /> {item.phone}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-8 py-7">
                      <span className="text-[10px] font-bold text-brand-ink/60 uppercase tracking-widest bg-brand-cream/50 px-2 py-1 rounded-lg">{item.role}</span>
                    </td>
                    <td className="hidden md:table-cell px-8 py-7">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="font-medium text-[10px] uppercase tracking-widest text-brand-olive font-bold">In Good Standing</span>
                      </div>
                    </td>
                    <td className="px-8 py-7 text-right">
                       <div className="flex justify-end gap-2 opacity-0 lg:group-hover:opacity-100 transition-all">
                         <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-2.5 bg-brand-cream text-brand-ink/60 rounded-xl hover:bg-brand-olive hover:text-white transition-all shadow-sm"><Edit2 size={13} /></button>
                         <button onClick={() => { setItemToDelete(item); setIsDeleteModalOpen(true); }} className="hidden sm:inline-flex p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}

                {activeTab === 'registrations' && paginatedData.map(item => {
                   const event = events.find(e => e.id === item.eventId);
                   return (
                    <tr key={`reg-${item.id}`} className="hover:bg-brand-cream/20 transition-all group border-b border-brand-olive/5 last:border-0">
                      <td className="px-8 py-7">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-cream flex items-center justify-center text-brand-olive font-bold text-xs uppercase">
                            {item.userName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-brand-ink text-sm mb-0.5 tracking-tight">{item.userName}</p>
                            <p className="text-[10px] text-brand-ink/40 font-mono font-medium">{item.userEmail}</p>
                          </div>
                        </div>
                        <div className="sm:hidden mt-3">
                           <span className="bg-brand-ink/5 text-brand-ink/60 text-[8px] font-bold px-2 py-1 rounded-full uppercase tracking-widest border border-brand-ink/5">{event?.title || 'General RSVP'}</span>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-8 py-7">
                         <span className="bg-brand-ink text-white text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-sm shadow-brand-ink/10">
                           {event?.title || 'General RSVP'}
                         </span>
                      </td>
                      <td className="hidden md:table-cell px-8 py-7">
                        <div className="flex items-center gap-2 text-brand-ink/40">
                          <Clock size={12} className="text-brand-gold/50" />
                          <p className="text-[10px] font-bold uppercase tracking-widest">{item.timestamp?.seconds ? new Date(item.timestamp.seconds * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Recent'}</p>
                        </div>
                      </td>
                      <td className="px-8 py-7 text-right">
                         <div className="flex justify-end">
                           <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                             <CheckCircle className="w-4 h-4" />
                           </div>
                         </div>
                      </td>
                    </tr>
                   );
                })}

                {activeTab === 'users' && paginatedData.map(item => (
                  <tr key={`user-${item.uid}`} className="hover:bg-brand-cream/20 transition-all group border-b border-brand-olive/5 last:border-0">
                    <td className="px-8 py-7">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs uppercase ${item.role === 'admin' ? 'bg-brand-olive text-white shadow-lg shadow-brand-olive/20' : 'bg-brand-cream text-brand-olive'}`}>
                          {item.displayName?.[0] || item.email[0]}
                        </div>
                        <div>
                          <p className="font-bold text-brand-ink text-sm mb-0.5 tracking-tight">{item.displayName || 'Unnamed Overseer'}</p>
                          <p className="text-[10px] font-mono text-brand-ink/40 font-medium tracking-tight">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-8 py-7">
                       <span className={`text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-[0.1em] border ${
                          item.role === 'admin' ? 'bg-brand-olive/10 border-brand-olive/20 text-brand-olive' : 'bg-brand-cream/50 border-brand-olive/5 text-brand-ink/60'
                       }`}>
                         {item.role}
                       </span>
                    </td>
                    <td className="hidden lg:table-cell px-8 py-7">
                       <div className="flex flex-col items-center gap-1.5">
                         <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${item.preferences?.liturgyAlerts ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-brand-ink/10'}`} />
                            <span className="text-[9px] uppercase font-bold text-brand-ink/40 tracking-tighter">Liturgies</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${item.preferences?.donationReceipts ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-brand-ink/10'}`} />
                            <span className="text-[9px] uppercase font-bold text-brand-ink/40 tracking-tighter">Receipts</span>
                         </div>
                       </div>
                    </td>
                    <td className="hidden md:table-cell px-8 py-7 text-[10px] font-mono text-brand-ink/30 truncate max-w-[120px] tracking-widest">{item.uid.slice(0, 8)}...</td>
                    <td className="hidden lg:table-cell px-8 py-7 text-center">
                       <div className="flex justify-center">
                         <CheckCircle className="w-4 h-4 text-emerald-500/40" />
                       </div>
                    </td>
                    <td className="px-8 py-7 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                         <button onClick={() => { 
                           setEditingItem(item); 
                           setSelectedRole(item.role);
                           setIsModalOpen(true); 
                         }} className="p-2.5 bg-brand-cream text-brand-ink/60 rounded-xl hover:bg-brand-olive hover:text-white transition-all shadow-sm"><Shield size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationControls />
            {(filteredData[activeTab as keyof typeof filteredData]?.length === 0 && activeTab !== 'registrations') && (
               <div className="py-20 text-center bg-brand-cream/20">
                  <p className="text-brand-ink/30 italic font-serif text-lg">No records match your inquiry.</p>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
    );
  }

  return (
    <>
      {mainContent}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="rounded-[40px] p-8 max-w-md text-center">
          <DialogHeader>
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <DialogTitle className="text-xl font-serif italic text-brand-ink mb-3">Confirm Removal</DialogTitle>
            <DialogDescription className="text-xs text-brand-ink/60 mb-6 leading-relaxed">
              Are you certain you wish to purge <span className="font-bold text-brand-ink underline">{itemToDelete?.title || itemToDelete?.name || 'this record'}</span> from the sanctuary records? This action is irreversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2.5">
            <Button 
              onClick={handleDelete}
              disabled={loading}
              variant="destructive"
              className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[9px] shadow-lg shadow-red-500/20"
            >
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              Confirm Devastation
            </Button>
            <Button 
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(false)}
              className="w-full h-12 text-brand-ink/40 font-bold uppercase tracking-widest text-[9px] hover:text-brand-ink"
            >
              Dismiss
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog Replacement */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="rounded-[40px] p-8 max-w-md text-center">
          <DialogHeader>
            <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield size={28} className="text-brand-gold" />
            </div>
            <DialogTitle className="text-xl font-serif italic text-brand-ink mb-3">Authority Adjustment</DialogTitle>
            <DialogDescription className="text-xs text-brand-ink/60 mb-6 leading-relaxed">
              You are about to modify the sanctuary access for <span className="font-bold text-brand-ink underline">{(pendingRoleChange?.user.displayName || pendingRoleChange?.user.email)}</span>. 
              Changing their identity to <span className="font-bold text-brand-olive uppercase tracking-widest px-2 py-0.5 bg-brand-olive/5 rounded-md">{pendingRoleChange?.newRole}</span> will immediately affect their administrative permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2.5">
            <Button 
              onClick={handleConfirmRoleChange}
              disabled={loading}
              className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[9px] shadow-lg shadow-brand-olive/20"
            >
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              Confirm Sacred Trust
            </Button>
            <Button 
              variant="ghost"
              onClick={() => setIsConfirmModalOpen(false)}
              className="w-full h-12 text-brand-ink/40 font-bold uppercase tracking-widest text-[9px] hover:text-brand-ink"
            >
              Cancel Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl rounded-[32px] p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-serif italic text-brand-ink">{editingItem ? 'Refine' : 'Initialize'} {activeTab.slice(0, -1)}</DialogTitle>
          </DialogHeader>

          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            handleSave(data);
          }} className="space-y-4">
            {activeTab === 'events' && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Event Title</Label>
                  <Input id="title" name="title" defaultValue={editingItem?.title} required className="h-12 rounded-xl bg-brand-cream border-none focus-visible:ring-brand-olive/20 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="date" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Date</Label>
                    <Input id="date" name="date" type="date" defaultValue={editingItem?.date} required className="h-12 rounded-xl bg-brand-cream border-none focus-visible:ring-brand-olive/20 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="time" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Time</Label>
                    <Input id="time" name="time" defaultValue={editingItem?.time} placeholder="9:00 AM" required className="h-12 rounded-xl bg-brand-cream border-none focus-visible:ring-brand-olive/20 text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="category" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Category</Label>
                    <select id="category" name="category" defaultValue={editingItem?.category || 'Worship'} className="w-full h-12 px-4 rounded-xl bg-brand-cream border-none text-sm font-medium focus:ring-2 focus:ring-brand-olive/20 outline-none">
                       <option>Worship</option>
                       <option>Youth</option>
                       <option>Community</option>
                       <option>Mission</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="priority" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Theocratic Priority</Label>
                    <div className="relative">
                      <select id="priority" name="priority" defaultValue={editingItem?.priority || 'Low'} required className="w-full h-12 px-4 rounded-xl bg-brand-cream border-none text-sm font-bold text-brand-ink focus:ring-2 focus:ring-brand-olive/20 outline-none appearance-none">
                         <option value="High">High Priority</option>
                         <option value="Medium">Medium Priority</option>
                         <option value="Low">Low Priority</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ArrowRight size={14} className="rotate-90 text-brand-olive/40" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="thumbnail" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Event Thumbnail URL</Label>
                  <Input id="thumbnail" name="thumbnail" defaultValue={editingItem?.thumbnail} placeholder="https://images.unsplash.com/..." className="h-12 rounded-xl bg-brand-cream border-none focus-visible:ring-brand-olive/20 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Description</Label>
                  <textarea id="description" name="description" defaultValue={editingItem?.description} required rows={2} className="w-full p-4 rounded-xl bg-brand-cream border-none text-sm font-medium focus:ring-2 focus:ring-brand-olive/20 outline-none" />
                </div>
              </>
            )}

            {activeTab === 'donations' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="userName" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Donor Name</Label>
                    <Input id="userName" name="userName" defaultValue={editingItem?.userName} required className="h-12 rounded-xl bg-brand-cream border-none focus-visible:ring-brand-olive/20 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="userEmail" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Donor Email</Label>
                    <Input id="userEmail" name="userEmail" type="email" defaultValue={editingItem?.userEmail} required className="h-12 rounded-xl bg-brand-cream border-none focus-visible:ring-brand-olive/20 text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="amount" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Amount ($)</Label>
                    <Input id="amount" name="amount" type="number" step="0.01" defaultValue={editingItem?.amount} required className="h-12 rounded-xl bg-brand-cream border-none focus-visible:ring-brand-olive/20 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="status" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Status</Label>
                    <select id="status" name="status" defaultValue={editingItem?.status || 'completed'} className="w-full h-12 px-4 rounded-xl bg-brand-cream border-none text-sm font-medium focus:ring-2 focus:ring-brand-olive/20 outline-none">
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="category" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Category</Label>
                  <select id="category" name="category" defaultValue={editingItem?.category || [...donationCategories].sort((a, b) => (a.order || 0) - (b.order || 0))[0]?.name} className="w-full h-12 px-4 rounded-xl bg-brand-cream border-none text-sm font-medium focus:ring-2 focus:ring-brand-olive/20 outline-none">
                    {[...donationCategories].sort((a, b) => (a.order || 0) - (b.order || 0)).map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                    {donationCategories.length === 0 && <option value="Uncategorized">Please add categories first</option>}
                  </select>
                </div>
              </>
            )}

            {activeTab === 'sermons' && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Sermon Topic</Label>
                  <Input id="title" name="title" defaultValue={editingItem?.title} required className="h-12 rounded-xl bg-brand-cream border-none focus-visible:ring-brand-olive/20 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="speaker" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Lead Speaker</Label>
                  <Input id="speaker" name="speaker" defaultValue={editingItem?.speaker} required className="h-12 rounded-xl bg-brand-cream border-none focus-visible:ring-brand-olive/20 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="date" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Date Delivered</Label>
                    <Input id="date" name="date" type="date" defaultValue={editingItem?.date} required className="h-12 rounded-xl bg-brand-cream border-none focus-visible:ring-brand-olive/20 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="category" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Category</Label>
                    <Input id="category" name="category" defaultValue={editingItem?.category || 'Biblical Study'} required className="h-12 rounded-xl bg-brand-cream border-none focus-visible:ring-brand-olive/20 text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="series" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Sermon Series</Label>
                  <Input id="series" name="series" defaultValue={editingItem?.series} placeholder="e.g. Parables of Jesus" className="h-12 rounded-xl bg-brand-cream border-none focus-visible:ring-brand-olive/20 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="thumbnail" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Thumbnail URL</Label>
                  <Input id="thumbnail" name="thumbnail" defaultValue={editingItem?.thumbnail} placeholder="https://images.unsplash.com/..." className="h-12 rounded-xl bg-brand-cream border-none focus-visible:ring-brand-olive/20 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="videoUrl" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Video Resource URL</Label>
                  <Input id="videoUrl" name="videoUrl" defaultValue={editingItem?.videoUrl} placeholder="https://youtube.com/..." className="h-12 rounded-xl bg-brand-cream border-none focus-visible:ring-brand-olive/20 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Sermon Essence (Description)</Label>
                  <textarea id="description" name="description" defaultValue={editingItem?.description} placeholder="A deep spiritual exploration..." className="w-full p-4 rounded-xl bg-brand-cream border-none text-sm font-medium focus:ring-2 focus:ring-brand-olive/20 outline-none h-24" />
                </div>
              </>
            )}

            {activeTab === 'registrations' && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="eventId" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Divine Event Allocation</Label>
                  <select id="eventId" name="eventId" defaultValue={editingItem?.eventId || (events.length > 0 ? events[0].id : '')} className="w-full h-12 px-4 rounded-xl bg-brand-cream border-none text-sm font-medium focus:ring-2 focus:ring-brand-olive/20 outline-none">
                    {events.map(event => (
                      <option key={event.id} value={event.id}>{event.title} ({event.date})</option>
                    ))}
                    {events.length === 0 && <option value="">No manifested events found</option>}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="userName" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Soul's Full Name</Label>
                    <Input id="userName" name="userName" defaultValue={editingItem?.userName} required placeholder="Johnathan Doe" className="h-12 rounded-xl bg-brand-cream border-none focus-visible:ring-brand-olive/20 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="userEmail" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Sacred Communication Email</Label>
                    <Input id="userEmail" name="userEmail" type="email" defaultValue={editingItem?.userEmail} required placeholder="soul@temple.org" className="h-12 rounded-xl bg-brand-cream border-none focus-visible:ring-brand-olive/20 text-sm" />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'members' && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Full Legal Name</Label>
                  <Input id="name" name="name" defaultValue={editingItem?.name} required className="h-12 rounded-xl bg-brand-cream border-none focus-visible:ring-brand-olive/20 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="role" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Assigned Office</Label>
                    <Input id="role" name="role" placeholder="Member / Deacon" defaultValue={editingItem?.role} required className="h-12 rounded-xl bg-brand-cream border-none focus-visible:ring-brand-olive/20 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Telephone</Label>
                    <Input id="phone" name="phone" placeholder="+00..." defaultValue={editingItem?.phone} className="h-12 rounded-xl bg-brand-cream border-none focus-visible:ring-brand-olive/20 text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">Electronic Mail</Label>
                  <Input id="email" name="email" type="email" defaultValue={editingItem?.email} required className="h-12 rounded-xl bg-brand-cream border-none focus-visible:ring-brand-olive/20 text-sm" />
                </div>
              </>
            )}

            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="p-4 bg-brand-cream/50 rounded-2xl border border-brand-olive/5">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 mb-1.5">Authenticated Identity</p>
                  <p className="font-bold text-brand-ink text-sm">{editingItem?.displayName || editingItem?.email}</p>
                  <p className="text-[10px] text-brand-ink/40">{editingItem?.uid}</p>
                </div>
                <div>
                  <Label className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/40 mb-3 block ml-1">Revise Access Level</Label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {(['guest', 'member', 'admin'] as UserRole[]).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center text-center gap-1.5 ${
                          selectedRole === role 
                            ? 'bg-brand-olive border-brand-olive text-white' 
                            : 'bg-brand-cream border-transparent text-brand-ink/40 hover:border-brand-olive/20'
                        }`}
                      >
                        <Shield size={14} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">{role}</span>
                      </button>
                    ))}
                  </div>
                  <input type="hidden" name="role" value={selectedRole} />
                </div>
              </div>
            )}

            <Button 
                type="submit"
                className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] mt-4 shadow-lg shadow-brand-olive/10"
            >
              {editingItem ? 'Save Changes' : 'Initialize Record'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Category Management Dialog */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="max-w-2xl rounded-[32px] p-8 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-serif italic text-brand-ink">{editingCategory ? 'Refine' : CHURCH_NAME.split(' ')[0]} Provinces (Categories)</DialogTitle>
            <DialogDescription className="text-sm text-brand-ink/40 font-medium">Manage the categories used for classifying sanctuary stewardship and donations.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Add/Edit Category Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                name: formData.get('catName') as string,
                description: formData.get('catDesc') as string,
                isActive: true,
                order: editingCategory ? editingCategory.order : (donationCategories.length + 1)
              };
              handleCategorySave(data);
              e.currentTarget.reset();
            }} className="p-6 bg-brand-cream/30 rounded-3xl border border-brand-olive/5 space-y-4">
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-olive mb-2">{editingCategory ? 'Update' : 'Establish'} Province</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="catName" className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/40 ml-2">Name</Label>
                  <Input id="catName" name="catName" defaultValue={editingCategory?.name} placeholder="e.g. Welfare" required className="h-12 rounded-xl bg-white border-brand-olive/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="catDesc" className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/40 ml-2">Description</Label>
                  <Input id="catDesc" name="catDesc" defaultValue={editingCategory?.description} placeholder="Brief mandate" className="h-12 rounded-xl bg-white border-brand-olive/10" />
                </div>
              </div>
              <div className="flex gap-2">
                {editingCategory && (
                  <Button type="button" variant="ghost" onClick={() => setEditingCategory(null)} className="h-12 rounded-xl text-[10px] uppercase font-bold tracking-widest font-mono">Cancel</Button>
                )}
                <Button type="submit" disabled={loading} className="flex-grow bg-brand-olive text-white h-12 rounded-xl text-[10px] uppercase font-bold tracking-widest">
                  {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : editingCategory ? <Edit2 size={14} className="mr-2" /> : <Plus size={14} className="mr-2" />} {editingCategory ? 'Refine' : 'Establish'} Province
                </Button>
              </div>
            </form>

            {/* List of Categories */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/40 ml-2 mb-2">Existing Provinces</p>
              <Reorder.Group 
                axis="y" 
                values={donationCategories} 
                onReorder={handleReorderCategories}
                className="max-h-60 overflow-y-auto space-y-2 pr-2"
              >
                {donationCategories.map((cat) => (
                  <Reorder.Item 
                    key={cat.id} 
                    value={cat}
                    className="flex items-center justify-between p-4 bg-white rounded-2xl border border-brand-olive/5 shadow-sm group cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-brand-ink/20 group-hover:text-brand-olive transition-colors">
                        <GripVertical size={16} />
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-brand-cream flex items-center justify-center text-brand-olive font-bold text-[10px]">
                        {cat.order || '0'}
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-ink text-sm">{cat.name}</h4>
                        <p className="text-[9px] text-brand-ink/40 italic truncate max-w-[200px]">{cat.description || 'No description provided'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingCategory(cat)}
                        className="p-2 text-brand-ink/40 hover:bg-brand-cream rounded-lg transition-colors"
                        title="Edit Province"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleCategoryDelete(cat.id!)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove Province"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </Reorder.Item>
                ))}
                {donationCategories.length === 0 && (
                  <div className="text-center py-10 text-brand-ink/30 italic font-serif">No provinces established yet.</div>
                )}
              </Reorder.Group>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <style>{`
        .admin-input {
          width: 100%;
          padding: 1rem 1.25rem;
          background-color: #F9F7F2;
          border: none;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #1A1D1A;
          transition: all 0.2s ease;
        }
        .admin-input:focus {
          outline: none;
          box-shadow: 0 0 0 4px rgba(61, 74, 62, 0.05);
          background-color: white;
          border: 1px solid rgba(61, 74, 62, 0.1);
        }
      `}</style>
    </>
  );
}
