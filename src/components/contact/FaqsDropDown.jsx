import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../utils/axios";



const FAQ = () => {

  const [faqs, setFaqs] = useState([]);
  const fetchFaqs = async () => {
    try {
      const response = await api.get("/api/get-all-faqs");
      const visibleFaqs = response.data.faqs.filter((faq) => faq.is_shown === 1);
      setFaqs(visibleFaqs);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);






  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);
  return (

    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isLoaded ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-2xl mx-auto mt-10 px-4 mb-20 lg:max-w-4xl xl:max-w-7xl"
    >
       <p className="font-avenir-black text-h4 mb-10">
                 <span className="text-primary">Frequently</span> Asked Questions
              </p>
              <div className="border-t border-primary">
  {faqs.map((faq, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={isLoaded ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
        delay: index * 0.1,
      }}
      className="border-b border-primary"
    >
      <button
        className="cursor-pointer flex justify-between items-center w-full py-4 text-left transition-colors"
        onClick={() => toggleFAQ(index)}
      >
        <span className={`text-body ${openIndex === index ? "text-primary font-avenir-black" : "text-gray-800"}`}>
          {faq.question}
        </span>
        {openIndex === index ? (
          <ChevronUp className="w-5 h-5 text-primary" />
        ) : (
          <ChevronDown className="w-5 h-5 text-primary" />
        )}
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={
          openIndex === index
            ? { height: "auto", opacity: 1 }
            : { height: 0, opacity: 0 }
        }
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="px-4 pb-4 mt-1 text-gray-800 text-body">
          {faq.answer}
        </p>
      </motion.div>
    </motion.div>
  ))}
</div>

    </motion.div>
  );
};

export default FAQ;
