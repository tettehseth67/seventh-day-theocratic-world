import SermonsSection from '../components/home/SermonsSection';
import PageHeader from '../components/layout/PageHeader';
import { motion } from 'motion/react';
import { CHURCH_NAME } from '../constants';

export default function SermonsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PageHeader 
        title="Nourishment for the Soul" 
        subtitle="Explore our library of deep, transformational messages and scriptural studies from our theocratic congregation."
        category={CHURCH_NAME}
      />
      <SermonsSection />
    </motion.div>
  );
}
