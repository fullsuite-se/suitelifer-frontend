import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";


const faqs = [
  {
    question: "How long is the hiring process?",
    answer:
      "Once you have sent your application and have attended all the interviews, we will be sending the full list of pre-employment requirements you will need.",
  },
  {
    question:
      "I am a first-time jobseeker, should I have my requirements ready before I apply?",
    answer:
      "Once you have sent your application and have attended all the interviews, we will be sending the full list of pre-employment requirements you will need.",
  },
  {
    question:
      "I got a low score in the Test-gorilla, does that mean I am no longer fit to apply?",
    answer:
      "Once you have sent your application and have attended all the interviews, we will be sending the full list of pre-employment requirements you will need.",
  },
  {
    question: "What are the pre-employment requirements needed?",
    answer:
      "Once you have sent your application and have attended all the interviews, we will be sending the full list of pre-employment requirements you will need.",
  },
];

const FAQ = () => {
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
