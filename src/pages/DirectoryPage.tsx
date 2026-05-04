import DirectorySection from '../components/home/DirectorySection';
import PageHeader from '../components/layout/PageHeader';
import { motion } from 'motion/react';

export default function DirectoryPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PageHeader 
        title="Our Fellowship Circle" 
        subtitle="Meet the leaders and members of the Seventh Day Theocratic World Congregation community."
        category="Directory"
      />
      <DirectorySection />
    </motion.div>
  );
}
