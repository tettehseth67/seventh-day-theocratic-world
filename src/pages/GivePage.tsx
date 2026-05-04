import DonationPortal from '../components/home/DonationPortal';
import PageHeader from '../components/layout/PageHeader';
import { motion } from 'motion/react';

export default function GivePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white"
    >
      <PageHeader 
        title="Divine Stewardship" 
        subtitle="Your provision allows the diaspora sanctuaries to flourish."
        category="Offering"
      />
      <DonationPortal />
    </motion.div>
  );
}
