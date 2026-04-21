import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: {
      duration: 0.3,
    },
  },
};

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-warm-bg">
      <Navbar />
      <main className="flex-1 w-full relative z-0">
        <motion.div
          className="page-enter"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
