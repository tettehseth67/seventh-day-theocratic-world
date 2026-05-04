import LivestreamSection from '../components/home/LivestreamSection';
import PageHeader from '../components/layout/PageHeader';
import { motion } from 'motion/react';

export default function LivestreamPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-brand-cream/30"
    >
      <PageHeader 
        title="Sacred Transmission" 
        subtitle="Step into the digital sanctuary from any point in the diaspora."
        category="Live Liturgy"
      />
      <LivestreamSection />
    </motion.div>
  );
}
