import { useState, useEffect } from "react";
import { ArrowUpToLine } from "lucide-react"; // Arrow with line above it
import { motion } from "framer-motion";

const BackToTop = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: showButton ? 1 : 0,
        scale: showButton ? 1 : 0.5,
        y: showButton ? [0, -10, 0] : 0, // Moves the entire button up and down
      }}
      transition={{
        opacity: { duration: 0.3 },
        scale: { type: "spring", stiffness: 200, damping: 10 },
        y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }, // Smooth floating effect
      }}
      className="fixed bottom-6 right-6 z-50"
      style={{ pointerEvents: showButton ? "auto" : "none" }}
    >
      <button
        onClick={scrollToTop}
        className="bg-white p-3 rounded-full shadow-lg transition-opacity duration-300"
      >
        <ArrowUpToLine size={28} className="text-primary" />
      </button>
    </motion.div>
  );
};

export default BackToTop;
