import EventsSection from '../components/home/EventsSection';
import PageHeader from '../components/layout/PageHeader';
import { motion } from 'motion/react';

export default function EventsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PageHeader 
        title="Upcoming Church Activities" 
        subtitle="Stay engaged with our community through our various worship services, youth programs, and special events."
        category="Calendar"
      />
      <EventsSection />
    </motion.div>
  );
}
