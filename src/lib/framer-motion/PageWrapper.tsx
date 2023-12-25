import { Variants, motion } from "framer-motion";

const pagesVarient: Variants = {
  init: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      variants={pagesVarient}
      initial="init"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.2 }}
      className="flex flex-1 h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
